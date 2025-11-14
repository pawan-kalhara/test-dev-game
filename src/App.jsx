import React, { useState, useEffect } from 'react';
import { authService } from './services/authService.js';

// Import all your scenes
import Loader from './components/Loader.jsx';
import LoginScene from './scenes/LoginScene.jsx';
import RegisterScene from './scenes/RegisterScene.jsx';
import AvatarScene from './scenes/AvatarScene.jsx';
import DifficultyScene from './scenes/DifficultyScene.jsx';
import GameScene from './scenes/GameScene.jsx';
import GameOverScene from './scenes/GameOverScene.jsx';

export default function App() {
  const [scene, setScene] = useState('loading'); // loading, login, register, avatar, difficulty, game, gameover
  const [currentUser, setCurrentUser] = useState(null); // { email, avatar, highScore }
  const [difficulty, setDifficulty] = useState('easy');
  const [lastScore, setLastScore] = useState(0);

  // Check for an active session on first load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (!user.avatar) {
        setScene('avatar');
      } else {
        setScene('difficulty');
      }
    } else {
      setScene('login');
    }
  }, []);

  // --- Navigation Callbacks ---

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (!user.avatar) {
      setScene('avatar');
    } else {
      setScene('difficulty');
    }
  };

  const handleAvatarSelect = (avatar) => {
    const newUserData = { ...currentUser, avatar };
    authService.saveUserData(currentUser.email, { avatar: avatar, highScore: currentUser.highScore })
      .then(() => {
        setCurrentUser(newUserData);
        setScene('difficulty');
      });
  };

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setScene('game');
  };

  const handleGameEnd = (score) => {
    setLastScore(score);
    if (score > currentUser.highScore) {
      const newUserData = { ...currentUser, highScore: score };
      authService.saveUserData(currentUser.email, { avatar: newUserData.avatar, highScore: score })
        .then(() => {
          setCurrentUser(newUserData);
        });
    }
    setScene('gameover');
  };

  const handlePlayAgain = () => {
    setScene('difficulty');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setScene('login');
  };

  // --- Scene Renderer ---
  const renderScene = () => {
    switch (scene) {
      case 'loading':
        return <Loader />;
      case 'login':
        return (
          <LoginScene
            onLoginSuccess={handleAuthSuccess}
            onGoToRegister={() => setScene('register')}
          />
        );
      case 'register':
        return (
          <RegisterScene
            onRegisterSuccess={handleAuthSuccess}
            onGoToLogin={() => setScene('login')}
          />
        );
      case 'avatar':
        return (
          <AvatarScene
            onAvatarSelect={handleAvatarSelect}
            onLogout={handleLogout}
          />
        );
      case 'difficulty':
        return (
          <DifficultyScene
            onDifficultySelect={handleDifficultySelect}
            highScore={currentUser?.highScore || 0}
            onLogout={handleLogout}
          />
        );
      case 'game':
        return (
          <GameScene
            difficulty={difficulty}
            avatar={currentUser?.avatar}
            onGameEnd={handleGameEnd}
            onLogout={handleLogout}
          />
        );
      case 'gameover':
        return (
          <GameOverScene
            score={lastScore}
            highScore={currentUser?.highScore || 0}
            onPlayAgain={handlePlayAgain}
            onLogout={handleLogout}
          />
        );
      default:
        return <LoginScene onLoginSuccess={handleAuthSuccess} onGoToRegister={() => setScene('register')} />;
    }
  };

  return (
    <div className="font-sans text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {renderScene()}
      </div>
    </div>
  );
}