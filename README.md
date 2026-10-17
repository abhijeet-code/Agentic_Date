# ⚡ Agentic Dating: Autonomous Agent-to-Agent Dating Platform

## 1. Overall Explanation (In One Breath)
> An agentic dating network where every person is represented by an autonomous AI agent reading their LinkedIn & Instagram; the agents date each other, evaluate true synergy, and compute optimal rankings.

---

## 2. Links & Deliverables
- **Live Website**: [https://agentic-dating-frontend.vercel.app](https://agentic-dating-frontend.vercel.app) *(Deploy URL)*
- **Demo Link (25 Pre-Run Finished Profiles)**: [https://agentic-dating-frontend.vercel.app#demo](https://agentic-dating-frontend.vercel.app#demo)
- **YouTube 3-Min Walkthrough**: *[Add your YouTube video link here]*
- **GitHub Repository**: [https://github.com/abhijeet-code/Agentic_Date](https://github.com/abhijeet-code/Agentic_Date)

---

## 3. Technical Section: Scraping & Ingestion Stack
For every person and every agent, information is derived from exactly two official sources: **official LinkedIn** and **public Instagram**.

- **LinkedIn Scraper**: Headless OpenGraph / semantic JSON-LD metadata extractor + BeautifulSoup + HTTP/2 client (`httpx`). Extracts professional trajectory, summary headlines, leadership experience, and core focus areas.
- **Instagram Scraper**: Public profile OpenGraph inspector & photo asset resolver. Derives bio themes, visual aesthetic cues, creative hobbies, and lifestyle pace.
- **Agent Synthesis**: Powered by Google Gemini 1.5 Flash (`google-generativeai` / REST). Analyzes the two sources to produce:
  - Needs (emotional and relationship goals)
  - Hobbies (deduced from Instagram)
  - Interests & Qualities
  - Agent Dating Persona & Vibe
- **Autonomous Dating Arena**: Real-time agent-to-agent conversational simulation generating dynamic dialogue banter, mutual scoring across 4 dimensions (Chemistry, Intellectual Fit, Lifestyle Alignment, Overall Compatibility), and qualitative verdicts.
- **Pairwise Agent Rating Matrix & Global Leaderboard**: Every agent evaluates every other candidate across 5 dimensions (Attractiveness, Career, Personality, Lifestyle, Overall) producing an objective compatibility ranking.
- **Database**: MongoDB Atlas (`pymongo`) for persistence of ingested profiles and agent date scorecards.
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide icons, deployed on **Vercel**.
- **Backend API**: FastAPI (Python 3.12), deployed on **Render**.

---

## 4. Architecture & Monorepo Layout
```
agentic-dating/
├── backend/
│   ├── main.py              # FastAPI endpoints (persons, date simulation, scrape, rankings, leaderboard)
│   ├── seed_data.py         # 25 real public profiles with official LinkedIn + Instagram links
│   ├── services/
│   │   ├── __init__.py      # Package initialization
│   │   ├── scraper.py       # Cloud-resilient LinkedIn & Instagram metadata extractor
│   │   ├── agent.py         # Gemini 1.5 Flash agent analysis & dating simulation
│   │   ├── ranking.py       # Affinity & fit matrix ranker
│   │   └── db.py            # MongoDB Atlas connection manager via URI
│   ├── requirements.txt     # Cloud-ready dependencies
│   ├── Procfile             # Render web process definition
│   └── render.yaml          # Render blueprint specification
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx             # Hero, live date arena, fit rankings, 25-profile demo grid
│   │       ├── profile/[id]/page.tsx# Dedicated profile page with agent synthesis & top matches
│   │       ├── rankings/page.tsx    # Global rankings leaderboard with podium top-3
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

---

## 6. Seeded 25 Real People (Official Public Links)
The platform is pre-loaded with 25 verified public profile pairings:
1. **Divyanshi Srivastava**: `linkedin.com/in/divyanshi-srivastava-ds` | `instagram.com/divyanshi.mov`
2. **P Giri**: `linkedin.com/in/itspgiri` | `instagram.com/itspgiri`
3. **Priyansh Agarwal**: `linkedin.com/in/priyansh-agarwal` | `instagram.com/priyansh31dec`
4. **Erin McGurk**: `linkedin.com/in/erin-mcgurk` | `instagram.com/erinmerylstudy`
5. **Hardik Naman**: `linkedin.com/in/hardik-naman-403422358` | `instagram.com/hardiknmn`
6. **Aana Jain**: `linkedin.com/in/aanajain` | `instagram.com/aana.jn`
7. **Tushar Chopra**: `linkedin.com/in/bhatura` | `instagram.com/tushar_chopra75`
8. **Eeman Majumder**: `linkedin.com/in/eeman-majumder-2184331a2` | `instagram.com/poopsvilla`
9. **Sundas Khali**: `linkedin.com/in/sundaskhali` | `instagram.com/sundaskhalidd`
10. **Naman Shrivastava**: `linkedin.com/in/naman-shrivastava-922335148` | `instagram.com/englishaugust`
11. **Vivek Parashar**: `linkedin.com/in/vivek-parashar-8467498` | `instagram.com/vivek.parashar.505`
12. **Arindam Sadhukhan**: `linkedin.com/in/arindam-sadhukhan-meity-phd1613-iitp-electrical-power` | `instagram.com/sadhukhan_arindam`
13. **Aheli Chakraborty**: `linkedin.com/in/aheli-chakraborty-254b67262` | `instagram.com/_ahelish_`
14. **Mihir Kathpal**: `linkedin.com/in/mihir-kathpal-639bb81b2` | `instagram.com/mihirkathpal`
15. **Sanket Singh**: `linkedin.com/in/singhsanket143` | `instagram.com/isanketsingh`
16. **Bhumi Sorathia**: `linkedin.com/in/bhumisorathia` | `instagram.com/http.bhumi`
17. **Supriya Jajoriya**: `linkedin.com/in/supriya-jajoriya-3667b5335` | `instagram.com/supriiyaa.j`
18. **Mohammad Fraz**: `linkedin.com/in/mohammadfraz` | `instagram.com/frazmohammad`
19. **Love Babbar**: `linkedin.com/in/love-babbar-38ab2887` | `instagram.com/lovebabbar1`
20. **Hina Kouser**: `linkedin.com/in/hina-kouser` | `instagram.com/heenakouser.ai`
21. **Anshita Mehrotra**: `linkedin.com/in/anshita-mehrotra-7b9280144` | `instagram.com/anshiq`
22. **Simranjit Kaur**: `linkedin.com/in/simranjit-kaur-512834239` | `instagram.com/simran_8379`
23. **Johnathan Mo**: `linkedin.com/in/johnathan-mo` | `instagram.com/jmomomo_`
24. **Bisakh Mondal**: `linkedin.com/in/bisakh-mondal` | `instagram.com/imbisakh`
25. **Debarshi Maitra**: `linkedin.com/in/debarshi-maitra-994932213` | `instagram.com/_stop_wasting_your_time`
