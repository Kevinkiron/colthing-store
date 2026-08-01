"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Garment({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ dragging: false, lastX: 0 });

  useFrame((_, delta) => {
    if (group.current && !drag.current.dragging) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        drag.current.dragging = true;
        drag.current.lastX = e.clientX;
      }}
      onPointerUp={() => (drag.current.dragging = false)}
      onPointerLeave={() => (drag.current.dragging = false)}
      onPointerMove={(e) => {
        if (drag.current.dragging && group.current) {
          const delta = e.clientX - drag.current.lastX;
          group.current.rotation.y += delta * 0.01;
          drag.current.lastX = e.clientX;
        }
      }}
    >
      {/* Bodice */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 1.1, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.35} sheen={1} sheenColor="white" clearcoat={0.15} />
      </mesh>
      {/* Skirt */}
      <mesh position={[0, -0.55, 0]}>
        <coneGeometry args={[1.35, 1.6, 40, 1, true]} />
        <meshPhysicalMaterial color={color} roughness={0.4} side={THREE.DoubleSide} sheen={1} sheenColor="white" />
      </mesh>
      {/* Neck / collar accent */}
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[0.28, 0.05, 16, 32]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function ProductScene({ color }: { color: string }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 4.2], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} />
      <directionalLight position={[-3, -2, -2]} intensity={0.3} />
      <Garment color={color} />
    </Canvas>
  );
}
