import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Game Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-900 text-white p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">😓 Game Error</h1>
            <p className="text-xl mb-4">Something went wrong!</p>
            <p className="text-sm text-gray-300 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-red-900 rounded-lg font-bold hover:bg-gray-200"
            >
              Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
