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

  export const EffectComposer: React.FC<EffectComposerProps>;
  export const Bloom: React.FC<EffectProps>;
  export const BrightnessContrast: React.FC<EffectProps>;
  export const ChromaticAberration: React.FC<EffectProps>;
  export const Vignette: React.FC<EffectProps>;
} 