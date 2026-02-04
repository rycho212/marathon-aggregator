// 🍃 Mint Fresh Theme
// Clean, modern, and energizing - perfect for positive running vibes!

export const Colors = {
  // Primary brand colors - fresh mint green
  primary: '#00C9A7',
  primaryDark: '#00A88C',
  primaryLight: '#5EEAD4',

  // Secondary accents - warm coral pink
  secondary: '#FF6F91',
  secondaryDark: '#E85A7B',

  // Backgrounds - light and airy
  background: '#F5FFFA',        // Mint cream
  backgroundLight: '#FFFFFF',   // Pure white
  backgroundCard: '#FFFFFF',    // White cards
  backgroundAccent: '#E8FFF5',  // Light mint for accents

  // Text - dark but not harsh
  text: '#1A1A2E',
  textSecondary: '#4A5568',
  textMuted: '#A0AEC0',

  // Status colors
  success: '#00C9A7',
  warning: '#ECC94B',
  error: '#FC8181',

  // Distance category colors - vibrant but friendly
  distance5k: '#00C9A7',       // Mint (matches primary)
  distance10k: '#4299E1',      // Bright blue
  distanceHalf: '#ECC94B',     // Golden yellow
  distanceMarathon: '#FC8181', // Soft coral
  distanceUltra: '#B794F4',    // Lavender purple
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
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
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
