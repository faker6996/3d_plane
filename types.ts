export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
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
}

export interface Explosion {
  id: string;
  position: Vector3;
  scale: number;
  life: number; // 0 to 1
}