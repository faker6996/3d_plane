
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerrainProps {
  paused: boolean;
  gridColor: string;
}

export const Terrain: React.FC<TerrainProps> = ({ paused, gridColor }) => {
  const terrainRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (paused) return;
    if (terrainRef.current) {
      terrainRef.current.position.z += delta * 20;
      if (terrainRef.current.position.z > 20) {
        terrainRef.current.position.z = 0;
      }
    }
  });

  return (
    <group position={[0, -10, -40]}>
      <gridHelper args={[100, 40, gridColor, gridColor]} position={[0, 0, 0]} />
      <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100, 20, 20]} />
        <meshBasicMaterial wireframe color={gridColor} transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 2, -60]}>
         <planeGeometry args={[200, 40]} />
         <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}
