
import React from 'react';
import { GameState, WeaponType, LevelConfig } from '../types';
import { Crosshair, Play, RotateCcw, ShieldAlert, Trophy, Skull, Pause, Zap, Target, Hexagon, ArrowRight } from 'lucide-react';
import { MAX_WEAPON_LEVEL } from '../constants';

interface UIProps {
  gameState: GameState;
  score: number;
  lives: number;
  bossHealth: number;
  maxBossHealth: number;
  currentWeapon: WeaponType;
  weaponLevel: number;
  levelConfig: LevelConfig;
  onStart: () => void;
  onRestart: () => void;
  onResume: () => void;
  onNextLevel: () => void;
}

export const UI: React.FC<UIProps> = ({ 
  gameState, score, lives, bossHealth, maxBossHealth, currentWeapon, weaponLevel, levelConfig,
  onStart, onRestart, onResume, onNextLevel 
}) => {
  
  // --- MENU SCREENS ---

  if (gameState === GameState.MENU) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-white">
        <div className="text-6xl font-game font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 mb-8 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] text-center uppercase tracking-widest">
          Chiến Cơ <br /> Siêu Hạng
        </div>
        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-all duration-300 skew-x-[-12deg] overflow-hidden border-2 border-blue-400"
        >
          <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 origin-left" />
          <span className="flex items-center gap-3 font-game text-xl font-bold skew-x-[12deg]">
            <Play className="w-6 h-6" /> BẮT ĐẦU
          </span>
        </button>
        <div className="mt-8 text-blue-200 opacity-70 text-sm text-center space-y-2">
          <p>Di chuyển chuột để lái • Nhấp chuột trái để bắn</p>
          <p>Phím 1: Blaster • Phím 2: Shotgun • Phím 3: Plasma</p>
          <p>ESC: Tạm dừng</p>
        </div>
      </div>
    );
  }

  if (gameState === GameState.GAME_OVER) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-900/80 backdrop-blur-md text-white animate-in fade-in duration-500">
        <div className="text-6xl font-game font-black text-red-500 mb-4 drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] uppercase tracking-widest">
          THẤT BẠI
        </div>
        <div className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Trophy className="text-yellow-400" />
          Điểm số: {score}
        </div>
        <button
          onClick={onRestart}
          className="group px-8 py-4 bg-white text-red-900 hover:bg-gray-200 transition-all duration-300 font-game font-bold text-xl flex items-center gap-2 rounded shadow-lg shadow-red-900/50"
        >
          <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
          CHƠI LẠI
        </button>
      </div>
    );
  }

  if (gameState === GameState.LEVEL_COMPLETE) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-indigo-900/90 backdrop-blur-md text-white animate-in zoom-in-95 duration-300">
        <div className="text-5xl font-game font-black text-yellow-400 mb-2 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)] uppercase tracking-widest">
          LEVEL COMPLETED
        </div>
        <div className="text-2xl font-bold text-blue-200 mb-8">
          {levelConfig.name} CLEARED
        </div>
        
        <div className="flex flex-col gap-4 items-center">
           <div className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="text-yellow-400 w-8 h-8" />
            {score} PTS
          </div>
          <div className="w-64 h-px bg-white/20 my-2"></div>
          <button
            onClick={onNextLevel}
            className="px-10 py-4 bg-green-600 hover:bg-green-500 rounded-sm font-game font-bold text-xl flex items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105"
          >
            TIẾP TỤC <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (gameState === GameState.PAUSED) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
        <div className="text-5xl font-game font-bold text-white mb-8 tracking-widest">TẠM DỪNG</div>
        <button
          onClick={onResume}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded font-game font-bold text-lg flex items-center gap-2 transition-colors"
        >
          <Play className="w-5 h-5" /> TIẾP TỤC
        </button>
      </div>
    );
  }

  // --- HUD (Head-up Display) ---
  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        {/* Score & Level */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-3 py-1 rounded text-xs font-bold text-blue-300 border border-blue-500/30">
               {levelConfig.name}
            </div>
          </div>
          <div className="text-blue-400 text-sm font-bold tracking-wider opacity-80 mt-1">SCORE</div>
          <div className="text-4xl font-game font-bold text-white drop-shadow-md tabular-nums">
            {score.toString().padStart(6, '0')}
          </div>
        </div>
        
        {/* Boss HP Bar */}
        {bossHealth > 0 && (
          <div className="flex-1 max-w-md mx-8 flex flex-col items-center animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="text-red-500 font-game font-bold text-lg tracking-widest flex items-center gap-2 mb-1 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
              <Skull className="w-5 h-5" /> WARNING: BOSS DETECTED <Skull className="w-5 h-5" />
            </div>
            <div className="w-full h-4 bg-gray-900 border border-red-900 skew-x-[-20deg] overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-200"
                style={{ width: `${(bossHealth / maxBossHealth) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Lives & Pause Button */}
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-2 skew-x-[-20deg] transition-colors duration-300 ${i < lives ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-gray-800'}`}
                    />
                  ))}
              </div>
              <ShieldAlert className={`${lives < 2 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
           </div>
           <div className="text-[10px] text-white/50 font-mono mt-1">PRESS ESC TO PAUSE</div>
        </div>
      </div>

      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
         <Crosshair className="w-12 h-12 text-white" />
      </div>

      {/* Bottom - Weapons HUD */}
      <div className="self-center mt-auto mb-4 flex flex-col items-center gap-2">
         {/* Power Level Bar */}
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400 tracking-wider">POWER LVL</span>
            <div className="flex gap-0.5">
               {[...Array(MAX_WEAPON_LEVEL)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-1.5 ${i < weaponLevel ? 'bg-cyan-400 shadow-[0_0_5px_cyan]' : 'bg-gray-800'}`}
                  />
               ))}
            </div>
         </div>

         <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentWeapon === WeaponType.BLASTER ? 'text-blue-400 scale-110' : 'text-gray-500 scale-90'}`}>
               <Zap className="w-6 h-6" />
               <span className="text-[10px] font-bold">1. BLASTER</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentWeapon === WeaponType.SPREAD ? 'text-yellow-400 scale-110' : 'text-gray-500 scale-90'}`}>
               <Target className="w-6 h-6" />
               <span className="text-[10px] font-bold">2. SPREAD</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentWeapon === WeaponType.PLASMA ? 'text-green-400 scale-110' : 'text-gray-500 scale-90'}`}>
               <Hexagon className="w-6 h-6" />
               <span className="text-[10px] font-bold">3. PLASMA</span>
            </div>
         </div>
      </div>
    </div>
  );
};
