import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ArtisticCanvas, PaintingObject } from './ArtisticCanvasSystem';
import { ArtisticPresets, ArtisticConfigBuilder } from './ArtisticConfigSystem';
import { subtleFlowPreset, dynamicPaintingPreset, minimalZenPreset } from './presets';
import { ArtisticCanvasConfig } from '../../types/artistic';

// Example 3D objects that will become painting brushes
const ExampleSphere: React.FC<{ 
  behavior: any; 
  position: { x: number; y: number; z: number };
  color: string;
  index: number;
}> = ({ behavior, position, color, index }) => {
  return (
    <PaintingObject 
      behavior={behavior} 
      position={position}
      objectColor={color}
      index={index}
    >
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </PaintingObject>
  );
};

const ExampleCube: React.FC<{ 
  behavior: any; 
  position: { x: number; y: number; z: number };
  color: string;
  index: number;
}> = ({ behavior, position, color, index }) => {
  return (
    <PaintingObject 
      behavior={behavior} 
      position={position}
      objectColor={color}
      index={index}
    >
      <mesh position={[position.x, position.y, position.z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </PaintingObject>
  );
};

const ExampleTorus: React.FC<{ 
  behavior: any; 
  position: { x: number; y: number; z: number };
  color: string;
  index: number;
}> = ({ behavior, position, color, index }) => {
  return (
    <PaintingObject 
      behavior={behavior} 
      position={position}
      objectColor={color}
      index={index}
    >
      <mesh position={[position.x, position.y, position.z]}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </PaintingObject>
  );
};

// Main example component
export const ArtisticCanvasExample: React.FC = () => {
  const [currentPreset, setCurrentPreset] = useState<ArtisticCanvasConfig>(subtleFlowPreset);
  const [presetName, setPresetName] = useState<string>('subtle_flow');

  const handlePresetChange = (presetKey: string) => {
    setPresetName(presetKey);
    switch (presetKey) {
      case 'subtle_flow':
        setCurrentPreset(subtleFlowPreset);
        break;
      case 'dynamic_painting':
        setCurrentPreset(dynamicPaintingPreset);
        break;
      case 'minimal_zen':
        setCurrentPreset(minimalZenPreset);
        break;
      default:
        setCurrentPreset(subtleFlowPreset);
    }
  };

  const createCustomConfig = () => {
    const customConfig = new ArtisticConfigBuilder('subtle_flow')
      .setAquariumView(30, 60)
      .setFadeRate(0.01)
      .setBlendMode('screen')
      .enableTrails(['spheres', 'toruses'], { 
        trailLength: 40, 
        trailWidth: 5, 
        trailFade: 0.97 
      })
      .enableGlow(['blobs'], { 
        glowIntensity: 1.5, 
        glowRadius: 25 
      })
      .addTextureLayer('watercolor', { 
        opacity: 0.15, 
        blendMode: 'overlay',
        scale: 1.2,
        movement: { x: 0.05, y: 0.02 }
      })
      .setColorGrading({ 
        saturation: 1.2, 
        contrast: 1.1, 
        brightness: 1.05 
      })
      .enableCohesionEffects({
        connectionLines: { 
          enabled: true, 
          maxDistance: 35, 
          opacity: 0.15, 
          thickness: 1.5, 
          color: 'temperature' 
        }
      })
      .makeWeatherResponsive()
      .build();

    setCurrentPreset(customConfig);
    setPresetName('custom');
  };

  return (
    <div className="w-full h-screen relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
        <h3 className="text-lg font-bold mb-2">Artistic Canvas Presets</h3>
        <div className="space-y-2">
          <button
            onClick={() => handlePresetChange('subtle_flow')}
            className={`block w-full px-3 py-2 rounded text-sm ${
              presetName === 'subtle_flow' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Subtle Flow
          </button>
          <button
            onClick={() => handlePresetChange('dynamic_painting')}
            className={`block w-full px-3 py-2 rounded text-sm ${
              presetName === 'dynamic_painting' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Dynamic Painting
          </button>
          <button
            onClick={() => handlePresetChange('minimal_zen')}
            className={`block w-full px-3 py-2 rounded text-sm ${
              presetName === 'minimal_zen' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Minimal Zen
          </button>
          <button
            onClick={createCustomConfig}
            className={`block w-full px-3 py-2 rounded text-sm ${
              presetName === 'custom' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Custom Config
          </button>
        </div>
      </div>

      {/* Canvas */}
      <Canvas>
        <ArtisticCanvas config={currentPreset}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Example objects that will paint */}
          {currentPreset.objectBehaviors.spheres.enabled && (
            <>
              <ExampleSphere 
                behavior={currentPreset.objectBehaviors.spheres}
                position={{ x: -3, y: 2, z: 0 }}
                color="#ff6b6b"
                index={0}
              />
              <ExampleSphere 
                behavior={currentPreset.objectBehaviors.spheres}
                position={{ x: 3, y: -2, z: 0 }}
                color="#4ecdc4"
                index={1}
              />
              <ExampleSphere 
                behavior={currentPreset.objectBehaviors.spheres}
                position={{ x: 0, y: 3, z: 2 }}
                color="#45b7d1"
                index={2}
              />
            </>
          )}

          {currentPreset.objectBehaviors.cubes.enabled && (
            <>
              <ExampleCube 
                behavior={currentPreset.objectBehaviors.cubes}
                position={{ x: -2, y: -1, z: 1 }}
                color="#96ceb4"
                index={0}
              />
              <ExampleCube 
                behavior={currentPreset.objectBehaviors.cubes}
                position={{ x: 2, y: 1, z: -1 }}
                color="#feca57"
                index={1}
              />
            </>
          )}

          {currentPreset.objectBehaviors.toruses.enabled && (
            <>
              <ExampleTorus 
                behavior={currentPreset.objectBehaviors.toruses}
                position={{ x: -1, y: 0, z: 3 }}
                color="#ff9ff3"
                index={0}
              />
              <ExampleTorus 
                behavior={currentPreset.objectBehaviors.toruses}
                position={{ x: 1, y: 0, z: -3 }}
                color="#54a0ff"
                index={1}
              />
            </>
          )}

          {/* Orbit controls for camera movement */}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            maxDistance={50}
            minDistance={5}
          />
        </ArtisticCanvas>
      </Canvas>

      {/* Info overlay */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-w-sm">
        <h4 className="font-bold mb-2">Current Preset: {presetName}</h4>
        <p className="text-sm text-gray-300 mb-2">
          The 3D objects are now painting brushes! Watch as they create trails, stamps, and effects on the canvas overlay.
        </p>
        <div className="text-xs text-gray-400">
          <p>• Spheres: {currentPreset.objectBehaviors.spheres.type} painting</p>
          <p>• Cubes: {currentPreset.objectBehaviors.cubes.type} painting</p>
          <p>• Toruses: {currentPreset.objectBehaviors.toruses.type} painting</p>
          <p>• Blend Mode: {currentPreset.paintingSystem.activeBlendMode}</p>
          <p>• Fade Rate: {currentPreset.paintingSystem.fadeRate}</p>
        </div>
      </div>
    </div>
  );
}; 