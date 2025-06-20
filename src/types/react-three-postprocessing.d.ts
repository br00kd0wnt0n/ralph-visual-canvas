declare module '@react-three/postprocessing' {
  import { ReactNode } from 'react';
  import { Effect } from 'postprocessing';

  export interface EffectComposerProps {
    children?: ReactNode;
    enabled?: boolean;
    [key: string]: any;
  }

  export interface EffectProps {
    enabled?: boolean;
    [key: string]: any;
  }

  export interface DepthOfFieldProps {
    blendFunction?: any;
    worldFocusDistance?: number;
    worldFocusRange?: number;
    focusDistance?: number;
    focalLength?: number;
    focusRange?: number;
    bokehScale?: number;
    resolutionScale?: number;
    resolutionX?: number;
    resolutionY?: number;
    width?: number;
    height?: number;
    target?: any;
    depthTexture?: any;
    blur?: number;
    enabled?: boolean;
  }

  export const EffectComposer: React.FC<EffectComposerProps>;
  export const Bloom: React.FC<EffectProps>;
  export const BrightnessContrast: React.FC<EffectProps>;
  export const ChromaticAberration: React.FC<EffectProps>;
  export const Vignette: React.FC<EffectProps>;
  export const DepthOfField: React.FC<DepthOfFieldProps>;
} 