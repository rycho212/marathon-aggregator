/**
 * Goal Engine - Keyword-based "AI" that analyzes free-form text
 * and extracts structured running goals and preferences
 */

export interface GoalTag {
  id: string;
  label: string;
  category: 'distance' | 'time' | 'terrain' | 'course' | 'experience' | 'special';
  icon: string; // Ionicon name
  color: string;
}

export interface ParsedGoals {
  tags: GoalTag[];
  preferredDistances: string[];   // e.g., ['marathon', 'half']
  preferredTerrain: string[];     // e.g., ['trail', 'road']
  targetTime?: string;            // e.g., 'sub-3:30'
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  coursePreferences: string[];    // e.g., ['flat', 'hilly', 'scenic']
  specialGoals: string[];         // e.g., ['bq', 'first-marathon', 'streak']
}

// Pattern definitions for goal extraction
const PATTERNS = {
  // Boston Qualifying
  bq: {
    patterns: [
      /\b(bq|boston qualif|qualify for boston|boston marathon|boston goal)\b/i,
      /\bqualify\b.*\b(boston|baa)\b/i,
    ],
    tag: {
      id: 'bq',
      label: 'BQ Goal',
      category: 'special' as const,
      icon: 'star',
      color: '#F59E0B',
    },
  },

  // First race goals
  firstMarathon: {
    patterns: [
      /\b(first|1st)\s*(full\s*)?marathon\b/i,
      /\bnever\s*(run|done|completed)\s*a?\s*marathon\b/i,
    ],
    tag: {
      id: 'first-marathon',
      label: 'First Marathon',
      category: 'special' as const,
      icon: 'ribbon',
      color: '#8B5CF6',
    },
  },
  firstHalf: {
    patterns: [
      /\b(first|1st)\s*half\s*marathon\b/i,
      /\bnever\s*(run|done|completed)\s*a?\s*half\b/i,
    ],
    tag: {
      id: 'first-half',
      label: 'First Half Marathon',
      category: 'special' as const,
      icon: 'ribbon',
      color: '#8B5CF6',
    },
  },
  firstRace: {
    patterns: [
      /\b(first|1st)\s*(ever\s*)?(race|5k|10k|run)\b/i,
      /\bbeginner\b/i,
      /\bnew\s*(to\s*)?running\b/i,
      /\bjust\s*start(ed|ing)\b/i,
    ],
    tag: {
      id: 'first-race',
      label: 'First Race',
      category: 'experience' as const,
      icon: 'heart',
      color: '#EC4899',
    },
  },

  // PR / Speed goals
  pr: {
    patterns: [
      /\b(pr|personal record|personal best|pb|new record)\b/i,
      /\bfaster\b/i,
      /\bimprove\s*(my\s*)?(time|pace)\b/i,
      /\bspeed\b/i,
    ],
    tag: {
      id: 'pr-goal',
      label: 'PR Attempt',
      category: 'time' as const,
      icon: 'timer',
      color: '#EF4444',
    },
  },

  // Time targets
  subThree: {
    patterns: [
      /\bsub[\s-]?3(:00)?\s*(hour|hr|marathon)?\b/i,
      /\bunder\s*3\s*(hour|hr)\b/i,
      /\b(break|beat)\s*3\s*(hour|hr)\b/i,
    ],
    tag: {
      id: 'sub-3',
      label: 'Sub-3:00 Marathon',
      category: 'time' as const,
      icon: 'flash',
      color: '#EF4444',
    },
  },
  subThreeThirty: {
    patterns: [
      /\bsub[\s-]?3:30\b/i,
      /\bunder\s*3[\s:]30\b/i,
      /\b(break|beat)\s*3[\s:]30\b/i,
    ],
    tag: {
      id: 'sub-330',
      label: 'Sub-3:30 Marathon',
      category: 'time' as const,
      icon: 'flash',
      color: '#F97316',
    },
  },
  subFour: {
    patterns: [
      /\bsub[\s-]?4(:00)?\s*(hour|hr|marathon)?\b/i,
      /\bunder\s*4\s*(hour|hr)\b/i,
      /\b(break|beat)\s*4\s*(hour|hr)\b/i,
    ],
    tag: {
      id: 'sub-4',
      label: 'Sub-4:00 Marathon',
      category: 'time' as const,
      icon: 'flash',
      color: '#F59E0B',
    },
  },
  subTwo: {
    patterns: [
      /\bsub[\s-]?2(:00)?\s*(hour|hr)?\s*(half)?\b/i,
      /\bunder\s*2\s*(hour|hr)?\s*(half)?\b/i,
    ],
    tag: {
      id: 'sub-2-half',
      label: 'Sub-2:00 Half',
      category: 'time' as const,
      icon: 'flash',
      color: '#F97316',
    },
  },

  // Distance preferences
  marathon: {
    patterns: [
      /\bmarathon\b/i,
      /\b26\.2\b/i,
      /\bfull\s*marathon\b/i,
    ],
    tag: {
      id: 'pref-marathon',
      label: 'Marathon',
      category: 'distance' as const,
      icon: 'trophy',
      color: '#00C9A7',
    },
  },
  halfMarathon: {
    patterns: [
      /\bhalf\s*marathon\b/i,
      /\b13\.1\b/i,
      /\bhalf\b(?!.*time)/i,
    ],
    tag: {
      id: 'pref-half',
      label: 'Half Marathon',
      category: 'distance' as const,
      icon: 'medal',
      color: '#00C9A7',
    },
  },
  ultra: {
    patterns: [
      /\bultra\b/i,
      /\b50k\b/i,
      /\b50\s*mile\b/i,
      /\b100k\b/i,
      /\b100\s*mile\b/i,
      /\bendurance\b/i,
    ],
    tag: {
      id: 'pref-ultra',
      label: 'Ultra Running',
      category: 'distance' as const,
      icon: 'flame',
      color: '#DC2626',
    },
  },
  fiveK: {
    patterns: [
      /\b5k\b/i,
      /\bfive\s*k\b/i,
    ],
    tag: {
      id: 'pref-5k',
      label: '5K',
      category: 'distance' as const,
      icon: 'walk',
      color: '#00C9A7',
    },
  },
  tenK: {
    patterns: [
      /\b10k\b/i,
      /\bten\s*k\b/i,
    ],
    tag: {
      id: 'pref-10k',
      label: '10K',
      category: 'distance' as const,
      icon: 'fitness',
      color: '#00C9A7',
    },
  },

  // Terrain preferences
  trail: {
    patterns: [
      /\btrail\b/i,
      /\bmountain\b/i,
      /\boff[\s-]?road\b/i,
      /\bsingle[\s-]?track\b/i,
      /\bwild(erness)?\b/i,
    ],
    tag: {
      id: 'pref-trail',
      label: 'Trail Running',
      category: 'terrain' as const,
      icon: 'leaf',
      color: '#16A34A',
    },
  },
  road: {
    patterns: [
      /\broad\s*(race|running)\b/i,
      /\bcity\s*run\b/i,
      /\bpavement\b/i,
    ],
    tag: {
      id: 'pref-road',
      label: 'Road Racing',
      category: 'terrain' as const,
      icon: 'car',
      color: '#6366F1',
    },
  },

  // Course characteristics
  hilly: {
    patterns: [
      /\bhilly?\b/i,
      /\belev(ation)?\b/i,
      /\bclimb(ing)?\b/i,
      /\bascent\b/i,
      /\bmountain(ous)?\b/i,
    ],
    tag: {
      id: 'pref-hilly',
      label: 'Hilly Courses',
      category: 'course' as const,
      icon: 'trending-up',
      color: '#D97706',
    },
  },
  flat: {
    patterns: [
      /\bflat\b/i,
      /\bfast\s*(course|race)?\b/i,
      /\bno\s*hills?\b/i,
    ],
    tag: {
      id: 'pref-flat',
      label: 'Flat & Fast',
      category: 'course' as const,
      icon: 'arrow-forward',
      color: '#0EA5E9',
    },
  },
  scenic: {
    patterns: [
      /\bscenic\b/i,
      /\bbeautiful\b/i,
      /\bview(s)?\b/i,
      /\bnature\b/i,
      /\bocean\b/i,
      /\bbeach\b/i,
      /\bcoast(al)?\b/i,
      /\blake\b/i,
    ],
    tag: {
      id: 'pref-scenic',
      label: 'Scenic Routes',
      category: 'course' as const,
      icon: 'image',
      color: '#14B8A6',
    },
  },

  // Special goals
  streak: {
    patterns: [
      /\bstreak\b/i,
      /\b(run\s*)?every\s*(month|week)\b/i,
      /\bmultiple\s*races\b/i,
      /\brace\s*series\b/i,
    ],
    tag: {
      id: 'streak',
      label: 'Race Streak',
      category: 'special' as const,
      icon: 'calendar',
      color: '#8B5CF6',
    },
  },
  charity: {
    patterns: [
      /\bcharity\b/i,
      /\bfundrais(e|ing)\b/i,
      /\bcause\b/i,
    ],
    tag: {
      id: 'charity',
      label: 'Charity Runs',
      category: 'special' as const,
      icon: 'heart',
      color: '#EC4899',
    },
  },
  bucketList: {
    patterns: [
      /\bbucket\s*list\b/i,
      /\bdream\s*race\b/i,
      /\bonce\s*in\s*a\s*lifetime\b/i,
      /\biconic\b/i,
      /\bmajor(s)?\b/i,
      /\bworld\s*marathon\b/i,
    ],
    tag: {
      id: 'bucket-list',
      label: 'Bucket List Races',
      category: 'special' as const,
      icon: 'globe',
      color: '#6366F1',
    },
  },
};

