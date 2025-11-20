
import React, { forwardRef } from 'react';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from '../types';

interface ShipProps {
  position: Vector3;
}

export const PlayerShip = forwardRef<THREE.Group, ShipProps>((props, ref) => {
  return (
    <group ref={ref} dispose={null}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group rotation={[0, Math.PI, 0]} scale={0.8}>
           {/* Main Fuselage */}
           <mesh castShadow receiveShadow position={[0, 0, 0.5]}>
            <boxGeometry args={[0.8, 0.5, 3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} envMapIntensity={1} />
          </mesh>
          
          {/* Cockpit Glass */}
          <mesh position={[0, 0.3, 0.5]}>
            <boxGeometry args={[0.6, 0.3, 1.5]} />
            <meshPhysicalMaterial 
              color="#0ea5e9" 
              roughness={0} 
              metalness={0.9} 
              transmission={0.2}
              emissive="#0ea5e9"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Wings */}
          <group position={[0, 0, 0]}>
             <mesh position={[1.5, -0.2, 1]} rotation={[0, 0, -0.1]}>
               <boxGeometry args={[2.5, 0.1, 1.5]} />
               <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
             </mesh>
             <mesh position={[-1.5, -0.2, 1]} rotation={[0, 0, 0.1]}>
               <boxGeometry args={[2.5, 0.1, 1.5]} />
               <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
             </mesh>
             {/* Wing Lights */}
             <mesh position={[2.5, -0.2, 1]}>
                <boxGeometry args={[0.1, 0.1, 1]} />
                <meshBasicMaterial color="#00ffcc" toneMapped={false} />
             </mesh>
             <mesh position={[-2.5, -0.2, 1]}>
                <boxGeometry args={[0.1, 0.1, 1]} />
                <meshBasicMaterial color="#00ffcc" toneMapped={false} />
             </mesh>
          </group>

          {/* Engines */}
          <group position={[0, -0.2, 2]}>
            <mesh position={[0.6, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 1]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[-0.6, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 1]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Engine Glow */}
            <mesh position={[0.6, 0, 0.5]} rotation={[Math.PI/2, 0, 0]}>
               <circleGeometry args={[0.25]} />
               <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>
            <mesh position={[-0.6, 0, 0.5]} rotation={[Math.PI/2, 0, 0]}>
               <circleGeometry args={[0.25]} />
               <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
});
