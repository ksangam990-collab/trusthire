import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function TrustNetworkScene() {
  const mountRef = useRef(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check reduced motion or mobile viewport fallback
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      setUseFallback(true);
      return;
    }

    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      setUseFallback(true);
      return;
    }

    // Central Trust Core (Verification Nexus)
    const coreGeometry = new THREE.IcosahedronGeometry(2.2, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner glowing solid kernel
    const innerGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x059669,
      wireframe: false,
      transparent: true,
      opacity: 0.25
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Orbiting Satellite Nodes (Employers, Candidates, Jobs)
    const nodeCount = 18;
    const nodePositions = [];
    const nodeColors = [0x10b981, 0x3b82f6, 0xf59e0b]; // Verified, Candidate, Monitored
    const nodesGroup = new THREE.Group();

    for (let i = 0; i < nodeCount; i++) {
      const radius = 6.5 + Math.random() * 2.5;
      const theta = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.4;
      const phi = (Math.random() - 0.5) * Math.PI * 0.6;

      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi);
      const z = radius * Math.sin(theta) * Math.cos(phi);

      const sphereGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: nodeColors[i % nodeColors.length],
        transparent: true,
        opacity: 0.85
      });
      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.position.set(x, y, z);
      nodesGroup.add(nodeMesh);
      nodePositions.push({ mesh: nodeMesh, originalX: x, originalY: y, originalZ: z, speed: 0.001 + Math.random() * 0.002 });
    }
    scene.add(nodesGroup);

    // Dynamic Connections (Splines / Lines to Core)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15
    });

    const linesGroup = new THREE.Group();
    nodePositions.forEach((node) => {
      const points = [new THREE.Vector3(0, 0, 0), node.mesh.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      linesGroup.add(line);
    });
    scene.add(linesGroup);

    // Animation Loop with Visibility Control
    let animationFrameId;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(currentMount);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Rotate central core
      coreMesh.rotation.x = elapsedTime * 0.12;
      coreMesh.rotation.y = elapsedTime * 0.18;
      innerMesh.rotation.x = -elapsedTime * 0.08;

      // Orbit satellite nodes
      nodesGroup.rotation.y = elapsedTime * 0.05;

      // Render
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      // Cleanly dispose Three.js scene assets
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      lineMaterial.dispose();

      nodePositions.forEach(node => {
        if (node.mesh) {
          node.mesh.geometry?.dispose();
          node.mesh.material?.dispose();
        }
      });

      linesGroup.children.forEach(child => {
        child.geometry?.dispose();
      });

      if (currentMount && renderer?.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  if (useFallback) {
    return (
      <div className="w-full h-full flex items-center justify-center relative select-none">
        <svg viewBox="0 0 400 400" className="w-72 h-72 animate-pulse text-emerald-500/20">
          <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4" />
          <circle cx="200" cy="200" r="28" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1.5" />
          <circle cx="200" cy="60" r="6" fill="#3b82f6" />
          <circle cx="330" cy="240" r="6" fill="#10b981" />
          <circle cx="90" cy="270" r="6" fill="#f59e0b" />
          <line x1="200" y1="200" x2="200" y2="60" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
          <line x1="200" y1="200" x2="330" y2="240" stroke="#10b981" strokeWidth="1" opacity="0.3" />
          <line x1="200" y1="200" x2="90" y2="270" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full min-h-[360px]" />;
}