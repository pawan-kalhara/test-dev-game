import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import soundManager from '../services/soundManager.js';

export default function ForgotPasswordScene({ onBack }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      soundManager.playSound('buttonClick');

      await authService.sendPasswordReset(email);

      setSuccess('✅ Password reset link sent to ' + email);
      soundManager.playSound('levelComplete');
      
      setTimeout(onBack, 3000);
    } catch (err) {
      soundManager.playSound('bomb');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    soundManager.playSound('buttonClick');
    onBack();
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: 'url(/assets/backgrounds/menu-background.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: '#064e3b'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-green-700/50 to-green-900/50" style={{ zIndex: 0 }} />

      <div className="relative z-10 w-full flex flex-col items-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🔑 Reset Password
        </h1>
        <p className="text-green-200 mb-8 text-center">Enter your email to receive a password reset link</p>

        {error && (
          <div className="w-full bg-red-500/20 border-2 border-red-500 rounded-lg p-4 mb-6 text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="w-full bg-green-500/20 border-2 border-green-500 rounded-lg p-4 mb-6 text-green-300 text-sm">
            {success}
            <p className="text-xs mt-2">Redirecting in 3 seconds...</p>
          </div>
        )}

        <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-8 border-2 border-white/20 mb-8">
          <form onSubmit={handleSendReset}>
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-green-400 bg-white/10 text-white placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-4 rounded-lg font-bold text-white transition-all mb-4 ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-all"
            >
              ← Back to Login
            </button>
          </form>
        </div>

        <div className="w-full bg-blue-500/20 border-2 border-blue-400 rounded-lg p-4 text-blue-300 text-sm">
          <p><strong>📧 How it works:</strong></p>
          <p>Check your email inbox for a password reset link. Click it to create a new password. The link expires in 24 hours.</p>
        </div>
      </div>
    </div>
  );
}
