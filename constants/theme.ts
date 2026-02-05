// GetABib Theme
// Clean, minimal, professional - a sleek race discovery platform

export const Colors = {
  // Primary brand color - single mint accent
  primary: '#00C9A7',
  primaryDark: '#00A88C',
  primaryLight: '#E6FAF6',

  // Keep secondary minimal
  secondary: '#64748B',
  secondaryDark: '#475569',

  // Backgrounds - clean whites and grays
  background: '#FAFBFC',
  backgroundLight: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  backgroundAccent: '#F1F5F9',

  // Text - professional gray scale
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',

  // Status colors - muted versions
  success: '#00C9A7',
  warning: '#F59E0B',
  error: '#EF4444',

  // Distance category colors - subtle, uniform tints
  distance5k: '#00C9A7',
  distance10k: '#00C9A7',
  distanceHalf: '#00C9A7',
  distanceMarathon: '#00C9A7',
  distanceUltra: '#00C9A7',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Less rounded - more professional
export const BorderRadius = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
};

// Slightly smaller, lighter fonts
export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  hero: 36,
};

// Thinner font weights
export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const DistanceCategories = [
  { id: '5k', label: '5K', color: Colors.primary, minKm: 0, maxKm: 5.5 },
  { id: '10k', label: '10K', color: Colors.primary, minKm: 5.5, maxKm: 12 },
  { id: 'half', label: 'Half', color: Colors.primary, minKm: 12, maxKm: 25 },
  { id: 'marathon', label: 'Marathon', color: Colors.primary, minKm: 25, maxKm: 50 },
  { id: 'ultra', label: 'Ultra', color: Colors.primary, minKm: 50, maxKm: Infinity },
];
