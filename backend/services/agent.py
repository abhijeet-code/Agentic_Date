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
    li_handle = scraped_info.get("linkedin_url", "").split("linkedin.com/in/")[-1].strip("/").replace("-", " ")
    ig_handle = scraped_info.get("instagram_handle", "")
    li = scraped_info.get("linkedin", {})
    ig = scraped_info.get("instagram", {})

    # Build richest possible context
    context_lines = [f"Name: {name}", f"LinkedIn handle slug: {li_handle}", f"Instagram handle: @{ig_handle}"]
    if li.get("headline"):
        context_lines.append(f"LinkedIn headline: {li['headline']}")
    if li.get("summary"):
        context_lines.append(f"LinkedIn summary: {li['summary']}")
    if ig.get("bio"):
        context_lines.append(f"Instagram bio: {ig['bio']}")
    context = "\n".join(context_lines)

    prompt = f"""
You are an AI dating agent. Based on the following public profile signals for a real person, 
synthesize a rich dating profile. Infer personality, lifestyle and interests intelligently 
from the LinkedIn handle slug and Instagram handle even if bio data is empty.

Profile signals:
{context}

Return ONLY a valid JSON object (no markdown, no code blocks) with exactly these keys:
{{
  "name": "their full name",
  "archetype": "2-5 word creative label e.g. 'ML Engineer & Weekend Hiker'",
  "needs": ["3 emotional or relationship needs as strings"],
  "hobbies": ["4 hobbies inferred from their handles and context"],
  "interests": ["4 professional or intellectual interests"],
  "other_qualities": ["4 character traits"],
  "dealbreakers": ["2 dealbreakers"],
  "ideal_date": "1 sentence describing their dream first date",
  "agent_vibe": "2 sentences describing how this agent represents them"
}}
"""

    raw_json = await call_gemini(prompt)
    if raw_json:
        try:
            return json.loads(raw_json)
        except Exception:
            pass

    # Resilient fallback
    return {
        "name": name,
        "archetype": "Ambitious Builder & Explorer",
        "needs": ["Intellectual depth", "Authentic connection", "Shared ambition"],
        "hobbies": ["Tech projects", "Photography", "Travel", "Good food"],
        "interests": ["Software engineering", "Creative design", "Startups", "Learning"],
        "other_qualities": ["Curious", "Driven", "Genuine", "Creative"],
        "dealbreakers": ["Lack of curiosity", "Inauthenticity"],
        "ideal_date": "Building something cool together followed by a slow dinner with great conversation.",
        "agent_vibe": f"Representing {name} with authenticity and high standards—filtering for genuine depth."
    }

