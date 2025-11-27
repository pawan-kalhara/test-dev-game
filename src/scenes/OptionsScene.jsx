import React, { useState } from 'react';

export default function OptionsScene({ onBack }) {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.7);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: 'url(/assets/backgrounds/menu-background.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundColor: '#064e3b'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-700/50 to-blue-900/50" style={{ zIndex: 0 }} />

      <div className="relative z-10 bg-black/70 p-8 rounded-2xl max-w-2xl w-full">
        <h1 className="text-5xl font-bold text-white mb-8 text-center drop-shadow-lg">
          ⚙ OPTIONS
        </h1>

        <div className="space-y-8">
          {/* Music Settings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🎵 Music</h2>
            
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <span className="text-white text-lg">Enable Music</span>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`w-16 h-8 rounded-full transition-colors ${
                  musicEnabled ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    musicEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <label className="text-white text-lg block mb-2">
                Music Volume: {Math.round(musicVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                disabled={!musicEnabled}
                className="w-full"
              />
            </div>
          </div>

          {/* Sound Effects Settings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🔊 Sound Effects</h2>
            
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <span className="text-white text-lg">Enable Sound Effects</span>
              <button
                onClick={() => setSfxEnabled(!sfxEnabled)}
                className={`w-16 h-8 rounded-full transition-colors ${
                  sfxEnabled ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    sfxEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <label className="text-white text-lg block mb-2">
                SFX Volume: {Math.round(sfxVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                disabled={!sfxEnabled}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-8 w-full px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-xl font-bold rounded-lg transition-all"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}
