import React from 'react';

export default function GameOverScene({ score, highScore, onPlayAgain, onLogout }) {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Game Over</h1>
      <p className="text-2xl text-white mb-2">Your Score: {score}</p>
      <p className="text-xl text-yellow-400 mb-6">High Score: {highScore}</p>
      <button onClick={onPlayAgain} className="w-full max-w-xs mx-auto p-3 rounded bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 transition-colors">
        Play Again
      </button>
      <button onClick={onLogout} className="text-gray-400 hover:text-white mt-6 text-sm">Logout</button>
    </div>
  );
}