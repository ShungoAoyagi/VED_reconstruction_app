"""In-memory game session state management."""

import random
from datetime import datetime, timezone

import numpy as np

from models import Level, WaveFunctionProperty
from wave_functions import (
    get_raw_wavefunction,
    get_wavefunction_real_part,
    compute_electron_density,
    TOTAL_POINTS,
)

ORBITAL_SET_1 = [(1, 1), (2, 1), (2, -2)]
ORBITAL_SET_2_POOL = [(1, 1), (1, -1), (2, 1), (2, -1)]

LEVEL_CONFIG: dict[Level, dict] = {
    Level.EASY: {
        "limit_seconds": 150,
        "max_answer_num": 4,
        "possible_amplitudes": [1.0, 2.0, 4.0],
        "possible_phases": [0.0],
        "phase_fixed": True,
    },
    Level.NORMAL: {
        "limit_seconds": 180,
        "max_answer_num": 5,
        "possible_amplitudes": [1.0, 2.0, 4.0],
        "possible_phases": [0.0, 90.0, 180.0, 270.0],
        "phase_fixed": False,
    },
    Level.HARD: {
        "limit_seconds": 210,
        "max_answer_num": 5,
        "possible_amplitudes": [],
        "possible_phases": [],
        "phase_fixed": False,
    },
}


class GameSession:
    def __init__(self):
        self.level: Level | None = None
        self.start_time: str | None = None
        self.limit_seconds: int = 0
        self.max_answer_num: int = 0
        self.wave_function_properties: list[WaveFunctionProperty] = []
        self.target_density: np.ndarray = np.zeros(TOTAL_POINTS)
        self.target_amplitudes: list[float] = []
        self.target_phases: list[float] = []
        self.answer_count: int = 0
        self.highest_score: int = 0
        self.best_density: np.ndarray | None = None

    def start_game(self, level: Level) -> dict:
        self.level = level
        config = LEVEL_CONFIG[level]
        self.limit_seconds = config["limit_seconds"]
        self.max_answer_num = config["max_answer_num"]
        self.start_time = datetime.now(timezone.utc).isoformat()
        self.answer_count = 0
        self.highest_score = 0
        self.best_density = None

        # use_set_1 = random.random() < 0.5
        # if use_set_1:
        orbitals = list(ORBITAL_SET_1)
        # else:
        #     orbitals = random.sample(ORBITAL_SET_2_POOL, 3)

        target_amplitudes = [2.0]
        target_phases = [0.0]

        for i in range(1, 3):
            amp = random.choice(config["possible_amplitudes"]) if config["possible_amplitudes"] else round(random.uniform(1.0, 4.0), 1)
            target_amplitudes.append(amp)

            if level == Level.EASY:
                phase = 90.0 if orbitals[i] == (2, 1) else 0.0
            elif level == Level.NORMAL:
                phase = random.choice(config["possible_phases"])
            elif level == Level.HARD:
                phase = random.random() * 360.0
            else:
                raise ValueError(f"Invalid level: {level}")
            target_phases.append(phase)

        self.target_amplitudes = target_amplitudes
        self.target_phases = target_phases

        wave_func_list = []
        self.wave_function_properties = []

        for i, (ell, m) in enumerate(orbitals):
            psi = get_raw_wavefunction(ell, m)
            wave_func_list.append((psi, target_amplitudes[i], target_phases[i]))

            wf_prop = WaveFunctionProperty(
                ell=ell,
                m=m,
                phase=target_phases[i] if i == 0 else 0.0,
                possible_phase_list=(
                    [90.0] if (i != 0 and level == Level.EASY and orbitals[i] == (2, 1))
                    else config["possible_phases"] if i != 0
                    else []
                ),
                amplitude=target_amplitudes[i] if i == 0 else config["possible_amplitudes"][0] if config["possible_amplitudes"] else 1.0,
                amplitude_min=1,
                amplitude_max=4,
                possible_amplitude_list=config["possible_amplitudes"] if i != 0 else [],
                wave_function=get_wavefunction_real_part(ell, m).tolist(),
            )
            self.wave_function_properties.append(wf_prop)

        self.target_density = compute_electron_density(wave_func_list)

        return {
            "start_time": self.start_time,
            "limit_seconds": self.limit_seconds,
            "max_answer_num": self.max_answer_num,
            "wave_function_property_list": self.wave_function_properties,
            "target_electron_density": self.target_density.tolist(),
        }

    def check_correct(self, amplitudes: list[float], phases: list[float]) -> bool:
        """Check if the answer matches (for easy/normal modes).
        Tolerant comparison: amplitude within 0.5, phase within 5 degrees."""
        if self.level == Level.HARD:
            return False

        for i in range(len(self.target_amplitudes)):
            if abs(amplitudes[i] - self.target_amplitudes[i]) > 0.5:
                return False
            if abs(phases[i] - self.target_phases[i]) > 5.0:
                return False

        return True


_current_session = GameSession()


def get_session() -> GameSession:
    return _current_session
