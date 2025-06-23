// SafeValues utility for input validation and clamping

export function safeNumber(value: any, fallback = 0) {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function safeColor(value: any, fallback = '#ffffff') {
  if (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }
  return fallback;
} 