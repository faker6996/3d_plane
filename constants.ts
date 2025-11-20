
import { WeaponType, LevelConfig } from './types';

export const PLAYER_SPEED = 0.18;
export const PLAYER_LIMIT_X = 12; 
export const PLAYER_LIMIT_Y = 7;

export const ENEMY_SPEED = 0.25;
export const ENEMY_BULLET_SPEED = 0.4;

export const POWERUP_SPEED = 0.3;
export const POWERUP_DROP_RATE = 0.2; // 20% chance
export const MAX_WEAPON_LEVEL = 5;
export const DAMAGE_MULTIPLIER_PER_LEVEL = 0.5; // +50% damage per level

export const MAX_BULLETS = 200;
export const MAX_ENEMIES = 50;
export const MAX_POWERUPS = 20;

export const WEAPONS = {
  [WeaponType.BLASTER]: { speed: 1.2, cooldown: 0.15, damage: 1 },
  [WeaponType.SPREAD]: { speed: 1.0, cooldown: 0.4, damage: 1 }, 
  [WeaponType.PLASMA]: { speed: 0.8, cooldown: 0.6, damage: 5 }
};

// --- LEVEL DATA ---
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "SECTOR 1: CYBER VOID",
    themeColor: "#3b82f6", // Blue
    fogColor: "#020617",
    gridColor: "#1e293b",
    enemySpeedMultiplier: 1.0,
    spawnRate: 50,
    bossHp: 300,
    bossScoreThreshold: 500,
    sceneryType: 'cubes'
  },
  {
    id: 2,
    name: "SECTOR 2: RED ALERT",
    themeColor: "#ef4444", // Red
    fogColor: "#2a0505",
    gridColor: "#450a0a",
    enemySpeedMultiplier: 1.3,
    spawnRate: 40,
    bossHp: 600,
    bossScoreThreshold: 800, 
    sceneryType: 'asteroids'
  },
  {
    id: 3,
    name: "SECTOR 3: THE ABYSS",
    themeColor: "#a855f7", // Purple
    fogColor: "#180220",
    gridColor: "#3b0764",
    enemySpeedMultiplier: 1.6,
    spawnRate: 30,
    bossHp: 1000,
    bossScoreThreshold: 1200,
    sceneryType: 'alien'
  }
];
