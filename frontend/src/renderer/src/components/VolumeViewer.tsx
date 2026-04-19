import { useRef, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GRID_SIZE, GRID_CENTER } from "../constants";
import { marchingCubes } from "../utils/marchingCubes";

type CameraState = {
  azimuth: number;
  polar: number;
  distance: number;
};

type VolumeViewerProps = {
  data: number[];
  threshold?: number;
  color?: string;
  opacity?: number;
  cameraState?: CameraState;
  onCameraChange?: (state: CameraState) => void;
  width?: number;
  height?: number;
  showNegative?: boolean;
  negativeColor?: string;
};

const IsosurfaceMesh = ({
  data,
  threshold,
  color,
  opacity,
  showNegative,
  negativeColor,
}: {
  data: number[];
  threshold: number;
  color: string;
  opacity: number;
  showNegative: boolean;
  negativeColor: string;
}) => {
  const positiveGeometry = useMemo(() => {
    const { vertices, normals } = marchingCubes(
      data,
      GRID_SIZE,
      threshold,
      GRID_CENTER,
    );
    if (vertices.length === 0) return null;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geo.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normals, 3),
    );
    return geo;
  }, [data, threshold]);

  const negativeGeometry = useMemo(() => {
    if (!showNegative) return null;
    const { vertices, normals } = marchingCubes(
      data,
      GRID_SIZE,
      -threshold,
      GRID_CENTER,
      true,
    );
    if (vertices.length === 0) return null;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geo.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normals, 3),
    );
    return geo;
  }, [data, threshold, showNegative]);

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
  );
};

const CameraSync = ({
  cameraState,
  onCameraChange,
}: {
  cameraState?: CameraState;
  onCameraChange?: (state: CameraState) => void;
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!cameraState || !controlsRef.current) return;
    const controls = controlsRef.current;
    const { azimuth, polar, distance } = cameraState;

    const x = distance * Math.sin(polar) * Math.cos(azimuth);
    const y = distance * Math.cos(polar);
    const z = distance * Math.sin(polar) * Math.sin(azimuth);

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    controls.update();
  }, [cameraState, camera]);

  const handleChange = () => {
    if (!onCameraChange) return;
    const pos = camera.position;
    const distance = pos.length();
    const polar = Math.acos(pos.y / distance);
    const azimuth = Math.atan2(pos.z, pos.x);
    onCameraChange({ azimuth, polar, distance });
  };

  return (
    <OrbitControls
      ref={controlsRef}
      onChange={handleChange}
      enablePan={false}
    />
  );
};

const DEFAULT_THRESHOLD = 0.005;

export const VolumeViewer = ({
  data,
  threshold = DEFAULT_THRESHOLD,
  color = "#3B82F6",
  opacity = 0.7,
  cameraState,
  onCameraChange,
  width = 400,
  height = 400,
  showNegative = false,
  negativeColor = "#EF4444",
}: VolumeViewerProps) => {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [15, 15, 15], fov: 50 }}
        style={{ background: "#f0f0f0", borderRadius: "0.75rem" }}
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
        <CameraSync
          cameraState={cameraState}
          onCameraChange={onCameraChange}
        />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
};
