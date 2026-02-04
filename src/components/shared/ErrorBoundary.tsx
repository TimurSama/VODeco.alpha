'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
            <div className="glass-card p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h2>
              <p className="text-white/60 mb-6">{this.state.error?.message}</p>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                className="px-6 py-3 bg-neon-cyan text-white rounded-lg font-semibold hover:bg-neon-cyan/80 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
