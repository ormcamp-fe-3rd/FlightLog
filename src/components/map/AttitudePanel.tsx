"use client";
import { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function DronModel() {
  let scene = new THREE.Scene();
  let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas") as HTMLCanvasElement,
    antialias: true,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // 톤 매핑 설정
  renderer.toneMappingExposure = 1.5;

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(1, 1.5, 2); // 카메라 위치

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  scene.background = new THREE.Color("white"); // 배경색 설정

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); //조명
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //환경조명
  scene.add(ambientLight);

  const textureLoader = new THREE.TextureLoader();
  const diffuseMap = textureLoader.load(
    "/images/map/drone/material_0_diffuse.png",
  );
  const specularMap = textureLoader.load(
    "/images/map/drone/material_0_specularGlossiness.png",
  );
  const normalMap = textureLoader.load(
    "/images/map/drone/material_0_normal.png",
  );
  const aoMap = textureLoader.load(
    "/images/map/drone/material_0_occlusion.png",
  ); // 텍스처 경로 각각 할당

  const loader = new GLTFLoader();
  loader.load("/images/map/drone/scene.gltf", (gltf) => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          map: diffuseMap,
          normalMap: normalMap,
          roughnessMap: specularMap,
          aoMap: aoMap,
          roughness: 0.5,
          metalness: 0.5,
        });
      }
    });

    scene.add(gltf.scene);
    renderer.render(scene, camera);
  });

  const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
}

export default function AttitudePanel() {
  useEffect(() => {
    DronModel();
  }, []);

  return (
    <div className="flex size-[280px] flex-shrink-0 flex-col justify-between rounded-[30px] bg-white p-4 opacity-90">
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
