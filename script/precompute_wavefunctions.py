"""
Precompute hydrogen atom wavefunctions (p and d orbitals) on a 21x21x21 grid.

Orbitals needed (from AGENT.md):
  Set 1: p{m=1}, d{m=1}, d{m=-2}
  Set 2: p{m=1}, p{m=-1}, d{m=1}, d{m=-1}

Unique orbitals: (ell=1, m=1), (ell=1, m=-1), (ell=2, m=1), (ell=2, m=-1), (ell=2, m=-2)

For p orbitals we use n=2 (the lowest n that supports ell=1).
For d orbitals we use n=3 (the lowest n that supports ell=2).

Grid: 21x21x21, origin at [10,10,10], flattened in x,y,z order
(i.e. [0,0,0], [0,0,1], ..., [0,1,0], ..., [1,0,0], ...).

Output: JSON file containing a dict keyed by "ell_m" with "real" and "imag"
arrays, each a flat list of 9261 floats.
"""

import json
import os

import numpy as np
from scipy.special import factorial, sph_harm_y

GRID_SIZE = 21
CENTER = 10
BOHR_RADIUS = 1.0


def radial_wavefunction(n: int, ell: int, r: np.ndarray) -> np.ndarray:
    """Compute the radial part R_{n,l}(r) of the hydrogen atom wavefunction."""
    from scipy.special import assoc_laguerre

    rho = 2.0 * r / (n * BOHR_RADIUS)
    normalization = np.sqrt(
        (2.0 / (n * BOHR_RADIUS)) ** 3
        * factorial(n - ell - 1, exact=True)
        / (2.0 * n * factorial(n + ell, exact=True))
    )
    return (
        normalization
        * np.exp(-rho / 2.0)
        * rho**ell
        * assoc_laguerre(rho, n - ell - 1, 2 * ell + 1)
    )


def hydrogen_wavefunction(
    n: int, ell: int, m: int, x: np.ndarray, y: np.ndarray, z: np.ndarray
) -> np.ndarray:
    """Compute the complex hydrogen wavefunction psi_{n,l,m}(x,y,z)."""
    r = np.sqrt(x**2 + y**2 + z**2)
    r = np.maximum(r, 1e-10)
    theta = np.arccos(np.clip(z / r, -1, 1))
    phi = np.arctan2(y, x)

    R = radial_wavefunction(n, ell, r)
    Y = sph_harm_y(ell, m, theta, phi)

    return R * Y



def main():
    coords_1d = np.arange(GRID_SIZE, dtype=float) - CENTER

    x, y, z = np.meshgrid(coords_1d, coords_1d, coords_1d, indexing="ij")
    x_flat = x.ravel()
    y_flat = y.ravel()
    z_flat = z.ravel()

    orbitals = [
        (1, 1),
        (1, -1),
        (2, 1),
        (2, -1),
        (2, -2),
    ]

    result = {}
    for ell, m in orbitals:
        n = ell + 1
        psi = hydrogen_wavefunction(n, ell, m, x_flat, y_flat, z_flat)
        result[f"{ell}_{m}"] = {
            "real": psi.real.tolist(),
            "imag": psi.imag.tolist(),
        }
        print(
            f"Computed ell={ell}, m={m} (n={n}): "
            f"max|psi|={np.max(np.abs(psi)):.6f}, "
            f"max|Re|={np.max(np.abs(psi.real)):.6f}, "
            f"max|Im|={np.max(np.abs(psi.imag)):.6f}"
        )

    output_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "wavefunctions.json")

    with open(output_path, "w") as f:
        json.dump(result, f)

    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Saved to {output_path} ({file_size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
