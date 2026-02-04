export interface Race {
  id: string;
  name: string;
  date: string;
  city: string;
  state: string;
  country: string;
  distance: number; // in kilometers
  distanceLabel: string;
  category: '5k' | '10k' | 'half' | 'marathon' | 'ultra';
  registrationUrl: string;
  websiteUrl?: string;
  description?: string;
  price?: number;
  currency?: string;
  spotsRemaining?: number;
  totalSpots?: number;
  imageUrl?: string;
  terrain?: 'road' | 'trail' | 'track' | 'mixed';
  elevation?: number; // gain in meters
  isFeatured?: boolean;
  organizerName?: string;

  // NEW: Enhanced race characteristics for recommendations
  characteristics?: RaceCharacteristics;
  vibes?: RaceVibe[];
  tags?: string[];
  avgRating?: number;
  reviewCount?: number;
  difficultyRating?: 1 | 2 | 3 | 4 | 5; // 1=easy, 5=brutal
}

// Detailed race characteristics for filtering & recommendations
export interface RaceCharacteristics {
  // Course profile
  isFlat?: boolean;
  isHilly?: boolean;
  isScenic?: boolean;
  isFastCourse?: boolean;       // Known for PRs
  isLooped?: boolean;           // vs point-to-point
  isBQQualifier?: boolean;      // Boston Qualifier eligible

  // Organization & amenities
  isWellOrganized?: boolean;
  hasExpo?: boolean;
  hasPacers?: boolean;
  hasGoodSwag?: boolean;
  hasQualityMedal?: boolean;
  hasPostRaceParty?: boolean;
  hasAidStations?: boolean;     // For trail/ultras
  hasCutoffTimes?: boolean;

  // Crowd & vibe
  fieldSize?: 'small' | 'medium' | 'large' | 'massive';
  crowdSupport?: 'none' | 'sparse' | 'moderate' | 'great' | 'legendary';

  // Accessibility
  isBeginnerFriendly?: boolean;
  isFamilyFriendly?: boolean;
  isStrollerFriendly?: boolean;
  isWheelchairAccessible?: boolean;

  // Special types
  isVirtual?: boolean;
  isCharity?: boolean;
  isThemed?: boolean;           // Costume, color run, etc.
  isNightRace?: boolean;
  isHolidayRace?: boolean;      // Turkey trot, etc.

  // Experience level recommended
  recommendedFor?: ('beginner' | 'intermediate' | 'advanced' | 'elite')[];
}

// Vibe tags for the "race personality" matching
export type RaceVibe =
  | 'competitive'
  | 'social'
  | 'scenic'
  | 'challenging'
  | 'beginner-friendly'
  | 'family'
  | 'party'
  | 'adventure'
  | 'bucket-list'
  | 'local-favorite'
  | 'hidden-gem'
  | 'iconic'
  | 'fast'
  | 'brutal'
  | 'zen'
  | 'wild';

export interface RaceFilters {
  search: string;
  categories: string[];
  startDate: Date | null;
  endDate: Date | null;
  location: string;
  terrain: string[];
  maxPrice?: number;

  // NEW: Enhanced filters
  vibes?: RaceVibe[];
  characteristics?: Partial<RaceCharacteristics>;
  difficultyRange?: [number, number]; // [min, max]
  fieldSize?: RaceCharacteristics['fieldSize'][];
  maxDistance?: number; // km from user
}

export interface Location {
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// For the personalized feed
export interface FeedItem {
  race: Race;
  relevanceScore: number;
  matchReasons: string[];
  section?: 'for-you' | 'near-you' | 'bucket-list' | 'coming-soon' | 'trending';
}
