import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import soundManager from '../services/soundManager.js';

export default function LeaderboardScene({ onBack }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    soundManager.initializeSounds();
    fetchTopPlayers();
  }, []);

  const fetchTopPlayers = async () => {
    try {
      setLoading(true);
      const players = await authService.getTopPlayers(3);
      setTopPlayers(players);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    soundManager.playSound('buttonClick');
    onBack();
  };

  const getMedalEmoji = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return '🎖️';
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">Loading leaderboard...</div>
      </div>
    );
  }

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

      <div className="relative z-10 w-full flex flex-col items-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
          🏆 LEADERBOARD
        </h1>
        <p className="text-xl text-green-200 mb-8">Top 3 Players</p>

        {/* Leaderboard Cards */}
        <div className="w-full space-y-4 mb-8">
          {topPlayers.length > 0 ? (
            topPlayers.map((player, index) => (
              <div 
                key={index}
                className={`
                  flex items-center justify-between p-6 rounded-lg
                  border-2 transition-all transform hover:scale-105
                  ${index === 0 
                    ? 'bg-yellow-500/20 border-yellow-400 shadow-lg shadow-yellow-400/50' 
                    : index === 1 
                    ? 'bg-gray-400/20 border-gray-300 shadow-lg shadow-gray-300/50' 
                    : 'bg-orange-600/20 border-orange-500 shadow-lg shadow-orange-500/50'
                  }
                `}
              >
                <div className="flex items-center gap-6 flex-1">
                  <span className="text-5xl">
                    {getMedalEmoji(index)}
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {player.email?.split('@')[0] || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-300">
                      Rank #{index + 1}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-300">
                    {player.highScore || 0}
                  </p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-white/10 rounded-lg border-2 border-white/20">
              <p className="text-xl text-gray-300">No players yet. Be the first!</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border-2 border-white/20">
          <p className="text-sm text-gray-300 text-center">
            🎮 Complete levels and collect bananas to climb the leaderboard!
          </p>
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
