import React, { useState, useEffect } from 'react';
import { GameWorld } from './components/GameWorld';
import { UI } from './components/UI';
import { GameState } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bossHealth, setBossHealth] = useState(0);
  const [maxBossHealth, setMaxBossHealth] = useState(100);
  const [mouseClicked, setMouseClicked] = useState(false);

  const handleStart = () => {
    setScore(0);
    setLives(3);
    setBossHealth(0);
    setGameState(GameState.PLAYING);
  };

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setBossHealth(0);
    setGameState(GameState.PLAYING);
  };

  // Handle shooting input
  useEffect(() => {
    const handleMouseDown = () => setMouseClicked(true);
    const handleMouseUp = () => setMouseClicked(false);
    
    // Also allow spacebar
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') setMouseClicked(true);
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
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden select-none">
      <UI 
        gameState={gameState} 
        score={score} 
        lives={lives} 
        bossHealth={bossHealth}
        maxBossHealth={maxBossHealth}
        onStart={handleStart} 
        onRestart={handleRestart} 
      />
      <GameWorld 
        gameState={gameState}
        setGameState={setGameState}
        setScore={setScore}
        setLives={setLives}
        setBossHealth={setBossHealth}
        setMaxBossHealth={setMaxBossHealth}
        mouseClicked={mouseClicked}
      />
    </div>
  );
}