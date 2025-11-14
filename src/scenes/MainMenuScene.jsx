import React, { useState } from 'react';

export default function MainMenuScene({ userName, onStartGame, onOptions, onExit }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  const buttons = [
    {
      id: 'start',
      image: '/images/buttons/start-button.png',
      alt: 'Start Game',
      onClick: onStartGame,
      scale: hoveredButton === 'start' ? 1.1 : 1
    },
   /* {
      id: 'options',
      image: '/images/buttons/options-button.png',
      alt: 'Options',
      onClick: onOptions,
      scale: hoveredButton === 'options' ? 1.1 : 1
    },*/
    {
      id: 'exit',
      image: '/images/buttons/exit-button.png',
      alt: 'Exit',
      onClick: onExit,
      scale: hoveredButton === 'exit' ? 1.1 : 1
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-900 via-green-700 to-green-900 p-8">
      {/* Game Title */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg pixel-text">
          MONKEY CODEBREAKER
        </h1>
        <p className="text-2xl text-green-200">
          Welcome, <span className="text-yellow-300 font-semibold">{userName}</span>!
        </p>
      </div>

      {/* Menu Buttons */}
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={button.onClick}
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-400 rounded-lg"
            style={{
              transform: `scale(${button.scale})`,
              filter: hoveredButton === button.id ? 'brightness(1.2)' : 'brightness(1)'
            }}
          >
            <img
              src={button.image}
              alt={button.alt}
              className="w-full h-auto drop-shadow-2xl"
              style={{
                imageRendering: 'pixelated'
              }}
            />
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 text-center text-green-300 text-sm">
        <p>Press START to begin your adventure!</p>
      </div>
    </div>
  );
}
