import re
import httpx
from bs4 import BeautifulSoup
import logging
from typing import Dict, Any

logger = logging.getLogger("uvicorn")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def extract_linkedin_handle(url: str) -> str:
    match = re.search(r"linkedin\.com/in/([^/?#]+)", url)
    return match.group(1).replace("-", " ").title() if match else "LinkedIn Member"

def extract_instagram_handle(url: str) -> str:
    match = re.search(r"instagram\.com/([^/?#]+)", url)
    return match.group(1) if match else "instagram_user"

async def scrape_public_profile(linkedin_url: str, instagram_url: str) -> Dict[str, Any]:
    """
    Scrapes or extracts public metadata from LinkedIn and Instagram profiles.
    Designed to be resilient on cloud environments (like Render).
    """
    li_handle = extract_linkedin_handle(linkedin_url)
    ig_handle = extract_instagram_handle(instagram_url)
    
    scraped_data = {
        "linkedin_url": linkedin_url,
        "instagram_url": instagram_url,
        "extracted_name": li_handle,
        "instagram_handle": ig_handle,
        "linkedin": {
            "title": "",
            "headline": "",
            "summary": "",
            "meta_description": ""
        },
        "instagram": {
            "bio": "",
            "followers": "",
            "profile_pic": "",
            "recent_vibes": []
        }
    }


    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, headers=HEADERS) as client:
            resp = await client.get(linkedin_url)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                og_title = soup.find("meta", property="og:title")
                og_desc = soup.find("meta", property="og:description")
                if og_title and og_title.get("content"):
                    scraped_data["linkedin"]["headline"] = og_title["content"]
                if og_desc and og_desc.get("content"):
                    scraped_data["linkedin"]["summary"] = og_desc["content"]
    except Exception as e:
        logger.warning(f"Direct LinkedIn scrape note: {e}")

    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, headers=HEADERS) as client:
            resp = await client.get(instagram_url)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                og_desc = soup.find("meta", property="og:description")
                og_image = soup.find("meta", property="og:image")
                if og_desc and og_desc.get("content"):
                    scraped_data["instagram"]["bio"] = og_desc["content"]
                if og_image and og_image.get("content"):
                    scraped_data["instagram"]["profile_pic"] = og_image["content"]
    except Exception as e:
        logger.warning(f"Direct Instagram scrape note: {e}")

    return scraped_data
