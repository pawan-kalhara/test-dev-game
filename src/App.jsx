/*import React, { useState, useEffect } from 'react';
import { authService } from './services/authService.js';

// Import all your scenes
import Loader from './components/Loader.jsx';
import LoginScene from './scenes/LoginScene.jsx';
import RegisterScene from './scenes/RegisterScene.jsx';
import MainMenuScene from './scenes/MainMenuScene.jsx';
import AvatarScene from './scenes/AvatarScene.jsx';
import DifficultyScene from './scenes/DifficultyScene.jsx';
import GameScene from './scenes/GameScene.jsx';
import GameOverScene from './scenes/GameOverScene.jsx';

export default function App() {
  const [scene, setScene] = useState('loading');
  const [currentUser, setCurrentUser] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [lastScore, setLastScore] = useState(0);

  // Check for an active session on first load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setScene('mainmenu');
    } else {
      setScene('login');
    }
  }, []);

  // --- Navigation Callbacks ---

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setScene('mainmenu');
  };

  const handleStartGame = () => {
    // Check if user has selected an avatar
    if (!currentUser.avatar) {
      setScene('avatar');
    } else {
      setScene('difficulty');
    }
  };

  const handleChangeAvatar = () => {
    
    setScene('avatar');
  };

  const handleOptions = () => {
    alert('Options menu coming soon!');
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit?')) {
      handleLogout();
    }
  };

  const handleAvatarSelect = (avatar) => {
    const newUserData = { ...currentUser, avatar };
    authService.saveUserData(currentUser.email, { 
      avatar: avatar, 
      highScore: currentUser.highScore 
    }).then(() => {
      setCurrentUser(newUserData);
      
      setScene('mainmenu');
    });
  };

  const handleAvatarCancel = () => {
    
    setScene('mainmenu');
  };

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setScene('game');
  };

  const handleGameEnd = (score) => {
    setLastScore(score);
    if (score > currentUser.highScore) {
      const newUserData = { ...currentUser, highScore: score };
      authService.saveUserData(currentUser.email, { 
        avatar: newUserData.avatar, 
        highScore: score 
      }).then(() => {
        setCurrentUser(newUserData);
      });
    }
    setScene('gameover');
  };

  const handlePlayAgain = () => {
    setScene('difficulty');
  };

  const handleBackToMenu = () => {
    setScene('mainmenu');
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
      case 'mainmenu':
        return (
          <MainMenuScene
            userName={currentUser?.email?.split('@')[0] || 'Player'}
            currentAvatar={currentUser?.avatar}
            onStartGame={handleStartGame}
            onChangeAvatar={handleChangeAvatar}
            onOptions={handleOptions}
            onExit={handleExit}
          />
        );
      case 'avatar':
        return (
          <AvatarScene
            currentAvatar={currentUser?.avatar}
            onAvatarSelect={handleAvatarSelect}
            onCancel={handleAvatarCancel}
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
            onBackToMenu={handleBackToMenu}
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
}*/

import React, { useState, useEffect } from 'react';
import { authService } from './services/authService.js';

// Import all your scenes
import Loader from './components/Loader.jsx';
import LoginScene from './scenes/LoginScene.jsx';
import RegisterScene from './scenes/RegisterScene.jsx';
import MainMenuScene from './scenes/MainMenuScene.jsx';
import AvatarScene from './scenes/AvatarScene.jsx';
import DifficultyScene from './scenes/DifficultyScene.jsx';
import ForgotPasswordScene from './scenes/ForgotPasswordScene.jsx';
import GameScene from './scenes/GameScene.jsx';
import GameOverScene from './scenes/GameOverScene.jsx';
import OptionsScene from './scenes/OptionsScene.jsx';
import LeaderboardScene from './scenes/LeaderboardScene.jsx';

export default function App() {
  const [scene, setScene] = useState('loading');
  const [currentUser, setCurrentUser] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [lastScore, setLastScore] = useState(0);

  // Subscribe to Firebase auth state changes (replaces localStorage check)
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setScene('mainmenu');
      } else {
        setCurrentUser(null);
        setScene('login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // --- Navigation Callbacks ---

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setScene('mainmenu');
  };

  const handleStartGame = () => {
    // Check if user has selected an avatar
    if (!currentUser.avatar) {
      setScene('avatar');
    } else {
      setScene('difficulty');
    }
  };

  const handleChangeAvatar = () => {
    // Navigate to avatar selection
    setScene('avatar');
  };

  const handleOptions = () => {
    setScene('options');
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit?')) {
      handleLogout();
    }
  };

  const handleAvatarSelect = async (avatar) => {
    try {
      // Save avatar to Firebase (using uid instead of email)
      const updatedUser = await authService.saveUserData(currentUser.uid, { 
        avatar: avatar, 
        highScore: currentUser.highScore || 0
      });
      setCurrentUser(updatedUser);
      // Return to main menu after avatar change
      setScene('mainmenu');
    } catch (error) {
      console.error('Failed to save avatar:', error);
      alert('Failed to save avatar. Please try again.');
    }
  };

  const handleAvatarCancel = () => {
    // Return to main menu without changing avatar
    setScene('mainmenu');
  };

  const handleLeaderboard = () => {
  setScene('leaderboard');
};

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setScene('game');
  };

  const handleGameEnd = async (score) => {
    setLastScore(score);
    
    // Update high score if necessary
    if (score > (currentUser.highScore || 0)) {
      try {
        const updatedUser = await authService.saveUserData(currentUser.uid, { 
          avatar: currentUser.avatar, 
          highScore: score 
        });
        setCurrentUser(updatedUser);
      } catch (error) {
        console.error('Failed to save high score:', error);
      }
    }
    
    setScene('gameover');
  };

  const handlePlayAgain = () => {
    setScene('difficulty');
  };

  const handleBackToMenu = () => {
    setScene('mainmenu');
  };

  const handleMainMenu = () => {
  setScene('mainmenu');
};

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setScene('login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
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
            onForgotPassword={() => setScene('forgotPassword')}
          />
        );
        
      case 'register':
        return (
          <RegisterScene
            onRegisterSuccess={handleAuthSuccess}
            onGoToLogin={() => setScene('login')}
          />
        );

      case 'forgotPassword':
        return (
          <ForgotPasswordScene
            onBack={() => setScene('login')}
         />
       );
        
      case 'mainmenu':
        return (
          <MainMenuScene
            userName={currentUser?.email?.split('@')[0] || 'Player'}
            currentAvatar={currentUser?.avatar}
            onStartGame={handleStartGame}
            onChangeAvatar={handleChangeAvatar}
            onOptions={handleOptions}
            onLeaderboard={handleLeaderboard}
            onExit={handleExit}
          />
        );
        
      case 'avatar':
        return (
          <AvatarScene
            currentAvatar={currentUser?.avatar}
            onAvatarSelect={handleAvatarSelect}
            onCancel={handleAvatarCancel}
            onLogout={handleLogout}
          />
        );

      case 'leaderboard':
        return (
          <LeaderboardScene
            onBack={handleBackToMenu}
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
            onMainMenu={handleMainMenu}
          />
        );
        
      case 'gameover':
        return (
          <GameOverScene
            score={lastScore}
            highScore={currentUser?.highScore || 0}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
            onLogout={handleLogout}
          />
        );
        
      case 'options':
        return (
          <OptionsScene
            onBack={handleBackToMenu}
          />
        );
        
      default:
        return (
          <LoginScene 
            onLoginSuccess={handleAuthSuccess} 
            onGoToRegister={() => setScene('register')}
            onForgotPassword={() => setScene('forgotPassword')}
          />
        );
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
