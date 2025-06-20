// Enhanced Toruses, Blobs, Ribbons, and Crystals following the same pattern
const EnhancedToruses: React.FC<{ config: any; paintingBehavior: any }> = ({ 
  config, 
  paintingBehavior 
}) => {
  return (
    <>
      {Array.from({ length: config.count }, (_, i) => (
        <EnhancedTorus 
          key={i} 
          config={config} 
          paintingBehavior={paintingBehavior}
          index={i}
        />
      ))}
    </>
  );
};

const EnhancedTorus: React.FC<{ 
  config: any; 
  paintingBehavior: any; 
  index: number;
}> = ({ config, paintingBehavior, index }) => {
  const meshRef = useRef<any>();
  const [position, setPosition] = useState<any>({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const radius = 6;
    const newPosition = {
      x: Math.cos(time * config.speed + index * 1.5) * radius,
      y: Math.sin(time * config.speed * 0.6 + index * 1.5) * 2,
      z: Math.sin(time * config.speed + index * 1.5) * radius * 0.5
    };
    
    meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
    meshRef.current.rotation.x = time * config.speed * 0.5;
    meshRef.current.rotation.y = time * config.speed;
    setPosition(newPosition);
  });

  return (
    <PaintingObject behavior={paintingBehavior} position={position}>
      <mesh ref={meshRef}>
        <torusGeometry args={[config.size, config.size * 0.4, 16, 32]} />
        <meshStandardMaterial 
          color={config.color} 
          opacity={config.opacity}
          transparent
        />
      </mesh>
    </PaintingObject>
  );
};

const EnhancedBlobs: React.FC<{ config: any; paintingBehavior: any }> = ({ 
  config, 
  paintingBehavior 
}) => {
  return (
    <>
      {Array.from({ length: config.count }, (_, i) => (
        <EnhancedBlob 
          key={i} 
          config={config} 
          paintingBehavior={paintingBehavior}
          index={i}
        />
      ))}
    </>
  );
};

const EnhancedBlob: React.FC<{ 
  config: any; 
  paintingBehavior: any; 
  index: number;
}> = ({ config, paintingBehavior, index }) => {
  const meshRef = useRef<any>();
  const [position, setPosition] = useState<any>({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const newPosition = {
      x: Math.sin(time * config.speed * 0.3 + index * 3) * 7,
      y: Math.cos(time * config.speed * 0.4 + index * 3) * 4,
      z: Math.sin(time * config.speed * 0.2 + index * 3) * 3
    };
    
    // Organic scaling for blob effect
    const scale = 1 + Math.sin(time * 2 + index) * config.organicness * 0.3;
    meshRef.current.scale.setScalar(scale);
    meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
    setPosition(newPosition);
  });

  return (
    <PaintingObject behavior={paintingBehavior} position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[config.size, 2]} />
        <meshStandardMaterial 
          color={config.color} 
          opacity={config.opacity}
          transparent
        />
      </mesh>
    </PaintingObject>
  );
};

const EnhancedRibbons: React.FC<{ config: any; paintingBehavior: any }> = ({ 
  config, 
  paintingBehavior 
}) => {
  return (
    <>
      {Array.from({ length: config.count }, (_, i) => (
        <EnhancedRibbon 
          key={i} 
          config={config} 
          paintingBehavior={paintingBehavior}
          index={i}
        />
      ))}
    </>
  );
};

const EnhancedRibbon: React.FC<{ 
  config: any; 
  paintingBehavior: any; 
  index: number;
}> = ({ config, paintingBehavior, index }) => {
  const meshRef = useRef<any>();
  const [position, setPosition] = useState<any>({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const centerPosition = {
      x: Math.sin(time * config.speed * 0.5 + index * 2) * 5,
      y: Math.cos(time * config.speed * 0.3 + index * 2) * 3,
      z: Math.sin(time * config.speed * 0.4 + index * 2) * 2
    };
    
    meshRef.current.position.set(centerPosition.x, centerPosition.y, centerPosition.z);
    meshRef.current.rotation.z = time * config.flow;
    setPosition(centerPosition);
  });

  return (
    <PaintingObject behavior={paintingBehavior} position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry 
          args={[config.width, config.width, config.length, 8]} 
        />
        <meshStandardMaterial 
          color={config.color} 
          opacity={config.opacity}
          transparent
        />
      </mesh>
    </PaintingObject>
  );
};

