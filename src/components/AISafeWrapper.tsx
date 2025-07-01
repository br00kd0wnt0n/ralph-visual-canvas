import React, { Component, ReactNode } from 'react';
import { useVisualStore } from '../store/visualStore';
import type { VisualState } from '../store/visualStore';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class AIErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AI Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">AI Feature Unavailable</h3>
          <p className="text-red-600 text-sm mt-1">
            The AI feature encountered an error and has been disabled for safety.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AISafeWrapperProps {
  children: ReactNode;
  featureKey: keyof NonNullable<VisualState['ai']>['features'];
  fallback?: ReactNode;
  showWhenDisabled?: boolean;
}

export const AISafeWrapper: React.FC<AISafeWrapperProps> = ({
  children,
  featureKey,
  fallback,
  showWhenDisabled = false
}) => {
  const { ai } = useVisualStore();
  
  // Check if AI is enabled and the specific feature is enabled
  const isAIEnabled = ai?.enabled ?? false;
  const isFeatureEnabled = ai?.features?.[featureKey] ?? false;
  
  // If AI is disabled or feature is disabled, show fallback or nothing
  if (!isAIEnabled || !isFeatureEnabled) {
    if (showWhenDisabled) {
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-gray-800 font-medium">AI Feature Disabled</h3>
          <p className="text-gray-600 text-sm mt-1">
            This AI feature is currently disabled. Enable AI features in the settings to use this functionality.
          </p>
        </div>
      );
    }
    return null;
  }

  // Wrap in error boundary for safety
  return (
    <AIErrorBoundary fallback={fallback}>
      {children}
    </AIErrorBoundary>
  );
};

// Convenience components for specific AI features
export const WeatherIntegrationWrapper: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <AISafeWrapper featureKey="weatherIntegration" fallback={fallback}>
    {children}
  </AISafeWrapper>
);

export const ColorHarmonyWrapper: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <AISafeWrapper featureKey="colorHarmony" fallback={fallback}>
    {children}
  </AISafeWrapper>
);

export const ThemeAnalysisWrapper: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <AISafeWrapper featureKey="themeAnalysis" fallback={fallback}>
    {children}
  </AISafeWrapper>
);

export const ParameterInterpolationWrapper: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => (
  <AISafeWrapper featureKey="parameterInterpolation" fallback={fallback}>
    {children}
  </AISafeWrapper>
); 