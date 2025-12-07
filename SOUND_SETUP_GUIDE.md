# Sound Effects Setup Guide

This guide explains how to add and manage sound effects in your monkey game.

## Overview

The game uses a **Sound Manager** service that handles all audio playback. It provides:
- Centralized sound management
- Volume control
- Mute functionality
- Easy-to-use sound effects API

## File Structure

```
test-dev-game/
├── public/
│   └── sounds/                    # Your audio files go here
│       ├── coin-collect.mp3
│       ├── bomb-hit.mp3
│       ├── level-complete.mp3
│       ├── game-over.mp3
│       ├── jump.mp3
│       ├── menu-select.mp3
│       └── button-click.mp3
├── src/
│   ├── services/
│   │   └── soundManager.js        # Sound manager service
│   ├── hooks/
│   │   └── useGameLogic.jsx       # Updated with sound integration
│   └── ...
```

## Setup Steps

### Step 1: Create Sounds Directory

1. In your project root, navigate to the `public` folder
2. Create a new folder called `sounds`

```bash
mkdir public/sounds
```

### Step 2: Add Your Audio Files

Download or create audio files and place them in `public/sounds/`:

- **coin-collect.mp3** - Cheerful chime when collecting coins (required)
- **bomb-hit.mp3** - Explosion or impact sound when hit by obstacles (required)
- **level-complete.mp3** - Victory/success sound for next level (required)
- **game-over.mp3** - Sad/defeat sound at game end (required)
- **jump.mp3** - (Optional) Short sound for jump action
- **menu-select.mp3** - (Optional) Menu navigation sound
- **button-click.mp3** - (Optional) Button click sound

**Audio Format Recommendations:**
- Format: MP3 (best browser compatibility)
- Duration: 0.5-2 seconds (shorter is better for game effects)
- Sample Rate: 44100 Hz
- Bit Rate: 128 kbps or higher

**Where to get free sounds:**
- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [Pixabay Sounds](https://pixabay.com/sound-effects/)
- [OpenGameArt](https://opengameart.org/)

### Step 3: Verify Integration

The sound manager is already integrated into `useGameLogic.jsx`:

```javascript
// Sounds are automatically triggered when:
// - Collecting coins: soundManager.playSound('coin')
// - Hitting obstacles: soundManager.playSound('bomb')
// - Completing level: soundManager.playSound('levelComplete')
// - Game over: soundManager.playSound('gameOver')
```

## Usage Examples

### In Game Components

```javascript
import soundManager from '../services/soundManager.js';

// Initialize sounds (done automatically in useGameLogic)
soundManager.initializeSounds();

// Play a sound
soundManager.playSound('coin');

// Stop a specific sound
soundManager.stopSound('coin');

// Stop all sounds
soundManager.stopAllSounds();
```

### Volume Control

```javascript
// Set overall volume (0 to 1)
soundManager.setMasterVolume(0.8);

// Set sound effects volume
soundManager.setSoundEffectsVolume(0.7);

// Get current volume
const volume = soundManager.getMasterVolume();
```

### Mute Control

```javascript
// Toggle mute on/off
const isMuted = soundManager.toggleMute();

// Check mute status
if (soundManager.isSoundMuted()) {
  console.log('Sounds are muted');
}
```

## Sound Locations in Code

### Coin Collection
**File:** `src/hooks/useGameLogic.jsx`
```javascript
if (checkCollision(player, itemRect)) {
  soundManager.playSound('coin'); // Plays coin sound
  setScore(s => s + item.points);
  return false;
}
```

### Bomb Collision
**File:** `src/hooks/useGameLogic.jsx`
```javascript
if (checkCollision(player, itemRect)) {
  soundManager.playSound('bomb'); // Plays bomb hit sound
  setLives(l => l - 1);
  // ...
}
```

### Level Complete
**File:** `src/hooks/useGameLogic.jsx`
```javascript
const loadLevel = (levelNumber) => {
  // ...
  soundManager.playSound('levelComplete'); // Plays next level sound
  // ...
};
```

### Game Over
**File:** `src/hooks/useGameLogic.jsx`
```javascript
if (newLives <= 0) {
  soundManager.playSound('gameOver'); // Plays game over sound
  setGameActive(false);
  onGameEnd(score);
}
```

## Adding New Sounds

To add a new sound effect:

### 1. Add the audio file to `public/sounds/`

### 2. Update `soundManager.js`

```javascript
const soundFiles = {
  // Existing sounds...
  myNewSound: '/sounds/my-new-sound.mp3',  // Add your sound here
};
```

### 3. Use it in your component

```javascript
import soundManager from '../services/soundManager.js';

// In your code:
soundManager.playSound('myNewSound');
```

## Optional: Add Jump Sound

To enable the optional jump sound, uncomment this line in `useGameLogic.jsx`:

```javascript
// In the jump input handler:
if (keys.has('Space') && onGround) {
  dy = JUMP_POWER;
  onGround = false;
  soundManager.playSound('jump'); // Uncomment this
}
```

## Troubleshooting

### Sounds Not Playing?

1. **Check file paths** - Ensure audio files are in `public/sounds/` with correct names
2. **Check browser console** - Look for errors like `Failed to load sound:`
3. **CORS issues** - If using external CDN, ensure CORS headers are set
4. **Browser permissions** - Some browsers require user interaction before playing audio

### Audio Quality Issues?

1. Use high-quality source files
2. Check MP3 encoding (128+ kbps)
3. Test with different browsers
4. Compress large files using audio tools

### Volume Issues?

```javascript
// Check and adjust volume
console.log('Master Volume:', soundManager.getMasterVolume());
soundManager.setMasterVolume(1.0); // Set to max
```

## Best Practices

1. **Keep sounds short** - 0.5-2 second clips for best UX
2. **Use consistent levels** - Avoid sounds that are too loud/quiet
3. **Test on different devices** - Mobile audio behavior differs
4. **Provide mute option** - Always let users disable sounds
5. **Use appropriate formats** - MP3 for best compatibility
6. **Preload sounds** - Initialize sounds at app startup

## Sound Manager API Reference

| Method | Parameters | Description |
|--------|-----------|-------------|
| `initializeSounds()` | None | Load all defined sound files |
| `playSound(key, loop)` | key (string), loop (boolean) | Play a sound effect |
| `stopSound(key)` | key (string) | Stop a specific sound |
| `stopAllSounds()` | None | Stop all playing sounds |
| `setMasterVolume(volume)` | volume (0-1) | Set overall volume |
| `setSoundEffectsVolume(volume)` | volume (0-1) | Set SFX volume |
| `setMusicVolume(volume)` | volume (0-1) | Set music volume |
| `toggleMute()` | None | Toggle mute on/off |
| `isSoundMuted()` | None | Check if muted |
| `getMasterVolume()` | None | Get current master volume |
| `getSoundEffectsVolume()` | None | Get current SFX volume |

## Next Steps

1. Download sound files from sources listed above
2. Place them in `public/sounds/`
3. Test the game - sounds should play automatically
4. Adjust volume levels in `soundManager.js` if needed
5. Add more sounds as needed following the patterns

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Sound Manager code in `src/services/soundManager.js`
3. Check browser console for error messages
4. Test with different audio files
