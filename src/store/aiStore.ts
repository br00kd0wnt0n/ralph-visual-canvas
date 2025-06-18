// aiStore.ts
// Zustand store for AI analysis and parameter mapping functionality

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ThemeAnalysis, WeatherData } from '../ai-system/types/AITypes';
import { ParameterUpdate } from '../ai-system/services/ParameterMappingEngine';

export interface AIState {
  // AI Analysis Results
  aiResults: ThemeAnalysis | null;
  weatherData: WeatherData | null;
  
  // Parameter Mapping
  parameterUpdates: ParameterUpdate[];
  lastUpdateTime: Date | null;
  
  // Mapping Engine State
  isLiveMode: boolean;
  activeOverrides: Record<string, any>;
  mappingEngineStatus: 'idle' | 'active' | 'error';
  
  // Performance Metrics
  performanceMetrics: {
    fps: number;
    memoryUsage?: {
      used: number;
      total: number;
      percentage: number;
    };
    updateFrequency: number; // updates per second
  };
  
  // UI State
  showParameterTester: boolean;
  selectedVariable: string;
}

export interface AIActions {
  // AI Results Management
  setAIResults: (results: ThemeAnalysis) => void;
  setWeatherData: (data: WeatherData) => void;
  clearAIResults: () => void;
  
  // Parameter Mapping
  addParameterUpdate: (update: ParameterUpdate) => void;
  addParameterUpdates: (updates: ParameterUpdate[]) => void;
  clearParameterUpdates: () => void;
  setLastUpdateTime: (time: Date) => void;
  
  // Live Mode Control
  setLiveMode: (enabled: boolean) => void;
  toggleLiveMode: () => void;
  
  // Override Management
  setOverride: (variable: string, value: any) => void;
  clearOverride: (variable: string) => void;
  clearAllOverrides: () => void;
  
  // Engine Status
  setMappingEngineStatus: (status: AIState['mappingEngineStatus']) => void;
  
  // Performance Monitoring
  updatePerformanceMetrics: (metrics: Partial<AIState['performanceMetrics']>) => void;
  
  // UI Controls
  setShowParameterTester: (show: boolean) => void;
  setSelectedVariable: (variable: string) => void;
  
  // Utility Actions
  resetAIState: () => void;
  exportAIState: () => string;
  importAIState: (stateJson: string) => void;
}

const defaultAIState: AIState = {
  aiResults: null,
  weatherData: null,
  parameterUpdates: [],
  lastUpdateTime: null,
  isLiveMode: true,
  activeOverrides: {},
  mappingEngineStatus: 'idle',
  performanceMetrics: {
    fps: 0,
    updateFrequency: 0
  },
  showParameterTester: false,
  selectedVariable: ''
};

type AIStore = AIState & AIActions;

export const useAIStore = create<AIStore>()(
  subscribeWithSelector((set, get) => ({
    ...defaultAIState,

    // AI Results Management
    setAIResults: (results) => {
      set({ aiResults: results });
    },

    setWeatherData: (data) => {
      set({ weatherData: data });
    },

    clearAIResults: () => {
      set({ 
        aiResults: null, 
        weatherData: null,
        parameterUpdates: [],
        lastUpdateTime: null
      });
    },

    // Parameter Mapping
    addParameterUpdate: (update) => {
      set((state) => ({
        parameterUpdates: [...state.parameterUpdates.slice(-99), update], // Keep last 100 updates
        lastUpdateTime: new Date()
      }));
    },

    addParameterUpdates: (updates) => {
      set((state) => ({
        parameterUpdates: [...state.parameterUpdates.slice(-99), ...updates], // Keep last 100 updates
        lastUpdateTime: new Date()
      }));
    },

    clearParameterUpdates: () => {
      set({ parameterUpdates: [], lastUpdateTime: null });
    },

    setLastUpdateTime: (time) => {
      set({ lastUpdateTime: time });
    },

    // Live Mode Control
    setLiveMode: (enabled) => {
      set({ isLiveMode: enabled });
    },

    toggleLiveMode: () => {
      set((state) => ({ isLiveMode: !state.isLiveMode }));
    },

    // Override Management
    setOverride: (variable, value) => {
      set((state) => ({
        activeOverrides: {
          ...state.activeOverrides,
          [variable]: value
        }
      }));
    },

    clearOverride: (variable) => {
      set((state) => {
        const newOverrides = { ...state.activeOverrides };
        delete newOverrides[variable];
        return { activeOverrides: newOverrides };
      });
    },

    clearAllOverrides: () => {
      set({ activeOverrides: {} });
    },

    // Engine Status
    setMappingEngineStatus: (status) => {
      set({ mappingEngineStatus: status });
    },

    // Performance Monitoring
    updatePerformanceMetrics: (metrics) => {
      set((state) => ({
        performanceMetrics: {
          ...state.performanceMetrics,
          ...metrics
        }
      }));
    },

    // UI Controls
    setShowParameterTester: (show) => {
      set({ showParameterTester: show });
    },

    setSelectedVariable: (variable) => {
      set({ selectedVariable: variable });
    },

    // Utility Actions
    resetAIState: () => {
      set(defaultAIState);
    },

    exportAIState: () => {
      const state = get();
      return JSON.stringify({
        aiResults: state.aiResults,
        weatherData: state.weatherData,
        activeOverrides: state.activeOverrides,
        performanceMetrics: state.performanceMetrics
      }, null, 2);
    },

    importAIState: (stateJson) => {
      try {
        const importedState = JSON.parse(stateJson);
        set((state) => ({
          ...state,
          aiResults: importedState.aiResults || null,
          weatherData: importedState.weatherData || null,
          activeOverrides: importedState.activeOverrides || {},
          performanceMetrics: importedState.performanceMetrics || state.performanceMetrics
        }));
      } catch (error) {
        console.error('Failed to import AI state:', error);
      }
    }
  }))
);

// Subscribe to parameter updates for external integrations
export const subscribeToParameterUpdates = (callback: (updates: ParameterUpdate[]) => void) => {
  return useAIStore.subscribe(
    (state) => state.parameterUpdates,
    (updates) => {
      if (updates.length > 0) {
        callback(updates);
      }
    }
  );
};

// Subscribe to AI results for external integrations
export const subscribeToAIResults = (callback: (results: ThemeAnalysis | null) => void) => {
  return useAIStore.subscribe(
    (state) => state.aiResults,
    callback
  );
};

// Subscribe to weather data for external integrations
export const subscribeToWeatherData = (callback: (data: WeatherData | null) => void) => {
  return useAIStore.subscribe(
    (state) => state.weatherData,
    callback
  );
};

// Subscribe to live mode changes
export const subscribeToLiveMode = (callback: (isLive: boolean) => void) => {
  return useAIStore.subscribe(
    (state) => state.isLiveMode,
    callback
  );
};

// Subscribe to performance metrics
export const subscribeToPerformanceMetrics = (callback: (metrics: AIState['performanceMetrics']) => void) => {
  return useAIStore.subscribe(
    (state) => state.performanceMetrics,
    callback
  );
};

// Utility function to get current state for external use
export const getAIState = () => useAIStore.getState();

// Utility function to apply parameter updates to visual store
export const applyParameterUpdatesToVisualStore = (updates: ParameterUpdate[]) => {
  // This function will be implemented to apply updates to the visual store
  // For now, we'll just log the updates
  console.log('Applying parameter updates to visual store:', updates);
  
  // TODO: Implement integration with visual store
  // This would involve importing the visual store and applying the updates
  // updates.forEach(update => {
  //   // Apply update to visual store based on variable path
  // });
}; 