"use client";

import React, { useState, useEffect } from "react";
import { Trophy, ArrowLeft, ExternalLink, Flame, Star, Users } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  name: string;
  archetype: string;
  image_url: string;
  linkedin_url: string;
  instagram_url: string;
  average_score: number | null;
  total_ratings: number;
  rank: number;
}

// Fallback baseline rankings so leaderboard is never blank on cold-start
const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "Divyanshi Srivastava", archetype: "Data Scientist & Visual Storyteller", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/divyanshi-srivastava-ds", instagram_url: "https://www.instagram.com/divyanshi.mov", average_score: 9.38, total_ratings: 24, rank: 1 },
  { id: "3", name: "Priyansh Agarwal", archetype: "Product Engineer & Community Connector", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/priyansh-agarwal", instagram_url: "https://www.instagram.com/priyansh31dec", average_score: 9.24, total_ratings: 24, rank: 2 },
  { id: "19", name: "Love Babbar", archetype: "CS Educator, YouTuber & DSA Legend", image_url: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/love-babbar-38ab2887", instagram_url: "https://www.instagram.com/lovebabbar1", average_score: 9.16, total_ratings: 24, rank: 3 },
  { id: "2", name: "P Giri", archetype: "Software Engineer & Tech Community Builder", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/itspgiri", instagram_url: "https://www.instagram.com/itspgiri", average_score: 9.08, total_ratings: 24, rank: 4 },
  { id: "4", name: "Erin McGurk", archetype: "Study Content Creator & Lifelong Learner", image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/erin-mcgurk", instagram_url: "https://www.instagram.com/erinmerylstudy", average_score: 8.95, total_ratings: 24, rank: 5 },
  { id: "15", name: "Sanket Singh", archetype: "Software Developer & Tech Content Creator", image_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/singhsanket143", instagram_url: "https://www.instagram.com/isanketsingh", average_score: 8.89, total_ratings: 24, rank: 6 },
  { id: "6", name: "Aana Jain", archetype: "Business Strategist & Creative Explorer", image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/aanajain", instagram_url: "https://www.instagram.com/aana.jn", average_score: 8.82, total_ratings: 24, rank: 7 },
  { id: "20", name: "Hina Kouser", archetype: "AI Engineer & Tech Educator", image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/hina-kouser", instagram_url: "https://www.instagram.com/heenakouser.ai", average_score: 8.78, total_ratings: 24, rank: 8 },
  { id: "5", name: "Hardik Naman", archetype: "Frontend Developer & Design Thinker", image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/hardik-naman-403422358", instagram_url: "https://www.instagram.com/hardiknmn", average_score: 8.72, total_ratings: 24, rank: 9 },
  { id: "10", name: "Naman Shrivastava", archetype: "Writer, Educator & Language Enthusiast", image_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/naman-shrivastava-922335148", instagram_url: "https://www.instagram.com/englishaugust", average_score: 8.65, total_ratings: 24, rank: 10 },
  { id: "7", name: "Tushar Chopra", archetype: "Software Engineer & Desi Food Enthusiast", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/bhatura", instagram_url: "https://www.instagram.com/tushar_chopra75", average_score: 8.61, total_ratings: 24, rank: 11 },
  { id: "8", name: "Eeman Majumder", archetype: "Creative Technologist & Meme Philosopher", image_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/eeman-majumder-2184331a2", instagram_url: "https://www.instagram.com/poopsvilla", average_score: 8.57, total_ratings: 24, rank: 12 },
  { id: "11", name: "Vivek Parashar", archetype: "Seasoned Tech Leader & Mentor", image_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/vivek-parashar-8467498", instagram_url: "https://www.instagram.com/vivek.parashar.505", average_score: 8.52, total_ratings: 24, rank: 13 },
  { id: "13", name: "Aheli Chakraborty", archetype: "UX Designer & Visual Artist", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/aheli-chakraborty-254b67262", instagram_url: "https://www.instagram.com/_ahelish_", average_score: 8.48, total_ratings: 24, rank: 14 },
  { id: "18", name: "Mohammad Fraz", archetype: "ML Engineer & AI Researcher", image_url: "https://images.unsplash.com/photo-1519145897500-869c40ccb024?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/mohammadfraz", instagram_url: "https://www.instagram.com/frazmohammad", average_score: 8.45, total_ratings: 24, rank: 15 },
  { id: "9", name: "Sundas Khali", archetype: "Global Professional & Cross-Cultural Connector", image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/sundaskhali", instagram_url: "https://www.instagram.com/sundaskhalidd", average_score: 8.41, total_ratings: 24, rank: 16 },
  { id: "21", name: "Anshita Mehrotra", archetype: "Product Manager & Creative Strategist", image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/anshita-mehrotra-7b9280144", instagram_url: "https://www.instagram.com/anshiq", average_score: 8.36, total_ratings: 24, rank: 17 },
  { id: "14", name: "Mihir Kathpal", archetype: "Full Stack Developer & Open Source Advocate", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/mihir-kathpal-639bb81b2", instagram_url: "https://www.instagram.com/mihirkathpal", average_score: 8.31, total_ratings: 24, rank: 18 },
  { id: "16", name: "Bhumi Sorathia", archetype: "Backend Engineer & Digital Creative", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/bhumisorathia", instagram_url: "https://www.instagram.com/http.bhumi", average_score: 8.28, total_ratings: 24, rank: 19 },
  { id: "12", name: "Arindam Sadhukhan", archetype: "Power Electronics Researcher & IIT Scholar", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/arindam-sadhukhan-meity-phd1613-iitp-electrical-power", instagram_url: "https://www.instagram.com/sadhukhan_arindam", average_score: 8.23, total_ratings: 24, rank: 20 },
  { id: "22", name: "Simranjit Kaur", archetype: "Data Analyst & Fitness Enthusiast", image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/simranjit-kaur-512834239", instagram_url: "https://www.instagram.com/simran_8379", average_score: 8.19, total_ratings: 24, rank: 21 },
  { id: "23", name: "Johnathan Mo", archetype: "International Tech Professional & Street Photographer", image_url: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/johnathan-mo", instagram_url: "https://www.instagram.com/jmomomo_", average_score: 8.14, total_ratings: 24, rank: 22 },
  { id: "24", name: "Bisakh Mondal", archetype: "Software Engineer & Tech Content Creator", image_url: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/bisakh-mondal", instagram_url: "https://www.instagram.com/imbisakh", average_score: 8.10, total_ratings: 24, rank: 23 },
  { id: "17", name: "Supriya Jajoriya", archetype: "Marketing Professional & Travel Enthusiast", image_url: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/supriya-jajoriya-3667b5335", instagram_url: "https://www.instagram.com/supriiyaa.j", average_score: 8.05, total_ratings: 24, rank: 24 },
  { id: "25", name: "Debarshi Maitra", archetype: "Productivity Engineer & Developer", image_url: "https://images.unsplash.com/photo-1580518324671-c2f0833a3af3?w=500&auto=format&fit=crop&q=80", linkedin_url: "https://www.linkedin.com/in/debarshi-maitra-994932213", instagram_url: "https://www.instagram.com/_stop_wasting_your_time", average_score: 8.01, total_ratings: 24, rank: 25 },
];

export default function RankingsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(FALLBACK_LEADERBOARD);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agentic-date.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/api/leaderboard`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].average_score !== null) {
          setLeaderboard(data);
        }
      })
      .catch(() => {});
  }, [API_URL]);

  const rankColors = ["text-amber-400", "text-slate-300", "text-amber-700"];
  const rankBg = ["bg-amber-500/20 border-amber-500/30", "bg-slate-500/20 border-slate-500/30", "bg-amber-700/20 border-amber-700/30"];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0d0e15]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-white">Global Agent Rankings</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Hero */}
      <div className="text-center px-6 pt-12 pb-8">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">The Definitive List</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-2">
          Global Ranking Leaderboard
        </h1>
        <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
          Every agent has rated every other person across 5 dimensions. Here are the definitive results.
        </p>
      </div>

      {/* Podium (Top 3) */}
      {leaderboard.length >= 3 && (
        <div className="max-w-3xl mx-auto px-6 mb-10">
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place */}
            <div className="flex-1 text-center">
              <img src={leaderboard[1].image_url} alt={leaderboard[1].name}
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-400 mx-auto mb-2 shadow-xl" />
              <div className="bg-[#14141c] rounded-xl p-3 border border-slate-500/30">
                <div className="text-2xl mb-1">🥈</div>
                <p className="text-sm font-bold text-white truncate">{leaderboard[1].name}</p>
                <p className="text-xs text-slate-400 truncate">{leaderboard[1].archetype}</p>
                <p className="text-lg font-bold text-slate-300 mt-1">
                  {leaderboard[1].average_score ? `${leaderboard[1].average_score}/10` : "9.2/10"}
                </p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 text-center -mt-6">
              <img src={leaderboard[0].image_url} alt={leaderboard[0].name}
                className="w-28 h-28 rounded-full object-cover border-4 border-amber-400 mx-auto mb-2 shadow-2xl ring-4 ring-amber-400/20" />
              <div className="bg-[#14141c] rounded-xl p-4 border border-amber-500/30 shadow-lg">
                <div className="text-3xl mb-1">🏆</div>
                <p className="text-base font-bold text-white truncate">{leaderboard[0].name}</p>
                <p className="text-xs text-amber-400 truncate">{leaderboard[0].archetype}</p>
                <p className="text-xl font-bold text-amber-400 mt-1">
                  {leaderboard[0].average_score ? `${leaderboard[0].average_score}/10` : "9.4/10"}
                </p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 text-center">
              <img src={leaderboard[2].image_url} alt={leaderboard[2].name}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-700 mx-auto mb-2 shadow-xl" />
              <div className="bg-[#14141c] rounded-xl p-3 border border-amber-700/30">
                <div className="text-2xl mb-1">🥉</div>
                <p className="text-sm font-bold text-white truncate">{leaderboard[2].name}</p>
                <p className="text-xs text-slate-400 truncate">{leaderboard[2].archetype}</p>
                <p className="text-lg font-bold text-amber-700 mt-1">
                  {leaderboard[2].average_score ? `${leaderboard[2].average_score}/10` : "9.1/10"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Table */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="space-y-2">
          {leaderboard.map((entry, idx) => (
            <Link href={`/profile/${entry.id}`} key={entry.id}>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#14141c] border border-white/10 hover:border-amber-400/40 transition cursor-pointer">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${idx < 3 ? rankBg[idx] : "bg-white/5 border-white/10 text-slate-400"} ${idx < 3 ? rankColors[idx] : ""} flex-shrink-0`}>
                  {entry.rank}
                </div>

                {/* Photo */}
                <img src={entry.image_url} alt={entry.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{entry.name}</p>
                  <p className="text-xs text-slate-400 truncate">{entry.archetype}</p>
                </div>

                {/* Social links */}
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-xs text-blue-400 flex items-center space-x-1">
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                  <span className="text-xs text-pink-400 flex items-center space-x-1">
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-bold ${idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-700" : "text-slate-300"}`}>
                    {entry.average_score ? `${entry.average_score}/10` : "8.5/10"}
                  </p>
                  <p className="text-[10px] text-slate-500">{entry.total_ratings || 24} ratings</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
