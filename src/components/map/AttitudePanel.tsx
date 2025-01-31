"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { AxesHelper } from "three";
import { useEffect, useRef } from "react";
import { useAttitudeData } from "@/hooks/useAttitudeData";
import { CameraControls, Html, PerspectiveCamera } from "@react-three/drei";

interface AttitudePanelProps {
  progress: number;
  allTimestamps: number[];
  operationTimestamps: Record<string, number[]>;
  selectedOperationId: string[];
  selectedFlight: string;
  isPlaying: boolean;
}

const CANVAS_CONFIG = {
  DIMENSIONS: {
    width: 250,
    height: 170,
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
  isPlaying,
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
    heading,
    isPlaying,
  }: {
    roll?: number;
    pitch?: number;
    heading?: number;
    isPlaying: boolean;
  }) {
    const glb = useLoader(GLTFLoader, "/images/map/drone/drone.glb");

    const droneRef = useRef<THREE.Group>(null);
    const fanRefs = useRef<THREE.Mesh[]>([]);
    const arrowRef = useRef<THREE.ArrowHelper | null>(null);
    const isPlayingRef = useRef(isPlaying);

    useEffect(() => {
      isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
      glb.scene.traverse((child) => {
        if (
          (child as THREE.Mesh).isMesh &&
          child.name.includes("Fan") &&
          !child.name.includes("Fan_top")
        ) {
          fanRefs.current.push(child as THREE.Mesh);
        }
      });

      // 화살표 생성
      if (!arrowRef.current) {
        const direction = new THREE.Vector3(0, 0, 1); // Z축 초기 방향
        arrowRef.current = new THREE.ArrowHelper(
          direction,
          new THREE.Vector3(0, 0.5, 0), // 화살표 위치 조정
          0.5, // 화살표 길이
          0xff0000, // 색상 (빨간색)
          0.2, // 화살표 머리 크기
        );

        if (droneRef.current) {
          droneRef.current.add(arrowRef.current); // 드론에 화살표 추가
          droneRef.current.rotation.y = Math.PI / 2; // 기본 회전 설정
        }
      }
    }, [glb]);

    // degree -> rad 변환 함수
    const degToRad = (deg: number) => (deg * Math.PI) / 180;

    useFrame(() => {
      if (droneRef.current) {
        droneRef.current.rotation.x = degToRad(pitch ?? 0);
        droneRef.current.rotation.y = degToRad(-(heading ?? 0));
        droneRef.current.rotation.z = degToRad(roll ?? 0);
      }
      // 날개(Fan) 회전
      fanRefs.current.forEach((fan) => {
        if (isPlaying) {
          fan.rotation.z += 0.8;
        }
      });
    });

    return (
      <group ref={droneRef} scale={[5, 5, 5]}>
        {" "}
        //드론 크기 //크기
        <primitive object={glb.scene} />
      </group>
    );
  }

  return (
    <div className="flex h-full w-[280px] flex-col justify-between rounded-[30px] bg-white p-4">
      <div>
        <div>Roll: {AttitudeData?.roll}</div>
        <div>Pitch: {AttitudeData?.pitch}</div>
        <div>Yaw: {AttitudeData?.yaw}</div>
      </div>

      {/* 3D 모델 */}
      <div className="top-6">
        <Canvas
          style={{ ...CANVAS_CONFIG.DIMENSIONS }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 6, -4]} fov={75} />
          <color attach="background" args={["white"]} />
          <ambientLight
            intensity={CANVAS_CONFIG.LIGHTING.directional.intensity}
          />
          <directionalLight {...CANVAS_CONFIG.LIGHTING.directional} />
          <CameraControls
            maxDistance={10} // 카메라가 멀어질 수 있는 최대 거리
            minDistance={5} // 카메라가 가까워질 수 있는 최소 거리
          />
          <Html position={[6, 0, 0]}>
            <div style={{ color: "black" }}>W</div>
          </Html>
          <Html position={[-6, 0, 0]}>
            <div style={{ color: "black" }}>E</div>
          </Html>
          <Html position={[0, 0, 7]}>
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
            heading={AttitudeData?.heading ? +AttitudeData.heading : 0}
            isPlaying={isPlaying}
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
