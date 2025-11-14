import React, { useState } from 'react';

export default function PuzzleModal({ puzzle, timer, onSolve }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSolve(true, answer);
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Solve the Puzzle!</h2>
        <p className="text-2xl font-bold text-red-500 mb-4">Time Left: {timer}s</p>
        
        {puzzle.question ? (
          <img src={puzzle.question} alt="Puzzle" className="mx-auto mb-4 border-4 border-gray-700 rounded"/>
        ) : (
          <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-white mb-4">
            Loading Puzzle...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 text-2xl text-center rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Your Answer"
            autoFocus
          />
          <button type="submit" className="w-full mt-4 p-3 rounded bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 transition-colors">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}