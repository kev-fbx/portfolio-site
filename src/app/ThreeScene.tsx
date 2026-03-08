"use client";

import * as React from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

type ThreeSceneProps = {
  className?: string;
  projects: {
    id: string;
    title: string;
    summary: string;
    link: string;
    image?: string;
  }[];
  onSelect?: (project: { id: string; title: string; summary: string; link: string; image?: string }) => void;
};

export default function ThreeScene({ className, projects, onSelect }: ThreeSceneProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const fontRef = React.useRef<any | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const setupScene = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const fontLoader = new FontLoader();
      fontLoader.load("/fonts/Google Sans Code_Bold.json", (font) => {
        fontRef.current = font;
      });

      const scene = new THREE.Scene();

      const frustumSize = 3.5;
      let aspect = 1;
      const camera = new THREE.OrthographicCamera(
        -frustumSize / 2,
        frustumSize / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        100
      );
      camera.position.set(0, -0.1, 2.8);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      host.appendChild(renderer.domElement);

      const ring = new THREE.Group();
      const tiltAxis = new THREE.Vector3(1, 0, 1).normalize();
      const tiltAngle = 0.4;
      const tiltQuat = new THREE.Quaternion();
      tiltQuat.setFromAxisAngle(tiltAxis, tiltAngle);
      ring.quaternion.copy(tiltQuat);
      scene.add(ring);

      const ambient = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambient);

      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(2, 2, 3);
      scene.add(key);

      const rim = new THREE.DirectionalLight(0xffffff, 1.0);
      rim.position.set(-2, 1, -2);
      scene.add(rim);

      const cssColor = (value: string, fallback: number) => {
        try {
          const c = value.trim();
          return c ? new THREE.Color(c) : new THREE.Color(fallback);
        } catch {
          return new THREE.Color(fallback);
        }
      };

      const styles = getComputedStyle(host);
      const baseColor = cssColor(styles.getPropertyValue("--title-color"), 0x3b5bfd);
      const hoverColor = cssColor(styles.getPropertyValue("--hover-accent"), 0xffc857);

      const planeGeo = new THREE.CircleGeometry(0.20, 64);
      const textureLoader = new THREE.TextureLoader();
      const edgesGeo = new THREE.EdgesGeometry(planeGeo);
      const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 80 });

      const projectMeshes: { mesh: THREE.Mesh; projectId: string; material: THREE.MeshStandardMaterial; label?: THREE.Mesh }[] = [];
      let hovered: THREE.Mesh | null = null;

      const createLabelTexture = (text: string): THREE.Texture => {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#3b5bfd";
        ctx.font = "bold 64px GoogleSansCode, 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const maxWidth = canvas.width - 250;
        const lineHeight = 80;
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? currentLine + " " + word : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        const totalHeight = lines.length * lineHeight;
        const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

        ctx.fillStyle = "#3b5bfd";
        lines.forEach((line, index) => {
          ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
        });

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
        return texture;
      };

      const radius = 1.15;
      projects.forEach((project, idx) => {
        const angle = (idx / projects.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 0.5) * 0.15;

        const material = new THREE.MeshStandardMaterial({
          color: baseColor.clone(),
          roughness: 0.35,
          metalness: 0.1,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0.0,
          side: THREE.DoubleSide,
        });

        if (project.image) {
          textureLoader.load(project.image, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            material.map = texture;
            material.color.set(0xffffff);
            material.needsUpdate = true;
          });
        }

        const body = new THREE.Mesh(planeGeo, material);
        body.position.set(x, y, z);
        body.userData.projectId = project.id;
        body.lookAt(camera.position);

        const borderLines = new THREE.LineSegments(edgesGeo, borderMaterial);
        borderLines.position.z = 0.001;
        body.add(borderLines);

        const labelTexture = createLabelTexture(project.title);
        const labelMaterial = new THREE.MeshBasicMaterial({
          map: labelTexture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const labelGeo = new THREE.PlaneGeometry(0.6, 0.3);
        const label = new THREE.Mesh(labelGeo, labelMaterial);
        label.position.y = -0.26;
        body.add(label);

        ring.add(body);
        projectMeshes.push({ mesh: body, projectId: project.id, material, label });
      });

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        renderer.setSize(w, h, false);
        aspect = w / h;
        const frustumHeight = frustumSize / aspect;
        camera.left = -frustumSize / 2;
        camera.right = frustumSize / 2;
        camera.top = frustumHeight / 2;
        camera.bottom = -frustumHeight / 2;
        camera.updateProjectionMatrix();
      };

      resize();

      const ro = new ResizeObserver(() => resize());
      ro.observe(host);

      const clock = new THREE.Clock();

      const pointer = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      const hoverEmissive = hoverColor.clone().multiplyScalar(0.4);

      const updateHover = () => {
        const intersects = raycaster.intersectObjects(projectMeshes.map((p) => p.mesh), false);
        const hit = intersects[0]?.object as THREE.Mesh | undefined;

        if (hovered && hovered !== hit) {
          const pm = projectMeshes.find((p) => p.mesh === hovered);
          if (pm) {
            if (pm.material.map) {
              pm.material.emissive.set(0x000000);
              pm.material.emissiveIntensity = 0.0;
            } else {
              pm.material.color.copy(baseColor);
              pm.material.emissive.set(0x000000);
            }
          }
          hovered = null;
        }

        if (hit) {
          const pm = projectMeshes.find((p) => p.mesh === hit);
          if (pm) {
            if (pm.material.map) {
              pm.material.emissive.set(0xffffff);
              pm.material.emissiveIntensity = 0.1;
            } else {
              pm.material.color.copy(hoverColor);
              pm.material.emissive.copy(hoverEmissive);
            }
            hovered = hit;
            renderer.domElement.style.cursor = "pointer";
            return;
          }
        }

        renderer.domElement.style.cursor = "default";
      };

      const updatePointerFromEvent = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
      };

      const handlePointerMove = (event: PointerEvent) => {
        updatePointerFromEvent(event);
        updateHover();
      };

      const handlePointerDown = (event: PointerEvent) => {
        updatePointerFromEvent(event);

        const intersects = raycaster.intersectObjects(projectMeshes.map((p) => p.mesh), false);
        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh & { userData: { projectId?: string } };
          const pm = projectMeshes.find((p) => p.mesh === hit);
          if (pm) {
            pm.material.emissive.set(0x000000);
            pm.material.emissiveIntensity = 0.0;
          }
          hovered = null;
          renderer.domElement.style.cursor = "default";

          const projectId = hit.userData.projectId;
          const project = projects.find((p) => p.id === projectId);
          if (project && onSelect) {
            onSelect(project);
          }
        }
      };

      renderer.domElement.addEventListener("pointermove", handlePointerMove);
      renderer.domElement.addEventListener("pointerdown", handlePointerDown);

      const tick = () => {
        const t = clock.getElapsedTime();
        const spinQuat = new THREE.Quaternion();
        spinQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), t * 0.35);
        ring.quaternion.copy(tiltQuat).multiply(spinQuat);

        projectMeshes.forEach(({ mesh }) => {
          const worldPos = new THREE.Vector3();
          mesh.getWorldPosition(worldPos);
          const distance = worldPos.distanceTo(camera.position);
          const scale = 8 / (distance * distance);
          mesh.scale.set(scale, scale, scale);

          const ringRotationInverse = new THREE.Quaternion().copy(ring.quaternion).invert();
          mesh.quaternion.copy(ringRotationInverse);

          mesh.userData.planeUp = new THREE.Vector3(0, 1, 0);
          mesh.userData.planeRight = new THREE.Vector3(1, 0, 0);
          mesh.userData.planeNormal = new THREE.Vector3(0, 0, 1);
        });

        renderer.render(scene, camera);
        rafRef.current = window.requestAnimationFrame(tick);
      };

      rafRef.current = window.requestAnimationFrame(tick);

      return () => {
        if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
        renderer.domElement.removeEventListener("pointermove", handlePointerMove);

        projectMeshes.forEach(({ material, label }) => {
          material.dispose();
          if (label) {
            (label.material as THREE.Material).dispose();
            label.geometry.dispose();
          }
        });
        planeGeo.dispose();
        renderer.dispose();

        if (renderer.domElement.parentElement === host) {
          host.removeChild(renderer.domElement);
        }
      };
    };

    setupScene();
  }, [projects, onSelect]);

  return <div ref={hostRef} className={className} />;
}
