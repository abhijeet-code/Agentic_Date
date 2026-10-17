import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
import logging

from services.db import get_db
from services.scraper import scrape_public_profile
from services.agent import analyze_person_profile, simulate_agent_date
from services.ranking import compute_personalized_rankings
from seed_data import SEED_PEOPLE

logger = logging.getLogger("uvicorn")

app = FastAPI(
    title="Agentic Dating API",
    description="Backend API powering the agent-to-agent dating platform",
    version="1.0.0"
)

# CORS configuration for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    linkedin_url: str
    instagram_url: str

class DateSimulationRequest(BaseModel):
    person_a_id: str
    person_b_id: str

@app.get("/api/health")
def health():
    db = get_db()
    return {
        "status": "healthy",
        "database": "connected (Atlas)" if db is not None else "in-memory-fallback",
        "service": "agentic-dating-backend"
    }

@app.get("/api/persons")
def get_all_persons():
    db = get_db()
    if db is not None:
        try:
            records = list(db["persons"].find({}, {"_id": 0}))
            if records:
                return records
        except Exception as e:
            logger.error(f"DB read error: {e}")
            
    return SEED_PEOPLE

@app.get("/api/persons/{person_id}")
def get_person(person_id: str):
    db = get_db()
    if db is not None:
        try:
            record = db["persons"].find_one({"id": person_id}, {"_id": 0})
            if record:
                return record
        except Exception as e:
            logger.error(f"DB lookup error: {e}")
            
    for p in SEED_PEOPLE:
        if p["id"] == person_id:
            return p
            
    raise HTTPException(status_code=404, detail="Person not found")

@app.post("/api/scrape-and-analyze")
async def scrape_and_analyze(req: ScrapeRequest):
    """
    Live website ingestion endpoint: User pastes LinkedIn + Instagram public URLs.
    Agent reads both sources, synthesizes profile & adds to system.
    """
    scraped = await scrape_public_profile(req.linkedin_url, req.instagram_url)
    analyzed = await analyze_person_profile(scraped)
    
    new_id = str(len(SEED_PEOPLE) + 1)
    new_person = {
        "id": new_id,
        "name": analyzed.get("name", scraped.get("extracted_name")),
        "linkedin_url": req.linkedin_url,
        "instagram_url": req.instagram_url,
        "image_url": scraped.get("instagram", {}).get("profile_pic") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
        "archetype": analyzed.get("archetype", "Tech Creator"),
        "needs": analyzed.get("needs", []),
        "hobbies": analyzed.get("hobbies", []),
        "interests": analyzed.get("interests", []),
        "other_qualities": analyzed.get("other_qualities", []),
        "ideal_date": analyzed.get("ideal_date", ""),
        "agent_vibe": analyzed.get("agent_vibe", "")
    }

    db = get_db()
    if db is not None:
        try:
            db["persons"].update_one({"id": new_id}, {"$set": new_person}, upsert=True)
        except Exception as e:
            logger.warning(f"Could not persist new profile: {e}")
            
    return new_person

@app.post("/api/simulate-date")
async def simulate_date(req: DateSimulationRequest):
    """
    Simulates a live date between two AI agents dating on their people's behalf.
    """
    person_a = get_person(req.person_a_id)
    person_b = get_person(req.person_b_id)
    
    date_result = await simulate_agent_date(person_a, person_b)
    return date_result

@app.get("/api/rankings/{person_id}")
def get_rankings_for_person(person_id: str):
    """
    For a given person, ranks who fits them best across the entire pool.
    """
    all_people = get_all_persons()
    target_person = None
    for p in all_people:
        if p["id"] == person_id:
            target_person = p
            break
            
    if not target_person:
        raise HTTPException(status_code=404, detail="Target person not found")
        
    rankings = compute_personalized_rankings(target_person, all_people)
    return {
        "person": target_person,
        "rankings": rankings
    }

@app.post("/api/seed")
def seed_database():
    """Seeds the 25 real profiles into MongoDB Atlas."""
    db = get_db()
    if db is not None:
        try:
            db["persons"].delete_many({})
            db["persons"].insert_many([dict(p) for p in SEED_PEOPLE])
            return {"status": "success", "count": len(SEED_PEOPLE), "message": "Seeded 25 profiles to Atlas"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return {"status": "memory_mode", "count": len(SEED_PEOPLE), "message": "Using in-memory seed dataset"}
