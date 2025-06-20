export { subtleFlowPreset } from './subtle_flow';
export { dynamicPaintingPreset } from './dynamic_painting';
export { minimalZenPreset } from './minimal_zen';

export const presetNames = {
  subtle_flow: 'Subtle Flow',
  dynamic_painting: 'Dynamic Painting',
  minimal_zen: 'Minimal Zen'
} as const;

export type PresetName = keyof typeof presetNames; 