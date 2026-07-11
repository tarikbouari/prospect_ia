# Prospect-IA 🤖

> Générateur de messages de prospection B2B ultra-personnalisés, propulsé par l'IA.
> Adaptés à chaque canal : LinkedIn, Email, Instagram DM, Plan Commercial, Twitter/X.

---

## Le problème

La prospection B2B prend un temps fou. Envoyer des messages génériques ne fonctionne plus — il faut personnaliser chaque approche. Faire ça manuellement pour 50 prospects par jour est impossible.

## La solution

Prospect-IA analyse automatiquement le site web d'un prospect et génère en quelques secondes un message de prospection personnalisé, adapté au canal de diffusion choisi.

---

## Démo — 4 étapes

```
1. Colle l'URL du site prospect
2. Choisis ton canal (LinkedIn, Email, Instagram, Plan Commercial, Twitter)
3. Décris ton offre en quelques mots
4. Reçois un message prêt à envoyer — modifiable et copiable en 1 clic
```

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Python, FastAPI |
| IA | OpenAI GPT-4o-mini |
| Scraping | requests, BeautifulSoup4 |

---

## Architecture

```
[Next.js :3000]
      ↕  POST /generate { url, services, channel }
[FastAPI :8000]
      ↕
[prospect_ia.py]
   scraping → prompt dynamique → OpenAI → message adapté au canal
```

---

## Canaux supportés

| Canal | Format | Longueur |
|---|---|---|
| 💼 LinkedIn | Professionnel, accroche personnalisée | 80 mots |
| ✉️ Email | Objet + corps structuré | 150 mots |
| 📸 Instagram DM | Ton décontracté | 60 mots |
| 📋 Plan Commercial | 5 sections structurées | 300 mots |
| 🐦 Twitter / X | Ultra court et percutant | 40 mots |

---

## Installation

### Prérequis

- Python 3.10+
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

## Utilisation

1. Lance le backend → `http://localhost:8000`
2. Lance le frontend → `http://localhost:3000`
3. Ouvre `http://localhost:3000` dans ton navigateur
4. Suis les 4 étapes et copie ton message

---

## Structure du projet

```
prospect-ia/
├── .gitignore
├── README.md
├── backend/
│   ├── prospect_ia.py    # scraping + génération multicanal
│   ├── main.py           # API FastAPI
│   ├── requirements.txt  # dépendances Python
│   └── .env              # clé OpenAI (ne pas committer !)
└── frontend/
    └── app/
        └── page.tsx      # interface utilisateur 4 étapes
```

---

## Roadmap

- [x] MVP — scraping + génération de message
- [x] Interface Next.js 4 étapes
- [x] API FastAPI
- [x] Support multicanal (LinkedIn, Email, Instagram, Plan Commercial, Twitter)
- [ ] Génération en masse (import CSV de 50 prospects)
- [ ] Historique des messages générés
- [ ] Authentification utilisateur
- [ ] Deploy production (Vercel + Railway)

---

## Auteur

**Lerik** — Développeur Web & Intégrateur Solutions IA

[LinkedIn](https://www.linkedin.com/in/tarikbouari/) · [GitHub](https://github.com/tarikbouari/prospect_ia)
