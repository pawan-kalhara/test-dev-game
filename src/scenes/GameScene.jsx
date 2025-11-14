import React, { useRef, useEffect, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic.jsx';
import PuzzleModal from '../components/PuzzleModal.jsx';
import { getAvatar, getCollectible, getObstacle } from '../config/assetConfig.js';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const PLATFORM_HEIGHT = 20;
const DOOR_WIDTH = 40;
const DOOR_HEIGHT = 60;

export default function GameScene({ difficulty, avatar, onGameEnd, onLogout }) {
  const canvasRef = useRef(null);
  const { gameState, puzzle } = useGameLogic({ difficulty, onGameEnd });
  
  // Image loading state
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef({});

  // Load all images
  useEffect(() => {
    const avatarConfig = getAvatar(avatar);
    const collectibleConfig = getCollectible(gameState.levelData.collectibleType);
    const obstacleConfig = getObstacle(gameState.levelData.obstacleType);

    const images = {
      avatar: new Image(),
      collectible: new Image(),
      obstacle: new Image(),
    };

    let loadedCount = 0;
    const totalImages = 3;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    const onImageError = (type) => {
      console.warn(`Failed to load ${type} image, using fallback`);
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    images.avatar.onload = onImageLoad;
    images.avatar.onerror = () => onImageError('avatar');
    images.avatar.src = avatarConfig.image;

    images.collectible.onload = onImageLoad;
    images.collectible.onerror = () => onImageError('collectible');
    images.collectible.src = collectibleConfig.image;

    images.obstacle.onload = onImageLoad;
    images.obstacle.onerror = () => onImageError('obstacle');
    images.obstacle.src = obstacleConfig.image;

    imagesRef.current = images;
  }, [avatar, gameState.levelData.collectibleType, gameState.levelData.obstacleType]);

  // Draw loop
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const avatarConfig = getAvatar(avatar);
    const collectibleConfig = getCollectible(gameState.levelData.collectibleType);
    const obstacleConfig = getObstacle(gameState.levelData.obstacleType);
    
    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 1. Background
      ctx.fillStyle = gameState.levelData.backgroundColor || '#2d5016';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Ground line
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 400);
      ctx.lineTo(CANVAS_WIDTH, 400);
      ctx.stroke();
      
      // 2. Platforms
      ctx.fillStyle = gameState.levelData.platformColor || '#8B4513';
      gameState.levelData.platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, PLATFORM_HEIGHT);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.width, PLATFORM_HEIGHT);
      });
      
      // 3. Door
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(gameState.levelData.door.x, gameState.levelData.door.y, DOOR_WIDTH, DOOR_HEIGHT);
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(gameState.levelData.door.x, gameState.levelData.door.y, DOOR_WIDTH, DOOR_HEIGHT);
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(gameState.levelData.door.x + 10, gameState.levelData.door.y + 30, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 4. Collectibles (PNG)
      gameState.collectibles.forEach(c => {
        if (imagesRef.current.collectible.complete && imagesRef.current.collectible.naturalWidth > 0) {
          ctx.drawImage(
            imagesRef.current.collectible,
            c.x,
            c.y,
            collectibleConfig.size,
            collectibleConfig.size
          );
        } else {
          // Fallback
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(c.x + collectibleConfig.size/2, c.y + collectibleConfig.size/2, collectibleConfig.size/2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // 5. Obstacles (PNG)
      gameState.obstacles.forEach(o => {
        if (imagesRef.current.obstacle.complete && imagesRef.current.obstacle.naturalWidth > 0) {
          ctx.drawImage(
            imagesRef.current.obstacle,
            o.x,
            o.y,
            obstacleConfig.size,
            obstacleConfig.size
          );
        } else {
          // Fallback
          ctx.fillStyle = '#DC143C';
          ctx.beginPath();
          ctx.arc(o.x + obstacleConfig.size/2, o.y + obstacleConfig.size/2, obstacleConfig.size/2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // 6. Player Avatar (PNG)
      if (imagesRef.current.avatar.complete && imagesRef.current.avatar.naturalWidth > 0) {
        ctx.drawImage(
          imagesRef.current.avatar,
          gameState.player.x,
          gameState.player.y,
          avatarConfig.size,
          avatarConfig.size
        );
      } else {
        // Fallback
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(gameState.player.x, gameState.player.y, avatarConfig.size, avatarConfig.size);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(gameState.player.x, gameState.player.y, avatarConfig.size, avatarConfig.size);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState, avatar, imagesLoaded]);

  if (!imagesLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">Loading game assets...</div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
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
      
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full bg-gray-900 rounded-lg shadow-2xl border-4 border-gray-700"
        tabIndex={-1}
      />

      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-center">
        <p className="text-sm text-gray-300">
          🎮 Arrow Keys to move | Space to jump | Collect items | Avoid obstacles | Enter door!
        </p>
      </div>

      {puzzle.isActive && (
        <PuzzleModal 
          puzzle={puzzle.data} 
          timer={puzzle.timer}
          onSolve={puzzle.handleSubmit} 
        />
      )}

      <button 
        onClick={onLogout} 
        className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 z-20"
      >
        Logout
      </button>
    </div>
  );
}