/**
 * Analyze free-form text and extract structured running goals
 */
export function analyzeGoals(text: string): ParsedGoals {
  const tags: GoalTag[] = [];
  const preferredDistances: string[] = [];
  const preferredTerrain: string[] = [];
  const coursePreferences: string[] = [];
  const specialGoals: string[] = [];
  let experienceLevel: ParsedGoals['experienceLevel'] = null;
  let targetTime: string | undefined;

  // Check each pattern
  for (const [key, config] of Object.entries(PATTERNS)) {
    const matched = config.patterns.some((p) => p.test(text));
    if (matched) {
      // Avoid duplicates
      if (!tags.find((t) => t.id === config.tag.id)) {
        tags.push(config.tag);
      }

      // Categorize the match
      switch (config.tag.category) {
        case 'distance':
          preferredDistances.push(key);
          break;
        case 'terrain':
          preferredTerrain.push(key);
          break;
        case 'course':
          coursePreferences.push(key);
          break;
        case 'special':
          specialGoals.push(config.tag.id);
          break;
        case 'time':
          if (config.tag.id.startsWith('sub-')) {
            targetTime = config.tag.label;
          }
          break;
      }
    }
  }

  // Infer experience level
  if (specialGoals.includes('first-race') || specialGoals.includes('first-marathon') || specialGoals.includes('first-half')) {
    experienceLevel = 'beginner';
  } else if (tags.find((t) => t.id === 'sub-3') || tags.find((t) => t.id === 'pref-ultra')) {
    experienceLevel = 'advanced';
  } else if (tags.length > 0) {
    experienceLevel = 'intermediate';
  }

  // Extract any custom time targets we might have missed
  if (!targetTime) {
    const timeMatch = text.match(/\b(\d{1,2}):(\d{2})\b/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const mins = parseInt(timeMatch[2]);
      if (hours >= 1 && hours <= 12 && mins >= 0 && mins < 60) {
        targetTime = `${hours}:${timeMatch[2]}`;
      }
    }
  }

  return {
    tags,
    preferredDistances,
    preferredTerrain,
    targetTime,
    experienceLevel,
    coursePreferences,
    specialGoals,
  };
}

