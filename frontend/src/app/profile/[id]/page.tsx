"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Heart, Zap, Flame, Star, Trophy, Compass } from "lucide-react";
import Link from "next/link";

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

interface RankingEntry {
  candidate_id: string;
  candidate_name: string;
  candidate_archetype: string;
  candidate_image: string;
  match_score: number;
  shared_vibe: string;
  verdict: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agentic-dating-backend.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personRes, rankRes] = await Promise.all([
          fetch(`${API_URL}/api/persons/${params.id}`),
          fetch(`${API_URL}/api/rankings/${params.id}`)
        ]);
        if (personRes.ok) {
          const p = await personRes.json();
          setPerson(p);
        }
        if (rankRes.ok) {
          const r = await rankRes.json();
          setRankings(r.rankings?.slice(0, 6) || []);
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Agent synthesizing profile...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p className="text-lg">Profile not found.</p>
          <Link href="/" className="mt-4 inline-block text-amber-400 underline text-sm">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pb-16">
      {/* Back nav */}
      <div className="sticky top-0 z-50 bg-[#0d0e15]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition text-sm w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all agents</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={person.image_url} alt={person.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/60 to-transparent" />
        <div className="absolute bottom-8 left-6 right-6">
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-1">AI Agent Profile</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">{person.name}</h1>
          <p className="text-lg text-amber-300 mt-1 font-medium">{person.archetype}</p>
          <div className="flex items-center space-x-3 mt-3">
            <a href={person.linkedin_url} target="_blank" rel="noreferrer"
              className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition">
              <ExternalLink className="w-3 h-3" />
              <span>LinkedIn</span>
            </a>
            <a href={person.instagram_url} target="_blank" rel="noreferrer"
              className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-400 hover:bg-pink-600/30 transition">
              <ExternalLink className="w-3 h-3" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 mt-10 space-y-8">

        {/* Agent Vibe */}
        <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Agent Synthesis & Persona</h2>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed italic">
            &ldquo;{person.agent_vibe}&rdquo;
          </p>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              Core Needs <span className="text-slate-500 normal-case">(From LinkedIn)</span>
            </h3>
            <ul className="space-y-2">
              {person.needs.map((n, i) => (
                <li key={i} className="flex items-center space-x-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">
              Hobbies <span className="text-slate-500 normal-case">(From Instagram)</span>
            </h3>
            <ul className="space-y-2">
              {person.hobbies.map((h, i) => (
                <li key={i} className="flex items-center space-x-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {person.interests.map((interest, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Character Qualities</h3>
            <div className="flex flex-wrap gap-2">
              {person.other_qualities.map((q, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ideal Date */}
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-widest">Ideal First Date</h3>
          </div>
          <p className="text-sm text-slate-200">{person.ideal_date}</p>
        </div>

        {/* Dealbreakers */}
        {person.dealbreakers && person.dealbreakers.length > 0 && (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">Dealbreakers</h3>
            <ul className="space-y-1.5">
              {person.dealbreakers.map((d, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-center space-x-2">
                  <span className="text-red-400">✗</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Agent Rankings */}
        {rankings.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Top Agent Matches</h2>
              <span className="text-xs text-slate-400 ml-2">Ranked by {person.name.split(' ')[0]}'s agent</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rankings.map((entry, idx) => (
                <Link href={`/profile/${entry.candidate_id}`} key={entry.candidate_id}>
                  <div className="p-4 rounded-xl bg-[#14141c] border border-white/10 hover:border-amber-400/50 transition cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                        {idx + 1}
                      </div>
                      <img src={entry.candidate_image} alt={entry.candidate_name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{entry.candidate_name}</p>
                        <p className="text-xs text-slate-400 truncate">{entry.candidate_archetype}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 truncate flex-1 mr-2">{entry.shared_vibe}</span>
                      <span className="text-xs font-bold text-amber-400 whitespace-nowrap">{entry.match_score}/10</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        {entry.verdict}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back CTA */}
        <div className="text-center pt-4">
          <Link href="/rankings"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-black font-bold text-sm hover:opacity-95 transition">
            <Flame className="w-4 h-4" />
            <span>View Global Rankings Leaderboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
