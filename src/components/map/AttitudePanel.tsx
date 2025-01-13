"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Drone() {
  const gltf = useGLTF("/images/map/drone/scene.gltf");
  const textures = useTexture({
    map: "/images/map/drone/material_0_diffuse.png",
    normalMap: "/images/map/drone/material_0_normal.png",
    roughnessMap: "/images/map/drone/material_0_specularGlossiness.png",
    aoMap: "/images/map/drone/material_0_occlusion.png",
  });

  return (
    <primitive
      object={gltf.scene}
      dispose={null}
      children={gltf.scene.children.map((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          return (
            <mesh key={mesh.uuid} geometry={mesh.geometry}>
              <meshStandardMaterial
                {...textures}
                roughness={0.5}
                metalness={0.5}
              />
            </mesh>
          );
        }
        return null;
      })}
    />
  );
}

export default function AttitudePanel() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <div>
        <div>Roll: </div>
        <div>Pitch: </div>
        <div>Yaw: </div>
      </div>
      <div>
        <Canvas
          camera={{ position: [0.5, 1.3, 1.5], fov: 75 }} //카메라
          style={{ width: 250, height: 140 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
          }}
        >
          <color attach="background" args={["white"]} /> // 배경색
          <ambientLight intensity={0.5} /> //조명
          <directionalLight intensity={1.5} position={[5, 10, 5]} /> //조명
          <Drone /> // 3D모델
          <OrbitControls /> //마우스컨트롤
        </Canvas>
      </div>
      <div className="flex w-full justify-between">
        <div>
          <div>Roll 속도</div>
          <div>Roll 속도</div>
        </div>
        <div>
          <div>Pitch 속도</div>
          <div>Pitch 속도</div>
        </div>
        <div>
          <div>Yaw 속도</div>
          <div>Yaw 속도</div>
        </div>
      </div>
    </div>
  );
}
