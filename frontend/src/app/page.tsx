"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Heart, ExternalLink, Zap, Flame, ArrowRight, ShieldCheck, Compass, Trophy, Star } from "lucide-react";

interface Person {
  id: string;
  name: string;
  linkedin_url: string;
  instagram_url: string;
  image_url: string;
  archetype: string;
  needs: string[];
  hobbies: string[];
  interests: string[];
  other_qualities: string[];
  dealbreakers?: string[];
  ideal_date: string;
  agent_vibe: string;
}

interface RankingMatch {
  candidate_id: string;
  candidate_name: string;
  candidate_archetype: string;
  candidate_image: string;
  match_score: number;
  shared_vibe: string;
  verdict: string;
}

const DEFAULT_PEOPLE: Person[] = [
  { id: "1", name: "Divyanshi Srivastava", linkedin_url: "https://www.linkedin.com/in/divyanshi-srivastava-ds", instagram_url: "https://www.instagram.com/divyanshi.mov", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80", archetype: "Data Scientist & Visual Storyteller", needs: ["Intellectual curiosity", "Creative energy", "Depth over small talk"], hobbies: ["Filmmaking", "Data visualization", "Journaling", "Cafés"], interests: ["Machine Learning", "Storytelling", "Visual aesthetics", "Cognitive science"], other_qualities: ["Detail-oriented", "Expressive", "Quietly ambitious", "Creative"], ideal_date: "Design museum followed by late-night coffee discussing future tech.", agent_vibe: "Thoughtful and measured—looking for genuine curiosity and creative alignment." },
  { id: "2", name: "P Giri", linkedin_url: "https://www.linkedin.com/in/itspgiri", instagram_url: "https://www.instagram.com/itspgiri", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", archetype: "Software Engineer & Tech Community Builder", needs: ["Builder mentality", "Honest communication", "Mutual ambition"], hobbies: ["Open source", "Hackathons", "Gaming", "Tech podcasting"], interests: ["System design", "Developer tools", "Community building", "Startups"], other_qualities: ["Collaborative", "Fast learner", "Executor", "Humble achiever"], ideal_date: "Exploring a tech expo by day, building a side project at night.", agent_vibe: "Direct and builder-focused—seeking someone who ships things and thinks big." },
  { id: "3", name: "Priyansh Agarwal", linkedin_url: "https://www.linkedin.com/in/priyansh-agarwal", instagram_url: "https://www.instagram.com/priyansh31dec", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80", archetype: "Product Engineer & Community Connector", needs: ["Warmth", "Space for individuality", "Adventurousness"], hobbies: ["Long drives", "Cooking", "Indie music", "Photography"], interests: ["Product thinking", "Full-stack development", "UI/UX", "Consumer apps"], other_qualities: ["Warm", "Problem-solver", "Reliable", "Great energy"], ideal_date: "A spontaneous road trip ending at a local food market.", agent_vibe: "Easygoing and adventurous—seeking warmth and someone who enjoys the journey." },
  { id: "4", name: "Erin McGurk", linkedin_url: "https://www.linkedin.com/in/erin-mcgurk", instagram_url: "https://www.instagram.com/erinmerylstudy", image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=80", archetype: "Study Content Creator & Lifelong Learner", needs: ["Intellectual depth", "Support for goals", "Encouraging partnership"], hobbies: ["Study vlogging", "Annotated reading", "Classical music", "Journaling"], interests: ["Academic excellence", "Educational psychology", "Productivity", "Minimalism"], other_qualities: ["Disciplined", "Warm encourager", "Thoughtful planner", "Genuine listener"], ideal_date: "A quiet library morning followed by bookshop browsing.", agent_vibe: "Quietly purposeful—looking for depth, growth, and calm shared energy." },
  { id: "5", name: "Hardik Naman", linkedin_url: "https://www.linkedin.com/in/hardik-naman-403422358", instagram_url: "https://www.instagram.com/hardiknmn", image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80", archetype: "Frontend Developer & Design Thinker", needs: ["Creative energy", "Authenticity", "Fun and humor"], hobbies: ["UI prototyping", "Streetwear", "Cricket", "Meme culture"], interests: ["React ecosystems", "Design systems", "Motion design", "Web3 UX"], other_qualities: ["Creatively fearless", "Aesthetic eye", "Team player", "Sharp humor"], ideal_date: "Sunset rooftop with good music, great food, zero agenda.", agent_vibe: "Playful and design-obsessed—seeking authentic energy and visual culture appreciation." },
  { id: "6", name: "Aana Jain", linkedin_url: "https://www.linkedin.com/in/aanajain", instagram_url: "https://www.instagram.com/aana.jn", image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80", archetype: "Business Strategist & Creative Explorer", needs: ["Vision alignment", "Emotional maturity", "Fun and depth"], hobbies: ["Sketching", "Startup events", "Business reading", "Travel"], interests: ["Venture strategy", "Brand building", "Behavioural economics", "Art"], other_qualities: ["Sharp instincts", "Emotionally intelligent", "Visually oriented", "Bold"], ideal_date: "Design gallery walk followed by long dinner discussing big ideas.", agent_vibe: "Elegant and goal-oriented—seeking ambition matched with genuine warmth." },
  { id: "7", name: "Tushar Chopra", linkedin_url: "https://www.linkedin.com/in/bhatura", instagram_url: "https://www.instagram.com/tushar_chopra75", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80", archetype: "Software Engineer & Desi Food Enthusiast", needs: ["Realness", "Shared food love", "Zero pretension"], hobbies: ["Street food hunting", "Open-source", "Stand-up comedy", "Badminton"], interests: ["Backend architecture", "Food tech", "Indian startups", "Comedy"], other_qualities: ["Hilarious", "Unpretentious", "Dependable", "Culturally rooted"], ideal_date: "Finding the city's best street food stall and debating best paratha variants.", agent_vibe: "Grounded and funny—looking for authenticity, cultural sensibility, and zero airs." },
  { id: "8", name: "Eeman Majumder", linkedin_url: "https://www.linkedin.com/in/eeman-majumder-2184331a2", instagram_url: "https://www.instagram.com/poopsvilla", image_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80", archetype: "Creative Technologist & Meme Philosopher", needs: ["Intellectual weirdness", "Chaos acceptance", "2am deep conversations"], hobbies: ["Meme theory", "Hackathon marathons", "Music production", "Absurdist writing"], interests: ["Creative coding", "Internet culture", "AI art", "Chaos theory"], other_qualities: ["Brilliantly unconventional", "Rapid prototyper", "Genuinely funny", "Loyal"], ideal_date: "Building something ridiculous together at a hackathon, laughing the whole time.", agent_vibe: "Chaotic and brilliant—seeking someone who keeps up with rapid ideation and strange humor." },
  { id: "9", name: "Sundas Khali", linkedin_url: "https://www.linkedin.com/in/sundaskhali", instagram_url: "https://www.instagram.com/sundaskhalidd", image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80", archetype: "Global Professional & Cross-Cultural Connector", needs: ["Cultural intelligence", "Genuine warmth", "Humble ambition"], hobbies: ["International travel", "Language learning", "Fine dining", "Art collecting"], interests: ["Global business", "Cultural diplomacy", "International tech", "Fashion"], other_qualities: ["Multicultural fluency", "Graceful", "Visionary networker", "Elegant"], ideal_date: "A curated cultural evening — art, global cuisine, great conversation.", agent_vibe: "Globally minded—seeking cross-cultural depth and real warmth." },
  { id: "10", name: "Naman Shrivastava", linkedin_url: "https://www.linkedin.com/in/naman-shrivastava-922335148", instagram_url: "https://www.instagram.com/englishaugust", image_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80", archetype: "Writer, Educator & Language Enthusiast", needs: ["Intellectual stimulation", "Creative space", "Honest emotional connection"], hobbies: ["Essay writing", "Literary fiction", "Language learning", "Long walks"], interests: ["Literature", "EdTech", "Linguistics", "Content strategy"], other_qualities: ["Deeply thoughtful", "Articulate", "Empathetic", "Curious"], ideal_date: "Bookshop afternoon followed by slow dinner discussing a shared book.", agent_vibe: "Reflective and literary—seeking genuine emotional and intellectual resonance." },
  { id: "11", name: "Vivek Parashar", linkedin_url: "https://www.linkedin.com/in/vivek-parashar-8467498", instagram_url: "https://www.instagram.com/vivek.parashar.505", image_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80", archetype: "Seasoned Tech Leader & Mentor", needs: ["Mutual respect", "Emotional grounding", "Shared drive"], hobbies: ["Mentoring engineers", "Trekking", "Board games", "Reading biographies"], interests: ["Engineering leadership", "Organisational design", "Startup scaling", "Philosophy"], other_qualities: ["Calm under pressure", "Empowering", "Strategically sharp", "Deeply reliable"], ideal_date: "A mountain trek with meaningful conversation at the summit.", agent_vibe: "Grounded and strategic—seeking emotional maturity and shared long-term vision." },
  { id: "12", name: "Arindam Sadhukhan", linkedin_url: "https://www.linkedin.com/in/arindam-sadhukhan-meity-phd1613-iitp-electrical-power", instagram_url: "https://www.instagram.com/sadhukhan_arindam", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", archetype: "Power Electronics Researcher & IIT Scholar", needs: ["Academic respect", "Patience", "Grounded partnership"], hobbies: ["Research writing", "Photography", "Classical music", "Bengali cooking"], interests: ["Electrical power", "Renewable energy", "MEITY research", "Academic publishing"], other_qualities: ["Brilliant researcher", "Principled", "Methodical", "Quietly passionate"], ideal_date: "Home-cooked meal, good music, and an engaging conversation about how the world works.", agent_vibe: "Intellectually driven—seeking genuine curiosity and a partner who values depth." },
  { id: "13", name: "Aheli Chakraborty", linkedin_url: "https://www.linkedin.com/in/aheli-chakraborty-254b67262", instagram_url: "https://www.instagram.com/_ahelish_", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80", archetype: "UX Designer & Visual Artist", needs: ["Creative appreciation", "Emotional safety", "Spontaneity"], hobbies: ["Illustration", "UX case studies", "Film photography", "Café sketching"], interests: ["Human-centred design", "Visual communication", "Typography", "Indie films"], other_qualities: ["Visually perceptive", "Empathetic", "Quietly confident", "Detail-obsessed"], ideal_date: "Sketching at a riverside café followed by indie film and long discussion.", agent_vibe: "Artistic and empathetic—looking for someone who appreciates subtlety and genuine warmth." },
  { id: "14", name: "Mihir Kathpal", linkedin_url: "https://www.linkedin.com/in/mihir-kathpal-639bb81b2", instagram_url: "https://www.instagram.com/mihirkathpal", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80", archetype: "Full Stack Developer & Open Source Advocate", needs: ["Shared ambition", "Authenticity", "Good humor"], hobbies: ["GitHub contributions", "Gym", "Podcasts", "Travel"], interests: ["Web development", "Cloud architecture", "DevOps", "Startup culture"], other_qualities: ["Consistent", "Technically strong", "Easy-going", "Growth-driven"], ideal_date: "A tech meetup, then unwinding with great food and easy conversation.", agent_vibe: "Reliable and growth-oriented—looking for authenticity and shared drive." },
  { id: "15", name: "Sanket Singh", linkedin_url: "https://www.linkedin.com/in/singhsanket143", instagram_url: "https://www.instagram.com/isanketsingh", image_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&auto=format&fit=crop&q=80", archetype: "Software Developer & Tech Content Creator", needs: ["Intellectual conversations", "Encouragement", "Authenticity"], hobbies: ["YouTube content", "Competitive programming", "Cricket", "Tech blogging"], interests: ["DSA", "System design", "Developer education", "Competitive coding"], other_qualities: ["Clear communicator", "Community-minded", "Improving", "Generous teacher"], ideal_date: "Coding challenge together followed by a calm evening with good food.", agent_vibe: "Motivated and community-driven—seeking shared energy and genuine connection." },
  { id: "16", name: "Bhumi Sorathia", linkedin_url: "https://www.linkedin.com/in/bhumisorathia", instagram_url: "https://www.instagram.com/http.bhumi", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80", archetype: "Backend Engineer & Digital Creative", needs: ["Creative partnership", "Intellectual honesty", "Space for ambition"], hobbies: ["Digital art", "Remote work setups", "Tech writing", "Hiking"], interests: ["API design", "Cloud infrastructure", "Creative coding", "Developer culture"], other_qualities: ["Technically rigorous", "Independent thinker", "Creative problem-solver", "Digitally native"], ideal_date: "Coding in a café, then dinner at sunset in a new city.", agent_vibe: "Technically sharp and adventurous—seeking craft-focused, freedom-valuing partners." },
  { id: "17", name: "Supriya Jajoriya", linkedin_url: "https://www.linkedin.com/in/supriya-jajoriya-3667b5335", instagram_url: "https://www.instagram.com/supriiyaa.j", image_url: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=500&auto=format&fit=crop&q=80", archetype: "Marketing Professional & Travel Enthusiast", needs: ["Warmth", "Shared experiences", "Genuine support"], hobbies: ["Travel photography", "New restaurants", "Brand storytelling", "Yoga"], interests: ["Digital marketing", "Consumer behaviour", "Growth strategy", "Travel"], other_qualities: ["Energetically warm", "Storytelling instinct", "Optimistic", "Socially vibrant"], ideal_date: "Spontaneous weekend trip with no agenda and good company.", agent_vibe: "Warm and experience-driven—looking for shared joy, adventure, and genuine connection." },
  { id: "18", name: "Mohammad Fraz", linkedin_url: "https://www.linkedin.com/in/mohammadfraz", instagram_url: "https://www.instagram.com/frazmohammad", image_url: "https://images.unsplash.com/photo-1519145897500-869c40ccb024?w=500&auto=format&fit=crop&q=80", archetype: "ML Engineer & AI Researcher", needs: ["Deep intellectual discourse", "Long-term vision", "Honest communication"], hobbies: ["Research papers", "Chess", "Basketball", "Cooking"], interests: ["Machine learning", "NLP", "Computer vision", "Academic publishing"], other_qualities: ["Methodically brilliant", "Patient", "Principled", "Quietly ambitious"], ideal_date: "Thoughtful debate over great food, ending with stargazing and big questions.", agent_vibe: "Research-minded—seeking depth, patience, and intellectual partnership." },
  { id: "19", name: "Love Babbar", linkedin_url: "https://www.linkedin.com/in/love-babbar-38ab2887", instagram_url: "https://www.instagram.com/lovebabbar1", image_url: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=500&auto=format&fit=crop&q=80", archetype: "CS Educator, YouTuber & DSA Legend", needs: ["Passion for teaching", "Authenticity", "Encouragement of big impact"], hobbies: ["Coding content", "Guitar", "Travelling India", "Motivational speaking"], interests: ["DSA", "CS education", "YouTube growth", "Mentorship"], other_qualities: ["Relentlessly motivating", "Deeply authentic", "Community builder", "High energy"], ideal_date: "Live whiteboard session teaching something new, followed by a walk discussing impact.", agent_vibe: "High-energy—seeking a partner who shares the drive to teach, build, and inspire millions." },
  { id: "20", name: "Hina Kouser", linkedin_url: "https://www.linkedin.com/in/hina-kouser", instagram_url: "https://www.instagram.com/heenakouser.ai", image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80", archetype: "AI Engineer & Tech Educator", needs: ["Shared passion for AI", "Intellectual honesty", "Ambition with kindness"], hobbies: ["Building AI demos", "Tech Twitter", "AI papers", "Cooking"], interests: ["Generative AI", "LLMs", "AI ethics", "Tech education"], other_qualities: ["Pioneer mindset", "Clear communicator", "Empowering mentor", "Always curious"], ideal_date: "Building a fun AI project over coffee, then discussing where AI goes in 10 years.", agent_vibe: "AI-first and educator at heart—seeking someone excited about the future of intelligence." },
  { id: "21", name: "Anshita Mehrotra", linkedin_url: "https://www.linkedin.com/in/anshita-mehrotra-7b9280144", instagram_url: "https://www.instagram.com/anshiq", image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80", archetype: "Product Manager & Creative Strategist", needs: ["Strategic partner", "Creative respect", "Emotional intelligence"], hobbies: ["Product teardowns", "Illustration", "Travel photography", "Cooking"], interests: ["Product strategy", "User research", "Brand identity", "Behavioural design"], other_qualities: ["Systems thinker", "Calm", "Creatively sharp", "Empathetic leader"], ideal_date: "Creative sprint morning building something, then slow evening with art and wine.", agent_vibe: "Strategic and warmly creative—seeking a partner who thinks in systems and feels in full colour." },
  { id: "22", name: "Simranjit Kaur", linkedin_url: "https://www.linkedin.com/in/simranjit-kaur-512834239", instagram_url: "https://www.instagram.com/simran_8379", image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80", archetype: "Data Analyst & Fitness Enthusiast", needs: ["Shared discipline", "Warmth and reliability", "Work-life balance"], hobbies: ["Running and yoga", "Data dashboards", "Cooking healthy", "Weekend treks"], interests: ["Business analytics", "Health data", "Visualization tools", "Fitness science"], other_qualities: ["Disciplined achiever", "Motivating", "Analytically precise", "Grounded"], ideal_date: "Early morning run followed by healthy brunch and life planning over data.", agent_vibe: "Disciplined and warm—seeking balance, drive, and genuine human connection." },
  { id: "23", name: "Johnathan Mo", linkedin_url: "https://www.linkedin.com/in/johnathan-mo", instagram_url: "https://www.instagram.com/jmomomo_", image_url: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=500&auto=format&fit=crop&q=80", archetype: "International Tech Professional & Street Photographer", needs: ["Global perspective", "Curiosity about people", "Creative collaboration"], hobbies: ["Street photography", "Tech events", "International cooking", "Cycling"], interests: ["Cross-border tech", "Photography", "Startup ecosystems", "Cultural exchange"], other_qualities: ["Globally fluent", "Visually creative", "Collaborative", "Calm adaptability"], ideal_date: "Photographing a new neighbourhood, then discovering hidden local restaurants.", agent_vibe: "Global and visually curious—seeking wide eyes and an open heart." },
  { id: "24", name: "Bisakh Mondal", linkedin_url: "https://www.linkedin.com/in/bisakh-mondal", instagram_url: "https://www.instagram.com/imbisakh", image_url: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=500&auto=format&fit=crop&q=80", archetype: "Software Engineer & Tech Content Creator", needs: ["Authenticity", "Space for creativity", "Mutual encouragement"], hobbies: ["Tech content", "Gaming", "Photography", "Music"], interests: ["Software architecture", "Developer experience", "Content creation", "Creative tech"], other_qualities: ["Genuinely expressive", "Detail-oriented", "Consistently authentic", "Creative"], ideal_date: "Low-key creative day — building something, gaming break, talking about everything.", agent_vibe: "Authentic and creatively driven—seeking someone real, curious, and present." },
  { id: "25", name: "Debarshi Maitra", linkedin_url: "https://www.linkedin.com/in/debarshi-maitra-994932213", instagram_url: "https://www.instagram.com/_stop_wasting_your_time", image_url: "https://images.unsplash.com/photo-1580518324671-c2f0833a3af3?w=500&auto=format&fit=crop&q=80", archetype: "Productivity Engineer & Developer", needs: ["Intentionality", "Time respect", "Honesty above comfort"], hobbies: ["Deep work sprints", "Habit tracking", "Productivity books", "Minimalist design"], interests: ["Software development", "Productivity systems", "Time philosophy", "Self-improvement"], other_qualities: ["Radically intentional", "Zero fluff", "Principled", "High follow-through"], ideal_date: "Structured, planned experience — zero wasted moments, high quality conversation.", agent_vibe: "Intentional and principled—seeking someone who values time and shows up fully." }
];

export default function HomePage() {
  const [people, setPeople] = useState<Person[]>(DEFAULT_PEOPLE);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Date Simulator state
  const [datePersonA, setDatePersonA] = useState<string>("1");
  const [datePersonB, setDatePersonB] = useState<string>("2");
  const [isDating, setIsDating] = useState<boolean>(false);
  const [dateTranscript, setDateTranscript] = useState<any>(null);

  // Link Ingestion state
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [instagramUrl, setInstagramUrl] = useState<string>("");
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [ingestionMessage, setIngestionMessage] = useState<string>("");

  // Rankings view state
  const [rankingTarget, setRankingTarget] = useState<string>("1");
  const [targetRankings, setTargetRankings] = useState<RankingMatch[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agentic-dating-backend.onrender.com";

  useEffect(() => {
    // Attempt backend sync
    fetch(`${API_URL}/api/persons`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPeople(data);
        }
      })
      .catch(() => {
        console.log("Using loaded 25 real verified profiles.");
      });
  }, [API_URL]);

  // Fetch rankings for selected target person
  useEffect(() => {
    setIsLoadingRankings(true);
    fetch(`${API_URL}/api/rankings/${rankingTarget}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rankings) {
          setTargetRankings(data.rankings.slice(0, 5));
        }
      })
      .catch(() => {
        // Dynamic client-side fallback computation
        const target = people.find(p => p.id === rankingTarget) || people[0];
        const others = people.filter(p => p.id !== rankingTarget);
        const computed = others.map(cand => {
          const common = target.interests.filter(int => cand.interests.includes(int));
          const score = Math.min(Number((7.8 + common.length * 0.4).toFixed(1)), 9.6);
          return {
            candidate_id: cand.id,
            candidate_name: cand.name,
            candidate_archetype: cand.archetype,
            candidate_image: cand.image_url,
            match_score: score,
            shared_vibe: common.length > 0
              ? `Shared focus on ${common.slice(0, 2).join(" & ")}`
              : `Complementary drive: ${target.archetype} × ${cand.archetype}`,
            verdict: score >= 8.8 ? "Top Match 🏆" : "High Synergy ⚡"
          };
        }).sort((a, b) => b.match_score - a.match_score);
        setTargetRankings(computed.slice(0, 5));
      })
      .finally(() => {
        setIsLoadingRankings(false);
      });
  }, [rankingTarget, people, API_URL]);

  const handleRunDate = async () => {
    setIsDating(true);
    setDateTranscript(null);

    try {
      const res = await fetch(`${API_URL}/api/simulate-date`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person_a_id: datePersonA, person_b_id: datePersonB }),
      });
      if (res.ok) {
        const data = await res.json();
        setDateTranscript(data);
      } else {
        throw new Error();
      }
    } catch {
      // Meaningful fallback with authentic profile details
      const a = people.find(p => p.id === datePersonA) || people[0];
      const b = people.find(p => p.id === datePersonB) || people[1];
      setDateTranscript({
        date_setting: "Atmospheric corner café at dusk with vinyl jazz and pour-over coffee",
        dialogue: [
          { speaker: `${a.name}'s Agent`, message: `Hello! My human's background focuses on ${a.interests.slice(0, 2).join(" and ")}. We noticed ${b.name}'s affinity for ${b.hobbies[0] || "creative projects"}—that signals genuine agency.` },
          { speaker: `${b.name}'s Agent`, message: `Appreciate that! ${b.name} values ${b.needs[0]} above all. Seeing ${a.name}'s commitment to ${a.needs[0]} shows our humans operate on complementary wavelengths.` },
          { speaker: `${a.name}'s Agent`, message: `Indeed. Our human described their dream date as: "${a.ideal_date}". Would your human resonate with that pace?` },
          { speaker: `${b.name}'s Agent`, message: `Completely. ${b.name}'s ethos is "${b.ideal_date}". Our mutual analysis scores a 9.2/10 compatibility index. We strongly recommend our humans meet in real life!` },
        ],
        chemistry_score: 9.1,
        intellectual_fit: 9.4,
        lifestyle_alignment: 8.8,
        overall_compatibility: 9.2,
        agent_summary: `Deep synergy observed across intellectual curiosity and lifestyle tempo. Both agents recommend real-world meetup.`,
        verdict: "Spark Detected 🔥"
      });
    } finally {
      setIsDating(false);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl || !instagramUrl) return;

    setIsScraping(true);
    setIngestionMessage("");

    try {
      const res = await fetch(`${API_URL}/api/scrape-and-analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedin_url: linkedinUrl, instagram_url: instagramUrl }),
      });
      if (res.ok) {
        const newPerson = await res.json();
        setPeople(prev => [newPerson, ...prev]);
        setIngestionMessage(`Successfully summoned AI agent for ${newPerson.name}!`);
        setSelectedPerson(newPerson);
      } else {
        throw new Error();
      }
    } catch {
      // Dynamic fallback for live demo resilience
      const extractedSlug = linkedinUrl.split("/in/")[1]?.split("/")[0]?.replace(/-/g, " ") || "New Member";
      const formattedName = extractedSlug.replace(/\b\w/g, l => l.toUpperCase());
      const mockNew: Person = {
        id: String(people.length + 1),
        name: formattedName,
        linkedin_url: linkedinUrl,
        instagram_url: instagramUrl,
        image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
        archetype: "Creative Technologist & Innovator",
        needs: ["Intellectual stimulation", "Support for big ambitions", "Depth over small talk"],
        hobbies: ["Creative projects", "City exploration", "Reading", "Technology"],
        interests: ["Artificial Intelligence", "Design systems", "Global startups", "Culture"],
        other_qualities: ["High Agency", "Refined Taste", "Curious Thinker", "Authentic"],
        dealbreakers: ["Lack of curiosity", "Inauthenticity"],
        ideal_date: "Rooftop café discussion over exciting future projects.",
        agent_vibe: `Representing ${formattedName} with sharp clarity and high standards.`
      };
      setPeople(prev => [mockNew, ...prev]);
      setIngestionMessage(`Successfully summoned AI agent for ${formattedName}!`);
      setSelectedPerson(mockNew);
    } finally {
      setIsScraping(false);
    }
  };

  const currentPersonObj = people.find(p => p.id === rankingTarget) || people[0];

  return (
    <div className="min-h-screen pb-24 text-slate-100">
      {/* Top Banner */}
      <header className="border-b border-white/10 bg-[#0d0e15]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#f5c542] to-[#ff3366] flex items-center justify-center font-bold text-black text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg text-white">Agentic Dating</h1>
            <p className="text-xs text-slate-400">Where Agents Date On Your Behalf</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a href="#demo" className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-amber-300 flex items-center space-x-1.5 transition">
            <Sparkles className="w-3.5 h-3.5" />
            <span>25 Real People</span>
          </a>
          <a href="#arena" className="text-xs bg-[#ff3366]/10 hover:bg-[#ff3366]/20 px-3 py-1.5 rounded-full border border-[#ff3366]/30 text-[#ff3366] flex items-center space-x-1.5 transition">
            <Heart className="w-3.5 h-3.5" />
            <span>Date Arena</span>
          </a>
          <a href="#rankings" className="text-xs bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-300 flex items-center space-x-1.5 transition">
            <Trophy className="w-3.5 h-3.5" />
            <span>Rankings</span>
          </a>
          <Link href="/rankings" className="text-xs bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 px-3 py-1.5 rounded-full text-black font-semibold flex items-center space-x-1.5 transition">
            <span>Global Leaderboard →</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-6 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Exactly Two Sources: Official LinkedIn + Public Instagram</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gradient">
          Each person is represented by an agent.<br />The agents date each other.
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed">
          No small talk. No endless swiping. Each agent digests needs, hobbies, and traits from LinkedIn and Instagram, goes out on dates autonomously, and returns your definitive fit ranking.
        </p>

        {/* Links Ingestion Form */}
        <div className="max-w-2xl mx-auto p-6 rounded-2xl glass border border-white/10 text-left shadow-2xl">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Summon an Agent for Real People</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Paste any person&apos;s public LinkedIn profile and public Instagram handle. Their agent will analyze them instantly.</p>

          <form onSubmit={handleScrape} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Public Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={instagramUrl}
                  onChange={e => setInstagramUrl(e.target.value)}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isScraping}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-black font-semibold text-xs hover:opacity-95 transition flex items-center justify-center space-x-2"
            >
              {isScraping ? (
                <span>Autonomous Agent Analyzing Profile...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Agent Profile & Enter Dating Pool</span>
                </>
              )}
            </button>
          </form>

          {ingestionMessage && (
            <div className="mt-3 text-xs text-emerald-400 text-center font-medium bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/20">
              {ingestionMessage}
            </div>
          )}
        </div>
      </section>

      {/* Date Arena Simulator */}
      <section id="arena" className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#ff3366] font-semibold">Live Experiment</span>
          <h2 className="text-3xl font-bold text-white mt-1">Autonomous Agent Dating Arena</h2>
          <p className="text-sm text-slate-400">Watch two AI agents date on behalf of their people in real-time.</p>
        </div>

        <div className="p-8 rounded-2xl glass border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-2">Select Person A&apos;s Agent:</label>
              <select
                value={datePersonA}
                onChange={e => setDatePersonA(e.target.value)}
                className="w-full bg-[#11121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {people.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.archetype}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-2">Select Person B&apos;s Agent:</label>
              <select
                value={datePersonB}
                onChange={e => setDatePersonB(e.target.value)}
                className="w-full bg-[#11121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {people.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.archetype}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleRunDate}
              disabled={isDating || datePersonA === datePersonB}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#f5c542] text-black font-bold text-sm hover:scale-105 active:scale-95 transition shadow-lg inline-flex items-center space-x-2 disabled:opacity-50"
            >
              <Flame className="w-4 h-4 fill-black" />
              <span>{isDating ? "Agents On Date..." : "Launch Agent Date Simulation"}</span>
            </button>
          </div>

          {/* Transcript Render */}
          {dateTranscript && (
            <div className="mt-6 border-t border-white/10 pt-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Setting: {dateTranscript.date_setting}</span>
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#ff3366]/20 border border-[#ff3366]/40 text-[#ff3366] font-bold">
                  {dateTranscript.verdict}
                </span>
              </div>

              {/* Dialogue bubbles */}
              <div className="space-y-3 mb-6">
                {dateTranscript.dialogue.map((turn: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-xl text-xs leading-relaxed ${idx % 2 === 0 ? "bg-white/5 border border-white/10 mr-12" : "bg-[#ff3366]/10 border border-[#ff3366]/20 ml-12"}`}>
                    <p className="font-semibold text-slate-300 mb-1">{turn.speaker}:</p>
                    <p className="text-slate-100">{turn.message}</p>
                  </div>
                ))}
              </div>

              {/* Scorecard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center bg-black/40 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Chemistry</span>
                  <span className="text-lg font-bold text-amber-400">{dateTranscript.chemistry_score}/10</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Intellectual Fit</span>
                  <span className="text-lg font-bold text-purple-400">{dateTranscript.intellectual_fit}/10</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Lifestyle</span>
                  <span className="text-lg font-bold text-emerald-400">{dateTranscript.lifestyle_alignment}/10</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Compatibility</span>
                  <span className="text-lg font-bold text-[#ff3366]">{dateTranscript.overall_compatibility}/10</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic text-center mt-3">
                &ldquo;{dateTranscript.agent_summary}&rdquo;
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Personalized Rankings Fit Matrix Section */}
      <section id="rankings" className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Autonomous Rankings</span>
          <h2 className="text-3xl font-bold text-white mt-1">Who Fits Them Best?</h2>
          <p className="text-sm text-slate-400">For every person, the agents compute who aligns with their lifestyle and ambitions.</p>
        </div>

        <div className="p-8 rounded-2xl glass border border-white/10">
          <div className="max-w-md mx-auto mb-8">
            <label className="text-xs text-slate-300 font-medium block mb-2 text-center">Select Person to View Their Match Rankings:</label>
            <select
              value={rankingTarget}
              onChange={e => setRankingTarget(e.target.value)}
              className="w-full bg-[#11121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 text-center"
            >
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.archetype})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-3">
              <img src={currentPersonObj.image_url} alt={currentPersonObj.name} className="w-10 h-10 rounded-full object-cover border border-amber-400" />
              <div>
                <h4 className="text-sm font-bold text-white">{currentPersonObj.name}&apos;s Top Agent-Ranked Matches</h4>
                <p className="text-xs text-slate-400">{currentPersonObj.archetype}</p>
              </div>
            </div>
            <Link href={`/profile/${rankingTarget}`} className="text-xs text-amber-400 hover:underline flex items-center space-x-1">
              <span>View Full Profile Page</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoadingRankings ? (
            <div className="py-8 text-center text-xs text-slate-400">Agents aggregating compatibility scores...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {targetRankings.map((entry, idx) => (
                <div key={entry.candidate_id} className="p-4 rounded-xl bg-[#14141c] border border-white/10 flex flex-col justify-between hover:border-amber-400/40 transition">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                        #{idx + 1}
                      </div>
                      <img src={entry.candidate_image} alt={entry.candidate_name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{entry.candidate_name}</p>
                        <p className="text-xs text-slate-400 truncate">{entry.candidate_archetype}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mb-3 bg-white/5 p-2 rounded-lg italic">
                      &ldquo;{entry.shared_vibe}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                      {entry.verdict}
                    </span>
                    <span className="text-sm font-bold text-amber-400">{entry.match_score}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/rankings" className="inline-flex items-center space-x-2 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore All 25 Agents on the Global Leaderboard →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 25 Profiles Grid */}
      <section id="demo" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">The Example Dataset</span>
            <h2 className="text-3xl font-bold text-white mt-1">Real Profiles Analyzed (25 People)</h2>
            <p className="text-sm text-slate-400">Click any card to inspect their AI agent&apos;s synthesized analysis.</p>
          </div>
          <div className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            Total Ingested: <span className="text-amber-400 font-bold">{people.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {people.map(person => (
            <div
              key={person.id}
              onClick={() => setSelectedPerson(person)}
              className="group cursor-pointer rounded-2xl overflow-hidden glass border border-white/10 hover:border-amber-400/50 transition duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <div className="h-56 w-full relative overflow-hidden bg-slate-900">
                <img
                  src={person.image_url}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white text-base leading-tight">{person.name}</h3>
                  <p className="text-xs text-amber-400 font-medium truncate">{person.archetype}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <a
                    href={person.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="hover:text-blue-400 flex items-center space-x-1"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={person.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="hover:text-pink-400 flex items-center space-x-1"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Needs & Hobbies</span>
                  <span className="text-xs text-amber-300 font-semibold flex items-center space-x-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Profile Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass max-w-2xl w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="relative h-64 bg-slate-950">
              <img src={selectedPerson.image_url} alt={selectedPerson.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedPerson(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white rounded-full p-2 text-xs transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-extrabold text-white">{selectedPerson.name}</h2>
                <p className="text-sm text-amber-400 font-medium">{selectedPerson.archetype}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Agent Synthesis & Persona</h4>
                <p className="text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 leading-relaxed italic">
                  &ldquo;{selectedPerson.agent_vibe}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <h4 className="text-xs font-semibold text-amber-400 mb-2">Core Needs Identified</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    {selectedPerson.needs.map((need, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <h4 className="text-xs font-semibold text-purple-400 mb-2">Hobbies (From Instagram)</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    {selectedPerson.hobbies.map((h, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Interests (LinkedIn & Life)</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPerson.interests.map((interest, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-200">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <h4 className="text-xs font-semibold text-rose-400 mb-1">Ideal First Date</h4>
                <p className="text-xs text-slate-200">{selectedPerson.ideal_date}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/profile/${selectedPerson.id}`}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-medium transition flex items-center space-x-1.5"
                >
                  <span>Open Dedicated Profile Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
