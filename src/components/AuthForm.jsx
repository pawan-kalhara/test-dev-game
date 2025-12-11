import React, { useState } from 'react';

export default function AuthForm({
  title,
  subtitle,
  onSubmit,
  error,
  loading,
  isRegister,
  footerButtonText,
  onFooterButtonClick,
  onForgotPassword,
  onGoogleSignIn,
  googleLoading
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      return;
    }

    onSubmit(email, password);
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
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
         {title}
        </h1>
        <p className="text-green-200 mb-8 text-center">{subtitle}</p>

        {error && (
          <div className="w-full bg-red-500/20 border-2 border-red-500 rounded-lg p-4 mb-6 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-8 border-2 border-white/20 mb-8">
          
          {/* Email/Password Form */}
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-white font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-green-400 bg-white/10 text-white placeholder-gray-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-green-400 bg-white/10 text-white placeholder-gray-500"
                required
              />
            </div>

            {isRegister && (
              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-green-400 bg-white/10 text-white placeholder-gray-500"
                  required
                />
              </div>
            )}

            {/* Forgot Password Link (only on login) */}
            {!isRegister && onForgotPassword && (
              <div className="mb-6 text-right">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-green-300 hover:text-green-200 text-sm font-bold transition-all"
                >
                  🔑 Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className={`w-full px-6 py-4 rounded-lg font-bold text-white transition-all mb-4 ${
                loading || googleLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? '⏳ Processing...' : (isRegister ? '✓ Create Account' : '✓ Login')}
            </button>
          </form>

          {/* Divider (only show if Google is available) */}
          {onGoogleSignIn && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 border-t border-gray-500"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-500"></div>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={googleLoading || loading}
                className={`w-full px-6 py-4 rounded-lg font-bold text-white transition-all mb-4 flex items-center justify-center gap-3 ${
                  googleLoading || loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {/* Google Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
                </svg>
                {googleLoading ? '⏳ Signing in...' : (isRegister ? 'Sign up with Google' : 'Sign in with Google')}
              </button>
            </>
          )}

          {/* Footer Button */}
          <button
            type="button"
            onClick={onFooterButtonClick}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
          >
            {footerButtonText}
          </button>
        </div>

        <div className="w-full bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-4 text-yellow-300 text-sm">
          <p><strong>💡 Tip:</strong> You can login with email/password or use Google. If you're a new user, Google will create an account automatically!</p>
        </div>
      </div>
    </div>
  );
}