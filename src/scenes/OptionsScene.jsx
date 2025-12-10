import React, { useState, useEffect } from 'react';
import soundManager from '../services/soundManager.js';

export default function OptionsScene({ onBack }) {
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());

  useEffect(() => {
    soundManager.initializeSounds();
  }, []);

  const handleMuteToggle = () => {
    soundManager.playSound('buttonClick');
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  const handleBackClick = () => {
    soundManager.playSound('buttonClick');
    onBack();
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: 'url(/assets/backgrounds/menu-background.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#064e3b'
      }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-green-700/50 to-green-900/50"
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10 w-full flex flex-col items-center max-w-md">
        <h1 className="text-5xl font-bold text-white mb-12 drop-shadow-lg">
          OPTIONS
        </h1>

        {/* Mute Button */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 w-full mb-8 border-2 border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              {isMuted ? '🔇 Sound OFF' : '🔊 Sound ON'}
            </span>
            <button
              onClick={handleMuteToggle}
              className={`
                w-20 h-12 rounded-full transition-all duration-300
                ${isMuted ? 'bg-red-500' : 'bg-green-500'}
                flex items-center ${isMuted ? 'justify-end' : 'justify-start'} 
                p-1 border-2 border-white shadow-lg hover:scale-110
              `}
            >
              <div className="w-8 h-8 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className={`
            w-full px-8 py-6 text-2xl font-bold uppercase tracking-wider
            bg-gradient-to-b from-blue-500 to-blue-700
            border-4 border-white
            rounded-xl shadow-2xl
            transition-all duration-200
            hover:scale-110 hover:brightness-125
            active:translate-y-1
            focus:outline-none focus:ring-4 focus:ring-yellow-400
          `}
          style={{
            textShadow: '3px 3px 0px rgba(0,0,0,0.8)',
            fontFamily: 'monospace'
          }}
        >
          ← BACK
        </button>
      </div>
    </div>
  );
}
