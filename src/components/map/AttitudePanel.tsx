"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
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
        <div>Roll: {roll.toFixed(2)} rad</div>
        <div>Pitch: {pitch.toFixed(2)} rad</div>
        <div>Yaw: {yaw.toFixed(2)} rad</div>
      </div>

      {/* 3D 모델 */}
      <div>
        <Canvas
          camera={{ position: [0.5, 1.3, 1.5], fov: 75 }}
          style={{ width: "250px", height: "140px" }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
          }}
        >
          <color attach="background" args={["white"]} />
          <ambientLight intensity={1.0} />
          <directionalLight intensity={2.0} position={[5, 10, 5]} />
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
            <div>{(item.value ?? 0).toFixed(4)} rad/s</div>
          </div>
        ))}
      </div>
    </div>
  );
}
