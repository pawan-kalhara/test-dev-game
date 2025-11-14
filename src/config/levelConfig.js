/*
  This is your main config file for levels.
  To add a new level, just copy LEVEL_1 and create a LEVEL_2.
  The game logic will automatically pick it up.

  Coordinates:
  - (0, 0) is the Top-Left corner of the canvas.
  - Canvas size is 800 (width) x 450 (height).
  - 'y' is distance from the top. A bigger 'y' is lower down.
  - The "ground" is at y = 400.
*/
export const LEVELS = {
  1: {
    name: "Jungle Jam",
    // This is the background image you'll add to public/assets/environment
    background: 'assets/environment/jungle-bg.png', 
    playerStart: { x: 50, y: 350 },
    door: { x: 750, y: 340 }, // 'y' is top of the door
    
    // This is the image you'll add for platforms
    platformImg: 'assets/environment/platform.png',
    platforms: [
      { x: 350, y: 300, width: 100 },
      { x: 500, y: 250, width: 100 },
    ],

    // This is the image you'll add for bananas
    collectibleImg: 'https://placehold.co/20x20/FFFF00/000000?text=B', // Placeholder
    collectibles: [
      { id: 'b1', x: 200, y: 360, points: 10 },
      { id: 'b2', x: 375, y: 260, points: 10 }, // On platform 1
      { id: 'b3', x: 525, y: 210, points: 10 }, // On platform 2
    ],

    // This is the image you'll add for bombs
    obstacleImg: 'assets/environment/bomb.png',
    obstacles: [
      { id: 'o1', x: 300, y: 360 },
      { id: 'o2', x: 515, y: 360 },
    ],
  },
  
  // TO ADD A NEW LEVEL:
  // 2: {
  //   name: "Cave Crisis",
  //   background: 'assets/environment/cave-bg.png', 
  //   playerStart: { x: 50, y: 350 },
  //   door: { x: 750, y: 340 },
  //   platformImg: 'assets/environment/rock-platform.png',
  //   platforms: [ ... new platform coordinates ... ],
  //   collectibleImg: '.../gem.png',
  //   collectibles: [ ... new collectible coordinates ... ],
  //   obstacleImg: 'assets/environment/spike.png',
  //   obstacles: [ ... new obstacle coordinates ... ],
  // }
};