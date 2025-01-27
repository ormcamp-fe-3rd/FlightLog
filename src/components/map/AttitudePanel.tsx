"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as THREE from "three";
import { AxesHelper, TextureLoader } from "three";
import { useEffect, useRef } from "react";
import { useAttitudeData } from "@/hooks/useAttitudeData";
import { CameraControls, Html, PerspectiveCamera } from "@react-three/drei";

interface AttitudePanelProps {
  progress: number;
  allTimestamps: number[];
  operationTimestamps: Record<string, number[]>;
  selectedOperationId: string[];
  selectedFlight: string;
}

const CANVAS_CONFIG = {
  DIMENSIONS: {
    width: 250,
    height: 140,
  },
  LIGHTING: {
    ambient: 1,
    directional: {
      intensity: 1.5,
      position: [5, 10, 5],
    },
  },
} as const;

export default function AttitudePanel({
  progress,
  allTimestamps,
  operationTimestamps,
  selectedOperationId,
  selectedFlight,
}: AttitudePanelProps) {
  const currentData = useAttitudeData({
    progress,
    allTimestamps,
    operationTimestamps,
    selectedOperationId,
  });

  const filteredData = currentData.filter(
    (data: { flightId: string }) => data.flightId === selectedFlight,
  );
  const AttitudeData = filteredData.length > 0 ? filteredData[0].status : null;

  function Drone({
    roll,
    pitch,
    yaw,
    heading,
  }: {
    roll?: number;
    pitch?: number;
    yaw?: number;
    heading?: number;
  }) {
    const fbx = useLoader(FBXLoader, "/images/map/drone/drone2.fbx");
    const texture = useLoader(
      TextureLoader,
      "/images/map/drone/FINAL_TEXTURE.png",
    );

    const droneRef = useRef<THREE.Group>(null);
    const arrowRef = useRef<THREE.ArrowHelper | null>(null);

    useEffect(() => {
      fbx.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            map: texture, // 텍스처 적용
            metalness: 0.5, // 금속성 조정
            roughness: 0.5, // 거칠기 조정
          });
        }
      });
      // 화살표 생성
      const direction = new THREE.Vector3(0, 0, 1); // Z축 초기 방향
      const arrow = new THREE.ArrowHelper(
        direction,
        new THREE.Vector3(0, 40, 20), // 화살표 위치를 드론의 머리 쪽으로 이동
        30, // 화살표 길이
        0xff0000, // 화살표 색상 (빨간색)
        15, // 화살표 머리 크기
        10, // 화살표 꼬리 크기
      );
      arrowRef.current = arrow;

      if (droneRef.current) {
        droneRef.current.add(arrow); // 드론에 화살표 추가
        droneRef.current.rotation.y = Math.PI / 2;
      }
    }, [fbx, texture]);

    // degree -> rad 변환 함수
    const degToRad = (deg: number) => (deg * Math.PI) / 180;

    useFrame(() => {
      if (droneRef.current) {
        droneRef.current.rotation.x = degToRad(pitch ?? 0);
        droneRef.current.rotation.y = degToRad(-(heading ?? 0));
        droneRef.current.rotation.z = degToRad(roll ?? 0);
      }
    });

    return (
      <group ref={droneRef} scale={[-0.05, 0.05, 0.05]}>
        {" "}
        //드론 크기 //크기
        <primitive object={fbx} />
      </group>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[30px] bg-white p-4">
      {/* 자세 데이터 */}
      <div>
        <div>Roll: {AttitudeData?.roll}</div>
        <div>Pitch: {AttitudeData?.pitch}</div>
        <div>Yaw: {AttitudeData?.yaw}</div>
      </div>

      {/* 3D 모델 */}
      <div>
        <Canvas
          style={{ ...CANVAS_CONFIG.DIMENSIONS }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 5, -4]} fov={75} />
          <color attach="background" args={["white"]} />
          <ambientLight
            intensity={CANVAS_CONFIG.LIGHTING.directional.intensity}
          />
          <directionalLight {...CANVAS_CONFIG.LIGHTING.directional} />
          <CameraControls
            maxDistance={10} // 카메라가 멀어질 수 있는 최대 거리
            minDistance={5} // 카메라가 가까워질 수 있는 최소 거리
          />
          <Html position={[7, 0, 0]}>
            <div style={{ color: "black" }}>W</div>
          </Html>
          <Html position={[-7, 0, 0]}>
            <div style={{ color: "black" }}>E</div>
          </Html>
          <Html position={[0, 0, 18]}>
            <div style={{ color: "black" }}>N</div>
          </Html>
          <Html position={[0, 0, -3]}>
            <div style={{ color: "black" }}>S</div>
          </Html>
          <primitive
            object={new AxesHelper(10)}
            position={[0, 0, 0]}
            rotation={[0, Math.PI, 0]}
          />
          <Drone
            roll={AttitudeData?.roll ? +AttitudeData.roll : 0}
            pitch={AttitudeData?.pitch ? +AttitudeData.pitch : 0}
            yaw={AttitudeData?.yaw ? +AttitudeData.yaw : 0}
            heading={AttitudeData?.heading ? +AttitudeData.heading : 0}
          />
        </Canvas>
      </div>

      {/* 속도 데이터 */}
      <div className="mt-4 flex w-full justify-between">
        {[
          { label: "Roll 속도", value: AttitudeData?.rollSpeed ?? 0.0 },
          { label: "Pitch 속도", value: AttitudeData?.pitchSpeed ?? 0.0 },
          { label: "Yaw 속도", value: AttitudeData?.yawSpeed ?? 0.0 },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div>{item.label}</div>
            <div>{item.value ?? 0.0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
