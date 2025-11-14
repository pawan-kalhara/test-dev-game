import React from 'react';

export default function DifficultyScene({ onDifficultySelect, highScore, onLogout }) {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
      <h1 className="text-3xl font-bold text-yellow-400 mb-2">Select Difficulty</h1>
      <p className="text-gray-300 mb-6">Your High Score: {highScore}</p>
      <div className="space-y-4 max-w-xs mx-auto">
        <button onClick={() => onDifficultySelect('easy')} className="w-full p-3 rounded bg-green-500 text-white font-bold hover:bg-green-400 transition-colors">
          Easy (30s Puzzle Timer)
        </button>
        <button onClick={() => onDifficultySelect('hard')} className="w-full p-3 rounded bg-red-500 text-white font-bold hover:bg-red-400 transition-colors">
          Hard (10s Puzzle Timer)
        </button>
      </div>
      <button onClick={onLogout} className="text-gray-400 hover:text-white mt-6 text-sm">Logout</button>
    </div>
  );
}