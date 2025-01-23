"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useTexture, CameraControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useRef } from "react";

interface AttitudePanelProps {
  roll: number;
  pitch: number;
  yaw: number;
  rollSpeed?: number;
  pitchSpeed?: number;
  yawSpeed?: number;
}

const CANVAS_CONFIG = {
  CAMERA: {
    position: [0.5, 1.3, 1.5] as [number, number, number],
    fov: 75,
  },
  DIMENSIONS: {
    width: 250,
    height: 140,
  },
  LIGHTING: {
    ambient: 0.5,
    directional: {
      intensity: 1.5,
      position: [5, 10, 5],
    },
  },
} as const;

function Drone({ roll, pitch, yaw }: AttitudePanelProps) {
  const gltf = useLoader(GLTFLoader, "/images/map/drone/scene.gltf");

  // 텍스처 로드
  const baseColorMap = useTexture(
    "/images/map/drone/0.701961_0.701961_0.701961_0.000000_0.000000_baseColor.jpeg",
  );
  const metallicRoughnessMap = useTexture(
    "/images/map/drone/0.701961_0.701961_0.701961_0.000000_0.000000_metallicRoughness.png",
  );

  const droneRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (droneRef.current) {
      droneRef.current.rotation.x = pitch;
      droneRef.current.rotation.y = yaw;
      droneRef.current.rotation.z = roll;
    }
  });

  return (
    <group ref={droneRef} scale={[8, 8, 8]}>
      //크기
      <primitive object={gltf.scene} />
      <CameraControls />
      <meshStandardMaterial
        map={baseColorMap}
        roughnessMap={metallicRoughnessMap}
        roughness={1.0}
        metalness={0.5}
      />
    </group>
  );
}

export default function AttitudePanel({
  roll,
  pitch,
  yaw,
  rollSpeed,
  pitchSpeed,
  yawSpeed,
}: AttitudePanelProps) {
  return (
    <div className="flex h-full w-[280px] flex-col justify-between rounded-[30px] bg-white p-4">
      <div>
        <div>Roll: {roll.toFixed(2)}</div>
        <div>Pitch: {pitch.toFixed(2)}</div>
        <div>Yaw: {yaw.toFixed(2)}</div>
      </div>

      {/* 3D 모델 */}
      <div>
        <Canvas
          camera={CANVAS_CONFIG.CAMERA}
          style={{ ...CANVAS_CONFIG.DIMENSIONS }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
          }}
        >
          <color attach="background" args={["white"]} />
          <ambientLight
            intensity={CANVAS_CONFIG.LIGHTING.directional.intensity}
          />
          <directionalLight {...CANVAS_CONFIG.LIGHTING.directional} />
          <Drone roll={roll} pitch={pitch} yaw={yaw} />
        </Canvas>
      </div>

      {/* 속도 데이터 */}
      <div className="mt-4 flex w-full justify-between">
        {[
          { label: "Roll 속도", value: rollSpeed },
          { label: "Pitch 속도", value: pitchSpeed },
          { label: "Yaw 속도", value: yawSpeed },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div>{item.label}</div>
            <div>{(item.value ?? 0).toFixed(4)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
