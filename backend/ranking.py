"""Ranking persistence using TSV files (one per level)."""

import os
from pathlib import Path

from models import Level, RankingUser

RANKING_DIR = Path(__file__).parent / "ranking_data"
MAX_RANKING_SIZE = 10
DISPLAY_SIZE = 5


def _ranking_file_path(level: Level) -> Path:
    return RANKING_DIR / f"ranking_{level.value}.tsv"


def _ensure_dir():
    RANKING_DIR.mkdir(parents=True, exist_ok=True)


def load_ranking(level: Level) -> list[RankingUser]:
    """Load ranking from TSV file. Returns sorted list by score descending."""
    _ensure_dir()
    path = _ranking_file_path(level)

    if not path.exists():
        return []

    try:
        users: list[RankingUser] = []
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                parts = line.split("\t")
                if len(parts) != 2:
                    raise ValueError("Corrupted ranking file")
                username, score_str = parts
                users.append(
                    RankingUser(rank=0, username=username, score=int(score_str))
                )

        users.sort(key=lambda u: u.score, reverse=True)
        for i, user in enumerate(users):
            user.rank = i + 1

        return users[:MAX_RANKING_SIZE]

    except (ValueError, OSError):
        path.unlink(missing_ok=True)
        return []


def save_ranking(level: Level, users: list[RankingUser]):
    """Save ranking to TSV file."""
    _ensure_dir()
    path = _ranking_file_path(level)

    with open(path, "w", encoding="utf-8") as f:
        for user in users[:MAX_RANKING_SIZE]:
            f.write(f"{user.username}\t{user.score}\n")


def is_in_ranking(level: Level, score: int) -> bool:
    """Check if a score qualifies for the ranking."""
    ranking = load_ranking(level)
    if len(ranking) < DISPLAY_SIZE:
        return True
    return score > ranking[DISPLAY_SIZE - 1].score


def add_to_ranking(level: Level, username: str, score: int) -> list[RankingUser]:
    """Add a user to the ranking and return the updated ranking list."""
    ranking = load_ranking(level)

    new_user = RankingUser(rank=0, username=username, score=score)
    ranking.append(new_user)

    ranking.sort(key=lambda u: u.score, reverse=True)
    ranking = ranking[:MAX_RANKING_SIZE]

    for i, user in enumerate(ranking):
        user.rank = i + 1

    save_ranking(level, ranking)
    return ranking
