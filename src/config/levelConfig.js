/*
  Level Configuration
  - Canvas size: 800 (width) x 450 (height)
  - Ground level: y = 400
  - Coordinate (0,0) is top-left
*/

export const LEVELS = {
  1: {
    name: "Jungle Jam",
    // Using solid color backgrounds as fallback
    background: '/assets/backgrounds/background-jungle.png',
    backgroundColor: '#2d5016', // Dark green jungle color
    playerStart: { x: 50, y: 350 },
    door: { x: 740, y: 340 },
    
    platformImg: null,
    platformColor: '#8B4513', // Brown platform color
    platforms: [
      { x: 200, y: 300, width: 120 },
      { x: 400, y: 250, width: 120 },
      { x: 600, y: 200, width: 120 },
    ],

    collectibleImg: null,
    collectibleColor: '#FFD700', // Gold banana color
    collectibles: [
      { id: 'b1', x: 150, y: 360, points: 10 },
      { id: 'b2', x: 240, y: 270, points: 10 },
      { id: 'b3', x: 440, y: 220, points: 10 },
      { id: 'b4', x: 640, y: 170, points: 10 },
    ],

    obstacleImg: null,
    obstacleColor: '#DC143C', // Red bomb color
    obstacles: [
      { id: 'o1', x: 300, y: 380 },
      { id: 'o2', x: 500, y: 380 },
    ],
  },
  
  2: {
    name: "Cave Crisis",
    background: '/assets/backgrounds/background-jungle.png',
    backgroundColor: '#1a1a2e',
    playerStart: { x: 50, y: 350 },
    door: { x: 740, y: 340 },
    
    platformImg: null,
    platformColor: '#4a4a4a',
    platforms: [
      { x: 150, y: 320, width: 100 },
      { x: 300, y: 280, width: 100 },
      { x: 450, y: 240, width: 100 },
      { x: 600, y: 200, width: 100 },
    ],

    collectibleImg: null,
    collectibleColor: '#00CED1',
    collectibles: [
      { id: 'b1', x: 180, y: 290, points: 15 },
      { id: 'b2', x: 330, y: 250, points: 15 },
      { id: 'b3', x: 480, y: 210, points: 15 },
      { id: 'b4', x: 630, y: 170, points: 15 },
    ],

    obstacleImg: null,
    obstacleColor: '#8B0000',
    obstacles: [
      { id: 'o1', x: 250, y: 380 },
      { id: 'o2', x: 400, y: 380 },
      { id: 'o3', x: 550, y: 380 },
    ],
  },
};
