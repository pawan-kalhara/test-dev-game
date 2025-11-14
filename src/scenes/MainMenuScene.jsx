import React, { useState } from 'react';
import { getAvatar } from '../config/assetConfig.js';

export default function MainMenuScene({ 
  userName, 
  currentAvatar, 
  onStartGame, 
  onChangeAvatar,
  onOptions, 
  onExit 
}) {
  const [hoveredButton, setHoveredButton] = useState(null);
  const avatarConfig = currentAvatar ? getAvatar(currentAvatar) : null;

  const ButtonStyled = ({ id, label, onClick, hovered, icon }) => (
    <button
      onClick={onClick}
      onMouseEnter={() => setHoveredButton(id)}
      onMouseLeave={() => setHoveredButton(null)}
      className={`
        w-full px-8 py-6 text-3xl font-bold uppercase tracking-wider
        bg-gradient-to-b from-green-500 to-green-700
        border-4 border-white
        rounded-xl shadow-2xl
        transition-all duration-200
        ${hovered === id ? 'scale-110 brightness-125' : 'scale-100'}
        hover:shadow-yellow-400/50
        active:translate-y-1
        focus:outline-none focus:ring-4 focus:ring-yellow-400
      `}
      style={{
        textShadow: '3px 3px 0px rgba(0,0,0,0.8)',
        fontFamily: 'monospace'
      }}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </button>
  );

return (
<div 
  className="relative min-h-screen flex flex-col items-center justify-center p-8"
  style={{
    backgroundImage: 'url(/assets/backgrounds/menu-background.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', // Scales to cover entire screen
    backgroundPosition: 'center',
    backgroundColor: '#064e3b'
  }}
  >
    {/* Optional: Add a semi-transparent overlay for better text readability */}
    <div 
      className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-green-700/50 to-green-900/50"
      style={{ zIndex: 0 }}
    />

    {/* Content - needs to be above the overlay */}
    <div className="relative z-10 w-full flex flex-col items-center">
      {/* Game Title */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg pixel-text">
          MONKEY QUEST
        </h1>
        <p className="text-2xl text-green-200">
          Welcome, <span className="text-yellow-300 font-semibold">{userName}</span>!
        </p>
      </div>

      {/* Current Avatar Display */}
      {avatarConfig && (
        <div className="mb-6 flex flex-col items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-green-200 mb-2">Current Avatar:</p>
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden mb-2">
            <img
              src={avatarConfig.image}
              alt={avatarConfig.name}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-3xl text-white">${avatarConfig.name[0]}</span>`;
              }}
            />
          </div>
          <p className="text-white font-bold">{avatarConfig.name}</p>
        </div>
      )}

      {/* Menu Buttons */}
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        <ButtonStyled
          id="start"
          label="START GAME"
          icon="▶"
          onClick={onStartGame}
          hovered={hoveredButton}
        />
        
        <ButtonStyled
          id="avatar"
          label="CHANGE AVATAR"
          icon="👤"
          onClick={onChangeAvatar}
          hovered={hoveredButton}
        />
        
        <ButtonStyled
          id="options"
          label="OPTIONS"
          icon="⚙"
          onClick={onOptions}
          hovered={hoveredButton}
        />
        
        <ButtonStyled
          id="exit"
          label="EXIT"
          icon="✕"
          onClick={onExit}
          hovered={hoveredButton}
        />
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-green-300 text-sm">
        <p>Press START GAME to begin your adventure!</p>
      </div>
    </div>
  </div>
);
}
