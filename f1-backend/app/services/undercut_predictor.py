"""
Undercut/Overcut Predictor (USP #3).

Model, in plain terms:
  - Build a tyre degradation curve per compound from historical race-pace
    data at this circuit (lap_time vs tyre_life, fit with a simple
    quadratic — degradation is rarely linear, it accelerates near cliff).
  - A driver who pits now gets `out_lap_penalty` seconds slower out-lap,
    then rejoins on a fresh-tyre pace curve.
  - Simulate N future laps for both the attacker (if they pit now vs. in
    1/2/3 laps) and the defender (assumed to continue on current tyre
    curve), and find the lap at which the attacker's projected total time
    is lowest relative to the defender — i.e. the pit lap that maximizes
    the post-stop gap in the attacker's favor.

This is intentionally a transparent, explainable heuristic model (not a
black-box ML model) — it's the kind of thing a broadcast graphic shows,
and users should be able to see *why* a lap was recommended.
"""
from dataclasses import dataclass
from typing import List, Optional

import numpy as np
import pandas as pd


@dataclass
class DegradationModel:
    compound: str
    intercept_ms: float          # fitted lap time at tyre_life=0
    linear_coef: float           # ms lost per lap early in stint
    quadratic_coef: float        # ms lost per lap^2 (captures the "cliff")
    sample_size: int

    def predicted_lap_time_ms(self, tyre_life: int) -> float:
        return (
            self.intercept_ms
            + self.linear_coef * tyre_life
            + self.quadratic_coef * (tyre_life ** 2)
        )

    @property
    def confidence(self) -> str:
        if self.sample_size >= 30:
            return "high"
        if self.sample_size >= 10:
            return "medium"
        return "low"


def fit_degradation_model(historical_laps: pd.DataFrame, compound: str) -> Optional[DegradationModel]:
    """
    historical_laps: DataFrame with columns ['compound', 'tyre_life', 'lap_time_ms'],
    already filtered to green-flag laps at this circuit (exclude in/out laps,
    SC/VSC laps, and laps with track_status flags — that filtering happens
    upstream before this is called).
    """
    subset = historical_laps[historical_laps["compound"] == compound].dropna(subset=["lap_time_ms"])
    if len(subset) < 5:
        return None

    coeffs = np.polyfit(subset["tyre_life"], subset["lap_time_ms"], deg=2)
    quad, lin, intercept = coeffs

    return DegradationModel(
        compound=compound,
        intercept_ms=float(intercept),
        linear_coef=float(lin),
        quadratic_coef=float(quad),
        sample_size=len(subset),
    )


def predict_optimal_pit_lap(
    attacker_current_lap: int,
    gap_to_defender_seconds: float,
    attacker_model: DegradationModel,
    defender_model: DegradationModel,
    attacker_current_tyre_life: int,
    defender_current_tyre_life: int,
    pit_lane_loss_seconds: float = 22.0,   # circuit-specific; pass real value where known
    out_lap_penalty_seconds: float = 1.2,
    simulate_laps_ahead: int = 6,
) -> dict:
    """
    Tries pitting on each of the next `simulate_laps_ahead` laps and picks
    the one that leaves the attacker in front of (or closest behind) the
    defender once both have made their stops on a "normal" defensive
    response (defender pits one lap after attacker, a standard reactive
    undercut assumption).
    """
    best_lap = attacker_current_lap
    best_projected_gap = float("inf")

    for pit_offset in range(0, simulate_laps_ahead):
        pit_lap = attacker_current_lap + pit_offset
        gap = gap_to_defender_seconds

        # Laps before pitting: attacker stays on current (aging) tyre.
        for i in range(pit_offset):
            attacker_time = attacker_model.predicted_lap_time_ms(attacker_current_tyre_life + i) / 1000
            defender_time = defender_model.predicted_lap_time_ms(defender_current_tyre_life + i) / 1000
            gap += attacker_time - defender_time

        # Pit stop lap: pit lane loss + out-lap penalty, fresh tyres.
        gap += pit_lane_loss_seconds + out_lap_penalty_seconds
        # Defender reacts one lap later (standard reactive-undercut assumption).
        gap -= pit_lane_loss_seconds + out_lap_penalty_seconds if pit_offset == simulate_laps_ahead - 1 else 0

        # A few laps post-stop on fresh tyres to see how the gap evolves.
        for i in range(3):
            attacker_time = attacker_model.predicted_lap_time_ms(i) / 1000
            defender_time = defender_model.predicted_lap_time_ms(defender_current_tyre_life + pit_offset + i) / 1000
            gap += attacker_time - defender_time

        if gap < best_projected_gap:
            best_projected_gap = gap
            best_lap = pit_lap

    confidence = "high" if attacker_model.confidence == defender_model.confidence == "high" else "medium" \
        if "low" not in (attacker_model.confidence, defender_model.confidence) else "low"

    return {
        "optimal_pit_lap": best_lap,
        "projected_gap_after_pit_seconds": round(best_projected_gap, 2),
        "confidence": confidence,
        "tyre_degradation_model": {
            "attacker": attacker_model.__dict__,
            "defender": defender_model.__dict__,
        },
        "notes": (
            "Heuristic model: quadratic tyre-degradation fit per compound, "
            "reactive one-lap-later defender response assumed. Treat as a "
            "decision aid, not a guarantee — real strategy also depends on "
            "traffic, track position, and undercut/overcut history at this circuit."
        ),
    }
