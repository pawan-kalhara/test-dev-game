import React, { useState } from 'react';
import { getAvatarList } from '../config/assetConfig.js';

export default function AvatarScene({ onAvatarSelect, onLogout }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-purple-700 to-purple-900 p-8">
      <h1 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
        Choose Your Character
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleSelect(avatar.id)}
            className={`
              flex flex-col items-center p-6 rounded-xl transition-all duration-200
              ${selectedAvatar === avatar.id 
                ? 'bg-yellow-400 scale-110 shadow-2xl ring-4 ring-white' 
                : 'bg-white/10 hover:bg-white/20 hover:scale-105'
              }
            `}
          >
            <div className="w-24 h-24 mb-3 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  // Fallback if image doesn't load
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
        Confirm Selection
      </button>

      <button
        onClick={onLogout}
        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
