import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import AuthForm from '../components/AuthForm.jsx';

export default function RegisterScene({ onRegisterSuccess, onGoToLogin }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (email, password) => {
    setError('');
    setLoading(true);
    authService.register(email, password)
      .then(user => {
        setLoading(false);
        onRegisterSuccess(user);
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <AuthForm
      title="Create Account"
      subtitle="Start your jungle adventure"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      isRegister={true}
      footerButtonText="Already have an account? Login"
      onFooterButtonClick={onGoToLogin}
    />
  );
}