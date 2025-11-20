import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, PerspectiveCamera, Environment, 
  Float, CameraShake 
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { GameState, Enemy, Bullet, Boss, Vector3 } from '../types';

// --- Constants ---
const PLAYER_SPEED = 0.18;
// Adjusted limits for wider FOV/Camera distance
const PLAYER_LIMIT_X = 12; 
const PLAYER_LIMIT_Y = 7;
const BULLET_SPEED = 1.2;
const ENEMY_SPEED = 0.25;
const ENEMY_BULLET_SPEED = 0.4;
const SPAWN_RATE = 40;
const MAX_BULLETS = 200;
const MAX_ENEMIES = 50;
const BOSS_SPAWN_SCORE = 500;
const BOSS_HP = 300;

// --- Utilities ---
const tempObj = new THREE.Object3D();

// --- Visual Components ---

// Player Ship - Detailed Model
const Ship = React.forwardRef<THREE.Group, { position: Vector3 }>((props, ref) => {
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

// Boss Model - Updated to be cooler and less obstructive
const BossShip = React.forwardRef<THREE.Group, { position: Vector3 }>((props, ref) => {
  return (
    <group ref={ref} dispose={null} scale={2.0}> {/* Scale reduced from 2.5 */}
       {/* Main Core - Glowing Dark Red */}
       <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.5]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            metalness={0.9} 
            roughness={0.2} 
            emissive="#500707" 
            emissiveIntensity={0.5} 
          />
       </mesh>
       
       {/* Glowing Eye - Brighter */}
       <mesh position={[0, 0, 1.2]}>
          <sphereGeometry args={[0.5]} />
          <meshBasicMaterial color="#ff0000" toneMapped={false} />
       </mesh>
       <pointLight position={[0, 0, 2]} color="#ff0000" intensity={2} distance={10} />

       {/* Wings - Angled back to be less blocky */}
       <group position={[0, 0, -0.5]}>
         <mesh position={[2.2, 0, 0]} rotation={[0, -0.3, -0.2]}>
            <boxGeometry args={[4, 0.3, 2]} />
            <meshStandardMaterial color="#450a0a" metalness={0.8} roughness={0.4} />
         </mesh>
         <mesh position={[-2.2, 0, 0]} rotation={[0, 0.3, 0.2]}>
            <boxGeometry args={[4, 0.3, 2]} />
            <meshStandardMaterial color="#450a0a" metalness={0.8} roughness={0.4} />
         </mesh>
         
         {/* Wing Glow Strips */}
         <mesh position={[3, 0.1, 0.5]} rotation={[0, -0.3, -0.2]}>
            <boxGeometry args={[2, 0.05, 0.2]} />
            <meshBasicMaterial color="#ff4400" toneMapped={false} />
         </mesh>
         <mesh position={[-3, 0.1, 0.5]} rotation={[0, 0.3, 0.2]}>
            <boxGeometry args={[2, 0.05, 0.2]} />
            <meshBasicMaterial color="#ff4400" toneMapped={false} />
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

// Moving Terrain for Speed Effect
const Terrain = () => {
  const terrainRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (terrainRef.current) {
      // Move texture or mesh to simulate speed
      terrainRef.current.position.z += delta * 20;
      if (terrainRef.current.position.z > 20) {
        terrainRef.current.position.z = 0;
      }
    }
  });

  return (
    <group position={[0, -10, -40]}>
      <gridHelper args={[100, 40, 0x1e293b, 0x1e293b]} position={[0, 0, 0]} />
      <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100, 20, 20]} />
        <meshBasicMaterial wireframe color="#0f172a" transparent opacity={0.2} />
      </mesh>
      {/* Horizon Glow */}
      <mesh position={[0, 2, -60]}>
         <planeGeometry args={[200, 40]} />
         <meshBasicMaterial color="#020617" />
      </mesh>
    </group>
  );
}

// --- Logic Manager ---
// Using Refs for everything to avoid React Reconciliation overhead (The "Lag" fix)

interface GameLogicProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setBossHealth: React.Dispatch<React.SetStateAction<number>>;
  setMaxBossHealth: React.Dispatch<React.SetStateAction<number>>;
  mouseClicked: boolean;
}

