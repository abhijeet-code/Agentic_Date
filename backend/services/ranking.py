from typing import List, Dict, Any

def compute_rankings_from_ratings(target_id: str, all_ratings: List[Dict[str, Any]], all_people: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Builds a ranked list of matches for a person using stored agent ratings.
    Falls back to affinity algorithm if no ratings exist.
    """
    # Try using stored agent ratings first
    received_ratings = [r for r in all_ratings if r.get("ratee_id") == target_id]

    if received_ratings:
        people_map = {p["id"]: p for p in all_people}
        results = []
        for rating in received_ratings:
            rater_id = rating.get("rater_id")
            rater = people_map.get(rater_id)
            if not rater:
                continue
            results.append({
                "candidate_id": rater_id,
                "candidate_name": rater.get("name", "Unknown"),
                "candidate_archetype": rater.get("archetype", ""),
                "candidate_image": rater.get("image_url", ""),
                "match_score": round(rating.get("score_overall", 7.5), 2),
                "shared_vibe": rating.get("analysis", "Strong potential compatibility"),
                "verdict": "Top Match 🏆" if rating.get("score_overall", 0) >= 8.5 else "High Potential ⚡"
            })
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results

    # Algorithmic fallback using interest intersection
    target = next((p for p in all_people if p["id"] == target_id), None)
    if not target:
        return []

    target_interests = set(target.get("interests", []))
    results = []

    for candidate in all_people:
        if candidate.get("id") == target_id:
            continue
        cand_interests = set(candidate.get("interests", []))
        common = target_interests.intersection(cand_interests)
        score = min(round(7.5 + len(common) * 0.4, 2), 9.7)

        vibe = (
            f"Shared passions: {', '.join(list(common)[:2])}"
            if common else
            f"Complementary energy: {target.get('archetype', 'Builder')} × {candidate.get('archetype', 'Creative')}"
        )
        results.append({
            "candidate_id": candidate.get("id"),
            "candidate_name": candidate.get("name"),
            "candidate_archetype": candidate.get("archetype", ""),
            "candidate_image": candidate.get("image_url", ""),
            "match_score": score,
            "shared_vibe": vibe,
            "verdict": "Top Match 🏆" if score >= 9.0 else "High Potential ⚡"
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results
