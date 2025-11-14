import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import AuthForm from '../components/AuthForm.jsx';

export default function LoginScene({ onLoginSuccess, onGoToRegister }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (email, password) => {
    setError('');
    setLoading(true);
    authService.login(email, password)
      .then(user => {
        setLoading(false);
        onLoginSuccess(user);
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <AuthForm
      title="Monkey Banana Quest"
      subtitle="Login to your account"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      isRegister={false}
      footerButtonText="Don't have an account? Register"
      onFooterButtonClick={onGoToRegister}
    />
  );
}