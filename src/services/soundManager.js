class SoundManager {
  constructor() {
    this.sounds = {};
    this.masterVolume = 1;
    this.soundEffectsVolume = 0.7;
    this.musicVolume = 0.5;
    this.isMuted = false;
    this.backgroundMusic = null;
  }

  initializeSounds() {
    const soundFiles = {
      coin: '/sounds/coin-collect.wav',
      bomb: '/sounds/bomb-hit.wav',
      levelComplete: '/sounds/level-complete.wav',
      gameOver: '/sounds/game-over.wav',
      jump: '/sounds/jump.mp3',
      
      // UI sounds
      menuSelect: '/sounds/menuSelect.mp3',
      buttonClick: '/sounds/button-press.mp3',
    };

    // Load each sound
    Object.entries(soundFiles).forEach(([key, path]) => {
      this.loadSound(key, path);
    });
  }

  loadSound(key, path) {
    const audio = new Audio(path);
    audio.volume = this.soundEffectsVolume;
    
    audio.addEventListener('error', () => {
      console.warn(`Failed to load sound: ${key} from ${path}`);
    });

    this.sounds[key] = audio;
  }

  /**
   * Play a sound effect
   */
  playSound(key, loop = false) {
    if (this.isMuted) return;

    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`Sound not found: ${key}`);
      return;
    }

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
   * Play background music (loops continuously)
   */
  playBackgroundMusic(key) {
    if (this.isMuted) return;

    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`Background music not found: ${key}`);
      return;
    }

    // Stop previous background music if playing
    if (this.backgroundMusic && this.backgroundMusic !== sound) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }

    this.backgroundMusic = sound;
    sound.loop = true;
    sound.volume = this.isMuted ? 0 : this.musicVolume * this.masterVolume;
    
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.warn(`Failed to play background music: ${key}`);
      });
    }
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
    }
  }

  /**
   * Stop a specific sound
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
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set sound effects volume (0 to 1)
   */
  setSoundEffectsVolume(volume) {
    this.soundEffectsVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set music volume (0 to 1)
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

    // Update background music volume separately
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.isMuted ? 0 : this.musicVolume * this.masterVolume;
    }
  }

  /**
   * Toggle mute on/off
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateVolumes();
    return this.isMuted;
  }

  /**
   * Check if currently muted
   */
  isSoundMuted() {
    return this.isMuted;
  }

  /**
   * Get current master volume
   */
  getMasterVolume() {
    return this.masterVolume;
  }

  /**
   * Get current sound effects volume
   */
  getSoundEffectsVolume() {
    return this.soundEffectsVolume;
  }

  /**
   * Get current music volume
   */
  getMusicVolume() {
    return this.musicVolume;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
