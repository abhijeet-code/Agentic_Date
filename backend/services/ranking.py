from typing import List, Dict, Any

def compute_personalized_rankings(target_person: Dict[str, Any], candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ranks who fits the target person best based on agent evaluations.
    """
    ranked_results = []
    target_interests = set(target_person.get("interests", []))
    target_needs = set(target_person.get("needs", []))
    
    for candidate in candidates:
        if candidate.get("id") == target_person.get("id") or candidate.get("name") == target_person.get("name"):
            continue
            
        cand_interests = set(candidate.get("interests", []))
        common_interests = target_interests.intersection(cand_interests)
        
        # Calculate algorithmic affinity base score (between 7.0 and 9.8)
        base = 7.5 + (len(common_interests) * 0.4)
        score = min(round(base, 2), 9.7)
        
        reasons = []
        if common_interests:
            reasons.append(f"Shared passions in {', '.join(list(common_interests)[:2])}")
        else:
            reasons.append(f"Complementary energy: {target_person.get('archetype', 'Builder')} meets {candidate.get('archetype', 'Visionary')}")
            
        ranked_results.append({
            "candidate_id": candidate.get("id"),
            "candidate_name": candidate.get("name"),
            "candidate_archetype": candidate.get("archetype", "Creative"),
            "candidate_image": candidate.get("image_url", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"),
            "match_score": score,
            "shared_vibe": reasons[0] if reasons else "Mutual high-agency drive",
            "verdict": "Top Match 🏆" if score >= 9.0 else "High Potential ⚡"
        })
        
    ranked_results.sort(key=lambda x: x["match_score"], reverse=True)
    return ranked_results
