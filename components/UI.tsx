import React from 'react';
import { GameState } from '../types';
import { Crosshair, Play, RotateCcw, ShieldAlert, Trophy, Skull } from 'lucide-react';

interface UIProps {
  gameState: GameState;
  score: number;
  lives: number;
  bossHealth: number;
  maxBossHealth: number;
  onStart: () => void;
  onRestart: () => void;
}

export const UI: React.FC<UIProps> = ({ gameState, score, lives, bossHealth, maxBossHealth, onStart, onRestart }) => {
  if (gameState === GameState.MENU) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
        <div className="text-6xl font-game font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 mb-8 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] text-center uppercase tracking-widest">
          Không Chiến <br /> 3D
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
        <p className="mt-6 text-blue-200 opacity-70 text-sm">Di chuyển chuột để lái • Nhấp chuột trái để bắn</p>
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

  // HUD
  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        {/* Score */}
        <div className="flex flex-col gap-1">
          <div className="text-blue-400 text-sm font-bold tracking-wider opacity-80">SCORE</div>
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
              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjqzFBhJAAIgxJgpCAIAFW4wIA4j4W7y/16OYAAAAASUVORK5CYII=')] opacity-30" />
            </div>
          </div>
        )}
        
        {/* Lives */}
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
      </div>

      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
         <Crosshair className="w-12 h-12 text-white" />
      </div>

      {/* Bottom Info */}
      <div className="self-end text-right">
        <div className="text-xs text-white/30 font-mono">SYSTEM: ONLINE</div>
        <div className="text-xs text-white/30 font-mono">TARGETING: ACTIVE</div>
      </div>
    </div>
  );
};