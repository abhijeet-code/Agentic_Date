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

export default function RankingsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agentic-dating-backend.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/api/leaderboard`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setLeaderboard(data))
      .catch(() => {})
      .finally(() => setLoading(false));
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
        {!loading && leaderboard.length > 0 && leaderboard[0].total_ratings === 0 && (
          <div className="mt-4 inline-block text-xs px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            ⚡ Ratings not yet computed. <a href={`${API_URL}/api/run-all-ratings`} target="_blank" rel="noreferrer" className="underline">Trigger rating matrix</a> then refresh.
          </div>
        )}
      </div>

      {/* Podium (Top 3) */}
      {!loading && leaderboard.length >= 3 && (
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
                  {leaderboard[1].average_score ? `${leaderboard[1].average_score}/10` : "Pending"}
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
                  {leaderboard[0].average_score ? `${leaderboard[0].average_score}/10` : "Pending"}
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
                  {leaderboard[2].average_score ? `${leaderboard[2].average_score}/10` : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Table */}
      <div className="max-w-4xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading rankings...</p>
          </div>
        ) : (
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
                    <a href={entry.linkedin_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      className="text-xs text-blue-400 hover:underline flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href={entry.instagram_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      className="text-xs text-pink-400 hover:underline flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-lg font-bold ${idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-700" : "text-slate-300"}`}>
                      {entry.average_score ? `${entry.average_score}` : "—"}
                    </p>
                    <p className="text-[10px] text-slate-500">{entry.total_ratings} ratings</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
