# 

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prospect_ia import run

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

class ProspectRequest(BaseModel):
    url: str
    services: str
    channel: str = "email"  # valeur par défaut si non fourni

@app.post("/generate")
def generate(data: ProspectRequest):
    try:
        message = run(url=data.url, my_services=data.services, channel=data.channel)
        return {"message": message, "channel": data.channel}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))