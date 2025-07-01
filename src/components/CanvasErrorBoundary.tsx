import React from 'react';
import { useVisualStore } from '../store/visualStore';

interface CanvasErrorBoundaryProps {
  children: React.ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class CanvasErrorBoundary extends React.Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Zustand or external service
    if (typeof window !== 'undefined') {
      // Optionally: send to remote logging
      // window.logError?.(error, errorInfo);
    }
    // Optionally: update Zustand error state
    // useVisualStore.getState().setCanvasError?.(error);
    if (process.env.NODE_ENV === 'development') {
      console.error('Canvas error boundary caught:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optionally: reset Zustand error state
    // useVisualStore.getState().setCanvasError?.(null);
    // Optionally: reload the page or re-mount the canvas
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: 'rgba(30, 0, 0, 0.85)',
          color: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center',
          maxWidth: 480,
          margin: '2rem auto',
          boxShadow: '0 0 32px #0008',
        }}>
          <h2>Something went wrong with the 3D canvas.</h2>
          <pre style={{ color: '#ffb4b4', fontSize: 14, margin: '1rem 0', whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
          <button
            onClick={this.handleReset}
            style={{
              background: '#ff4d4f',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0.5rem 1.5rem',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              marginTop: 16,
            }}
          >
            Try to recover
          </button>
        </div>
      );
    }
    return this.props.children;
  }
} 