
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneryProps {
  type: 'cubes' | 'asteroids' | 'alien';
  count?: number;
  color: string;
}

export const Scenery: React.FC<SceneryProps> = ({ type, count = 100, color }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      // Move particles towards camera to create speed effect
      // We modify zFactor cyclically
      particle.zFactor += 0.5; 
      if (particle.zFactor > 50) particle.zFactor = -150;

      dummy.position.set(particle.xFactor, particle.yFactor, particle.zFactor);
      
      // Rotate based on time
      if (type === 'cubes') {
         dummy.rotation.set(state.clock.elapsedTime * particle.speed, state.clock.elapsedTime * particle.speed, 0);
      } else {
         dummy.rotation.set(state.clock.elapsedTime * particle.speed, state.clock.elapsedTime * particle.speed, state.clock.elapsedTime * particle.speed);
      }

      // Scale variety
      const s = Math.max(0.2, Math.cos(particle.t) * 2);
      dummy.scale.set(s, s, s);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {type === 'cubes' && <boxGeometry args={[1, 1, 1]} />}
      {type === 'asteroids' && <dodecahedronGeometry args={[1, 0]} />}
      {type === 'alien' && <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />}
      
      <meshStandardMaterial 
        color={color} 
        roughness={0.8} 
        metalness={0.2} 
        transparent 
        opacity={0.4} 
      />
    </instancedMesh>
  );
};