const EnhancedCrystals: React.FC<{ config: any; paintingBehavior: any }> = ({ 
  config, 
  paintingBehavior 
}) => {
  return (
    <>
      {Array.from({ length: config.count }, (_, i) => (
        <EnhancedCrystal 
          key={i} 
          config={config} 
          paintingBehavior={paintingBehavior}
          index={i}
        />
      ))}
    </>
  );
};

const EnhancedCrystal: React.FC<{ 
  config: any; 
  paintingBehavior: any; 
  index: number;
}> = ({ config, paintingBehavior, index }) => {
  const meshRef = useRef<any>();
  const [position, setPosition] = useState<any>({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const newPosition = {
      x: Math.cos(time * config.rotation * 0.2 + index * 4) * 6,
      y: Math.sin(time * config.rotation * 0.15 + index * 4) * 4,
      z: Math.cos(time * config.rotation * 0.1 + index * 4) * 3
    };
    
    meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
    meshRef.current.rotation.x = time * config.rotation;
    meshRef.current.rotation.y = time * config.rotation * 0.7;
    meshRef.current.rotation.z = time * config.rotation * 0.5;
    setPosition(newPosition);
  });

  return (
    <PaintingObject behavior={paintingBehavior} position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[config.size, 0]} />
        <meshStandardMaterial 
          color={config.color} 
          opacity={config.opacity}
          transparent
          wireframe={config.complexity < 8}
        />
      </mesh>
    </PaintingObject>
  );
};

