import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { GRID_SIZE, GRID_CENTER } from '../constants'
import { marchingCubes } from '../utils/marchingCubes'

type CameraState = {
  azimuth: number
  polar: number
  distance: number
}

type VolumeViewerProps = {
  data: number[]
  threshold?: number
  color?: string
  opacity?: number
  cameraState?: CameraState
  onCameraChange?: (state: CameraState) => void
  width?: number
  height?: number
  showNegative?: boolean
  negativeColor?: string
  backgroundColor?: string
}

const IsosurfaceMesh = ({
  data,
  threshold,
  color,
  opacity,
  showNegative,
  negativeColor
}: {
  data: number[]
  threshold: number
  color: string
  opacity: number
  showNegative: boolean
  negativeColor: string
}): React.ReactNode => {
  const positiveGeometry = useMemo(() => {
    const { vertices, normals } = marchingCubes(data, GRID_SIZE, threshold, GRID_CENTER)
    if (vertices.length === 0) return null

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    return geo
  }, [data, threshold])

  const negativeGeometry = useMemo(() => {
    if (!showNegative) return null
    const { vertices, normals } = marchingCubes(data, GRID_SIZE, -threshold, GRID_CENTER, true)
    if (vertices.length === 0) return null

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    return geo
  }, [data, threshold, showNegative])

  return (
    <>
      {positiveGeometry && (
        <mesh geometry={positiveGeometry}>
          <meshPhongMaterial
            color={color}
            opacity={opacity}
            transparent={opacity < 1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {negativeGeometry && (
        <mesh geometry={negativeGeometry}>
          <meshPhongMaterial
            color={negativeColor}
            opacity={opacity}
            transparent={opacity < 1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  )
}

const CameraSync = ({
  cameraState,
  onCameraChange
}: {
  cameraState?: CameraState
  onCameraChange?: (state: CameraState) => void
}) => {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (!cameraState || !controlsRef.current) return
    const controls = controlsRef.current
    const { azimuth, polar, distance } = cameraState

    // z-up 球面座標: polar は z 軸からの角度
    const x = distance * Math.sin(polar) * Math.cos(azimuth)
    const y = distance * Math.sin(polar) * Math.sin(azimuth)
    const z = distance * Math.cos(polar)

    camera.up.set(0, 0, 1)
    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
    controls.update()
  }, [cameraState, camera])

  const handleChange = (): void => {
    if (!onCameraChange) return
    const pos = camera.position
    const distance = pos.length()
    const polar = Math.acos(Math.max(-1, Math.min(1, pos.z / distance)))
    const azimuth = Math.atan2(pos.y, pos.x)
    onCameraChange({ azimuth, polar, distance })
  }

  return <OrbitControls ref={controlsRef} onChange={handleChange} enablePan={false} />
}

function computeBoundaryMaxAbsolute(data: number[], gridSize: number): number {
  let max = -Infinity
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        if (
          x === 0 ||
          x === gridSize - 1 ||
          y === 0 ||
          y === gridSize - 1 ||
          z === 0 ||
          z === gridSize - 1
        ) {
          const idx = x * gridSize * gridSize + y * gridSize + z
          const absVal = Math.abs(data[idx])
          if (absVal > max) max = absVal
        }
      }
    }
  }
  return max
}

export const VolumeViewer = ({
  data,
  threshold: thresholdProp,
  color = '#3B82F6',
  opacity = 0.95,
  cameraState,
  onCameraChange,
  width = 400,
  height = 400,
  showNegative = false,
  negativeColor = '#EF4444',
  backgroundColor = '#f0f0f0'
}: VolumeViewerProps) => {
  const threshold = useMemo(
    () => thresholdProp ?? computeBoundaryMaxAbsolute(data, GRID_SIZE),
    [thresholdProp, data]
  )

  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [15, 15, 15], fov: 50 }}
        style={{ background: backgroundColor, borderRadius: '0.75rem' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[-10, -5, -10]} intensity={0.3} />
        <IsosurfaceMesh
          data={data}
          threshold={threshold}
          color={color}
          opacity={opacity}
          showNegative={showNegative}
          negativeColor={negativeColor}
        />
        <CameraSync cameraState={cameraState} onCameraChange={onCameraChange} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  )
}
