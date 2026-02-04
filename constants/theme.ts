export const Colors = {
  // Primary brand colors - energetic and sporty
  primary: '#FF6B35',      // Vibrant orange
  primaryDark: '#E85A2C',
  primaryLight: '#FF8A5C',

  // Secondary accents
  secondary: '#4ECDC4',    // Teal accent
  secondaryDark: '#3DB8B0',

  // Backgrounds
  background: '#0F0F1A',   // Deep dark blue
  backgroundLight: '#1A1A2E',
  backgroundCard: '#16213E',

  // Text
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#6B6B7B',

  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',

  // Distance category colors
  distance5k: '#4ECDC4',
  distance10k: '#45B7D1',
  distanceHalf: '#96C93D',
  distanceMarathon: '#FF6B35',
  distanceUltra: '#9B59B6',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 48,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const DistanceCategories = [
  { id: '5k', label: '5K', color: Colors.distance5k, minKm: 0, maxKm: 5.5 },
  { id: '10k', label: '10K', color: Colors.distance10k, minKm: 5.5, maxKm: 12 },
  { id: 'half', label: 'Half Marathon', color: Colors.distanceHalf, minKm: 12, maxKm: 25 },
  { id: 'marathon', label: 'Marathon', color: Colors.distanceMarathon, minKm: 25, maxKm: 50 },
  { id: 'ultra', label: 'Ultra', color: Colors.distanceUltra, minKm: 50, maxKm: Infinity },
];
