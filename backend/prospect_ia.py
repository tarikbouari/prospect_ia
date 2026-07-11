

import requests
from bs4 import BeautifulSoup
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI()

# Configuration de chaque canal : ton, longueur, instructions spécifiques
CHANNEL_CONFIG = {
    "linkedin": {
        "label": "LinkedIn",
        "max_words": 80,
        "instructions": """
- Ton professionnel mais humain
- Maximum 80 mots
- Commence par une accroche personnalisée sur leur activité
- Pas de formule générique type "J'espère que vous allez bien"
- Termine par une question ouverte simple
- Pas de signature formelle
""",
    },
    "email": {
        "label": "Email",
        "max_words": 150,
        "instructions": """
- Ton professionnel
- Maximum 150 mots
- Inclure un objet percutant sur la première ligne (format → Objet : ...)
- Accroche personnalisée sur l'activité du prospect
- Corps : problème identifié + solution proposée
- Call to action clair en fin de message
- Signature : [Votre Nom] / [Votre Entreprise] / [Votre Contact]
""",
    },
    "instagram": {
        "label": "Instagram DM",
        "max_words": 60,
        "instructions": """
- Ton décontracté et direct
- Maximum 60 mots
- Commence par un compliment sincère sur leur contenu ou activité
- Pas de vocabulaire corporate
- Une seule question à la fin pour ouvrir la conversation
- Pas de signature
""",
    },
    "plan_commercial": {
        "label": "Plan Commercial",
        "max_words": 300,
        "instructions": """
- Format structuré avec sections claires
- Structure :
  1. CONTEXTE : résumé de l'activité du prospect (2-3 lignes)
  2. PROBLÈME IDENTIFIÉ : ce que tu as détecté sur leur site
  3. SOLUTION PROPOSÉE : comment tes services répondent exactement
  4. BÉNÉFICES CONCRETS : 3 points mesurables
  5. PROCHAINE ÉTAPE : action claire à proposer
- Ton professionnel et précis
""",
    },
    "twitter": {
        "label": "Twitter / X",
        "max_words": 40,
        "instructions": """
- Maximum 40 mots, ultra concis
- Ton direct et percutant
- Une observation précise sur leur activité
- Une proposition de valeur en une phrase
- Pas de hashtags
- Pas de signature
""",
    },
}


def scrape_site(url: str) -> str:
    """Récupère et nettoie le texte d'un site web."""
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()

    text = soup.get_text(separator=" ", strip=True)
    return text[:3000]


def generate_message(prospect_content: str, my_services: str, channel: str = "email") -> str:
    """Génère un message de prospection personnalisé selon le canal choisi."""

    config = CHANNEL_CONFIG.get(channel, CHANNEL_CONFIG["email"])

    prompt = f"""Tu es un expert en prospection B2B.

Voici le contenu du site web du prospect :
{prospect_content}

Voici les services proposés :
{my_services}

Canal de diffusion : {config["label"]}

Instructions spécifiques pour ce canal :
{config["instructions"]}

Génère un message de prospection ultra-personnalisé en respectant strictement 
le format et les contraintes du canal. Commence directement par le message, 
sans introduction ni commentaire."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Tu es un expert copywriter en prospection B2B multicanal."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=600,
    )
    return response.choices[0].message.content


def run(url: str, my_services: str, channel: str = "email"):
    print(f"\n🔍 Scraping : {url}")
    content = scrape_site(url)
    print(f"✅ {len(content)} caractères récupérés\n")

    config = CHANNEL_CONFIG.get(channel, CHANNEL_CONFIG["email"])
    print(f"✉️  Génération du message ({config['label']})...")
    message = generate_message(content, my_services, channel)

    print(f"\n--- MESSAGE {config['label'].upper()} ---")
    print(message)
    print("---------------------------\n")
    return message


if __name__ == "__main__":
    # Change "channel" pour tester les différents canaux
    run(
        url="https://www.nike.com/fr/",
        my_services="Développeur web freelance spécialisé en tunnels de vente et automatisation marketing",
        channel="linkedin"  # linkedin | email | instagram | plan_commercial | twitter
    )
