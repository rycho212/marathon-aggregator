// Recommendation Engine
// Powers the Instagram-style personalized race feed

import { Race } from '@/data/types';
import {
  RunnerProfile,
  RunnerPersonality,
  PersonalityType,
  calculatePersonalityType,
} from '@/data/runnerProfile';

interface ScoredRace extends Race {
  relevanceScore: number;
  matchReasons: string[];
}

interface RecommendationContext {
  profile: RunnerProfile;
  allRaces: Race[];
  excludeIds?: string[];  // Already seen/dismissed races
}

// Main recommendation function - like Instagram's algorithm
export function getPersonalizedFeed(context: RecommendationContext): ScoredRace[] {
  const { profile, allRaces, excludeIds = [] } = context;

  // Filter out excluded races
  const eligibleRaces = allRaces.filter(race => !excludeIds.includes(race.id));

  // Score each race based on multiple signals
  const scoredRaces = eligibleRaces.map(race => scoreRace(race, profile));

  // Sort by relevance score (highest first)
  scoredRaces.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Apply diversity rules (don't show 5 marathons in a row)
  const diversifiedFeed = applyDiversityRules(scoredRaces);

  return diversifiedFeed;
}

// Score a single race for a user
function scoreRace(race: Race, profile: RunnerProfile): ScoredRace {
  let score = 50; // Base score
  const reasons: string[] = [];
  const { personality, preferences, behavior } = profile;

  // 1. DISTANCE MATCH (0-25 points)
  const distanceScore = scoreDistanceMatch(race, personality, preferences);
  score += distanceScore.points;
  if (distanceScore.reason) reasons.push(distanceScore.reason);

  // 2. TERRAIN MATCH (0-20 points)
  const terrainScore = scoreTerrainMatch(race, personality, preferences);
  score += terrainScore.points;
  if (terrainScore.reason) reasons.push(terrainScore.reason);

  // 3. LOCATION/PROXIMITY (0-20 points)
  const locationScore = scoreLocationMatch(race, profile);
  score += locationScore.points;
  if (locationScore.reason) reasons.push(locationScore.reason);

  // 4. PERSONALITY ALIGNMENT (0-15 points)
  const personalityScore = scorePersonalityMatch(race, personality);
  score += personalityScore.points;
  if (personalityScore.reason) reasons.push(personalityScore.reason);

  // 5. TIMING (0-10 points)
  const timingScore = scoreTimingMatch(race, preferences);
  score += timingScore.points;
  if (timingScore.reason) reasons.push(timingScore.reason);

  // 6. BEHAVIORAL SIGNALS (0-15 points)
  const behaviorScore = scoreBehavioralSignals(race, behavior);
  score += behaviorScore.points;
  if (behaviorScore.reason) reasons.push(behaviorScore.reason);

  // 7. PRICE MATCH (0-10 points)
  const priceScore = scorePriceMatch(race, preferences);
  score += priceScore.points;

  // 8. TRENDING/POPULAR BOOST (0-10 points)
  if (race.isFeatured) {
    score += 8;
    reasons.push('Popular race');
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  return {
    ...race,
    relevanceScore: score,
    matchReasons: reasons.slice(0, 3), // Top 3 reasons
  };
}

// Distance matching
function scoreDistanceMatch(
  race: Race,
  personality: RunnerPersonality,
  preferences: RunnerPreferences
): { points: number; reason?: string } {
  const affinity = personality.raceAffinities[race.category] || 50;

  // Check explicit preferences first
  if (preferences.preferredDistances.includes(race.category)) {
    return { points: 25, reason: `Matches your ${race.distanceLabel} preference` };
  }

  // Use personality affinity
  if (affinity > 75) {
    return { points: 20, reason: `Great for ${personality.primaryType.replace('_', ' ')}s` };
  } else if (affinity > 50) {
    return { points: 12 };
  }

  return { points: 5 };
}

// Terrain matching
function scoreTerrainMatch(
  race: Race,
  personality: RunnerPersonality,
  preferences: RunnerPreferences
): { points: number; reason?: string } {
  if (!race.terrain) return { points: 10 }; // Neutral if unknown

  const terrainPref = preferences.terrain[race.terrain] || 50;
  const isTrailPerson = personality.traits.adventurous > 60;

  if (race.terrain === 'trail' && isTrailPerson) {
    return { points: 20, reason: 'Trail run for the adventurous' };
  }

  if (terrainPref > 75) {
    return { points: 18, reason: `${race.terrain.charAt(0).toUpperCase() + race.terrain.slice(1)} terrain you love` };
  } else if (terrainPref > 50) {
    return { points: 12 };
  }

  return { points: 5 };
}

// Location/proximity matching
function scoreLocationMatch(
  race: Race,
  profile: RunnerProfile
): { points: number; reason?: string } {
  if (!profile.location) return { points: 10 };

  // Same state = good match
  if (race.state === profile.location.state) {
    return { points: 18, reason: `Local race in ${race.state}` };
  }

  // Check if user is an explorer type
  if (profile.personality.traits.explorer > 70) {
    // Destination races are actually a bonus for explorers
    if (race.country !== 'US' || profile.personality.raceAffinities.destination > 70) {
      return { points: 15, reason: 'Destination race for your bucket list' };
    }
  }

  // Same region (approximate)
  const eastCoast = ['MA', 'NY', 'NJ', 'PA', 'CT', 'RI', 'ME', 'NH', 'VT', 'DC', 'MD', 'VA'];
  const westCoast = ['CA', 'WA', 'OR'];
  const midwest = ['IL', 'OH', 'MI', 'MN', 'WI', 'IN', 'MO'];

  const userRegion = [eastCoast, westCoast, midwest].find(r => r.includes(profile.location!.state));
  const raceRegion = [eastCoast, westCoast, midwest].find(r => r.includes(race.state));

  if (userRegion && userRegion === raceRegion) {
    return { points: 12, reason: 'In your region' };
  }

  return { points: 5 };
}

// Personality alignment
function scorePersonalityMatch(
  race: Race,
  personality: RunnerPersonality
): { points: number; reason?: string } {
  const type = personality.primaryType;

  // Trail seeker + trail race
  if (type === 'trail_seeker' && race.terrain === 'trail') {
    return { points: 15, reason: 'Perfect for trail seekers' };
  }

  // PR hunter + fast/flat course
  if (type === 'pr_hunter' && race.elevation && race.elevation < 100) {
    return { points: 15, reason: 'Fast, flat PR course' };
  }

  // Bucket lister + featured/major race
  if (type === 'bucket_lister' && race.isFeatured) {
    return { points: 15, reason: 'Bucket list worthy' };
  }

  // Ultra curious + ultra distance
  if (type === 'ultra_curious' && race.category === 'ultra') {
    return { points: 15, reason: 'For the ultra curious' };
  }

  // Community runner + local smaller races
  if (type === 'community_runner' && race.category === '5k') {
    return { points: 12, reason: 'Great community event' };
  }

  // Scenic explorer + high elevation (implies scenic)
  if (type === 'scenic_explorer' && race.elevation && race.elevation > 500) {
    return { points: 15, reason: 'Stunning views await' };
  }

  return { points: 5 };
}

// Timing match
function scoreTimingMatch(
  race: Race,
  preferences: RunnerPreferences
): { points: number; reason?: string } {
  const raceDate = new Date(race.date);
  const now = new Date();
  const daysUntil = Math.floor((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Ideal: 2-6 months out (enough time to train)
  if (daysUntil >= 60 && daysUntil <= 180) {
    return { points: 10, reason: 'Perfect timing to train' };
  }

  // Still good: 1-2 months
  if (daysUntil >= 30 && daysUntil < 60) {
    return { points: 7 };
  }

  // Coming up soon
  if (daysUntil >= 14 && daysUntil < 30) {
    return { points: 5, reason: 'Coming up soon!' };
  }

  return { points: 3 };
}

// Behavioral signals (what they've shown interest in)
function scoreBehavioralSignals(
  race: Race,
  behavior: RunnerBehavior
): { points: number; reason?: string } {
  let points = 0;

  // Same category as races they've viewed a lot
  const categoryViews = behavior.categoryViews[race.category] || 0;
  if (categoryViews > 10) {
    points += 10;
  } else if (categoryViews > 5) {
    points += 5;
  }

  // Similar to saved races
  if (behavior.savedRaces.length > 0) {
    // In a real implementation, we'd check similarity
    points += 5;
  }

  return {
    points,
    reason: points > 5 ? 'Based on your browsing' : undefined
  };
}

// Price matching
function scorePriceMatch(
  race: Race,
  preferences: RunnerPreferences
): { points: number; reason?: string } {
  if (!race.price || !preferences.maxPrice) return { points: 5 };

  if (race.price <= preferences.maxPrice) {
    return { points: 10 };
  } else if (race.price <= preferences.maxPrice * 1.2) {
    return { points: 5 };
  }

  return { points: 0 };
}

// Apply diversity rules to prevent monotonous feeds
function applyDiversityRules(races: ScoredRace[]): ScoredRace[] {
  const result: ScoredRace[] = [];
  const recentCategories: string[] = [];
  const recentStates: string[] = [];

  for (const race of races) {
    // Check if we've shown too many of same category recently
    const recentSameCategory = recentCategories.filter(c => c === race.category).length;
    const recentSameState = recentStates.filter(s => s === race.state).length;

    // Allow max 2 of same category in last 5
    if (recentSameCategory >= 2) {
      // Penalize but don't exclude
      race.relevanceScore *= 0.8;
    }

    // Allow max 3 from same state in last 5
    if (recentSameState >= 3) {
      race.relevanceScore *= 0.9;
    }

    result.push(race);

    // Track recent items (sliding window of 5)
    recentCategories.push(race.category);
    recentStates.push(race.state);
    if (recentCategories.length > 5) recentCategories.shift();
    if (recentStates.length > 5) recentStates.shift();
  }

  // Re-sort after penalties
  result.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return result;
}

// Generate "Why we think you'll love this" reasons
export function generateMatchExplanation(race: ScoredRace, profile: RunnerProfile): string {
  const reasons = race.matchReasons;

  if (reasons.length === 0) {
    return 'Popular race in your area';
  }

  if (reasons.length === 1) {
    return reasons[0];
  }

  return reasons.slice(0, 2).join(' • ');
}

// Get races for specific sections of the home feed
export function getFeedSections(context: RecommendationContext): {
  forYou: ScoredRace[];
  nearYou: ScoredRace[];
  bucketList: ScoredRace[];
  comingSoon: ScoredRace[];
  basedOnHistory: ScoredRace[];
} {
  const allScored = getPersonalizedFeed(context);
  const now = new Date();

  return {
    // Top personalized picks
    forYou: allScored.slice(0, 10),

    // Geographically close
    nearYou: allScored
      .filter(r => r.matchReasons.some(reason =>
        reason.includes('Local') || reason.includes('your region')
      ))
      .slice(0, 6),

    // Destination/bucket list worthy
    bucketList: allScored
      .filter(r => r.isFeatured || r.matchReasons.some(reason =>
        reason.includes('bucket list') || reason.includes('Bucket list')
      ))
      .slice(0, 6),

    // Within next 60 days
    comingSoon: allScored
      .filter(r => {
        const raceDate = new Date(r.date);
        const daysUntil = Math.floor((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 60 && daysUntil > 0;
      })
      .slice(0, 6),

    // Based on their browsing
    basedOnHistory: allScored
      .filter(r => r.matchReasons.some(reason =>
        reason.includes('browsing') || reason.includes('preference')
      ))
      .slice(0, 6),
  };
}
