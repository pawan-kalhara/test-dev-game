import React, { useState } from 'react';

// You can add more avatars here. Just make sure the files exist
// in /public/assets/avatars/
const AVATARS = [
  { id: 'avatar01', src: 'assets/avatars/avatar01.png' },
  { id: 'avatar02', src: 'assets/avatars/avatar02.png' },
];

export default function AvatarScene({ onAvatarSelect, onLogout }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Choose your Avatar</h1>
      <div className="flex justify-center gap-6 mb-6">
        {AVATARS.map((avatar) => (
          <img
            key={avatar.id}
            src={avatar.src}
            alt={avatar.id}
            onClick={() => setSelected(avatar.id)}
            className={`w-32 h-32 rounded-full cursor-pointer transition-all ${selected === avatar.id ? 'ring-4 ring-yellow-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
          />
        ))}
      </div>
      <button 
        onClick={() => onAvatarSelect(selected)} 
        disabled={!selected}
        className="w-full max-w-xs mx-auto p-3 rounded bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
      >
        Confirm
      </button>
      <button onClick={onLogout} className="text-gray-400 hover:text-white mt-4 text-sm">Logout</button>
    </div>
  );
}