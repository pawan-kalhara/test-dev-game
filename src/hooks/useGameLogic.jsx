import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBananaPuzzle } from '../services/bananaApi.js';
import { LEVELS } from '../config/levelConfig.js';
import soundManager from '../services/soundManager.js';


const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const GROUND_Y = 400;
const GRAVITY = 0.5;
const JUMP_POWER = -12;
const PLAYER_SPEED = 5;


const ITEM_SIZE = 20;
const BOMB_SIZE = 20;
const PLATFORM_HEIGHT = 20;
const DOOR_WIDTH = 40;
const DOOR_HEIGHT = 60;


export const useGameLogic = ({ difficulty, onGameEnd }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelData, setLevelData] = useState(LEVELS[currentLevel]);
  
  const [player, setPlayer] = useState({ 
    ...levelData.playerStart, 
    width: PLAYER_WIDTH, 
    height: PLAYER_HEIGHT, 
    dx: 0, 
    dy: 0, 
    onGround: true 
  });
  
  const [collectibles, setCollectibles] = useState(levelData.collectibles);
  const [obstacles, setObstacles] = useState(levelData.obstacles);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(true);


  const [puzzle, setPuzzle] = useState({
    isActive: false,
    data: null,
    timer: 0,
    timerId: null,
  });


  const inputKeysRef = useRef(new Set());

   const soundInitializedRef = useRef(false);

  
  useEffect(() => {
    if (!soundInitializedRef.current) {
      soundManager.initializeSounds();
      soundInitializedRef.current = true;
    }
  }, []);

  
  const loadLevel = (levelNumber) => {
    const nextLevelData = LEVELS[levelNumber];
    if (!nextLevelData) {
      
      soundManager.playSound('gameOver');
      setGameActive(false);
      onGameEnd(score);
      return;
    }

    soundManager.playSound('levelComplete');
    
    setCurrentLevel(levelNumber);
    setLevelData(nextLevelData);
    setPlayer({ 
      ...nextLevelData.playerStart, 
      width: PLAYER_WIDTH, 
      height: PLAYER_HEIGHT, 
      dx: 0, 
      dy: 0, 
      onGround: true 
    });
    setCollectibles(nextLevelData.collectibles);
    setObstacles(nextLevelData.obstacles);
    setGameActive(true);
  };

  // Puzzle API
  const triggerPuzzle = useCallback(() => {
    if (puzzle.isActive) return; 
    
    setGameActive(false); 
    
    fetchBananaPuzzle().then(data => {
      const puzzleTime = difficulty === 'easy' ? 30 : 10;
      setPuzzle(prev => ({ ...prev, isActive: true, data: data, timer: puzzleTime }));
      
      const timerId = setInterval(() => {
        setPuzzle(p => {
          if (p.timer <= 1) {
            clearInterval(timerId);
            handlePuzzleSubmit(false, 0); // Time's up
            return { ...p, timer: 0, isActive: false };
          }
          return { ...p, timer: p.timer - 1 };
        });
      }, 1000);
      setPuzzle(p => ({ ...p, timerId: timerId }));
    });
  }, [difficulty, puzzle.isActive]);

const handlePuzzleSubmit = (isCorrect, answer) => {
  clearInterval(puzzle.timerId);
  
  if (isCorrect && parseInt(answer) === puzzle.data.solution) {
    setScore(s => s + 50); 
    soundManager.playSound('levelComplete');
    loadLevel(currentLevel + 1); 
    setPuzzle({ isActive: false, data: null, timer: 0, timerId: null });
  } else {
    
    soundManager.playSound('bomb');
    const newLives = lives - 1;
    setLives(newLives);
    
    if (newLives <= 0) {
      soundManager.playSound('gameOver');
      setGameActive(false);
      onGameEnd(score);
      setPuzzle({ isActive: false, data: null, timer: 0, timerId: null });
    } else {
      
      setGameActive(true);
      setPuzzle({ isActive: false, data: null, timer: 0, timerId: null });
    }
  }
};
  

  //Collision Detection 
  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };


