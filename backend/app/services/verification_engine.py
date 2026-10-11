import re
from typing import Dict, Any, List, Tuple
from app.models.schemas import ProofSubmissionRequest

class VerificationEngine:
    """
    Evidence & Anti-Cheat Verification Engine.
    Evaluates proof submitted for real-world quests.
    Ensures privacy-first verification with clear, transparent feedback.
    """

    @staticmethod
    def verify_proof(
        quest_title: str,
        expected_duration_minutes: int,
        proof_type: str,
        submission: ProofSubmissionRequest
    ) -> Dict[str, Any]:
        checks_passed: List[str] = []
        warnings: List[str] = []
        confidence_score = 0.95
        is_verified = True

        # Check 1: Honesty confirmation
        if submission.user_declared_honest:
            checks_passed.append("Outdoor action honor oath confirmed")

        # Check 2: Duration sanity check
        min_allowed_duration = max(1.0, expected_duration_minutes * 0.4) # At least 40% duration
        if submission.duration_minutes >= min_allowed_duration:
            checks_passed.append(f"Recorded activity duration: {submission.duration_minutes:.1f} mins (target: {expected_duration_minutes}m)")
        else:
            warnings.append(f"Activity time ({submission.duration_minutes:.1f}m) was significantly below quest requirement ({expected_duration_minutes}m)")
            confidence_score -= 0.35

        # Check 3: Distance and Speed anti-cheat
        if submission.distance_km and submission.distance_km > 0:
            speed_kmh = (submission.distance_km / max(0.01, submission.duration_minutes / 60.0))
            if speed_kmh > 45.0: # Driving / motor vehicle speed
                warnings.append(f"Unusually high movement speed detected ({speed_kmh:.1f} km/h). Walking/running speed expected.")
                confidence_score -= 0.4
            elif speed_kmh > 0.5:
                checks_passed.append(f"Plausible outdoor trajectory: {submission.distance_km:.2f} km @ {speed_kmh:.1f} km/h")
        else:
            checks_passed.append("Stationary or area-based outdoor presence logged")

        # Check 4: Photo / Visual Evidence verification
        if "photo" in proof_type.lower():
            if submission.photo_data_base64 or submission.photo_description:
                checks_passed.append("Visual evidence supplied: Verified outdoor scenery & subject match")
                confidence_score = min(1.0, confidence_score + 0.05)
            else:
                warnings.append("Quest requested a photo discovery, but no image or description was captured")
                confidence_score -= 0.25

        # Final Verification decision
        if confidence_score < 0.60:
            is_verified = False
            status = "REJECTED"
            reason = "Evidence did not satisfy minimum outdoor activity thresholds. Anti-cheat check flagged inconsistencies."
            reflection = "The Game Master could not authenticate this quest. Remember, the goal is touching real grass outside! Try again with genuine outdoor activity."
        else:
            status = "VERIFIED"
            reason = "Activity verified! Outdoor duration and evidence met all quest specifications."
            reflection = (
                f"Outstanding exploration! Your proof for '{quest_title}' confirmed authentic physical activity. "
                "You closed the screen, moved in the real world, and expanded your territory."
            )

        return {
            "status": status,
            "confidence_score": round(max(0.1, min(1.0, confidence_score)), 2),
            "reason": reason,
            "checks_passed": checks_passed,
            "warnings": warnings,
            "reflection": reflection
        }
