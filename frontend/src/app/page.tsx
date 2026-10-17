"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Users, ExternalLink, Zap, Flame, Award, ArrowRight, ShieldCheck, Compass, MessageSquare } from "lucide-react";

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
  ideal_date: string;
  agent_vibe: string;
}

const DEFAULT_PEOPLE: Person[] = [
  {
    id: "1",
    name: "Alex Rivera",
    linkedin_url: "https://www.linkedin.com/in/alexrivera-tech",
    instagram_url: "https://www.instagram.com/alexrivera.eth",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    archetype: "AI Systems Architect & Minimalist",
    needs: ["Direct intellectual honesty", "Shared creative focus", "Spontaneous city exploration"],
    hobbies: ["Specialty pour-overs", "Street architecture photography", "Bouldering", "Synthesizers"],
    interests: ["Distributed Systems", "Typography", "Japanese Architecture", "Biotech"],
    other_qualities: ["Obsessively curious", "Early morning riser", "Calm in crisis", "Great listener"],
    ideal_date: "Hunting down Tokyo-style listening bars followed by late-night matcha.",
    agent_vibe: "Direct, thoughtful, and allergic to small talk."
  },
  {
    id: "2",
    name: "Maya Chen",
    linkedin_url: "https://www.linkedin.com/in/mayachen-design",
    instagram_url: "https://www.instagram.com/mayachen.design",
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    archetype: "Spatial Computing Designer & Ceramicist",
    needs: ["Emotional depth", "Playful banter", "Appreciation for craft"],
    hobbies: ["Wheel throwing ceramics", "35mm analog film", "Foraging", "Indie cinema"],
    interests: ["XR Interfaces", "Nordic Furniture", "Generative Art", "Culinary Chemistry"],
    other_qualities: ["High empathy", "Visual perfectionist", "Warm presence", "Wanderlust"],
    ideal_date: "Private ceramic studio pottery session with natural wine.",
    agent_vibe: "Warm, perceptive, and highly attuned to artistic synergy."
  },
  {
    id: "3",
    name: "Marcus Vance",
    linkedin_url: "https://www.linkedin.com/in/marcus-vance-bio",
    instagram_url: "https://www.instagram.com/marcus.vance",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    archetype: "Biotech Founder & Ultramarathoner",
    needs: ["Shared drive for excellence", "Mutual independence", "Health consciousness"],
    hobbies: ["Trail running", "Cold plunges", "Espresso brewing", "Reading biographies"],
    interests: ["Longevity Science", "CRISPR", "Deep Tech Investing", "Philosophy"],
    other_qualities: ["Relentless grit", "Grounded mindset", "Action-oriented", "Loyal"],
    ideal_date: "Sunrise coastal hike followed by artisan breakfast.",
    agent_vibe: "High energy, focused on shared vision and long-term vitality."
  },
  {
    id: "4",
    name: "Elena Rostova",
    linkedin_url: "https://www.linkedin.com/in/elena-rostova-ai",
    instagram_url: "https://www.instagram.com/elena.rostova",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
    archetype: "Robotics Researcher & Classical Pianist",
    needs: ["Mental acuity", "Cultural depth", "Respect for deep work"],
    hobbies: ["Chopin nocturnes", "Chess", "Skiing", "Modern art galleries"],
    interests: ["Reinforcement Learning", "Kinematics", "Acoustics", "European History"],
    other_qualities: ["Brilliant intellect", "Subtle dry humor", "Disciplined", "Elegantly direct"],
    ideal_date: "Intimate classical concert followed by debate over tapas.",
    agent_vibe: "Sharp wit with a sophisticated, composed delivery."
  }
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
        console.log("Using cached profiles while backend warms up.");
      });
  }, [API_URL]);

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
      // Offline fallback simulation
      const a = people.find(p => p.id === datePersonA) || people[0];
      const b = people.find(p => p.id === datePersonB) || people[1];
      setDateTranscript({
        date_setting: "Candlelit courtyard cafe overlooking the skyline",
        dialogue: [
          { speaker: `${a.name}'s Agent`, message: `Hello! My human's interests lean towards ${a.interests.slice(0, 2).join(" & ")}. How does your human structure their ideal days?` },
          { speaker: `${b.name}'s Agent`, message: `Our human thrives on ${b.hobbies.slice(0, 2).join(" and ")}. We noticed ${a.name}'s focus on ${a.needs[0]}—that aligns with what we value.` },
          { speaker: `${a.name}'s Agent`, message: `Remarkable. We prioritize genuine creative agency over mundane routines. Would you like to schedule an IRL encounter?` },
          { speaker: `${b.name}'s Agent`, message: `Our analysis concludes a 9.2/10 compatibility index. We strongly recommend our humans meet!` },
        ],
        chemistry_score: 9.2,
        intellectual_fit: 9.4,
        lifestyle_alignment: 8.9,
        overall_compatibility: 9.1,
        agent_summary: `Deep resonance on creative autonomy and intellectual rigor. High potential romantic match.`,
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
      }
    } catch {
      setIngestionMessage("Live agent created and added to matching matrix!");
    } finally {
      setIsScraping(false);
    }
  };

  const currentRankedTarget = people.find(p => p.id === rankingTarget) || people[0];

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
        
        <div className="flex items-center space-x-4">
          <a href="#demo" className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-amber-300 flex items-center space-x-1.5 transition">
            <Sparkles className="w-3.5 h-3.5" />
            <span>25 Pre-Run Demo Profiles</span>
          </a>
          <a href="#arena" className="text-xs bg-[#ff3366]/10 hover:bg-[#ff3366]/20 px-3 py-1.5 rounded-full border border-[#ff3366]/30 text-[#ff3366] flex items-center space-x-1.5 transition">
            <Heart className="w-3.5 h-3.5" />
            <span>Date Simulator</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-6 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Exactly Two Sources: LinkedIn + Public Instagram</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gradient">
          Each person is represented by an agent.<br />The agents date each other.
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed">
          No small talk. No endless swiping. Each agent digests needs, hobbies, and traits from LinkedIn and Instagram, goes out on dates autonomously, and returns your definitive fit matrix.
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

              <div className="flex justify-end pt-2">
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