// Enhanced Particles System
const EnhancedParticles: React.FC<{ config: any; paintingBehavior: any }> = ({ 
  config, 
  paintingBehavior 
}) => {
  const particlesRef = useRef<any>();
  const positions = useMemo(() => {
    const pos = new Float32Array(config.count * 3);
    for (let i = 0; i < config.count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * config.spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * config.spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * config.spread;
    }
    return pos;
  }, [config.count, config.spread]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;
      positions[i3] += Math.sin(time * config.speed + i) * 0.01;
      positions[i3 + 1] += Math.cos(time * config.speed + i) * 0.01;
      positions[i3 + 2] += Math.sin(time * config.speed * 0.5 + i) * 0.01;
      
      // Paint individual particles if enabled
      if (paintingBehavior.enabled && i % 10 === 0) { // Paint every 10th particle for performance
        // This would need to be connected to the painting system
        // paintToCanvas({ x: positions[i3], y: positions[i3 + 1], z: positions[i3 + 2] });
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={config.count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={config.size} 
        color={config.color}
        transparent
        opacity={config.opacity}
      />
    </points>
  );
};

// Global Effects (unchanged from your existing system)
const GlobalEffects: React.FC<{ config: any }> = ({ config }) => {
  return (
    <>
      {/* Your existing global effects components */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* Add your other effects here */}
    </>
  );
};

// Development Control Panel
const ArtisticControlPanel: React.FC<{ 
  config: ArtisticCanvasConfig; 
  onConfigChange: (config: ArtisticCanvasConfig) => void;
}> = ({ config, onConfigChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700"
        >
          🎨 Artistic Controls
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-80 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg z-50 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Artistic Canvas Controls</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      {/* Painting System Controls */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Painting System</h4>
        <label className="block text-sm mb-1">Fade Rate</label>
        <input 
          type="range" 
          min="0.001" 
          max="0.1" 
          step="0.001"
          value={config.paintingSystem.fadeRate}
          onChange={(e) => {
            const newConfig = { ...config };
            newConfig.paintingSystem.fadeRate = parseFloat(e.target.value);
            onConfigChange(newConfig);
          }}
          className="w-full"
        />
        
        <label className="block text-sm mb-1 mt-2">Blend Mode</label>
        <select 
          value={config.paintingSystem.activeBlendMode}
          onChange={(e) => {
            const newConfig = { ...config };
            newConfig.paintingSystem.activeBlendMode = e.target.value as any;
            onConfigChange(newConfig);
          }}
          className="w-full bg-gray-700 text-white rounded px-2 py-1"
        >
          <option value="normal">Normal</option>
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
          <option value="soft-light">Soft Light</option>
          <option value="hard-light">Hard Light</option>
          <option value="color-dodge">Color Dodge</option>
        </select>
      </div>

      {/* Object Behavior Quick Controls */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Object Behaviors</h4>
        {Object.entries(config.objectBehaviors).map(([objectType, behavior]) => (
          <div key={objectType} className="mb-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={behavior.enabled}
                onChange={(e) => {
                  const newConfig = { ...config };
                  newConfig.objectBehaviors[objectType as keyof typeof newConfig.objectBehaviors].enabled = e.target.checked;
                  onConfigChange(newConfig);
                }}
                className="mr-2"
              />
              <span className="text-sm capitalize">{objectType}</span>
            </label>
            
            {behavior.enabled && (
              <div className="ml-4 mt-1">
                <label className="block text-xs">Opacity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={behavior.opacity}
                  onChange={(e) => {
                    const newConfig = { ...config };
                    newConfig.objectBehaviors[objectType as keyof typeof newConfig.objectBehaviors].opacity = parseFloat(e.target.value);
                    onConfigChange(newConfig);
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preset Loader */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Presets</h4>
        <div className="space-y-1">
          {Object.keys(ArtisticPresets).map((presetName) => (
            <button 
              key={presetName}
              onClick={() => {
                const preset = ArtisticPresets[presetName as keyof typeof ArtisticPresets];
                onConfigChange(preset);
              }}
              className="w-full text-left text-sm bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
              {presetName.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Export/Import */}
      <div>
        <button 
          onClick={() => {
            const configJson = JSON.stringify(config, null, 2);
            navigator.clipboard.writeText(configJson);
            alert('Config copied to clipboard!');
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm"
        >
          Export Config
        </button>
      </div>
    </div>
  );
};

// Placeholder for your existing canvas (to be replaced with your actual implementation)
const YourExistingCanvas: React.FC<any> = (props) => {
  return (
    <Canvas>
      {/* Your existing 3D scene implementation */}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* Your existing shapes and effects */}
    </Canvas>
  );
};

// Utility functions
const getSeason = (date: Date): 'spring' | 'summer' | 'fall' | 'winter' => {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

// Export the enhanced canvas
export default EnhancedVisualCanvas;
export { ArtisticConfigBuilder, ArtisticPresets, ParameterIntegration };

// Usage example:
/*
<EnhancedVisualCanvas
  geometric={your_geometric_config}
  particles={your_particles_config}
  globalEffects={your_global_effects}
  backgroundConfig={your_background_config}
  artisticMode="dynamic"
  performanceMode="balanced"
  enableDynamicUpdates={true}
  aiResults={your_ai_results}
  weatherData={your_weather_data}
  onArtisticConfigChange={(config) => {
    console.log('Artistic config updated:', config);
  }}
/>
*/ EnhancedVisualCanvas.tsx - Integration with your existing system

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ArtisticCanvas, PaintingObject } from './ArtisticCanvasSystem';
import { ArtisticPresets, ArtisticConfigBuilder, ParameterIntegration } from './ArtisticConfigSystem';
import type { ArtisticCanvasConfig } from './ArtisticConfigSystem';

// Enhanced Canvas that wraps your existing components
interface EnhancedVisualCanvasProps {
  // Your existing props
  geometric: any;
  particles: any;
  globalEffects: any;
  backgroundConfig: any;
  
  // New artistic props
  artisticMode?: 'off' | 'subtle' | 'dynamic' | 'minimal' | 'custom';
  customArtisticConfig?: ArtisticCanvasConfig;
  
  // AI and weather integration
  aiResults?: any;
  weatherData?: any;
  
  // Performance and customization
  performanceMode?: 'quality' | 'balanced' | 'performance';
  enableDynamicUpdates?: boolean;
  
  // Callbacks
  onArtisticConfigChange?: (config: ArtisticCanvasConfig) => void;
}

const EnhancedVisualCanvas: React.FC<EnhancedVisualCanvasProps> = ({
  geometric,
  particles,
  globalEffects,
  backgroundConfig,
  artisticMode = 'subtle',
  customArtisticConfig,
  aiResults,
  weatherData,
  performanceMode = 'balanced',
  enableDynamicUpdates = true,
  onArtisticConfigChange,
}) => {
  const [artisticConfig, setArtisticConfig] = useState<ArtisticCanvasConfig>(() => {
    if (customArtisticConfig) return customArtisticConfig;
    
    // Create initial config based on mode and performance
    const builder = new ArtisticConfigBuilder(
      artisticMode === 'off' ? undefined : 
      artisticMode === 'custom' ? 'subtle_flow' :
      artisticMode as keyof typeof ArtisticPresets
    );
    
    if (performanceMode === 'performance') {
      builder.optimizeForPerformance();
    } else if (performanceMode === 'quality') {
      builder.optimizeForQuality();
    }
    
    return builder.build();
  });

  // Dynamic updater for real-time changes
  const dynamicUpdater = useMemo(() => {
    return ParameterIntegration.createDynamicUpdater((newConfig) => {
      setArtisticConfig(newConfig);
      onArtisticConfigChange?.(newConfig);
    });
  }, [onArtisticConfigChange]);

  // Update artistic config when AI results change
  useEffect(() => {
    if (enableDynamicUpdates && aiResults && artisticMode !== 'off') {
      dynamicUpdater.updateFromAI(aiResults, artisticConfig);
    }
  }, [aiResults, enableDynamicUpdates, artisticMode]);

  // Update artistic config when weather changes
  useEffect(() => {
    if (enableDynamicUpdates && weatherData && artisticMode !== 'off') {
      dynamicUpdater.updateFromWeather(weatherData, artisticConfig);
    }
  }, [weatherData, enableDynamicUpdates, artisticMode]);

  // Time-based updates
  useEffect(() => {
    if (!enableDynamicUpdates || artisticMode === 'off') return;
    
    const timeUpdateInterval = setInterval(() => {
      const now = new Date();
      const timeData = {
        hour: now.getHours(),
        minute: now.getMinutes(),
        day: now.getDay(),
        season: getSeason(now)
      };
      
      dynamicUpdater.updateFromTime(timeData, artisticConfig);
    }, 60000); // Update every minute

    return () => clearInterval(timeUpdateInterval);
  }, [enableDynamicUpdates, artisticMode]);

  // If artistic mode is off, render your existing canvas
  if (artisticMode === 'off') {
    return (
      <YourExistingCanvas 
        geometric={geometric}
        particles={particles}
        globalEffects={globalEffects}
        backgroundConfig={backgroundConfig}
      />
    );
  }

  // Render with artistic enhancements
  return (
    <ArtisticCanvas config={artisticConfig}>
      {/* Enhanced Spheres */}
      {geometric.spheres.count > 0 && (
        <EnhancedSpheres 
          config={geometric.spheres}
          paintingBehavior={artisticConfig.objectBehaviors.spheres}
        />
      )}
      
      {/* Enhanced Cubes */}
      {geometric.cubes.count > 0 && (
        <EnhancedCubes 
          config={geometric.cubes}
          paintingBehavior={artisticConfig.objectBehaviors.cubes}
        />
      )}
      
      {/* Enhanced Toruses */}
      {geometric.toruses.count > 0 && (
        <EnhancedToruses 
          config={geometric.toruses}
          paintingBehavior={artisticConfig.objectBehaviors.toruses}
        />
      )}
      
      {/* Enhanced Blobs */}
      {geometric.blobs.count > 0 && (
        <EnhancedBlobs 
          config={geometric.blobs}
          paintingBehavior={artisticConfig.objectBehaviors.blobs}
        />
      )}
      
      {/* Enhanced Ribbons */}
      {geometric.ribbons.count > 0 && (
        <EnhancedRibbons 
          config={geometric.ribbons}
          paintingBehavior={artisticConfig.objectBehaviors.ribbons}
        />
      )}
      
      {/* Enhanced Crystals */}
      {geometric.crystals.count > 0 && (
        <EnhancedCrystals 
          config={geometric.crystals}
          paintingBehavior={artisticConfig.objectBehaviors.crystals}
        />
      )}
      
      {/* Enhanced Particles */}
      {particles.count > 0 && (
        <EnhancedParticles 
          config={particles}
          paintingBehavior={artisticConfig.objectBehaviors.particles}
        />
      )}
      
      {/* Global Effects (unchanged) */}
      <GlobalEffects config={globalEffects} />
      
      {/* Artistic Enhancement Control Panel (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <ArtisticControlPanel 
          config={artisticConfig}
          onConfigChange={setArtisticConfig}
        />
      )}
    </ArtisticCanvas>
  );
};

// Enhanced object components that add painting behavior
const EnhancedSpheres: React.FC<{ config: any; paintingBehavior: any }> = ({ 
  config, 
  paintingBehavior 
}) => {
  const spherePositions = useRef<any[]>([]);
  
  return (
    <>
      {Array.from({ length: config.count }, (_, i) => (
        <EnhancedSphere 
          key={i} 
          config={config} 
          paintingBehavior={paintingBehavior}
          index={i}
          onPositionUpdate={(position) => {
            spherePositions.current[i] = position;
          }}
        />
      ))}
    </>
  );
};

const EnhancedSphere: React.FC<{ 
  config: any; 
  paintingBehavior: any; 
  index: number;
  onPositionUpdate: (position: any) => void;
}> = ({ config, paintingBehavior, index, onPositionUpdate }) => {
  const meshRef = useRef<any>();
  const [position, setPosition] = useState<any>({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Your existing sphere animation logic here
    const time = state.clock.elapsedTime;
    const newPosition = {
      x: Math.sin(time * config.speed + index) * 5,
      y: Math.cos(time * config.speed * 0.7 + index) * 3,
      z: Math.sin(time * config.speed * 0.5 + index) * 2
    };
    
    meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
    setPosition(newPosition);
    onPositionUpdate(newPosition);
  });

  return (
    <PaintingObject behavior={paintingBehavior} position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.size, 32, 32]} />
        <meshStandardMaterial 
          color={config.color} 
          opacity={config.opacity}
          transparent
        />
      </mesh>
    </PaintingObject>
  );
};

// Similar pattern for other shapes (Cubes, Toruses, etc.)
const EnhancedCubes: React.FC<{ config: any; paintingBehavior: any }> = ({ 
  config, 
  paintingBehavior 
}) => {
  return (
    <>
      {Array.from({ length: config.count }, (_, i) => (
        <EnhancedCube 
          key={i} 
          config={config} 
          paintingBehavior={paintingBehavior}
          index={i}
        />
      ))}
    </>
  );
};

const EnhancedCube: React.FC<{ 
  config: any; 
  paintingBehavior: any; 
  index: number;
}> = ({ config, paintingBehavior, index }) => {
  const meshRef = useRef<any>();
  const [position, setPosition] = useState<any>({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const newPosition = {
      x: Math.cos(time * config.rotation + index * 2) * 4,
      y: Math.sin(time * config.rotation * 0.8 + index * 2) * 3,
      z: Math.cos(time * config.rotation * 0.6 + index * 2) * 2
    };
    
    meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
    meshRef.current.rotation.x = time * config.rotation;
    meshRef.current.rotation.y = time * config.rotation * 0.7;
    setPosition(newPosition);
  });

  return (
    <PaintingObject behavior={paintingBehavior} position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[config.size, config.size, config.size]} />
        <meshStandardMaterial 
          color={config.color} 
          opacity={config.opacity}
          transparent
        />
      </mesh>
    </PaintingObject>
  );
};

//