"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export function ThreeScene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffcf5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    let globe: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.setDecoderPath("'https://www.gstatic.com/draco/v1/decoders/'");
    loader.setDRACOLoader(dracoLoader);

    loader.load("/assets/models/home2.glb", (gltf) => {
      globe = gltf.scene;
      scene.add(gltf.scene);
    }, undefined, function (error) { console.error(error); });

    camera.position.z = 3;
    camera.position.y = 1.2;

    const animate = () => {
      if (globe) {
        globe.rotation.z += 0.0015;
        // globe.rotation.z += 0.005;
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvasContainer.removeChild(renderer.domElement);
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
}
