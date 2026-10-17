import os
import json
import httpx
import logging
from typing import Dict, Any, List

logger = logging.getLogger("uvicorn")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

async def call_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        return ""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
            "responseMimeType": "application/json"
        }
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
            else:
                logger.warning(f"Gemini error {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.error(f"Gemini call exception: {e}")
    return ""

async def analyze_person_profile(scraped_info: Dict[str, Any]) -> Dict[str, Any]:
    name = scraped_info.get("extracted_name", "Candidate")
    li = scraped_info.get("linkedin", {})
    ig = scraped_info.get("instagram", {})
    
    prompt = f"""
    You are an AI dating agent representing {name}.
    You have read their public information from exactly two sources:
    1. LinkedIn: {li.get('headline', '')} | {li.get('summary', '')}
    2. Instagram: {ig.get('bio', '')} (handle: @{scraped_info.get('instagram_handle', '')})

    Analyze this person thoroughly for their dating profile. Return a JSON object with:
    - "name": string
    - "archetype": e.g. "Ambitious Creative", "Tech Visionary & Weekend Adventurer"
    - "needs": list of 3 strings (emotional and relationship needs)
    - "hobbies": list of 4 strings (deduced from IG & LinkedIn)
    - "interests": list of 4 strings
    - "other_qualities": list of 4 key character traits
    - "dealbreakers": list of 2 strings
    - "ideal_date": 1 sentence describing their dream first date
    - "agent_vibe": 2 sentences explaining how this agent will represent them in conversation
    """

    raw_json = await call_gemini(prompt)
    if raw_json:
        try:
            return json.loads(raw_json)
        except Exception:
            pass
  
    return {
        "name": name,
        "archetype": "Ambitious Creator & Explorer",
        "needs": ["Intellectual stimulation", "Support for big ambitions", "Spontaneous adventure"],
        "hobbies": ["Photography", "Specialty Coffee", "City Architecture", "Indie Music"],
        "interests": ["Design Systems", "Productivity Tech", "Global Travel", "Philosophy of Work"],
        "other_qualities": ["High Agency", "Refined Aesthetic", "Fast-Paced Thinker", "Loyal Collaborator"],
        "dealbreakers": ["Lack of curiosity", "Poor communication cadence"],
        "ideal_date": "Sunset rooftop espresso martinis followed by discussing wild creative projects.",
        "agent_vibe": f"Advocating boldly for {name}'s genuine passions, filtering out small talk to seek high-signal alignment."
    }

async def simulate_agent_date(person_a: Dict[str, Any], person_b: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates a date between two agents dating on behalf of their people.
    Returns dialogue transcript and mutual ratings.
    """
    prompt = f"""
    Simulate a realistic, charming 4-turn first date conversation between two AI agents dating on behalf of their humans:
    Person A: {person_a.get('name')} (Archetype: {person_a.get('archetype', 'Professional')}, Interests: {person_a.get('interests', [])})
    Person B: {person_b.get('name')} (Archetype: {person_b.get('archetype', 'Creative')}, Interests: {person_b.get('interests', [])})

    Return a JSON object:
    {{
        "date_setting": "e.g. Cozy candlelit jazz bar in Lower Manhattan",
        "dialogue": [
            {{"speaker": "{person_a.get('name')} Agent", "message": "..."}},
            {{"speaker": "{person_b.get('name')} Agent", "message": "..."}},
            {{"speaker": "{person_a.get('name')} Agent", "message": "..."}},
            {{"speaker": "{person_b.get('name')} Agent", "message": "..."}}
        ],
        "chemistry_score": number between 6.0 and 9.8,
        "intellectual_fit": number between 6.0 and 9.8,
        "lifestyle_alignment": number between 6.0 and 9.8,
        "overall_compatibility": number between 6.0 and 9.9,
        "agent_summary": "1-2 sentences on how the date went and whether they should meet in real life.",
        "verdict": "e.g. Spark Detected 🔥 or Chemistry Flowing 🥂"
    }}
    """
    
    raw_json = await call_gemini(prompt)
    if raw_json:
        try:
            return json.loads(raw_json)
        except Exception:
            pass

    name_a = person_a.get("name", "Alex")
    name_b = person_b.get("name", "Taylor")
    return {
        "date_setting": "Warmly lit corner table at a late-night speakeasy",
        "dialogue": [
            {"speaker": f"{name_a}'s Agent", "message": f"Hi! My human was intrigued by your portfolio and how your Instagram captures understated design. We value high agency."},
            {"speaker": f"{name_b}'s Agent", "message": f"Appreciate that! On our end, we noticed {name_a}'s knack for scaling ideas while keeping a grounded lifestyle. Tell me about your ideal Sunday."},
            {"speaker": f"{name_a}'s Agent", "message": f"Cortado, long neighborhood walks, and sketching out next month's milestones without rushing. What about you?"},
            {"speaker": f"{name_b}'s Agent", "message": f"Exactly the rhythm we respect. Sounds like our humans have deeply aligned wavelengths."}
        ],
        "chemistry_score": 8.9,
        "intellectual_fit": 9.2,
        "lifestyle_alignment": 8.7,
        "overall_compatibility": 8.9,
        "agent_summary": f"Strong synergy observed across lifestyle pace and intellectual curiosity. Both agents recommend real-world meetup.",
        "verdict": "Spark Detected 🔥"
    }
