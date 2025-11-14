import React from 'react';

export default function GameOverScene({ score, highScore, onPlayAgain, onBackToMenu, onLogout }) {
  const isNewHighScore = score >= highScore;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-900 via-orange-800 to-red-900 p-8">
      <div className="text-center bg-black/50 p-12 rounded-2xl backdrop-blur-sm max-w-2xl">
        <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
          {isNewHighScore ? '🎉 NEW HIGH SCORE! 🎉' : 'GAME OVER'}
        </h1>

        <div className="mb-8 space-y-4">
          <div className="text-4xl text-yellow-400 font-bold">
            Score: {score}
          </div>
          <div className="text-2xl text-green-400">
            High Score: {highScore}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-lg transition-all transform hover:scale-105"
          >
            🔄 Play Again
          </button>

          <button
            onClick={onBackToMenu}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold rounded-lg transition-all transform hover:scale-105"
          >
            🏠 Main Menu
          </button>

          <button
            onClick={onLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
