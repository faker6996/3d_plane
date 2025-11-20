
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, PerspectiveCamera, Environment, CameraShake 
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { GameState, Enemy, Bullet, Boss, Vector3, WeaponType, Entity } from '../types';
import { 
  PLAYER_SPEED, PLAYER_LIMIT_X, PLAYER_LIMIT_Y, 
  ENEMY_SPEED,
  ENEMY_BULLET_SPEED, 
  MAX_BULLETS, MAX_ENEMIES, WEAPONS, LEVELS 
} from '../constants';
import { PlayerShip } from './PlayerShip';
import { BossShip } from './BossShip';
import { Terrain } from './Terrain';
import { Scenery } from './Scenery';

// --- Utilities ---
const tempObj = new THREE.Object3D();

// --- Logic Manager ---

interface GameLogicProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setBossHealth: React.Dispatch<React.SetStateAction<number>>;
  setMaxBossHealth: React.Dispatch<React.SetStateAction<number>>;
  mouseClicked: boolean;
  currentWeapon: WeaponType;
  currentLevelIndex: number;
}

const GameScene: React.FC<GameLogicProps> = ({ 
  gameState, setGameState, setScore, setLives, setBossHealth, setMaxBossHealth, mouseClicked, currentWeapon, currentLevelIndex
}) => {
  const { viewport } = useThree();
  
  // Get Current Level Config
  // Ensure level index is within bounds
  const safeLevelIndex = Math.min(currentLevelIndex, LEVELS.length - 1);
  const levelConfig = LEVELS[safeLevelIndex];

  // Game State Refs
  const playerPos = useRef<Vector3>({ x: 0, y: -2, z: 0 });
  
  const blasterBulletsRef = useRef<Bullet[]>([]);
  const spreadBulletsRef = useRef<Bullet[]>([]);
  const plasmaBulletsRef = useRef<Bullet[]>([]);
  
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const currentScore = useRef(0);
  
  // Rendering Refs
  const blasterMeshRef = useRef<THREE.InstancedMesh>(null);
  const spreadMeshRef = useRef<THREE.InstancedMesh>(null);
  const plasmaMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const enemyBulletMeshRef = useRef<THREE.InstancedMesh>(null);
  const enemyFighterRef = useRef<THREE.InstancedMesh>(null);
  const enemyDroneRef = useRef<THREE.InstancedMesh>(null);
  const shipRef = useRef<THREE.Group>(null);
  const bossModelRef = useRef<THREE.Group>(null);
  const shakeRef = useRef<any>(null);

  const lastShotTime = useRef(0);
  const frameCount = useRef(0);

  // Reset Logic
  useEffect(() => {
    // Reset when starting ANY level fresh
    if (gameState === GameState.PLAYING) {
      // We check if boss is null to assume it's a fresh start of a level
      if (!bossRef.current) {
          blasterBulletsRef.current = [];
          spreadBulletsRef.current = [];
          plasmaBulletsRef.current = [];
          enemyBulletsRef.current = [];
          enemiesRef.current = [];
          // Player position reset
          playerPos.current = { x: 0, y: -2, z: 0 };
      }
    }
    if (gameState === GameState.MENU) {
        currentScore.current = 0;
    }
  }, [gameState, currentLevelIndex]);

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

    // --- 2. Spawning & Shooting ---
    const weaponConfig = WEAPONS[currentWeapon];

    if (mouseClicked && time - lastShotTime.current > weaponConfig.cooldown) {
       lastShotTime.current = time;
       if (currentWeapon === WeaponType.BLASTER) {
          blasterBulletsRef.current.push({
            id: Math.random().toString(),
            position: { x: playerPos.current.x, y: playerPos.current.y, z: playerPos.current.z - 1 },
            velocity: { x: 0, y: 0, z: -weaponConfig.speed },
            active: true,
            owner: 'player',
            damage: weaponConfig.damage
          });
          if (shakeRef.current) shakeRef.current.setIntensity(0.1);
       } else if (currentWeapon === WeaponType.SPREAD) {
          [-0.3, 0, 0.3].forEach((angle) => {
             spreadBulletsRef.current.push({
                id: Math.random().toString(),
                position: { x: playerPos.current.x, y: playerPos.current.y, z: playerPos.current.z - 1 },
                velocity: { x: angle, y: 0, z: -weaponConfig.speed },
                active: true,
                owner: 'player',
                damage: weaponConfig.damage
             });
          });
          if (shakeRef.current) shakeRef.current.setIntensity(0.2);
       } else if (currentWeapon === WeaponType.PLASMA) {
          plasmaBulletsRef.current.push({
             id: Math.random().toString(),
             position: { x: playerPos.current.x, y: playerPos.current.y, z: playerPos.current.z - 2 },
             velocity: { x: 0, y: 0, z: -weaponConfig.speed },
             active: true,
             owner: 'player',
             damage: weaponConfig.damage
          });
          if (shakeRef.current) shakeRef.current.setIntensity(0.4);
       }
    }

    // Boss Spawning Logic (Based on Level Config)
    if (currentScore.current >= levelConfig.bossScoreThreshold && !bossRef.current) {
      bossRef.current = {
        id: 'BOSS',
        position: { x: 0, y: 2, z: -80 }, 
        velocity: { x: 0, y: 0, z: 0 },
        active: true,
        maxHealth: levelConfig.bossHp,
        health: levelConfig.bossHp,
        state: 'entering',
        attackCooldown: 0
      };
      setMaxBossHealth(levelConfig.bossHp);
      setBossHealth(levelConfig.bossHp);
      enemiesRef.current = []; 
    }

    // Enemy Spawning (Based on Level Config)
    if (!bossRef.current && frameCount.current % levelConfig.spawnRate === 0 && enemiesRef.current.length < MAX_ENEMIES) {
       const isFighter = Math.random() > 0.5;
       const startX = (Math.random() - 0.5) * viewport.width * 1.2;
       enemiesRef.current.push({
         id: Math.random().toString(),
         position: { x: startX, y: (Math.random() - 0.5) * viewport.height, z: -50 },
         velocity: { x: 0, y: 0, z: ENEMY_SPEED * levelConfig.enemySpeedMultiplier * (isFighter ? 1.5 : 1) },
         active: true,
         type: isFighter ? 'fighter' : 'drone',
         health: isFighter ? 2 : 1,
         rotationZ: 0
       });
    }

    // --- 3. Logic Updates ---
    
    const updateBullets = (bullets: Bullet[]) => {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.position.z += b.velocity.z;
            b.position.x += b.velocity.x;
            if (b.position.z < -100) bullets.splice(i, 1);
        }
    };
    updateBullets(blasterBulletsRef.current);
    updateBullets(spreadBulletsRef.current);
    updateBullets(plasmaBulletsRef.current);

    for (let i = enemyBulletsRef.current.length - 1; i >= 0; i--) {
       const eb = enemyBulletsRef.current[i];
       eb.position.z += eb.velocity.z;
       eb.position.x += eb.velocity.x;
       eb.position.y += eb.velocity.y;

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

    // Boss Interaction
    if (bossModelRef.current) {
       if (!bossRef.current) {
         bossModelRef.current.visible = false;
       } else {
         bossModelRef.current.visible = true;
         const boss = bossRef.current;
         
         if (boss.state === 'entering') {
            boss.position.z += 0.3;
            if (boss.position.z >= -35) boss.state = 'fighting';
         } else if (boss.state === 'fighting') {
            boss.position.x = Math.sin(time * 0.5) * 12;
            boss.position.y = Math.cos(time * 0.7) * 3;
            
            boss.attackCooldown -= delta;
            if (boss.attackCooldown <= 0) {
               const startPos = { ...boss.position };
               const dirs = [-0.3, -0.1, 0.1, 0.3];
               // Harder levels shoot more/faster
               if (currentLevelIndex >= 1) dirs.push(-0.4, 0.4); 

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
               boss.attackCooldown = Math.max(0.5, 1.2 - (currentLevelIndex * 0.2)); 
            }
         }

         bossModelRef.current.position.set(boss.position.x, boss.position.y, boss.position.z);
         bossModelRef.current.rotation.z = Math.sin(time) * 0.1;
         bossModelRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;

         const checkBossHit = (bullets: Bullet[]) => {
            for (let j = bullets.length - 1; j >= 0; j--) {
                const b = bullets[j];
                if (Math.abs(b.position.x - boss.position.x) < 5 && 
                    Math.abs(b.position.y - boss.position.y) < 3 && 
                    Math.abs(b.position.z - boss.position.z) < 3) {
                    
                    boss.health -= (b.damage || 1);
                    setBossHealth(boss.health);
                    bullets.splice(j, 1);
                    
                    if (boss.health <= 0) {
                        // LEVEL COMPLETE!
                        currentScore.current += 1000;
                        setScore(s => s + 1000);
                        bossRef.current = null;
                        setBossHealth(0);
                        setGameState(GameState.LEVEL_COMPLETE);
                        break;
                    }
                }
            }
         };

         checkBossHit(blasterBulletsRef.current);
         checkBossHit(spreadBulletsRef.current);
         checkBossHit(plasmaBulletsRef.current);
      }
    }

    // Enemies Interaction
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
      const checkEnemyHit = (bullets: Bullet[]) => {
          if (hit) return;
          for (let j = bullets.length - 1; j >= 0; j--) {
             const b = bullets[j];
             const dist = Math.hypot(b.position.x - e.position.x, b.position.y - e.position.y, b.position.z - e.position.z);
             if (dist < 1.5) {
                e.health -= (b.damage || 1);
                bullets.splice(j, 1);
                if (e.health <= 0) {
                   currentScore.current += (e.type === 'fighter' ? 150 : 50);
                   setScore(currentScore.current);
                   hit = true;
                }
                break; 
             }
          }
      };

      checkEnemyHit(blasterBulletsRef.current);
      checkEnemyHit(spreadBulletsRef.current);
      checkEnemyHit(plasmaBulletsRef.current);
      
      if (hit) {
        enemiesRef.current.splice(i, 1);
      } else if (e.position.z > 10) {
        enemiesRef.current.splice(i, 1);
      }
    }

    // --- 4. Render Instances ---
    const updateMesh = (mesh: THREE.InstancedMesh | null, bullets: Entity[], scale: number = 1, rotateTime: boolean = false) => {
        if (!mesh) return;
        mesh.count = bullets.length;
        bullets.forEach((b, i) => {
            tempObj.position.set(b.position.x, b.position.y, b.position.z);
            if (rotateTime) {
                tempObj.rotation.set(time*2, time*2, 0);
            } else {
                tempObj.rotation.set((b as Bullet).velocity?.z < 0 ? Math.PI/2 : 0, 0, 0);
            }
            tempObj.scale.set(scale, scale, scale);
            tempObj.updateMatrix();
            mesh.setMatrixAt(i, tempObj.matrix);
        });
        (mesh.instanceMatrix as any).needsUpdate = true;
    };

    updateMesh(blasterMeshRef.current, blasterBulletsRef.current);
    updateMesh(spreadMeshRef.current, spreadBulletsRef.current);
    updateMesh(plasmaMeshRef.current, plasmaBulletsRef.current, 1, true);
    updateMesh(enemyBulletMeshRef.current, enemyBulletsRef.current);

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
       <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
       <CameraShake ref={shakeRef} maxPitch={0.05} maxRoll={0.05} maxYaw={0.05} intensity={0} decay={0.8} decayRate={0.02} />
       
       <color attach="background" args={[levelConfig.fogColor]} />
       <Environment preset="city" /> 
       <fog attach="fog" args={[levelConfig.fogColor, 10, 90]} />
       
       <Stars radius={100} depth={50} count={2000} factor={6} saturation={0} fade speed={2} />
       
       {/* Level Specific Scenery */}
       <Scenery type={levelConfig.sceneryType} color={levelConfig.themeColor} />
       <Terrain paused={gameState !== GameState.PLAYING} gridColor={levelConfig.gridColor} />
       
       <ambientLight intensity={0.2} />
       <pointLight position={[10, 10, 10]} intensity={1} color={levelConfig.themeColor} />
       <pointLight position={[-10, -10, -10]} intensity={0.5} color="white" />

       <PlayerShip ref={shipRef} position={{x:0,y:0,z:0}} />

       <BossShip ref={bossModelRef} position={{x:0, y:100, z:100}} level={levelConfig.id} />

       {/* Bullets & Enemies Rendering */}
       <instancedMesh ref={blasterMeshRef} args={[undefined, undefined, MAX_BULLETS]}>
         <capsuleGeometry args={[0.05, 1.5, 4, 8]} />
         <meshBasicMaterial color="#4f46e5" toneMapped={false} />
       </instancedMesh>

       <instancedMesh ref={spreadMeshRef} args={[undefined, undefined, MAX_BULLETS]}>
         <sphereGeometry args={[0.2, 8, 8]} />
         <meshBasicMaterial color="#fbbf24" toneMapped={false} />
       </instancedMesh>

       <instancedMesh ref={plasmaMeshRef} args={[undefined, undefined, 20]}>
         <icosahedronGeometry args={[0.8, 1]} />
         <meshBasicMaterial color="#22c55e" toneMapped={false} />
       </instancedMesh>

       <instancedMesh ref={enemyBulletMeshRef} args={[undefined, undefined, MAX_BULLETS]}>
         <sphereGeometry args={[0.3, 8, 8]} />
         <meshBasicMaterial color={levelConfig.themeColor} toneMapped={false} />
       </instancedMesh>

       <instancedMesh ref={enemyFighterRef} args={[undefined, undefined, MAX_ENEMIES]}>
         <octahedronGeometry args={[0.7]} />
         <meshStandardMaterial color={levelConfig.themeColor} roughness={0.2} metalness={0.8} emissive="#000" emissiveIntensity={0.4} />
       </instancedMesh>

       <instancedMesh ref={enemyDroneRef} args={[undefined, undefined, MAX_ENEMIES]}>
         <dodecahedronGeometry args={[0.5]} />
         <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} emissive="#b45309" emissiveIntensity={0.8} />
       </instancedMesh>

       <EffectComposer enableNormalPass={false}>
         <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
         <Noise opacity={0.05 as any} />
         <Vignette eskil={false} offset={0.1 as any} darkness={1.1} />
       </EffectComposer>
    </>
  );
};

export const GameWorld: React.FC<GameLogicProps> = (props) => {
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
       <GameScene {...props} />
    </Canvas>
  );
};
