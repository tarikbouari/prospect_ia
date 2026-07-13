"""
Route /waitlist — stockage JSON simple pour démarrer.

Intégration dans ton main.py existant :

    from waitlist_routes import router as waitlist_router
    app.include_router(waitlist_router)

Le fichier waitlist.json est créé automatiquement au premier appel,
à côté de ce fichier (adapte WAITLIST_FILE si tu veux un autre chemin,
ex: un dossier /data monté en volume si tu déploies).
"""

import json
import threading
from pathlib import Path
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()

WAITLIST_FILE = Path(__file__).parent / "waitlist.json"
_lock = threading.Lock()  # évite les écritures concurrentes qui corrompraient le fichier


class WaitlistEntry(BaseModel):
    email: EmailStr


def _read_all() -> list[dict]:
    if not WAITLIST_FILE.exists():
        return []
    with open(WAITLIST_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def _write_all(entries: list[dict]) -> None:
    with open(WAITLIST_FILE, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)


@router.post("/waitlist")
async def join_waitlist(entry: WaitlistEntry):
    with _lock:
        entries = _read_all()

        if any(e["email"].lower() == entry.email.lower() for e in entries):
            # Déjà inscrit : on répond ok quand même, pas la peine d'exposer
            # l'info côté frontend ni de bloquer l'utilisateur.
            return {"status": "ok", "already_registered": True}

        entries.append(
            {
                "email": entry.email,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        _write_all(entries)

    return {"status": "ok", "already_registered": False}


@router.get("/waitlist/count")
async def waitlist_count():
    """Pratique pour un petit compteur social proof côté landing plus tard."""
    entries = _read_all()
    return {"count": len(entries)}
