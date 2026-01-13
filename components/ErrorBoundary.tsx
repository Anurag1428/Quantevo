'use client';

import { ReactNode, Component, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-gray-950">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={this.resetError}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