// Game Loop 
const gameTick = useCallback(() => {
  if (!gameActive) return;


  setPlayer(prevPlayer => {
    let { x, y, dx, dy, onGround } = { ...prevPlayer };

    
    const keys = inputKeysRef.current;
    dx = 0;
    if (keys.has('ArrowRight')) dx = PLAYER_SPEED;
    if (keys.has('ArrowLeft')) dx = -PLAYER_SPEED;
    if (keys.has('Space') && onGround) {
      dy = JUMP_POWER;
      onGround = false;
    }
    
    // game physics
    dy += GRAVITY;
    x += dx;
    y += dy;
    
    if (x < 0) x = 0;
    if (x + PLAYER_WIDTH > CANVAS_WIDTH) x = CANVAS_WIDTH - PLAYER_WIDTH;
    
    onGround = false;
    if (y + PLAYER_HEIGHT > GROUND_Y) {
      y = GROUND_Y - PLAYER_HEIGHT;
      dy = 0;
      onGround = true;
    }
    
    levelData.platforms.forEach(platform => {
      const platRect = { ...platform, height: PLATFORM_HEIGHT };
      if (prevPlayer.y + prevPlayer.height <= platform.y && 
          checkCollision({ ...prevPlayer, x, y }, platRect)) 
      {
        y = platform.y - PLAYER_HEIGHT;
        dy = 0;
        onGround = true;
      }
    });
    
    return { ...prevPlayer, x, y, dx, dy, onGround };
  });


  // --- 3. Collision System ---
  
  // Collectibles
  setCollectibles(prevItems => prevItems.filter(item => {
    const itemRect = { ...item, width: ITEM_SIZE, height: ITEM_SIZE };
    if (checkCollision(player, itemRect)) {
      setTimeout(() => {
            soundManager.playSound('coin');
          }, 0);
      setScore(s => s + item.points);
      return false;
    }
    return true;
  }));
  
  // bombs (with floating animation)
  setObstacles(prevObstacles => {
    const time = Date.now() / 1000;
    
    return prevObstacles.map(obstacle => {
      
      let obstacleY = obstacle.y;
      
      if (obstacle.floating) {
        const floatingOffset = Math.sin(time * 2) * 30;
        obstacleY = levelData.obstacles.find(o => o.id === obstacle.id).y + floatingOffset;
      }
      
      
      const itemRect = { ...obstacle, y: obstacleY, width: BOMB_SIZE, height: BOMB_SIZE };
      if (checkCollision(player, itemRect)) {
        soundManager.playSound('bomb');
        setLives(l => l - 1);
        if (lives - 1 <= 0) {
          soundManager.playSound('gameOver');
          setGameActive(false);
          onGameEnd(score);
        }
        return null; 
      }
      
      
      return { ...obstacle, y: obstacleY };
    }).filter(o => o !== null); 
  });

  
  const doorRect = { ...levelData.door, width: DOOR_WIDTH, height: DOOR_HEIGHT };
  if (checkCollision(player, doorRect)) {
    triggerPuzzle();
  }


}, [gameActive, player, lives, levelData, onGameEnd, score, triggerPuzzle]);


  // Input Event Listeners 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      inputKeysRef.current.add(e.code);
    };
    const handleKeyUp = (e) => {
      inputKeysRef.current.delete(e.code);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start game loop timer (60 Frames per second)
    const gameLoop = setInterval(gameTick, 1000 / 60); 


    return () => {
      // Cleanup
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
      if (puzzle.timerId) clearInterval(puzzle.timerId);
    };
  }, [gameTick, puzzle.timerId]);

  // Return all the state the GameScene needs to render
  return { 
    gameState: {
      player,
      collectibles,
      obstacles,
      levelData,
      score,
      lives,
      gameActive
    }, 
    puzzle: { 
      isActive: puzzle.isActive, 
      data: puzzle.data, 
      timer: puzzle.timer,
      handleSubmit: handlePuzzleSubmit
    } 
  };
};