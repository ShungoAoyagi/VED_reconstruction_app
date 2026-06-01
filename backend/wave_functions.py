"""Wave function loading and computation utilities."""

import json
import sys
from pathlib import Path

import numpy as np

GRID_SIZE = 21
GRID_CENTER = 10
TOTAL_POINTS = GRID_SIZE ** 3

# PyInstaller onefile bundles extract to sys._MEIPASS; otherwise use project root
if getattr(sys, 'frozen', False):
    DATA_DIR = Path(sys._MEIPASS) / "data"  # type: ignore[attr-defined]
else:
    DATA_DIR = Path(__file__).parent.parent / "data"

WAVEFUNCTION_FILE = DATA_DIR / "wavefunctions.json"

_wavefunction_cache: dict[str, np.ndarray] = {}


def load_wavefunctions() -> dict[str, np.ndarray]:
    """Load precomputed complex wavefunctions from JSON file."""
    global _wavefunction_cache
    if _wavefunction_cache:
        return _wavefunction_cache

    with open(WAVEFUNCTION_FILE) as f:
        data = json.load(f)

    for key, entry in data.items():
        if isinstance(entry, dict) and "real" in entry and "imag" in entry:
            real = np.array(entry["real"], dtype=np.float64)
            imag = np.array(entry["imag"], dtype=np.float64)
            _wavefunction_cache[key] = real + 1j * imag
        else:
            _wavefunction_cache[key] = np.array(entry, dtype=np.complex128)

    return _wavefunction_cache


def get_raw_wavefunction(ell: int, m: int) -> np.ndarray:
    """Get the raw (precomputed) complex wavefunction for given ell, m."""
    cache = load_wavefunctions()
    key = f"{ell}_{m}"
    if key not in cache:
        raise ValueError(f"Wavefunction for ell={ell}, m={m} not found")
    return cache[key]


def get_wavefunction_real_part(ell: int, m: int) -> np.ndarray:
    """Get the display wavefunction for the frontend.

    For l=2, m=-2: return the imaginary part (proportional to xy/r^2 = d_xy shape).
    For all others: return the real part.
    """
    psi = get_raw_wavefunction(ell, m)
    if ell == 2 and m == -2:
        return psi.imag
    return psi.real


def apply_coefficients(
    psi: np.ndarray, amplitude: float, phase_degrees: float
) -> np.ndarray:
    """
    Apply amplitude and phase to a complex wavefunction.
    result = amplitude * exp(i * phase) * psi
    """
    phase_rad = np.radians(phase_degrees)
    return amplitude * np.exp(1j * phase_rad) * psi


def compute_electron_density(wave_func_list: list[tuple[np.ndarray, float, float]]) -> np.ndarray:
    """
    Compute electron density from a list of (wavefunction, amplitude, phase) tuples.
    density = |sum(c_i * exp(i*phi_i) * psi_i)|^2
    """
    combined = np.zeros(TOTAL_POINTS, dtype=np.complex128)
    for psi, amplitude, phase_degrees in wave_func_list:
        combined += apply_coefficients(psi, amplitude, phase_degrees)

    return np.power(np.abs(combined), 2)


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
