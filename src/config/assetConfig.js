/**
 * Asset Configuration
 * 
 * This file centralizes all game assets.
 * To update assets, simply change the filename here.
 * All paths are relative to the public/ folder.
 */

// Avatar Configuration
export const AVATARS = {
  monkey: {
    id: 'monkey',
    name: 'Monkey',
    image: '/assets/avatars/monkey.png',
    size: 40, // width and height in pixels
    description: 'Agile and quick'
  },
  elephant: {
    id: 'elephant',
    name: 'Elephant',
    image: '/assets/avatars/elephant.png',
    size: 40,
    description: 'Strong and sturdy'
  }
  /*lion: {
    id: 'lion',
    name: 'Lion',
    image: '/assets/avatars/lion.png',
    size: 40,
    description: 'Brave and powerful'
  },
  panda: {
    id: 'panda',
    name: 'Panda',
    image: '/assets/avatars/panda.png',
    size: 40,
    description: 'Balanced and calm'
  }*/
};

// Collectibles Configuration
export const COLLECTIBLES = {
  banana: {
    id: 'banana',
    name: 'Banana',
    image: '/assets/items/banana.png',
    size: 20,
    points: 10
  }
  /*coin: {
    id: 'coin',
    name: 'Gold Coin',
    image: '/assets/items/coin.png',
    size: 20,
    points: 15
  },
  gem: {
    id: 'gem',
    name: 'Gem',
    image: '/assets/items/gem.png',
    size: 20,
    points: 25
  }*/
};

// Obstacles Configuration
export const OBSTACLES = {
  bomb: {
    id: 'bomb',
    name: 'Bomb',
    image: '/assets/obstacles/bomb.png',
    size: 20
  }
};

// Environment Assets
export const ENVIRONMENT = {
  door: {
    image: '/assets/environment/door.png',
    width: 40,
    height: 60
  },
  platform: {
    image: '/assets/environment/platform.png',
    height: 20
  },
  background: {
    jungle: '/assets/environment/jungle-bg.png',
    cave: '/assets/environment/cave-bg.png'
  }
};

// Get list of available avatars for selection screen
export const getAvatarList = () => Object.values(AVATARS);

// Get avatar by ID
export const getAvatar = (avatarId) => AVATARS[avatarId] || AVATARS.monkey;

// Get collectible by type
export const getCollectible = (type = 'banana') => COLLECTIBLES[type] || COLLECTIBLES.banana;

// Get obstacle by type
export const getObstacle = (type = 'bomb') => OBSTACLES[type] || OBSTACLES.bomb;
