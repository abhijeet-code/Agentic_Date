import os
import uuid
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging

from services.db import get_db
from services.scraper import scrape_public_profile
from services.agent import analyze_person_profile, simulate_agent_date, agent_rate_person
from services.ranking import compute_rankings_from_ratings
from seed_data import SEED_PEOPLE

logger = logging.getLogger("uvicorn")

app = FastAPI(
    title="Agentic Dating API",
    description="Backend API powering the agent-to-agent dating platform",
    version="2.0.0"
)

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


# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def get_all_people_list() -> List[Dict[str, Any]]:
    db = get_db()
    if db is not None:
        try:
            records = list(db["persons"].find({}, {"_id": 0}))
            if records:
                return records
        except Exception as e:
            logger.error(f"DB read error: {e}")
    return list(SEED_PEOPLE)

def get_person_by_id(person_id: str) -> Optional[Dict[str, Any]]:
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
            return dict(p)
    return None

def get_all_ratings_list() -> List[Dict[str, Any]]:
    db = get_db()
    if db is not None:
        try:
            return list(db["agent_ratings"].find({}, {"_id": 0}))
        except Exception as e:
            logger.error(f"Ratings read error: {e}")
    return []


# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────

@app.get("/api/health")
def health():
    db = get_db()
    return {
        "status": "healthy",
        "database": "connected (Atlas)" if db is not None else "in-memory-fallback",
        "service": "agentic-dating-backend",
        "version": "2.0.0"
    }

@app.get("/api/persons")
def get_all_persons():
    return get_all_people_list()

@app.get("/api/persons/{person_id}")
def get_person(person_id: str):
    person = get_person_by_id(person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

@app.post("/api/scrape-and-analyze")
async def scrape_and_analyze(req: ScrapeRequest):
    """
    Live ingestion: User provides LinkedIn + Instagram URLs.
    Agent reads public signals, synthesizes full profile via Gemini, adds to system.
    """
    scraped = await scrape_public_profile(req.linkedin_url, req.instagram_url)
    analyzed = await analyze_person_profile(scraped)

    new_id = str(uuid.uuid4())[:8]
    new_person = {
        "id": new_id,
        "name": analyzed.get("name", scraped.get("extracted_name", "New Member")),
        "linkedin_url": req.linkedin_url,
        "instagram_url": req.instagram_url,
        "image_url": scraped.get("instagram", {}).get("profile_pic") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
        "archetype": analyzed.get("archetype", "Tech Creator"),
        "needs": analyzed.get("needs", []),
        "hobbies": analyzed.get("hobbies", []),
        "interests": analyzed.get("interests", []),
        "other_qualities": analyzed.get("other_qualities", []),
        "dealbreakers": analyzed.get("dealbreakers", []),
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
    Autonomous agent-to-agent date simulation between two people.
    """
    if req.person_a_id == req.person_b_id:
        raise HTTPException(status_code=400, detail="Cannot simulate a date with the same person")
    person_a = get_person_by_id(req.person_a_id)
    person_b = get_person_by_id(req.person_b_id)
    if not person_a or not person_b:
        raise HTTPException(status_code=404, detail="One or both persons not found")
    return await simulate_agent_date(person_a, person_b)

@app.get("/api/rankings/{person_id}")
def get_rankings_for_person(person_id: str):
    """
    Returns a ranked list of best matches for a given person.
    Uses stored agent ratings if available; falls back to affinity algorithm.
    """
    all_people = get_all_people_list()
    all_ratings = get_all_ratings_list()
    target = get_person_by_id(person_id)
    if not target:
        raise HTTPException(status_code=404, detail="Person not found")

    rankings = compute_rankings_from_ratings(person_id, all_ratings, all_people)
    return {"person": target, "rankings": rankings}

@app.get("/api/leaderboard")
def get_leaderboard():
    """
    Global leaderboard: persons sorted by average score received from all agents.
    """
    all_people = get_all_people_list()
    all_ratings = get_all_ratings_list()

    score_map: Dict[str, List[float]] = {}
    for r in all_ratings:
        rid = r.get("ratee_id")
        if rid:
            score_map.setdefault(rid, []).append(r.get("score_overall", 7.5))

    leaderboard = []
    for person in all_people:
        pid = person.get("id")
        scores = score_map.get(pid, [])
        avg = round(sum(scores) / len(scores), 2) if scores else None
        leaderboard.append({
            "id": pid,
            "name": person.get("name"),
            "archetype": person.get("archetype"),
            "image_url": person.get("image_url"),
            "linkedin_url": person.get("linkedin_url"),
            "instagram_url": person.get("instagram_url"),
            "average_score": avg,
            "total_ratings": len(scores)
        })

    leaderboard.sort(key=lambda x: (x["average_score"] or 0), reverse=True)
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    return leaderboard

@app.post("/api/run-all-ratings")
async def run_all_ratings(background_tasks: BackgroundTasks):
    """
    Triggers the full N×(N-1) agent rating matrix computation in background.
    For 25 people = 600 Gemini calls. Runs async in background.
    """
    background_tasks.add_task(_run_rating_matrix)
    return {
        "status": "started",
        "message": "Rating matrix computation started in background. Check /api/leaderboard in ~5 minutes.",
        "estimated_calls": "600"
    }

async def _run_rating_matrix():
    """Background task: every agent rates every other person."""
    all_people = get_all_people_list()
    db = get_db()
    count = 0
    for rater in all_people:
        for ratee in all_people:
            if rater["id"] == ratee["id"]:
                continue
            try:
                # Skip if rating already exists
                if db is not None:
                    existing = db["agent_ratings"].find_one(
                        {"rater_id": rater["id"], "ratee_id": ratee["id"]}, {"_id": 0}
                    )
                    if existing:
                        continue

                rating = await agent_rate_person(rater, ratee)
                if db is not None:
                    db["agent_ratings"].update_one(
                        {"rater_id": rater["id"], "ratee_id": ratee["id"]},
                        {"$set": rating},
                        upsert=True
                    )
                count += 1
                logger.info(f"Rating {count}: {rater['name']} → {ratee['name']}: {rating.get('score_overall')}")
            except Exception as e:
                logger.error(f"Rating error {rater['id']} → {ratee['id']}: {e}")
    logger.info(f"Rating matrix complete. {count} ratings computed.")

@app.post("/api/seed")
def seed_database():
    """Seeds the 25 real profiles into MongoDB Atlas."""
    db = get_db()
    if db is not None:
        try:
            db["persons"].delete_many({})
            db["persons"].insert_many([dict(p) for p in SEED_PEOPLE])
            return {"status": "success", "count": len(SEED_PEOPLE), "message": "Seeded 25 real profiles to Atlas"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return {"status": "memory_mode", "count": len(SEED_PEOPLE), "message": "Using in-memory seed dataset"}
