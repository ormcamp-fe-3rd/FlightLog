"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function DronModel(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white"); //배경색

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;

  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.width / canvas.height,
    0.1,
    1000,
  ); // 카메라
  camera.position.set(1, 1.5, 2);

  const controls = new OrbitControls(camera, renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight); // 조명

  const textureLoader = new THREE.TextureLoader();
  const textures = {
    map: textureLoader.load("/images/map/drone/material_0_diffuse.png"),
    normalMap: textureLoader.load("/images/map/drone/material_0_normal.png"),
    roughnessMap: textureLoader.load(
      "/images/map/drone/material_0_specularGlossiness.png",
    ),
    aoMap: textureLoader.load("/images/map/drone/material_0_occlusion.png"),
  }; // 텍스쳐

  const loader = new GLTFLoader();
  loader.load("/images/map/drone/scene.gltf", (gltf) => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          ...textures,
          roughness: 0.5,
          metalness: 0.5,
        });
      }
    });
    scene.add(gltf.scene);
    renderer.render(scene, camera); // 드론 모델
  });

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
}

export default function AttitudePanel() {
  useEffect(() => {
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    if (canvas) DronModel(canvas);
  }, []);

  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <div>
        <div>Roll: </div>
        <div>Pitch: </div>
        <div>Yaw: </div>
      </div>
      <div>
        <canvas id="canvas" width={250} height={140}></canvas>
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
