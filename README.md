# ⚡ Agentic Dating: Autonomous Agent-to-Agent Dating Platform

## 1. Overall Explanation (In One Breath)
> An agentic dating network where every person is represented by an autonomous AI agent reading their LinkedIn & Instagram; the agents date each other, evaluate true synergy, and compute optimal rankings.

---

## 2. Links & Deliverables
- **Live Website**: [https://agentic-date.vercel.app](https://agentic-date.vercel.app/) *(Deploy URL)*
- **Demo Link (25 Pre-Run Finished Profiles)**: [https://agentic-date.vercel.app#demo](https://agentic-date.vercel.app#demo)
- **YouTube 3-Min Walkthrough**: *[Add your YouTube video link here]*
- **GitHub Repository**: [https://github.com/abhijeet-code/Agentic_Date](https://github.com/abhijeet-code/Agentic_Date)

---

## 3. Technical Section: Scraping & Ingestion Stack
For every person and every agent, information is derived from exactly two official sources: **LinkedIn** and **public Instagram**.

- **LinkedIn Scraper**: Headless OpenGraph / semantic JSON-LD metadata extractor + BeautifulSoup + HTTP/2 client (`httpx`). Extracts professional trajectory, summary headlines, leadership experience, and core focus areas.
- **Instagram Scraper**: Public profile OpenGraph inspector & photo asset resolver. Derives bio themes, visual aesthetic cues, creative hobbies, and lifestyle pace.
- **Agent Synthesis**: Powered by Google Gemini 1.5 Flash (`google-generativeai` / REST). Analyzes the two sources to produce:
  - Needs (emotional and relationship goals)
  - Hobbies (deduced from Instagram)
  - Interests & Qualities
  - Agent Dating Persona & Vibe
- **Autonomous Dating Arena**: Real-time agent-to-agent conversational simulation generating dynamic dialogue banter, mutual scoring across 4 dimensions (Chemistry, Intellectual Fit, Lifestyle Alignment, Overall Compatibility), and qualitative verdicts.
- **Database**: MongoDB Atlas (`pymongo`) for persistence of ingested profiles and agent date scorecards.
- **Frontend**: Next.js 14, Tailwind CSS, Lucide icons, deployed on **Vercel**.
- **Backend API**: FastAPI (Python 3.12), deployed on **Render**.

---

## 4. Architecture & Monorepo Layout
```
agentic-dating/
├── backend/
│   ├── main.py              # FastAPI endpoints (persons, date simulation, scrape, rankings)
│   ├── seed_data.py         # 25 real public profiles with LinkedIn + Instagram links
│   ├── services/
│   │   ├── scraper.py       # Resilient LinkedIn & Instagram metadata extractor
│   │   ├── agent.py         # Gemini 1.5 Flash agent analysis & dating simulation
│   │   ├── ranking.py       # Affinity & fit matrix ranker
│   │   └── db.py            # MongoDB Atlas connection manager
│   ├── requirements.txt     # Cloud-ready dependencies
│   ├── Procfile             # Render web process definition
│   └── render.yaml          # Render blueprint specification
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx     # Hero, 25-profile grid, live date simulator, link ingestion
│   │       ├── layout.tsx
│   │       └── globals.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
└── render.yaml              # Root Render blueprint
```

---

## 5. Deployment Setup

### Backend on Render
1. Create a new **Web Service** on [Render](https://dashboard.render.com).
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `PYTHON_VERSION`: `3.12.0`

### Frontend on Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com/new).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Next.js**.
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://agentic-dating-backend.onrender.com`).
5. Click **Deploy**.
