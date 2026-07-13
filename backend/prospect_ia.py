from dotenv import load_dotenv
load_dotenv()

import requests
from bs4 import BeautifulSoup
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.prompts import PromptTemplate

MAX_ITERATIONS = 10

# Configuration des canaux — identique à avant
CHANNEL_CONFIG = {
    "linkedin": {
        "label": "LinkedIn",
        "instructions": "Ton professionnel mais humain. Maximum 80 mots. Commence par une accroche personnalisée. Termine par une question ouverte. Pas de signature formelle.",
    },
    "email": {
        "label": "Email",
        "instructions": "Ton professionnel. Maximum 150 mots. Inclure un objet (format → Objet : ...). Accroche personnalisée. Call to action clair. Signature : [Nom] / [Entreprise] / [Contact]",
    },
    "instagram": {
        "label": "Instagram DM",
        "instructions": "Ton décontracté et direct. Maximum 60 mots. Commence par un compliment sincère. Une seule question à la fin. Pas de signature.",
    },
    "plan_commercial": {
        "label": "Plan Commercial",
        "instructions": "Format structuré : 1.CONTEXTE 2.PROBLÈME IDENTIFIÉ 3.SOLUTION PROPOSÉE 4.BÉNÉFICES CONCRETS 5.PROCHAINE ÉTAPE. Maximum 300 mots.",
    },
    "twitter": {
        "label": "Twitter / X",
        "instructions": "Maximum 40 mots. Ultra concis et percutant. Une observation + une proposition de valeur. Pas de hashtags. Pas de signature.",
    },
}


# --- Tool LangChain : le scraper ---

@tool
def scrape_site(url: str) -> str:
    """Scrape le contenu textuel d'un site web à partir de son URL.
    Retourne le texte nettoyé de la page, limité à 3000 caractères."""
    print(f"    >> Executing scrape_site(url='{url}')")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        return text[:3000]
    except requests.exceptions.Timeout:
        raise ValueError("Ce site est inaccessible ou trop lent. Essaie avec un autre URL.")
    except requests.exceptions.ConnectionError:
        raise ValueError("Impossible de joindre ce site. Vérifie l'URL et réessaie.")
    except requests.exceptions.HTTPError as e:
        raise ValueError(f"Le site a retourné une erreur ({e.response.status_code}). Il bloque peut-être les accès automatiques.")

# --- Prompt dynamique selon le canal ---

prompt_template = PromptTemplate(
    input_variables=["prospect_content", "my_services", "channel_label", "channel_instructions"],
    template="""Tu es un expert en prospection B2B multicanal.

Voici le contenu du site web du prospect :
{prospect_content}

Voici les services proposés :
{my_services}

Canal de diffusion : {channel_label}

Instructions spécifiques :
{channel_instructions}

Génère un message de prospection ultra-personnalisé en respectant strictement
le format et les contraintes du canal. Commence directement par le message,
sans introduction ni commentaire."""
)


# --- Agent Loop ---

def run(url: str, my_services: str, channel: str = "email"):
    tools = [scrape_site]
    tools_dict = {t.name: t for t in tools}

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
    llm_with_tools = llm.bind_tools(tools)

    config = CHANNEL_CONFIG.get(channel, CHANNEL_CONFIG["email"])

    print(f"\n🔍 Lancement de l'agent Prospect-IA")
    print(f"Canal : {config['label']}")
    print("=" * 60)

    messages = [
        SystemMessage(content=(
            "Tu es un agent de prospection B2B. "
            "Tu as accès à un outil de scraping pour analyser les sites web des prospects. "
            "RÈGLES STRICTES : "
            "1. Commence TOUJOURS par appeler scrape_site avec l'URL fournie. "
            "2. Génère le message de prospection UNIQUEMENT après avoir reçu le contenu scrapé. "
            "3. Ne génère JAMAIS un message sans avoir d'abord scrapé le site."
        )),
        HumanMessage(content=(
            f"URL du prospect : {url}\n"
            f"Services proposés : {my_services}\n"
            f"Canal : {config['label']}\n"
            f"Instructions : {config['instructions']}"
        )),
    ]

    for iteration in range(1, MAX_ITERATIONS + 1):
        print(f"\n--- Iteration {iteration} ---")

        ai_message = llm_with_tools.invoke(messages)
        tool_calls = ai_message.tool_calls

        # Pas de tool call = réponse finale
        if not tool_calls:
            print(f"\n✅ Message généré :\n{ai_message.content}")
            return ai_message.content

        # Exécute le tool
        tool_call = tool_calls[0]
        tool_name = tool_call.get("name")
        tool_args = tool_call.get("args", {})
        tool_call_id = tool_call.get("id")

        print(f"  [Tool Selected] {tool_name} with args: {tool_args}")

        tool_to_use = tools_dict.get(tool_name)
        if tool_to_use is None:
            raise ValueError(f"Tool '{tool_name}' not found")

        observation = tool_to_use.invoke(tool_args)
        print(f"  [Tool Result] {len(str(observation))} caractères récupérés")

        messages.append(ai_message)
        messages.append(ToolMessage(content=str(observation), tool_call_id=tool_call_id))

    print("ERROR: Max iterations reached")
    return None


if __name__ == "__main__":
    run(
        url="https://www.nike.com/fr/",
        my_services="Développeur web freelance spécialisé en tunnels de vente et automatisation marketing",
        channel="linkedin"
    )