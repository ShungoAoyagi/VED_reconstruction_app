"""Score calculation logic."""

import math
from models import Level


LEVEL_D: dict[Level, float] = {
    Level.EASY: 1.0,
    Level.NORMAL: 10.0,
    Level.HARD: 1000.0,
}

LEVEL_BIG_D: dict[Level, float] = {
    Level.EASY: 1.0,
    Level.NORMAL: 10.0,
    Level.HARD: 1000.0,
}


def compute_score(inner_product: float, remaining_seconds: float, level: Level) -> int:
    """
    Compute game score.
    score = ceil(d / (1.01 - P) * sqrt(t + D))

    where P = inner product, t = remaining seconds,
    d and D are level-dependent constants.
    """
    d = LEVEL_D[level]
    big_d = LEVEL_BIG_D[level]

    denominator = 1.01 - inner_product
    if denominator <= 0:
        denominator = 0.0001

    raw_score = d / denominator * math.sqrt(remaining_seconds + big_d)
    return math.ceil(raw_score)
