"""Wave function loading and computation utilities."""

import json
import os
from pathlib import Path

import numpy as np

GRID_SIZE = 21
GRID_CENTER = 10
TOTAL_POINTS = GRID_SIZE ** 3

DATA_DIR = Path(__file__).parent.parent / "data"
WAVEFUNCTION_FILE = DATA_DIR / "wavefunctions.json"

_wavefunction_cache: dict[str, np.ndarray] = {}


def load_wavefunctions() -> dict[str, np.ndarray]:
    """Load precomputed wavefunctions from JSON file."""
    global _wavefunction_cache
    if _wavefunction_cache:
        return _wavefunction_cache

    with open(WAVEFUNCTION_FILE) as f:
        data = json.load(f)

    for key, values in data.items():
        _wavefunction_cache[key] = np.array(values, dtype=np.float64)

    return _wavefunction_cache


def get_raw_wavefunction(ell: int, m: int) -> np.ndarray:
    """Get the raw (precomputed) wavefunction for given ell, m."""
    cache = load_wavefunctions()
    key = f"{ell}_{m}"
    if key not in cache:
        raise ValueError(f"Wavefunction for ell={ell}, m={m} not found")
    return cache[key]


def apply_coefficients(
    psi: np.ndarray, amplitude: float, phase_degrees: float
) -> np.ndarray:
    """
    Apply amplitude and phase to a wavefunction, return the real part.
    psi_out = Re(amplitude * exp(i*phase) * psi_complex)

    Since the stored wavefunctions are already the real part of complex
    wavefunctions, and the complex wavefunction is psi = R(r) * Y_l^m(theta, phi),
    the full complex value would be needed. For simplicity in this game context,
    we treat the stored data as the real part and apply:
    result = amplitude * cos(phase) * psi_real
    """
    phase_rad = np.radians(phase_degrees)
    return amplitude * np.cos(phase_rad) * psi


def compute_electron_density(wave_func_list: list[tuple[np.ndarray, float, float]]) -> np.ndarray:
    """
    Compute electron density from a list of (wavefunction, amplitude, phase) tuples.
    density = |sum(c_i * exp(i*phi_i) * psi_i)|^2
    """
    combined = np.zeros(TOTAL_POINTS, dtype=np.float64)
    for psi, amplitude, phase_degrees in wave_func_list:
        combined += apply_coefficients(psi, amplitude, phase_degrees)

    return combined ** 2


def normalize_density(density: np.ndarray) -> np.ndarray:
    """Normalize a density distribution."""
    norm = np.sqrt(np.sum(density ** 2))
    if norm < 1e-15:
        return density
    return density / norm


def compute_inner_product(d1: np.ndarray, d2: np.ndarray) -> float:
    """Compute the inner product of two normalized density distributions."""
    n1 = normalize_density(d1)
    n2 = normalize_density(d2)
    return float(np.sum(n1 * n2))
