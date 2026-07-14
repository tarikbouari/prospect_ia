# Solis 🤖

> La structure d'une entreprise, le travail d'une seule personne.

Solis est une plateforme d'agents IA qui aide les solopreneurs à structurer et faire avancer leur activité — en préparant le travail à leur place, tout en leur laissant le contrôle sur chaque décision qui compte.

**Live** → [solis-delta-dusky.vercel.app](https://solis-delta-dusky.vercel.app)

---

## Le problème

Un solopreneur porte seul tous les rôles d'une entreprise : commercial, stratège, community manager, gestionnaire administratif. Ce n'est pas le travail qui pose problème — c'est tout ce qu'il y a autour : décider chaque matin par où commencer, relancer ses prospects, rester visible en ligne, gérer devis et factures.

Résultat : beaucoup d'entrepreneurs solo avancent au feeling, perdent des clients faute de suivi, et plafonnent — non par manque de compétence, mais par manque de structure.

## La solution

Solis reproduit, pour une personne seule, l'organisation qu'apporterait une petite équipe. Un système qui prépare le travail en continu, pendant que l'entrepreneur garde la main sur chaque décision qui compte.

---

## Les 5 piliers

| Pilier | Statut | Ce qu'il fait |
|---|---|---|
| 🎯 **Prospection** | ✅ Live | Messages personnalisés générés à partir du site du prospect, prêts à envoyer |
| ✍️ **Contenu** | 🔜 V2 | Posts et formats générés à partir des idées de l'entrepreneur |
| 🧭 **Stratégie** | 🔜 V3 | Priorités du jour proposées selon l'activité réelle |
| 📅 **Organisation** | 🔜 V4 | Planning ajusté automatiquement face aux imprévus |
| 📋 **Relation client** | 🔜 V4 | Devis, factures et relances préparés en un clic |

---

## Pilier Prospection — Live ✅

L'agent analyse automatiquement le site web d'un prospect et génère un message de prospection ultra-personnalisé, adapté au canal choisi.

### Démo — 4 étapes

```
1. Colle l'URL du site prospect
2. Choisis ton canal (LinkedIn, Email, Instagram, Plan Commercial, Twitter/X)
3. Décris ton offre en quelques mots
4. Reçois un message prêt à envoyer — modifiable et copiable en 1 clic
```

**Essayer →** [solis-delta-dusky.vercel.app/prospect-ia](https://solis-delta-dusky.vercel.app/prospect-ia)

### Canaux supportés

| Canal | Format | Longueur |
|---|---|---|
| 💼 LinkedIn | Professionnel, accroche personnalisée | 80 mots |
| ✉️ Email | Objet + corps structuré | 150 mots |
| 📸 Instagram DM | Ton décontracté | 60 mots |
| 📋 Plan Commercial | 5 sections structurées | 300 mots |
| 🐦 Twitter / X | Ultra court et percutant | 40 mots |

---

## Architecture

```
[Next.js — Vercel]
        ↕  POST /generate { url, services, channel }
[FastAPI — Render]
        ↕
[Agent LangChain]
   @tool scrape_site → prompt dynamique → OpenAI GPT-4o-mini → message
```

### Principe directeur

- **Automatique** — ce qui est répétitif et sans risque
- **Préparé + validé** — ce qui touche à l'image ou à l'argent (messages, devis, contenu)
- **Décision humaine** — la direction stratégique, toujours

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16, Tailwind CSS |
| Backend | Python, FastAPI |
| Agent IA | LangChain, OpenAI GPT-4o-mini |
| Scraping | requests, BeautifulSoup4 |
| Deploy Frontend | Vercel |
| Deploy Backend | Render |

---

## Installation locale

### Prérequis

- Python 3.11+
- Node.js 18+
- Une clé API OpenAI

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Crée un fichier `.env` dans `/backend` :

```
OPENAI_API_KEY=sk-...ta-clé-ici
```

Lance le serveur :

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Structure du projet

```
solis/
├── .gitignore
├── README.md
├── backend/
│   ├── prospect_ia.py    # agent LangChain — scraping + génération multicanal
│   ├── main.py           # API FastAPI
│   ├── requirements.txt  # dépendances Python
│   └── .env              # clé OpenAI (ne pas committer !)
└── frontend/
    ├── app/
    │   ├── page.tsx           # landing page Solis
    │   └── prospect-ia/
    │       └── page.tsx       # outil Prospection IA
    └── components/
        └── landing.tsx        # composant landing
```

---





*Solis est développé par TRB Consulting — Fait pour les solopreneurs.*
## Auteur

**Lerik** — Développeur Web & Intégrateur Solutions IA

[LinkedIn](https://www.linkedin.com/in/tarikbouari/) · [GitHub](https://github.com/tarikbouari/prospect_ia)
