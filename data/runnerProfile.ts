// Runner Profile & Personality System
// This powers the personalized recommendation algorithm

export interface RunnerProfile {
  id: string;

  // Basic info
  name?: string;
  location?: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };

  // Running personality (calculated from preferences + behavior)
  personality: RunnerPersonality;

  // Explicit preferences
  preferences: RunnerPreferences;

  // Behavioral signals (what they actually do)
  behavior: RunnerBehavior;

  // Goals & motivations
  goals: RunnerGoals;
}

// The "Race Personality" - like a Spotify taste profile
export interface RunnerPersonality {
  // Core personality type (primary)
  primaryType: PersonalityType;

  // Secondary influences
  secondaryTypes: PersonalityType[];

  // Detailed trait scores (0-100)
  traits: {
    adventurous: number;      // Trail seeker vs road loyalist
    competitive: number;      // PR chaser vs experience seeker
    social: number;           // Group runner vs solo warrior
    endurance: number;        // Ultra curious vs speed demon
    explorer: number;         // Travel for races vs local hero
    casual: number;           // Fun runner vs serious athlete
  };

  // Calculated affinity scores for race types
  raceAffinities: {
    '5k': number;
    '10k': number;
    'half': number;
    'marathon': number;
    'ultra': number;
    'trail': number;
    'road': number;
    'themed': number;        // Color runs, costume runs, etc.
    'destination': number;   // Travel-worthy bucket list races
    'local': number;         // Community races
  };
}

// Personality archetypes for easy categorization
export type PersonalityType =
  | 'trail_seeker'        // Loves dirt, elevation, nature
  | 'urban_speedster'     // City races, fast times, convenience
  | 'bucket_lister'       // World majors, destination races
  | 'community_runner'    // Local 5Ks, charity runs, social aspect
  | 'ultra_curious'       // Pushing limits, long distances
  | 'casual_adventurer'   // Fun runs, themed events, not too serious
  | 'pr_hunter'           // All about the times, flat fast courses
  | 'scenic_explorer'     // Beautiful courses, doesn't care about time
  | 'family_runner'       // Kid-friendly, stroller-friendly, fun for all
  | 'newbie'              // Just starting out, needs guidance

// User's explicit preferences
export interface RunnerPreferences {
  // Distance preferences
  preferredDistances: ('5k' | '10k' | 'half' | 'marathon' | 'ultra')[];

  // Terrain preferences
  terrain: {
    road: number;     // 0-100 preference score
    trail: number;
    track: number;
    mixed: number;
  };

  // Race characteristics
  characteristics: {
    flat: boolean;
    hilly: boolean;
    scenic: boolean;
    fast: boolean;           // Known for PRs
    wellOrganized: boolean;
    smallField: boolean;
    largeCrowd: boolean;
    goodSwag: boolean;
    qualityMedal: boolean;
    postRaceParty: boolean;
  };

  // Logistics
  maxTravelDistance: number;  // miles willing to travel
  maxPrice: number;           // budget per race
  preferredDays: ('saturday' | 'sunday' | 'weekday')[];

  // Vibe
  vibes: string[];  // ['competitive', 'social', 'scenic', 'challenging', 'beginner-friendly', 'family', 'party']
}

// Behavioral signals (implicit preferences from actions)
export interface RunnerBehavior {
  // Races they've shown interest in
  viewedRaces: string[];
  savedRaces: string[];
  registeredRaces: string[];
  completedRaces: string[];

  // Search patterns
  recentSearches: {
    query: string;
    filters: any;
    timestamp: Date;
  }[];

  // Category engagement
  categoryViews: {
    '5k': number;
    '10k': number;
    'half': number;
    'marathon': number;
    'ultra': number;
  };

  // Time spent on different race types
  dwellTime: {
    trail: number;
    road: number;
    themed: number;
  };
}

// What motivates this runner
export interface RunnerGoals {
  // Current training goals
  currentGoal?: {
    type: 'first_race' | 'pr' | 'distance_milestone' | 'streak' | 'bucket_list' | 'fitness' | 'social';
    targetRace?: string;
    targetTime?: string;
    targetDate?: Date;
  };

  // Bucket list races
  bucketList: string[];

  // Completed milestones
  completedMilestones: string[];
}

