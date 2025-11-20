
import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from '../types';

interface BossProps {
  position: Vector3;
  level: number;
}

export const BossShip = forwardRef<THREE.Group, BossProps>((props, ref) => {
  const { level } = props;

  // Colors based on level
  const coreColor = level === 1 ? "#2a2a2a" : level === 2 ? "#4a0404" : "#1a0b2e";
  const glowColor = level === 1 ? "#ff0000" : level === 2 ? "#ffaa00" : "#aa00ff";
  const wingColor = level === 1 ? "#450a0a" : level === 2 ? "#7f1d1d" : "#4c1d95";

  return (
    <group ref={ref} dispose={null} scale={2.0}>
       {/* Level 3 Extra Aura */}
       {level === 3 && (
         <pointLight position={[0, 2, 0]} color="#aa00ff" intensity={5} distance={15} />
       )}

       {/* Main Core */}
       <mesh position={[0, 0, 0]}>
          {level === 3 ? <icosahedronGeometry args={[1.8, 0]} /> : <octahedronGeometry args={[1.5]} />}
          <meshStandardMaterial 
            color={coreColor} 
            metalness={0.9} 
            roughness={0.2} 
            emissive={level === 3 ? "#2e1065" : "#500707"}
            emissiveIntensity={0.5} 
          />
       </mesh>
       
       {/* Glowing Eye */}
       <mesh position={[0, 0, 1.2]}>
          <sphereGeometry args={[0.5]} />
          <meshBasicMaterial color={glowColor} toneMapped={false} />
       </mesh>
       <pointLight position={[0, 0, 2]} color={glowColor} intensity={2} distance={10} />

       {/* Wings */}
       <group position={[0, 0, -0.5]}>
         {/* Extra wings for Level 2+ */}
         {level >= 2 && (
            <>
             <mesh position={[2.2, 1.5, 0]} rotation={[0, 0, 0.5]}>
                <boxGeometry args={[3, 0.2, 1]} />
                <meshStandardMaterial color={wingColor} metalness={0.8} />
             </mesh>
             <mesh position={[-2.2, 1.5, 0]} rotation={[0, 0, -0.5]}>
                <boxGeometry args={[3, 0.2, 1]} />
                <meshStandardMaterial color={wingColor} metalness={0.8} />
             </mesh>
            </>
         )}

         <mesh position={[2.2, 0, 0]} rotation={[0, -0.3, -0.2]}>
            <boxGeometry args={[4, 0.3, 2]} />
            <meshStandardMaterial color={wingColor} metalness={0.8} roughness={0.4} />
         </mesh>
         <mesh position={[-2.2, 0, 0]} rotation={[0, 0.3, 0.2]}>
            <boxGeometry args={[4, 0.3, 2]} />
            <meshStandardMaterial color={wingColor} metalness={0.8} roughness={0.4} />
         </mesh>
         
         {/* Wing Glow Strips */}
         <mesh position={[3, 0.1, 0.5]} rotation={[0, -0.3, -0.2]}>
            <boxGeometry args={[2, 0.05, 0.2]} />
            <meshBasicMaterial color={glowColor} toneMapped={false} />
         </mesh>
         <mesh position={[-3, 0.1, 0.5]} rotation={[0, 0.3, 0.2]}>
            <boxGeometry args={[2, 0.05, 0.2]} />
            <meshBasicMaterial color={glowColor} toneMapped={false} />
         </mesh>
       </group>

       {/* Weapon Mounts */}
       <mesh position={[2.5, -0.5, 1]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 1.5]} />
          <meshStandardMaterial color="#333" />
       </mesh>
       <mesh position={[-2.5, -0.5, 1]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 1.5]} />
          <meshStandardMaterial color="#333" />
       </mesh>
    </group>
  )
});
