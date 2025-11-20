
import React, { useState, useEffect } from 'react';
import { GameWorld } from './components/GameWorld';
import { UI } from './components/UI';
import { GameState, WeaponType } from './types';
import { LEVELS } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bossHealth, setBossHealth] = useState(0);
  const [maxBossHealth, setMaxBossHealth] = useState(100);
  const [mouseClicked, setMouseClicked] = useState(false);
  const [currentWeapon, setCurrentWeapon] = useState<WeaponType>(WeaponType.BLASTER);
  const [weaponLevel, setWeaponLevel] = useState(1); // New State
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); // 0 = Level 1

  const handleStart = () => {
    setScore(0);
    setLives(3);
    setBossHealth(0);
    setCurrentLevelIndex(0); // Reset to Level 1
    setWeaponLevel(1); // Reset weapon level
    setGameState(GameState.PLAYING);
  };

  const handleRestart = () => {
    handleStart();
  };
  
  const handleNextLevel = () => {
     if (currentLevelIndex < LEVELS.length - 1) {
         setCurrentLevelIndex(prev => prev + 1);
         setGameState(GameState.PLAYING);
         setBossHealth(0);
     } else {
         // Game Finished Loop
         handleRestart();
     }
  };

  const togglePause = () => {
    setGameState(prev => {
      if (prev === GameState.PLAYING) return GameState.PAUSED;
      if (prev === GameState.PAUSED) return GameState.PLAYING;
      return prev;
    });
  };

  // Handle Input
  useEffect(() => {
    const handleMouseDown = () => setMouseClicked(true);
    const handleMouseUp = () => setMouseClicked(false);
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') setMouseClicked(true);
        if (e.code === 'Escape') togglePause();
        
        if (gameState === GameState.PLAYING || gameState === GameState.PAUSED) {
          if (e.key === '1') setCurrentWeapon(WeaponType.BLASTER);
          if (e.key === '2') setCurrentWeapon(WeaponType.SPREAD);
          if (e.key === '3') setCurrentWeapon(WeaponType.PLASMA);
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') setMouseClicked(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden select-none">
      <UI 
        gameState={gameState} 
        score={score} 
        lives={lives} 
        bossHealth={bossHealth}
        maxBossHealth={maxBossHealth}
        currentWeapon={currentWeapon}
        weaponLevel={weaponLevel}
        levelConfig={LEVELS[Math.min(currentLevelIndex, LEVELS.length - 1)]}
        onStart={handleStart} 
        onRestart={handleRestart} 
        onResume={togglePause}
        onNextLevel={handleNextLevel}
      />
      <GameWorld 
        gameState={gameState}
        setGameState={setGameState}
        setScore={setScore}
        setLives={setLives}
        setBossHealth={setBossHealth}
        setMaxBossHealth={setMaxBossHealth}
        mouseClicked={mouseClicked}
        currentWeapon={currentWeapon}
        weaponLevel={weaponLevel}
        setWeaponLevel={setWeaponLevel}
        currentLevelIndex={currentLevelIndex}
      />
    </div>
  );
}