// Personality quiz questions for onboarding
export const personalityQuizQuestions = [
  {
    id: 'terrain',
    question: "Your ideal running surface?",
    options: [
      { value: 'road', label: '🛣️ Smooth pavement', traits: { adventurous: -10, competitive: 10 } },
      { value: 'trail', label: '🌲 Dirt trails', traits: { adventurous: 20, explorer: 15 } },
      { value: 'mixed', label: '🔀 Mix it up!', traits: { adventurous: 10, explorer: 10 } },
    ]
  },
  {
    id: 'motivation',
    question: "What gets you to the start line?",
    options: [
      { value: 'pr', label: '⏱️ Chasing a PR', traits: { competitive: 25, casual: -15 } },
      { value: 'experience', label: '🎉 The experience', traits: { social: 15, casual: 10 } },
      { value: 'challenge', label: '🏔️ The challenge', traits: { adventurous: 15, endurance: 10 } },
      { value: 'social', label: '👥 Running with friends', traits: { social: 25, competitive: -10 } },
    ]
  },
  {
    id: 'distance',
    question: "Your sweet spot distance?",
    options: [
      { value: '5k', label: '5K - Quick & fun', traits: { casual: 10, endurance: -10 } },
      { value: '10k', label: '10K - Just right', traits: { competitive: 5 } },
      { value: 'half', label: 'Half Marathon - The classic', traits: { endurance: 10 } },
      { value: 'marathon', label: 'Marathon - Go big', traits: { endurance: 20, competitive: 10 } },
      { value: 'ultra', label: 'Ultra - No limits', traits: { endurance: 30, adventurous: 20 } },
    ]
  },
  {
    id: 'travel',
    question: "Would you travel for an amazing race?",
    options: [
      { value: 'local', label: '📍 Keep it local', traits: { explorer: -15 } },
      { value: 'regional', label: '🚗 A few hours drive', traits: { explorer: 5 } },
      { value: 'destination', label: '✈️ Absolutely! Race-cations are the best', traits: { explorer: 25 } },
    ]
  },
  {
    id: 'crowd',
    question: "Race day crowd preference?",
    options: [
      { value: 'big', label: '🎊 Big energy, big crowds', traits: { social: 15, competitive: 10 } },
      { value: 'small', label: '🤝 Intimate, community feel', traits: { social: 5, casual: 10 } },
      { value: 'solo', label: '🧘 Just me and the course', traits: { social: -10, adventurous: 10 } },
    ]
  },
  {
    id: 'priority',
    question: "Most important race feature?",
    options: [
      { value: 'scenery', label: '🏞️ Beautiful scenery', traits: { adventurous: 10, explorer: 15 } },
      { value: 'organization', label: '📋 Well organized', traits: { competitive: 10 } },
      { value: 'swag', label: '🎽 Great swag & medal', traits: { casual: 10, social: 5 } },
      { value: 'course', label: '📈 Fast course for PRs', traits: { competitive: 20, casual: -10 } },
      { value: 'party', label: '🍻 Post-race party', traits: { social: 20, casual: 15 } },
    ]
  },
];

// Calculate personality type from traits
export function calculatePersonalityType(traits: RunnerPersonality['traits']): PersonalityType {
  const { adventurous, competitive, social, endurance, explorer, casual } = traits;

  // Determine primary type based on dominant traits
  if (adventurous > 70 && endurance > 60) return 'trail_seeker';
  if (competitive > 70 && adventurous < 40) return 'pr_hunter';
  if (explorer > 70) return 'bucket_lister';
  if (social > 70 && casual > 50) return 'community_runner';
  if (endurance > 80) return 'ultra_curious';
  if (casual > 70 && social > 50) return 'casual_adventurer';
  if (adventurous > 60 && explorer > 50) return 'scenic_explorer';
  if (competitive > 60 && adventurous < 50) return 'urban_speedster';
  if (casual > 60 && social > 40) return 'family_runner';

  return 'newbie';
}

// Get personality description for display
export function getPersonalityDescription(type: PersonalityType): {
  title: string;
  emoji: string;
  description: string;
  recommendedRaces: string[];
} {
  const descriptions: Record<PersonalityType, any> = {
    trail_seeker: {
      title: 'Trail Seeker',
      emoji: '🌲',
      description: "You crave dirt under your feet and views that make the climb worth it. Technical terrain? Bring it on.",
      recommendedRaces: ['Ultra marathons', 'Trail races', 'Mountain runs', 'Adventure races']
    },
    urban_speedster: {
      title: 'Urban Speedster',
      emoji: '🏙️',
      description: "Fast courses, city vibes, and convenient logistics. You know every PR-friendly race in town.",
      recommendedRaces: ['City marathons', 'Fast 5Ks', 'Downtown 10Ks', 'Turkey trots']
    },
    bucket_lister: {
      title: 'Bucket Lister',
      emoji: '✈️',
      description: "Running is your passport. You're collecting bibs from iconic races around the world.",
      recommendedRaces: ['World Marathon Majors', 'Iconic destination races', 'International events']
    },
    community_runner: {
      title: 'Community Runner',
      emoji: '🤝',
      description: "It's about the people, not the pace. You love local races and the running community.",
      recommendedRaces: ['Local 5Ks', 'Charity runs', 'Park runs', 'Community events']
    },
    ultra_curious: {
      title: 'Ultra Curious',
      emoji: '🦁',
      description: "Distance is just a number, and you want to see how far you can go. 50K? 100 miles? Let's find out.",
      recommendedRaces: ['50Ks', '100-milers', 'Multi-day events', 'Endurance challenges']
    },
    casual_adventurer: {
      title: 'Casual Adventurer',
      emoji: '🎈',
      description: "Running should be fun! You're here for color runs, costume races, and good vibes.",
      recommendedRaces: ['Color runs', 'Themed races', 'Fun runs', 'Obstacle courses']
    },
    pr_hunter: {
      title: 'PR Hunter',
      emoji: '⏱️',
      description: "Every race is a chance to beat your best. Flat, fast, and net downhill? Yes please.",
      recommendedRaces: ['BQ-qualifying marathons', 'Fast half marathons', 'Downhill courses']
    },
    scenic_explorer: {
      title: 'Scenic Explorer',
      emoji: '🏞️',
      description: "Who cares about the clock when the views are this good? You run for the experience.",
      recommendedRaces: ['Coastal runs', 'National park races', 'Wine country races', 'Island races']
    },
    family_runner: {
      title: 'Family Runner',
      emoji: '👨‍👩‍👧‍👦',
      description: "Running is a family affair. You look for races everyone can enjoy together.",
      recommendedRaces: ['Family-friendly 5Ks', 'Kids runs', 'Stroller-friendly races', 'Holiday fun runs']
    },
    newbie: {
      title: 'Rising Runner',
      emoji: '🌱',
      description: "Every expert was once a beginner. You're just getting started on an amazing journey!",
      recommendedRaces: ['Couch to 5K races', 'Beginner-friendly events', 'Supportive community runs']
    },
  };

  return descriptions[type];
}