const GameScene: React.FC<GameLogicProps> = ({ 
  gameState, setGameState, setScore, setLives, setBossHealth, setMaxBossHealth, mouseClicked 
}) => {
  const { viewport } = useThree();
  
  // Game State Refs
  const playerPos = useRef<Vector3>({ x: 0, y: -2, z: 0 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const currentScore = useRef(0);
  
  // Rendering Refs (InstancedMesh)
  const bulletMeshRef = useRef<THREE.InstancedMesh>(null);
  const enemyBulletMeshRef = useRef<THREE.InstancedMesh>(null);
  const enemyFighterRef = useRef<THREE.InstancedMesh>(null);
  const enemyDroneRef = useRef<THREE.InstancedMesh>(null);
  const shipRef = useRef<THREE.Group>(null);
  const bossModelRef = useRef<THREE.Group>(null);
  const shakeRef = useRef<any>(null);

  const lastShotTime = useRef(0);
  const frameCount = useRef(0);

  // Reset
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      bulletsRef.current = [];
      enemyBulletsRef.current = [];
      enemiesRef.current = [];
      bossRef.current = null;
      currentScore.current = 0;
      playerPos.current = { x: 0, y: -2, z: 0 };
      frameCount.current = 0;
      setBossHealth(0);
    }
  }, [gameState]);

  useFrame((state, delta) => {
    if (gameState !== GameState.PLAYING) return;

    const time = state.clock.elapsedTime;
    frameCount.current++;

    // --- 1. Player Control ---
    const targetX = (state.mouse.x * viewport.width) / 2;
    const targetY = (state.mouse.y * viewport.height) / 2;

    playerPos.current.x += (targetX - playerPos.current.x) * PLAYER_SPEED;
    playerPos.current.y += (targetY - playerPos.current.y) * PLAYER_SPEED;
    
    playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -PLAYER_LIMIT_X, PLAYER_LIMIT_X);
    playerPos.current.y = THREE.MathUtils.clamp(playerPos.current.y, -PLAYER_LIMIT_Y, PLAYER_LIMIT_Y);

    if (shipRef.current) {
      shipRef.current.position.set(playerPos.current.x, playerPos.current.y, playerPos.current.z);
      shipRef.current.rotation.z = THREE.MathUtils.lerp(shipRef.current.rotation.z, (playerPos.current.x - targetX) * 0.8, 0.1);
      shipRef.current.rotation.x = THREE.MathUtils.lerp(shipRef.current.rotation.x, (targetY - playerPos.current.y) * 0.4, 0.1);
    }

    // --- 2. Spawning ---
    // Shoot
    if (mouseClicked && time - lastShotTime.current > 0.15) {
       bulletsRef.current.push({
         id: Math.random().toString(),
         position: { x: playerPos.current.x, y: playerPos.current.y, z: playerPos.current.z - 1 },
         velocity: { x: 0, y: 0, z: -BULLET_SPEED },
         active: true,
         owner: 'player'
       });
       lastShotTime.current = time;
       if (shakeRef.current) shakeRef.current.setIntensity(0.1);
    }

    // Boss Spawning
    if (currentScore.current >= BOSS_SPAWN_SCORE && !bossRef.current) {
      bossRef.current = {
        id: 'BOSS',
        position: { x: 0, y: 2, z: -80 }, // Start even further back
        velocity: { x: 0, y: 0, z: 0 },
        active: true,
        maxHealth: BOSS_HP,
        health: BOSS_HP,
        state: 'entering',
        attackCooldown: 0
      };
      setMaxBossHealth(BOSS_HP);
      setBossHealth(BOSS_HP);
      enemiesRef.current = []; 
    }

    // Enemy Spawning (Only if boss is not fighting)
    if (!bossRef.current && frameCount.current % SPAWN_RATE === 0 && enemiesRef.current.length < MAX_ENEMIES) {
       const isFighter = Math.random() > 0.5;
       const startX = (Math.random() - 0.5) * viewport.width * 1.2;
       enemiesRef.current.push({
         id: Math.random().toString(),
         position: { x: startX, y: (Math.random() - 0.5) * viewport.height, z: -50 },
         velocity: { x: 0, y: 0, z: ENEMY_SPEED * (isFighter ? 1.5 : 1) },
         active: true,
         type: isFighter ? 'fighter' : 'drone',
         health: isFighter ? 2 : 1,
         rotationZ: 0
       });
    }

    // --- 3. Logic Updates & Collision ---
    
    // Player Bullets
    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
      const b = bulletsRef.current[i];
      b.position.z += b.velocity.z;
      if (b.position.z < -100) bulletsRef.current.splice(i, 1);
    }

    // Enemy Bullets
    for (let i = enemyBulletsRef.current.length - 1; i >= 0; i--) {
       const eb = enemyBulletsRef.current[i];
       eb.position.z += eb.velocity.z;
       eb.position.x += eb.velocity.x;
       eb.position.y += eb.velocity.y;

       // Collision with Player
       const dist = Math.hypot(playerPos.current.x - eb.position.x, playerPos.current.y - eb.position.y, playerPos.current.z - eb.position.z);
       if (dist < 1.2) {
          setLives(l => {
            if (l - 1 <= 0) setGameState(GameState.GAME_OVER);
            return l - 1;
          });
          enemyBulletsRef.current.splice(i, 1);
          if (shakeRef.current) shakeRef.current.setIntensity(1.5);
          continue;
       }

       if (eb.position.z > 10) enemyBulletsRef.current.splice(i, 1);
    }

    // Boss Logic
    if (bossModelRef.current) {
       if (!bossRef.current) {
         // CRITICAL FIX: Hide boss when not spawned to prevent it blocking the screen
         bossModelRef.current.visible = false;
       } else {
         bossModelRef.current.visible = true;
         const boss = bossRef.current;
         
         // Movement
         if (boss.state === 'entering') {
            boss.position.z += 0.3; // Faster entry
            // Stop much further back to avoid blocking view (-35 instead of -15)
            if (boss.position.z >= -35) boss.state = 'fighting';
         } else if (boss.state === 'fighting') {
            // Hover and strafe
            boss.position.x = Math.sin(time * 0.5) * 12; // Wider movement
            boss.position.y = Math.cos(time * 0.7) * 3;
            
            // Shooting
            boss.attackCooldown -= delta;
            if (boss.attackCooldown <= 0) {
               const startPos = { ...boss.position };
               const dirs = [-0.3, -0.1, 0.1, 0.3]; // 4 bullets
               dirs.forEach(d => {
                  const targetDir = new THREE.Vector3(playerPos.current.x, playerPos.current.y, playerPos.current.z)
                                      .sub(new THREE.Vector3(startPos.x, startPos.y, startPos.z))
                                      .normalize();
                  targetDir.x += d; 
                  
                  enemyBulletsRef.current.push({
                     id: Math.random().toString(),
                     position: { x: startPos.x + d*10, y: startPos.y - 1, z: startPos.z + 4 },
                     velocity: { x: targetDir.x * ENEMY_BULLET_SPEED, y: targetDir.y * ENEMY_BULLET_SPEED, z: ENEMY_BULLET_SPEED },
                     active: true,
                     owner: 'enemy'
                  });
               });
               
               boss.attackCooldown = 1.2; 
            }
         }

         bossModelRef.current.position.set(boss.position.x, boss.position.y, boss.position.z);
         bossModelRef.current.rotation.z = Math.sin(time) * 0.1;
         bossModelRef.current.rotation.y = Math.sin(time * 0.5) * 0.1; // Add slight yaw

         // Collision: Player Bullets vs Boss
         for (let j = bulletsRef.current.length - 1; j >= 0; j--) {
            const b = bulletsRef.current[j];
            // Adjust hit box for new position/scale
            if (Math.abs(b.position.x - boss.position.x) < 5 && 
                Math.abs(b.position.y - boss.position.y) < 3 && 
                Math.abs(b.position.z - boss.position.z) < 3) {
                
                b.active = false;
                bulletsRef.current.splice(j, 1);
                boss.health -= 2; 
                setBossHealth(boss.health);
                
                if (boss.health <= 0) {
                   currentScore.current += 1000;
                   setScore(s => s + 1000);
                   bossRef.current = null;
                   setBossHealth(0);
                }
            }
         }
      }
    }

    // Enemies
    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      const e = enemiesRef.current[i];
      e.position.z += e.velocity.z;
      e.position.x += (playerPos.current.x - e.position.x) * 0.005;
      e.position.y += (playerPos.current.y - e.position.y) * 0.005;
      e.rotationZ += 0.02;

      const distToPlayer = Math.hypot(playerPos.current.x - e.position.x, playerPos.current.y - e.position.y, playerPos.current.z - e.position.z);
      if (distToPlayer < 2) {
         setLives(l => {
             if (l - 1 <= 0) setGameState(GameState.GAME_OVER);
             return l - 1;
         });
         enemiesRef.current.splice(i, 1);
         if (shakeRef.current) shakeRef.current.setIntensity(1); 
         continue;
      }

      let hit = false;
      for (let j = bulletsRef.current.length - 1; j >= 0; j--) {
         const b = bulletsRef.current[j];
         const dist = Math.hypot(b.position.x - e.position.x, b.position.y - e.position.y, b.position.z - e.position.z);
         if (dist < 1.5) {
            b.active = false; 
            bulletsRef.current.splice(j, 1);
            e.health--;
            if (e.health <= 0) {
               currentScore.current += (e.type === 'fighter' ? 150 : 50);
               setScore(currentScore.current);
               hit = true;
            }
            break; 
         }
      }
      
      if (hit) {
        enemiesRef.current.splice(i, 1);
      } else if (e.position.z > 10) {
        enemiesRef.current.splice(i, 1);
      }
    }

    // --- 4. Render Instances ---
    
    // Update Player Bullets
    if (bulletMeshRef.current) {
       bulletMeshRef.current.count = bulletsRef.current.length;
       bulletsRef.current.forEach((b, i) => {
          tempObj.position.set(b.position.x, b.position.y, b.position.z);
          tempObj.rotation.set(Math.PI/2, 0, 0);
          tempObj.updateMatrix();
          bulletMeshRef.current!.setMatrixAt(i, tempObj.matrix);
       });
       (bulletMeshRef.current.instanceMatrix as any).needsUpdate = true;
    }

    // Update Enemy Bullets
    if (enemyBulletMeshRef.current) {
       enemyBulletMeshRef.current.count = enemyBulletsRef.current.length;
       enemyBulletsRef.current.forEach((b, i) => {
          tempObj.position.set(b.position.x, b.position.y, b.position.z);
          tempObj.rotation.set(0, 0, 0); 
          tempObj.scale.set(1, 1, 1);
          tempObj.updateMatrix();
          enemyBulletMeshRef.current!.setMatrixAt(i, tempObj.matrix);
       });
       (enemyBulletMeshRef.current.instanceMatrix as any).needsUpdate = true;
    }

    // Update Enemies
    if (enemyFighterRef.current && enemyDroneRef.current) {
       let fIdx = 0;
       let dIdx = 0;
       enemiesRef.current.forEach((e) => {
          tempObj.position.set(e.position.x, e.position.y, e.position.z);
          if (e.type === 'fighter') {
             tempObj.rotation.set(0, 0, e.rotationZ);
             tempObj.rotation.z = Math.sin(time * 2) * 0.5;
             tempObj.updateMatrix();
             enemyFighterRef.current!.setMatrixAt(fIdx++, tempObj.matrix);
          } else {
             tempObj.rotation.set(time, time, 0);
             tempObj.updateMatrix();
             enemyDroneRef.current!.setMatrixAt(dIdx++, tempObj.matrix);
          }
       });
       
       enemyFighterRef.current.count = fIdx;
       (enemyFighterRef.current.instanceMatrix as any).needsUpdate = true;
       enemyDroneRef.current.count = dIdx;
       (enemyDroneRef.current.instanceMatrix as any).needsUpdate = true;
    }

  });

  return (
    <>
       {/* Adjusted Camera: Wider FOV and further back */}
       <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
       <CameraShake ref={shakeRef} maxPitch={0.05} maxRoll={0.05} maxYaw={0.05} intensity={0} decay={0.8} decayRate={0.02} />
       
       <color attach="background" args={['#020617']} />
       <Environment preset="city" /> 
       <fog attach="fog" args={['#020617', 10, 90]} />
       
       <Stars radius={100} depth={50} count={2000} factor={6} saturation={0} fade speed={2} />
       <Terrain />
       
       <ambientLight intensity={0.2} />
       <pointLight position={[10, 10, 10]} intensity={1} />
       <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

       <Ship ref={shipRef} position={{x:0,y:0,z:0}} />

       {/* Boss Render (Single instance, not instanced) */}
       <BossShip ref={bossModelRef} position={{x:0, y:100, z:100}} />

       {/* Player Bullets - Blue */}
       <instancedMesh ref={bulletMeshRef} args={[undefined, undefined, MAX_BULLETS]}>
         <capsuleGeometry args={[0.05, 1.5, 4, 8]} />
         <meshBasicMaterial color="#4f46e5" toneMapped={false} />
       </instancedMesh>

       {/* Enemy Bullets - Red Orbs */}
       <instancedMesh ref={enemyBulletMeshRef} args={[undefined, undefined, MAX_BULLETS]}>
         <sphereGeometry args={[0.3, 8, 8]} />
         <meshBasicMaterial color="#ef4444" toneMapped={false} />
       </instancedMesh>

       {/* Enemies */}
       <instancedMesh ref={enemyFighterRef} args={[undefined, undefined, MAX_ENEMIES]}>
         <octahedronGeometry args={[0.7]} />
         <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} emissive="#7f1d1d" emissiveIntensity={0.4} />
       </instancedMesh>

       <instancedMesh ref={enemyDroneRef} args={[undefined, undefined, MAX_ENEMIES]}>
         <dodecahedronGeometry args={[0.5]} />
         <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} emissive="#b45309" emissiveIntensity={0.8} />
       </instancedMesh>

       <EffectComposer enableNormalPass={false}>
         <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />
         <Noise opacity={0.05} />
         <Vignette eskil={false} offset={0.1 as any} darkness={1.1} />
       </EffectComposer>
    </>
  );
};

export const GameWorld: React.FC<GameLogicProps> = (props) => {
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
    >
      <GameScene {...props} />
    </Canvas>
  );
};