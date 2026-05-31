import { GRID_SIZE, GRID_CENTER } from '../constants'

/** グリッド境界ボクセルの絶対値最大値（VolumeViewerデフォルト閾値と同じ計算） */
export const computeBoundaryMax = (data: number[]): number => {
  const size = GRID_SIZE
  let max = 0
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        if (x === 0 || x === size - 1 || y === 0 || y === size - 1 || z === 0 || z === size - 1) {
          const abs = Math.abs(data[x * size * size + y * size + z])
          if (abs > max) max = abs
        }
      }
    }
  }
  return max
}

/** z 軸周りに phaseRad だけ回転（バイリニア補間） */
export const rotateWaveFunctionZ = (data: number[], phaseRad: number): number[] => {
  if (phaseRad === 0) return data
  const size = GRID_SIZE
  const center = GRID_CENTER
  const cosA = Math.cos(phaseRad)
  const sinA = Math.sin(phaseRad)
  const result = new Array<number>(data.length).fill(0)

  for (let ix = 0; ix < size; ix++) {
    for (let iy = 0; iy < size; iy++) {
      for (let iz = 0; iz < size; iz++) {
        const x = ix - center
        const y = iy - center
        const sx = x * cosA + y * sinA + center
        const sy = -x * sinA + y * cosA + center

        const x0 = Math.floor(sx)
        const y0 = Math.floor(sy)
        const x1 = x0 + 1
        const y1 = y0 + 1
        const tx = sx - x0
        const ty = sy - y0

        const outIdx = ix * size * size + iy * size + iz
        if (x0 < 0 || x1 >= size || y0 < 0 || y1 >= size) continue

        const v00 = data[x0 * size * size + y0 * size + iz]
        const v10 = data[x1 * size * size + y0 * size + iz]
        const v01 = data[x0 * size * size + y1 * size + iz]
        const v11 = data[x1 * size * size + y1 * size + iz]

        result[outIdx] =
          v00 * (1 - tx) * (1 - ty) +
          v10 * tx * (1 - ty) +
          v01 * (1 - tx) * ty +
          v11 * tx * ty
      }
    }
  }

  return result
}

/**
 * m < 0 の実球面調和関数はサーバーが cos 型（m > 0 と同形）で送ってくるため、
 * sin 型（dxy など）に変換するために π / (2|m|) だけ z 軸回転を補正する。
 *   m = -1 → 90° 回転（px → py）
 *   m = -2 → 45° 回転（dx²-y² → dxy）
 */
export const correctOrbitalOrientation = (data: number[], m: number): number[] => {
  if (m >= 0 || data.length === 0) return data
  const correctionAngle = Math.PI / (2 * Math.abs(m))
  return rotateWaveFunctionZ(data, correctionAngle)
}

/**
 * z 軸回転（ユーザー操作の位相）と amplitude スケールを適用する。
 * scale = (amplitude / ampMax)^(1/3):
 *   amplitude=ampMax → scale=1.0 → 固定閾値でちょうど収まるサイズ
 *   amplitude 小     → scale<1  → 縮小表示（消えない）
 */
export const transformWaveFunction = (
  data: number[],
  amplitude: number,
  ampMax: number,
  phaseRad: number
): number[] => {
  const scale = Math.pow(Math.max(amplitude, 0) / Math.max(ampMax, 1e-6), 1 / 3)
  const size = GRID_SIZE
  const center = GRID_CENTER
  const cosA = Math.cos(phaseRad)
  const sinA = Math.sin(phaseRad)
  const result = new Array<number>(data.length).fill(0)

  for (let ix = 0; ix < size; ix++) {
    for (let iy = 0; iy < size; iy++) {
      for (let iz = 0; iz < size; iz++) {
        const x = ix - center
        const y = iy - center
        const sx = x * cosA + y * sinA + center
        const sy = -x * sinA + y * cosA + center

        const x0 = Math.floor(sx)
        const y0 = Math.floor(sy)
        const x1 = x0 + 1
        const y1 = y0 + 1
        const tx = sx - x0
        const ty = sy - y0

        const outIdx = ix * size * size + iy * size + iz
        if (x0 < 0 || x1 >= size || y0 < 0 || y1 >= size) continue

        const v00 = data[x0 * size * size + y0 * size + iz]
        const v10 = data[x1 * size * size + y0 * size + iz]
        const v01 = data[x0 * size * size + y1 * size + iz]
        const v11 = data[x1 * size * size + y1 * size + iz]

        result[outIdx] =
          (v00 * (1 - tx) * (1 - ty) + v10 * tx * (1 - ty) + v01 * (1 - tx) * ty + v11 * tx * ty) *
          scale
      }
    }
  }

  return result
}
