import React, { useState } from 'react';

export default function AuthForm({
  title,
  subtitle,
  onSubmit,
  error,
  loading,
  isRegister,
  footerButtonText,
  onFooterButtonClick
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister && password !== confirmPassword) {
      onSubmit(null, null, "Passwords do not match.");
      return;
    }
    onSubmit(email, password);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2">{title}</h1>
      <p className="text-center text-gray-300 mb-6">{subtitle}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email (e.g., user@game.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        )}
        <button type="submit" disabled={loading} className="w-full p-3 rounded bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
          {loading ? 'Loading...' : (isRegister ? 'Register' : 'Login')}
        </button>
        <button type="button" onClick={onFooterButtonClick} className="w-full text-center text-sm text-yellow-400 hover:underline">
          {footerButtonText}
        </button>
      </form>
    </div>
  );
}