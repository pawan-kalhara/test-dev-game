/**
 * Sound Manager Service
 * Centralized audio management for the game
 * Handles loading, playing, and managing sound effects
 */

class SoundManager {
  constructor() {
    this.sounds = {};
    this.masterVolume = 1;
    this.soundEffectsVolume = 0.7;
    this.musicVolume = 0.5;
    this.isMuted = false;
  }

  /**
   * Initialize all sound assets
   * Place your audio files in the public/sounds/ directory
   */
  initializeSounds() {
    // Define all sounds with their file paths
    const soundFiles = {
      // Game sounds
      coin: '/sounds/coin-collect.mp3',          // Collectible item sound
      bomb: '/sounds/bomb-hit.mp3',              // Hit by obstacle/bomb
      levelComplete: '/sounds/level-complete.mp3', // Next level/level clear
      gameOver: '/sounds/game-over.mp3',         // Game over sound
      jump: '/sounds/jump.mp3',                  // Optional: Jump sound
      
      // UI sounds
      menuSelect: '/sounds/menu-select.mp3',     // Menu selection sound
      buttonClick: '/sounds/button-click.mp3',   // Button click sound
    };

    // Load each sound
    Object.entries(soundFiles).forEach(([key, path]) => {
      this.loadSound(key, path);
    });
  }

  /**
   * Load a single sound file
   * @param {string} key - Unique identifier for the sound
   * @param {string} path - Path to the audio file
   */
  loadSound(key, path) {
    const audio = new Audio(path);
    audio.volume = this.soundEffectsVolume;
    
    // Handle audio errors gracefully
    audio.addEventListener('error', () => {
      console.warn(`Failed to load sound: ${key} from ${path}`);
    });

    this.sounds[key] = audio;
  }

  /**
   * Play a sound effect
   * @param {string} key - The sound to play
   * @param {boolean} loop - Whether to loop the sound (default: false)
   */
  playSound(key, loop = false) {
    if (this.isMuted) return;

    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`Sound not found: ${key}`);
      return;
    }

    // Reset and play
    sound.currentTime = 0;
    sound.loop = loop;
    sound.volume = this.isMuted ? 0 : this.soundEffectsVolume;
    
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.warn(`Failed to play sound: ${key}`);
      });
    }
  }

  /**
   * Stop a specific sound
   * @param {string} key - The sound to stop
   */
  stopSound(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAllSounds() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Set master volume (0 to 1)
   * @param {number} volume - Volume level (0-1)
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set sound effects volume (0 to 1)
   * @param {number} volume - Volume level (0-1)
   */
  setSoundEffectsVolume(volume) {
    this.soundEffectsVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set music volume (0 to 1)
   * @param {number} volume - Volume level (0-1)
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Update all sound volumes based on master volume
   */
  updateVolumes() {
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.isMuted ? 0 : this.soundEffectsVolume * this.masterVolume;
    });
  }

  /**
   * Toggle mute on/off
   * @returns {boolean} - Current mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateVolumes();
    return this.isMuted;
  }

  /**
   * Check if currently muted
   * @returns {boolean} - Mute state
   */
  isSoundMuted() {
    return this.isMuted;
  }

  /**
   * Get current master volume
   * @returns {number} - Master volume (0-1)
   */
  getMasterVolume() {
    return this.masterVolume;
  }

  /**
   * Get current sound effects volume
   * @returns {number} - Sound effects volume (0-1)
   */
  getSoundEffectsVolume() {
    return this.soundEffectsVolume;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
