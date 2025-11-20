
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE'
}

export enum WeaponType {
  BLASTER = 'BLASTER', 
  SPREAD = 'SPREAD',   
  PLASMA = 'PLASMA'    
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Entity {
  id: string;
  position: Vector3;
  velocity: Vector3;
  active: boolean;
}

export interface Enemy extends Entity {
  type: 'fighter' | 'drone';
  health: number;
  rotationZ: number;
}

export interface Boss extends Entity {
  maxHealth: number;
  health: number;
  state: 'entering' | 'fighting' | 'dying';
  attackCooldown: number;
}

export interface Bullet extends Entity {
  owner: 'player' | 'enemy';
  damage?: number;
  bulletType?: WeaponType;
}

export interface LevelConfig {
  id: number;
  name: string;
  themeColor: string; // Main color for UI/Lights
  fogColor: string;
  gridColor: string;
  enemySpeedMultiplier: number;
  spawnRate: number; // Lower is faster
  bossHp: number;
  bossScoreThreshold: number;
  sceneryType: 'cubes' | 'asteroids' | 'alien';
}
