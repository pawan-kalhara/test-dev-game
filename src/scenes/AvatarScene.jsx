import React, { useState } from 'react';
import { getAvatarList } from '../config/assetConfig.js';

export default function AvatarScene({ currentAvatar, onAvatarSelect, onCancel, onLogout }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || null);
  const avatars = getAvatarList();

  const handleSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar);
    }
  };

 return (
  <div 
    className="min-h-screen flex flex-col items-center justify-center p-8"
    style={{
      backgroundImage: 'url(/assets/backgrounds/menu-background.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover', // Stretches to fill screen
      backgroundPosition: 'center',
      backgroundColor: '#581c87' // Fallback purple color
    }}
  >
    {/* Semi-transparent overlay for better visibility */}
    <div 
      className="absolute inset-0 bg-gradient-to-b from-green-900/60 via-green-700/60 to-green-900/60"
      style={{ zIndex: 0 }}
    />

    {/* Content - needs to be above the overlay */}
    <div className="relative z-10 flex flex-col items-center w-full">
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
        Choose Your Character
      </h1>
      
      {currentAvatar && (
        <p className="text-green-300 mb-6 text-lg">
          Currently using: <span className="text-yellow-300 font-bold">
            {getAvatarList().find(a => a.id === currentAvatar)?.name}
          </span>
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleSelect(avatar.id)}
            className={`
              flex flex-col items-center p-6 rounded-xl transition-all duration-200 relative
              ${selectedAvatar === avatar.id 
                ? 'bg-yellow-400 scale-110 shadow-2xl ring-4 ring-white' 
                : 'bg-white/10 hover:bg-white/20 hover:scale-105'
              }
            `}
          >
            {currentAvatar === avatar.id && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                CURRENT
              </div>
            )}
            
            <div className="w-24 h-24 mb-3 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="text-4xl">${avatar.name[0]}</span>`;
                }}
              />
            </div>
            <p className="text-xl font-bold text-white mb-1">{avatar.name}</p>
            <p className="text-sm text-gray-300 text-center">{avatar.description}</p>
          </button>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedAvatar}
          className={`
            px-8 py-4 rounded-lg text-xl font-bold transition-all
            ${selectedAvatar
              ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          {currentAvatar && selectedAvatar !== currentAvatar ? 'Change Avatar' : 'Confirm Selection'}
        </button>

        {currentAvatar && onCancel && (
          <button
            onClick={onCancel}
            className="px-8 py-4 rounded-lg text-xl font-bold bg-gray-600 hover:bg-gray-700 text-white transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      <button
        onClick={onLogout}
        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  </div>
);
}