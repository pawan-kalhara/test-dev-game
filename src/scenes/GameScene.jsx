import React, { useRef, useEffect, useMemo } from 'react';
import { useGameLogic } from '../hooks/useGameLogic.jsx';
import PuzzleModal from '../components/PuzzleModal.jsx';

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const PLAYER_AVATAR_SIZE = 40;
const ITEM_SIZE = 20;
const BOMB_SIZE = 20;
const PLATFORM_HEIGHT = 20;
const DOOR_WIDTH = 40;
const DOOR_HEIGHT = 60;

export default function GameScene({ difficulty, avatar, onGameEnd, onLogout }) {
  const canvasRef = useRef(null);
  const { gameState, puzzle } = useGameLogic({ difficulty, onGameEnd });
  
  // Memoize image objects to prevent re-loading
  const images = useMemo(() => ({
    player: new Image(PLAYER_AVATAR_SIZE, PLAYER_AVATAR_SIZE),
    background: new Image(),
    platform: new Image(),
    collectible: new Image(),
    obstacle: new Image(),
    door: new Image(),
  }), []);

  // Effect to load image sources
  useEffect(() => {
    images.player.src = `assets/avatars/${avatar}.png`;
    images.background.src = gameState.levelData.background;
    images.platform.src = gameState.levelData.platformImg;
    images.collectible.src = gameState.levelData.collectibleImg;
    images.obstacle.src = gameState.levelData.obstacleImg;
    // Placeholder for door
    images.door.src = 'https://placehold.co/40x60/8B4513/FFF?text=Door'; 
  }, [avatar, gameState.levelData, images]);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 1. Draw Background
      ctx.drawImage(images.background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 2. Draw Platforms
      gameState.levelData.platforms.forEach(p => {
        ctx.drawImage(images.platform, p.x, p.y, p.width, PLATFORM_HEIGHT);
      });
      
      // 3. Draw Door
      ctx.drawImage(images.door, gameState.levelData.door.x, gameState.levelData.door.y, DOOR_WIDTH, DOOR_HEIGHT);
      
      // 4. Draw Collectibles
      gameState.collectibles.forEach(c => {
        ctx.drawImage(images.collectible, c.x, c.y, ITEM_SIZE, ITEM_SIZE);
      });
      
      // 5. Draw Obstacles
      gameState.obstacles.forEach(o => {
        ctx.drawImage(images.obstacle, o.x, o.y, BOMB_SIZE, BOMB_SIZE);
      });
      
      // 6. Draw Player
      ctx.drawImage(images.player, gameState.player.x, gameState.player.y, PLAYER_AVATAR_SIZE, PLAYER_AVATAR_SIZE);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, images]); // Re-draw whenever game state changes

  return (
    <div className="w-full relative">
      {/* Game HUD (Event-Driven UI) */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/50 flex justify-between items-center z-10 rounded-t-lg">
        <div className="text-2xl font-bold text-yellow-400">Score: {gameState.score}</div>
        <div className="text-2xl font-bold text-red-500">Lives: {'❤️'.repeat(gameState.lives)}</div>
      </div>
      
      {/* Game Canvas */}
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full aspect-[16/9] bg-gray-700 rounded-lg shadow-xl"
        tabIndex={-1} // Allow window to capture keys
      />

      {/* Puzzle Modal (Event-Driven UI) */}
      {puzzle.isActive && (
        <PuzzleModal 
          puzzle={puzzle.data} 
          timer={puzzle.timer}
          onSolve={puzzle.handleSubmit} 
        />
      )}

      {/* Logout Button */}
      <button 
        onClick={onLogout} 
        className="absolute bottom-4 right-4 p-2 rounded bg-gray-700 text-white text-sm hover:bg-gray-600 z-10"
      >
        Logout
      </button>
    </div>
  );
}