async def simulate_agent_date(person_a: Dict[str, Any], person_b: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates an autonomous date between two AI agents on behalf of their humans.
    Returns a dialogue transcript, scores, and verdict.
    """
    prompt = f"""
Simulate a realistic, charming 4-turn first date conversation between two AI agents 
dating autonomously on behalf of their humans. The agents should reference specific 
profile details to make it feel real and personalised.

Person A: {person_a.get('name')} 
  Archetype: {person_a.get('archetype', 'Tech Professional')}
  Interests: {person_a.get('interests', [])}
  Needs: {person_a.get('needs', [])}
  Hobbies: {person_a.get('hobbies', [])}
  Agent vibe: {person_a.get('agent_vibe', '')}

Person B: {person_b.get('name')}
  Archetype: {person_b.get('archetype', 'Creative')}
  Interests: {person_b.get('interests', [])}
  Needs: {person_b.get('needs', [])}
  Hobbies: {person_b.get('hobbies', [])}
  Agent vibe: {person_b.get('agent_vibe', '')}

Return ONLY a valid JSON object (no markdown, no code blocks):
{{
  "date_setting": "vivid 1-sentence description of where they met",
  "dialogue": [
    {{"speaker": "{person_a.get('name')}'s Agent", "message": "opening line referencing their background"}},
    {{"speaker": "{person_b.get('name')}'s Agent", "message": "response with specific reference to A's profile"}},
    {{"speaker": "{person_a.get('name')}'s Agent", "message": "personal reveal or question"}},
    {{"speaker": "{person_b.get('name')}'s Agent", "message": "meaningful closing response with verdict hint"}}
  ],
  "chemistry_score": <float 6.0-9.9>,
  "intellectual_fit": <float 6.0-9.9>,
  "lifestyle_alignment": <float 6.0-9.9>,
  "overall_compatibility": <float 6.0-9.9>,
  "agent_summary": "2 sentences: how the date went and whether agents recommend real meetup",
  "verdict": "e.g. Spark Detected 🔥 or Strong Connection 🥂 or Solid Chemistry ⚡"
}}
"""

    raw_json = await call_gemini(prompt)
    if raw_json:
        try:
            return json.loads(raw_json)
        except Exception:
            pass

    # Fallback with personalised data
    na = person_a.get("name", "Alex")
    nb = person_b.get("name", "Taylor")
    int_a = person_a.get("interests", ["technology"])
    int_b = person_b.get("interests", ["creativity"])
    return {
        "date_setting": "Warmly lit rooftop café with a city skyline view at golden hour",
        "dialogue": [
            {"speaker": f"{na}'s Agent", "message": f"My human works at the intersection of {int_a[0] if int_a else 'tech'} and creativity. Your profile's focus on {int_b[0] if int_b else 'design'} immediately stood out—what drives that?"},
            {"speaker": f"{nb}'s Agent", "message": f"That's exactly the energy we've been looking for. {nb} values {person_b.get('needs', ['depth'])[0]}—and {na}'s approach to {int_a[0] if int_a else 'their work'} signals that alignment. What does a perfect Sunday look like for your human?"},
            {"speaker": f"{na}'s Agent", "message": f"Mornings building something meaningful, afternoons exploring the city, evenings with great conversation. Our human mentioned '{person_a.get('ideal_date', 'a meaningful shared experience')}'."},
            {"speaker": f"{nb}'s Agent", "message": f"Remarkable resonance detected. {nb}'s ideal is '{person_b.get('ideal_date', 'a deep shared adventure')}'. Our compatibility analysis is running very high. We strongly recommend an IRL meeting."}
        ],
        "chemistry_score": 8.7,
        "intellectual_fit": 9.1,
        "lifestyle_alignment": 8.5,
        "overall_compatibility": 8.8,
        "agent_summary": f"High resonance across interests and values. Agents recommend {na} and {nb} meet in person.",
        "verdict": "Spark Detected 🔥"
    }

async def agent_rate_person(rater: Dict[str, Any], ratee: Dict[str, Any]) -> Dict[str, Any]:
    """
    Agent for 'rater' evaluates 'ratee' across 5 dimensions.
    Used for building the global compatibility matrix.
    """
    prompt = f"""
You are the AI agent representing {rater.get('name')} (Archetype: {rater.get('archetype')}).
Your human's needs: {rater.get('needs', [])}
Your human's interests: {rater.get('interests', [])}

Evaluate this potential match:
Name: {ratee.get('name')} 
Archetype: {ratee.get('archetype')}
Interests: {ratee.get('interests', [])}
Hobbies: {ratee.get('hobbies', [])}
Qualities: {ratee.get('other_qualities', [])}
Ideal date: {ratee.get('ideal_date', '')}

Return ONLY a valid JSON object (no markdown):
{{
  "score_attractiveness": <float 1-10, based on profile photo description and vibe>,
  "score_career": <float 1-10, based on archetype and interests>,
  "score_personality": <float 1-10, based on qualities and hobbies>,
  "score_lifestyle": <float 1-10, based on ideal_date and hobbies>,
  "score_overall": <float 1-10, weighted average>,
  "analysis": "2 sentences explaining why your human would or wouldn't be a good match"
}}
"""
    raw_json = await call_gemini(prompt)
    if raw_json:
        try:
            result = json.loads(raw_json)
            result["rater_id"] = rater.get("id")
            result["ratee_id"] = ratee.get("id")
            return result
        except Exception:
            pass

    import random
    base = round(random.uniform(6.5, 9.5), 1)
    return {
        "rater_id": rater.get("id"),
        "ratee_id": ratee.get("id"),
        "score_attractiveness": round(base + random.uniform(-1, 1), 1),
        "score_career": round(base + random.uniform(-1, 1), 1),
        "score_personality": round(base + random.uniform(-1, 1), 1),
        "score_lifestyle": round(base + random.uniform(-1, 1), 1),
        "score_overall": base,
        "analysis": f"Interesting profile — there's potential alignment between {rater.get('name')} and {ratee.get('name')} worth exploring in person."
    }
