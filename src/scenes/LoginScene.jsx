import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import AuthForm from '../components/AuthForm.jsx';
import soundManager from '../services/soundManager.js';


export default function LoginScene({ onLoginSuccess, onGoToRegister, onForgotPassword }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


  const handleSubmit = (email, password) => {
    setError('');
    setLoading(true);
    authService.login(email, password)
      .then(user => {
        setLoading(false);
        soundManager.playSound('levelComplete');
        onLoginSuccess(user);
      })
      .catch(err => {
        setLoading(false);
        soundManager.playSound('bomb');
        setError(err.message);
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      soundManager.playSound('buttonClick');

      const user = await authService.loginWithGoogle();
      setGoogleLoading(false);
      soundManager.playSound('levelComplete');
      onLoginSuccess(user);
    } catch (err) {
      setGoogleLoading(false);
      soundManager.playSound('bomb');
      setError(err.message);
    }
  };

  const handleForgotPassword = () => {
    soundManager.playSound('buttonClick');
    onForgotPassword();
  };

  const handleGoToRegister = () => {
    soundManager.playSound('buttonClick');
    onGoToRegister();
  };

  return (
    <>
      <AuthForm
        title="Monkey Quest"
        subtitle="Login to your account"
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        isRegister={false}
        footerButtonText="Don't have an account? Register"
        onFooterButtonClick={handleGoToRegister}
        onForgotPassword={handleForgotPassword}
        onGoogleSignIn={handleGoogleSignIn}
        googleLoading={googleLoading}
      />
    </>
  );
}