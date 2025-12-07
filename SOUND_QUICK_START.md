# Sound Effects - Quick Start Guide

## What Was Done

I've integrated a complete sound system into your game. Here's what's ready:

### ✅ Files Created/Updated

1. **`src/services/soundManager.js`** - Sound management service
2. **`src/hooks/useGameLogic.jsx`** - Updated with sound effects
3. **`src/scenes/MainMenuScene.jsx`** - Menu button click sounds
4. **`SOUND_SETUP_GUIDE.md`** - Comprehensive documentation

### 🎵 Sounds Ready to Use

- `coin` - Coin collection sound
- `bomb` - Bomb hit/obstacle collision sound
- `levelComplete` - Level completion/next level sound
- `gameOver` - Game over sound
- `jump` - Jump sound (optional, commented out)
- `menuSelect` - Menu selection (optional)
- `buttonClick` - Button click sound

## Quick Setup (3 Steps)

### Step 1: Create Sounds Folder

```bash
mkdir public/sounds
```

### Step 2: Add Audio Files

Download these files and place them in `public/sounds/`:

| File Name | Purpose | Duration |
|-----------|---------|----------|
| `coin-collect.mp3` | Coin pickup | 0.3-0.8s |
| `bomb-hit.mp3` | Obstacle collision | 0.5-1s |
| `level-complete.mp3` | Next level | 1-2s |
| `game-over.mp3` | Game end | 1-2s |
| `button-click.mp3` | Menu click | 0.2-0.5s |

**Free Sound Resources:**
- https://freesound.org/
- https://pixabay.com/sound-effects/
- https://zapsplat.com/

### Step 3: Done!

Sounds will automatically play during gameplay.

## Where Sounds Play

```javascript
// Automatically triggered:
🪙 Collecting coins      → coin-collect.mp3
💣 Hit by obstacle       → bomb-hit.mp3
📈 Complete level        → level-complete.mp3
☠️  Game over           → game-over.mp3
🖱️  Menu button click    → button-click.mp3
```

## Testing Sounds

1. Start your dev server: `npm run dev`
2. Navigate through the menu (should hear button clicks)
3. Start a game and collect coins (should hear coin sounds)
4. Hit obstacles (should hear bomb sounds)
5. Complete levels (should hear level complete sounds)

## If Sounds Don't Play

### Debug Checklist

- [ ] Audio files are in `public/sounds/` folder
- [ ] File names match exactly: `coin-collect.mp3`, `bomb-hit.mp3`, etc.
- [ ] Files are MP3 format
- [ ] Check browser console for errors (F12 → Console tab)
- [ ] Try a different browser
- [ ] Check that browser allows autoplay (common issue)

### Troubleshooting Commands

```javascript
// In browser console (F12):
import soundManager from './src/services/soundManager.js';
soundManager.initializeSounds();
soundManager.playSound('coin'); // Test coin sound
```

## Volume Control

Add this to any component to give users volume control:

```javascript
import soundManager from '../services/soundManager.js';

// Mute/unmute
soundManager.toggleMute();

// Set volume (0 to 1)
soundManager.setMasterVolume(0.8);
soundManager.setSoundEffectsVolume(0.7);

// Check status
if (soundManager.isSoundMuted()) {
  console.log('Audio is muted');
}
```

## Adding More Sounds

### Example: Add a Power-Up Sound

**1. Add sound file:** `public/sounds/powerup.mp3`

**2. Update soundManager.js:**

```javascript
const soundFiles = {
  // ... existing sounds
  powerup: '/sounds/powerup.mp3', // Add this
};
```

**3. Use in your code:**

```javascript
if (collision.isPowerUp) {
  soundManager.playSound('powerup');
}
```

## Code Locations

**Game Sounds:**
- Coin: `src/hooks/useGameLogic.jsx` line ~155
- Bomb: `src/hooks/useGameLogic.jsx` line ~179
- Level Complete: `src/hooks/useGameLogic.jsx` line ~70
- Game Over: `src/hooks/useGameLogic.jsx` line ~89

**Menu Sounds:**
- Button Click: `src/scenes/MainMenuScene.jsx` line ~22

## Advanced Usage

### Play Sound with Loop

```javascript
// Loop forever
soundManager.playSound('someSound', true);

// Stop looping sound
soundManager.stopSound('someSound');
```

### Stop All Sounds

```javascript
soundManager.stopAllSounds();
```

### Get Current Volume

```javascript
const volume = soundManager.getMasterVolume(); // 0 to 1
const sfxVolume = soundManager.getSoundEffectsVolume();
```

## File Structure

Your project should look like this:

```
test-dev-game/
├── public/
│   └── sounds/              ← Add audio files here
│       ├── coin-collect.mp3
│       ├── bomb-hit.mp3
│       ├── level-complete.mp3
│       ├── game-over.mp3
│       └── button-click.mp3
├── src/
│   ├── services/
│   │   └── soundManager.js  ← Already created
│   ├── hooks/
│   │   └── useGameLogic.jsx ← Already updated
│   └── scenes/
│       └── MainMenuScene.jsx ← Already updated
└── ...
```

## Next Steps

1. ✅ Create `public/sounds/` folder
2. ✅ Download audio files
3. ✅ Place files in sounds folder
4. ✅ Test the game
5. ✅ Adjust volume in `soundManager.js` if needed
6. ✅ Add more sounds as desired

## Support Links

- **Sound Manager Code:** `src/services/soundManager.js`
- **Full Documentation:** `SOUND_SETUP_GUIDE.md`
- **Game Integration:** `src/hooks/useGameLogic.jsx`
- **Menu Integration:** `src/scenes/MainMenuScene.jsx`

## Common Questions

**Q: Can I use WAV or OGG files?**
A: Yes, but MP3 has best browser compatibility. Modern browsers support: MP3, WAV, OGG, FLAC.

**Q: How do I mute sounds?**
A: Call `soundManager.toggleMute()` or create a settings UI.

**Q: Why is audio delayed?**
A: First time playing a sound has slight delay. This is normal. Pre-load sounds at startup.

**Q: Can sounds play simultaneously?**
A: Yes. Each sound is independent and can overlap.

**Q: How do I loop background music?**
A: Use `soundManager.playSound('musicKey', true)` to loop.

---

**That's it! Your game now has sound effects ready to go.** 🎮🔊
