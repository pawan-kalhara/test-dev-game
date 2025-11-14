import React, { useRef, useEffect } from 'react';
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
  
  // Draw loop with fallback graphics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 1. Draw Background (solid color)
      ctx.fillStyle = gameState.levelData.backgroundColor || '#2d5016';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw ground line
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 400);
      ctx.lineTo(CANVAS_WIDTH, 400);
      ctx.stroke();
      
      // 2. Draw Platforms
      ctx.fillStyle = gameState.levelData.platformColor || '#8B4513';
      gameState.levelData.platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, PLATFORM_HEIGHT);
        // Platform border
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.width, PLATFORM_HEIGHT);
      });
      
      // 3. Draw Door
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(
        gameState.levelData.door.x, 
        gameState.levelData.door.y, 
        DOOR_WIDTH, 
        DOOR_HEIGHT
      );
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        gameState.levelData.door.x, 
        gameState.levelData.door.y, 
        DOOR_WIDTH, 
        DOOR_HEIGHT
      );
      // Door knob
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(
        gameState.levelData.door.x + 10, 
        gameState.levelData.door.y + 30, 
        3, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      // 4. Draw Collectibles (bananas as circles)
      gameState.collectibles.forEach(c => {
        ctx.fillStyle = gameState.levelData.collectibleColor || '#FFD700';
        ctx.beginPath();
        ctx.arc(c.x + ITEM_SIZE/2, c.y + ITEM_SIZE/2, ITEM_SIZE/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw "B" for Banana
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B', c.x + ITEM_SIZE/2, c.y + ITEM_SIZE/2);
      });
      
      // 5. Draw Obstacles (bombs as circles with fuse)
      gameState.obstacles.forEach(o => {
        // Bomb body
        ctx.fillStyle = gameState.levelData.obstacleColor || '#DC143C';
        ctx.beginPath();
        ctx.arc(o.x + BOMB_SIZE/2, o.y + BOMB_SIZE/2, BOMB_SIZE/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Fuse
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(o.x + BOMB_SIZE/2, o.y);
        ctx.lineTo(o.x + BOMB_SIZE/2 - 5, o.y - 8);
        ctx.stroke();
        
        // Spark
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(o.x + BOMB_SIZE/2 - 5, o.y - 8, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // 6. Draw Player (avatar as colored square with face)
      const avatarColors = {
        'monkey': '#8B4513',
        'elephant': '#A9A9A9',
        'lion': '#DAA520',
        'panda': '#000000',
      };
      
      ctx.fillStyle = avatarColors[avatar] || '#4169E1';
      ctx.fillRect(
        gameState.player.x, 
        gameState.player.y, 
        PLAYER_AVATAR_SIZE, 
        PLAYER_AVATAR_SIZE
      );
      
      // Player border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        gameState.player.x, 
        gameState.player.y, 
        PLAYER_AVATAR_SIZE, 
        PLAYER_AVATAR_SIZE
      );
      
      // Simple face
      ctx.fillStyle = '#FFF';
      // Eyes
      ctx.fillRect(gameState.player.x + 10, gameState.player.y + 12, 6, 6);
      ctx.fillRect(gameState.player.x + 24, gameState.player.y + 12, 6, 6);
      // Smile
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gameState.player.x + 20, gameState.player.y + 25, 8, 0, Math.PI);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState, avatar]);

  return (
    <div className="w-full relative">
      {/* Game HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/70 flex justify-between items-center z-10 rounded-t-lg">
        <div className="text-xl font-bold text-yellow-400">
          Level: {gameState.levelData.name}
        </div>
        <div className="text-xl font-bold text-yellow-400">
          Score: {gameState.score}
        </div>
        <div className="text-xl font-bold text-red-500">
          Lives: {'❤️'.repeat(gameState.lives)}
        </div>
      </div>
      
      {/* Game Canvas */}
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full bg-gray-900 rounded-lg shadow-2xl border-4 border-gray-700"
        tabIndex={-1}
      />

      {/* Game Instructions */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-center">
        <p className="text-sm text-gray-300">
          🎮 Use <span className="font-bold text-white">Arrow Keys</span> to move, 
          <span className="font-bold text-white"> Space</span> to jump. 
          Collect all <span className="text-yellow-400 font-bold">bananas</span>, 
          avoid <span className="text-red-500 font-bold">bombs</span>, 
          then enter the <span className="text-yellow-600 font-bold">door</span>!
        </p>
      </div>

      {/* Puzzle Modal */}
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
        className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors z-20 shadow-lg"
      >
        Logout
      </button>
    </div>
  );
}