/**
 * Score how well a race matches the user's parsed goals (0–100)
 */
export function scoreRaceForGoals(race: any, goals: ParsedGoals): number {
  if (goals.tags.length === 0) return 50; // neutral if no goals

  let score = 0;
  let factors = 0;

  // Distance match
  if (goals.preferredDistances.length > 0) {
    factors++;
    const distMatch = goals.preferredDistances.some((d) => {
      if (d === 'marathon' && race.category === 'marathon') return true;
      if (d === 'halfMarathon' && race.category === 'half') return true;
      if (d === 'ultra' && race.category === 'ultra') return true;
      if (d === 'fiveK' && race.category === '5k') return true;
      if (d === 'tenK' && race.category === '10k') return true;
      return false;
    });
    if (distMatch) score += 30;
  }

  // Terrain match
  if (goals.preferredTerrain.length > 0) {
    factors++;
    const terrainMatch = goals.preferredTerrain.some((t) => {
      if (t === 'trail' && race.terrain === 'trail') return true;
      if (t === 'road' && race.terrain === 'road') return true;
      return false;
    });
    if (terrainMatch) score += 25;
  }

  // Course preferences
  if (goals.coursePreferences.length > 0) {
    factors++;
    if (goals.coursePreferences.includes('hilly') && race.elevation && race.elevation > 200) {
      score += 20;
    }
    if (goals.coursePreferences.includes('flat') && (!race.elevation || race.elevation < 100)) {
      score += 20;
    }
    if (goals.coursePreferences.includes('scenic') && race.characteristics?.isScenic) {
      score += 20;
    }
  }

  // BQ goal — prioritize fast, flat marathons
  if (goals.specialGoals.includes('bq')) {
    factors++;
    if (race.category === 'marathon' && race.terrain === 'road') {
      score += 25;
      if (!race.elevation || race.elevation < 150) score += 10; // flat = BQ-friendly
      if (race.characteristics?.isBQQualifier) score += 15;
    }
  }

  // Beginner friendly
  if (goals.experienceLevel === 'beginner') {
    factors++;
    if (race.characteristics?.isBeginnerFriendly) score += 20;
    if (race.category === '5k' || race.category === '10k') score += 15;
  }

  // Bucket list
  if (goals.specialGoals.includes('bucket-list')) {
    factors++;
    if (race.isFeatured) score += 25;
  }

  // Normalize to 0–100
  return factors > 0 ? Math.min(100, Math.round((score / (factors * 25)) * 100)) : 50;
}
