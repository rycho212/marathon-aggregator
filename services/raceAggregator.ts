import AsyncStorage from '@react-native-async-storage/async-storage';
import { Race } from '@/data/types';

const CACHE_KEY = '@getabib_race_cache';
const CACHE_EXPIRY_KEY = '@getabib_race_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// All US states for comprehensive fetching
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

// =============================================================================
// RUNSIGNUP API
// =============================================================================
const RUNSIGNUP_API = 'https://runsignup.com/Rest';

interface RunSignUpRace {
  race_id: number;
  name: string;
  next_date?: string;
  last_date?: string;
  address?: {
    city?: string;
    state?: string;
    country_code?: string;
    zipcode?: string;
  };
  url?: string;
  external_race_url?: string;
  logo_url?: string;
  description?: string;
  events?: Array<{
    event_id: number;
    name: string;
    distance?: number;
    distance_unit?: string;
    start_time?: string;
  }>;
}

function getDistanceKm(distance?: number, unit?: string): number {
  if (!distance) return 42.195; // Default to marathon
  if (unit === 'M' || unit === 'mi' || unit === 'miles') {
    return distance * 1.60934;
  }
  if (unit === 'K' || unit === 'km' || unit === 'kilometers') {
    return distance;
  }
  if (unit === 'm' || unit === 'meters') {
    return distance / 1000;
  }
  return distance;
}

function getCategoryFromDistance(distanceKm: number): Race['category'] {
  if (distanceKm <= 5.5) return '5k';
  if (distanceKm <= 12) return '10k';
  if (distanceKm <= 25) return 'half';
  if (distanceKm <= 50) return 'marathon';
  return 'ultra';
}

function getDistanceLabel(distanceKm: number): string {
  if (Math.abs(distanceKm - 5) < 0.5) return '5K';
  if (Math.abs(distanceKm - 10) < 1) return '10K';
  if (Math.abs(distanceKm - 21.1) < 1.5) return 'Half Marathon';
  if (Math.abs(distanceKm - 42.2) < 2) return 'Marathon';
  if (distanceKm >= 50 && distanceKm < 85) return '50K Ultra';
  if (distanceKm >= 85 && distanceKm < 120) return '50 Mile Ultra';
  if (distanceKm >= 120 && distanceKm < 180) return '100K Ultra';
  if (distanceKm >= 180) return '100 Mile Ultra';
  return `${Math.round(distanceKm)}K`;
}

function transformRunSignUpRace(apiRace: RunSignUpRace): Race | null {
  try {
    // Find the primary event (longest distance or first)
    const primaryEvent = apiRace.events?.sort((a, b) =>
      (b.distance || 0) - (a.distance || 0)
    )[0];

    const distanceKm = getDistanceKm(primaryEvent?.distance, primaryEvent?.distance_unit);
    const category = getCategoryFromDistance(distanceKm);

    // Skip races without dates
    const raceDate = apiRace.next_date || apiRace.last_date;
    if (!raceDate) return null;

    // Skip past races
    if (new Date(raceDate) < new Date()) return null;

    return {
      id: `runsignup_${apiRace.race_id}`,
      name: apiRace.name,
      date: raceDate,
      city: apiRace.address?.city || 'Unknown',
      state: apiRace.address?.state || '',
      country: apiRace.address?.country_code || 'US',
      distance: distanceKm,
      distanceLabel: getDistanceLabel(distanceKm),
      category,
      registrationUrl: apiRace.url || apiRace.external_race_url || '#',
      websiteUrl: apiRace.external_race_url,
      description: apiRace.description?.slice(0, 500),
      imageUrl: apiRace.logo_url,
      terrain: 'road', // RunSignUp doesn't always provide this
      isFeatured: false,
      source: 'runsignup',
    };
  } catch (error) {
    console.error('Error transforming RunSignUp race:', error);
    return null;
  }
}

async function fetchRunSignUpRacesForState(state: string): Promise<Race[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const params = new URLSearchParams({
      format: 'json',
      state: state,
      start_date: today,
      end_date: oneYearFromNow,
      results_per_page: '100',
      sort: 'date+ASC',
      only_races_with_results: 'F',
      include_event_info: 'T',
    });

    const response = await fetch(`${RUNSIGNUP_API}/races?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`RunSignUp API error for ${state}: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.races || !Array.isArray(data.races)) {
      return [];
    }

    const races = data.races
      .map((r: { race: RunSignUpRace }) => transformRunSignUpRace(r.race))
      .filter((r: Race | null): r is Race => r !== null);

    console.log(`Fetched ${races.length} races from RunSignUp for ${state}`);
    return races;
  } catch (error) {
    console.error(`Error fetching RunSignUp races for ${state}:`, error);
    return [];
  }
}

export async function fetchAllRunSignUpRaces(
  onProgress?: (current: number, total: number) => void
): Promise<Race[]> {
  const allRaces: Race[] = [];
  const batchSize = 5; // Fetch 5 states at a time to avoid rate limiting

  for (let i = 0; i < US_STATES.length; i += batchSize) {
    const batch = US_STATES.slice(i, i + batchSize);
    const promises = batch.map(state => fetchRunSignUpRacesForState(state));
    const results = await Promise.all(promises);

    results.forEach(races => {
      allRaces.push(...races);
    });

    if (onProgress) {
      onProgress(Math.min(i + batchSize, US_STATES.length), US_STATES.length);
    }

    // Small delay between batches to be nice to the API
    if (i + batchSize < US_STATES.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return allRaces;
}

// =============================================================================
// ACTIVE.COM API (if available)
// =============================================================================
const ACTIVE_API = 'https://api.amp.active.com/v2/search';

async function fetchActiveRaces(): Promise<Race[]> {
  // Active.com requires an API key - this is a placeholder
  // In production, you'd need to register for their API
  try {
    // Note: Active.com API requires authentication
    // This is a simplified example that may not work without proper API keys
    console.log('Active.com API requires authentication - skipping');
    return [];
  } catch (error) {
    console.error('Error fetching Active.com races:', error);
    return [];
  }
}

// =============================================================================
// ULTRASIGNUP API (for trail/ultra races)
// =============================================================================
const ULTRASIGNUP_API = 'https://ultrasignup.com/service/events.svc';

interface UltraSignupEvent {
  EventId: number;
  EventName: string;
  EventDate: string;
  City: string;
  State: string;
  Country: string;
  EventUrl: string;
  Distance?: string;
  EventType?: string;
}

function transformUltraSignupRace(event: UltraSignupEvent): Race | null {
  try {
    // Parse distance from string like "50K" or "100M"
    let distanceKm = 50;
    if (event.Distance) {
      const match = event.Distance.match(/(\d+\.?\d*)\s*(K|M|mi|km)?/i);
      if (match) {
        const num = parseFloat(match[1]);
        const unit = match[2]?.toLowerCase();
        if (unit === 'm' || unit === 'mi') {
          distanceKm = num * 1.60934;
        } else {
          distanceKm = num;
        }
      }
    }

    return {
      id: `ultrasignup_${event.EventId}`,
      name: event.EventName,
      date: event.EventDate,
      city: event.City || 'Unknown',
      state: event.State || '',
      country: event.Country || 'US',
      distance: distanceKm,
      distanceLabel: getDistanceLabel(distanceKm),
      category: getCategoryFromDistance(distanceKm),
      registrationUrl: event.EventUrl || '#',
      terrain: 'trail',
      isFeatured: false,
      source: 'ultrasignup',
    };
  } catch (error) {
    console.error('Error transforming UltraSignup event:', error);
    return null;
  }
}

async function fetchUltraSignupRaces(): Promise<Race[]> {
  try {
    // UltraSignup has a public events feed
    const response = await fetch(`${ULTRASIGNUP_API}/getallevents`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`UltraSignup API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    const races = data
      .map((e: UltraSignupEvent) => transformUltraSignupRace(e))
      .filter((r: Race | null): r is Race => r !== null)
      .filter((r: Race) => new Date(r.date) > new Date()); // Future races only

    console.log(`Fetched ${races.length} races from UltraSignup`);
    return races;
  } catch (error) {
    console.error('Error fetching UltraSignup races:', error);
    return [];
  }
}

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

async function getCachedRaces(): Promise<Race[] | null> {
  try {
    const expiryStr = await AsyncStorage.getItem(CACHE_EXPIRY_KEY);
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      if (Date.now() > expiry) {
        console.log('Race cache expired');
        return null;
      }
    }

    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const races = JSON.parse(cached);
      console.log(`Loaded ${races.length} races from cache`);
      return races;
    }
  } catch (error) {
    console.error('Error reading race cache:', error);
  }
  return null;
}

async function cacheRaces(races: Race[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(races));
    await AsyncStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION));
    console.log(`Cached ${races.length} races`);
  } catch (error) {
    console.error('Error caching races:', error);
  }
}

export async function clearRaceCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_EXPIRY_KEY);
    console.log('Race cache cleared');
  } catch (error) {
    console.error('Error clearing race cache:', error);
  }
}

// =============================================================================
// MAIN AGGREGATOR
// =============================================================================

function deduplicateRaces(races: Race[]): Race[] {
  const seen = new Map<string, Race>();

  for (const race of races) {
    // Create a key based on name + date + city (normalized)
    const key = `${race.name.toLowerCase().trim()}_${race.date}_${race.city.toLowerCase().trim()}`;

    if (!seen.has(key)) {
      seen.set(key, race);
    } else {
      // Keep the one with more data
      const existing = seen.get(key)!;
      if ((race.description?.length || 0) > (existing.description?.length || 0)) {
        seen.set(key, race);
      }
    }
  }

  return Array.from(seen.values());
}

function markFeaturedRaces(races: Race[]): Race[] {
  // Mark popular/major races as featured
  const featuredNames = [
    'boston marathon', 'new york city marathon', 'nyc marathon', 'chicago marathon',
    'los angeles marathon', 'la marathon', 'marine corps marathon',
    'big sur marathon', 'western states', 'utmb', 'leadville',
    'comrades marathon', 'london marathon', 'berlin marathon',
    'peachtree road race', 'bolder boulder', 'bay to breakers',
    'disney marathon', 'disney princess', 'rock \'n\' roll',
  ];

  return races.map(race => {
    const nameLower = race.name.toLowerCase();
    const isFeatured = featuredNames.some(fn => nameLower.includes(fn));
    return { ...race, isFeatured };
  });
}

export async function fetchAllRaces(
  options: {
    useCache?: boolean;
    onProgress?: (message: string, current: number, total: number) => void;
  } = {}
): Promise<Race[]> {
  const { useCache = true, onProgress } = options;

  // Check cache first
  if (useCache) {
    const cached = await getCachedRaces();
    if (cached && cached.length > 0) {
      return cached;
    }
  }

  const allRaces: Race[] = [];

  // 1. Fetch from RunSignUp (main source)
  onProgress?.('Fetching from RunSignUp...', 0, 100);
  const runSignUpRaces = await fetchAllRunSignUpRaces((current, total) => {
    const percent = Math.round((current / total) * 70);
    onProgress?.(`Fetching RunSignUp (${current}/${total} states)...`, percent, 100);
  });
  allRaces.push(...runSignUpRaces);

  // 2. Fetch from UltraSignup (trail/ultra races)
  onProgress?.('Fetching from UltraSignup...', 75, 100);
  const ultraRaces = await fetchUltraSignupRaces();
  allRaces.push(...ultraRaces);

  // 3. Future: Add more sources here
  // onProgress?.('Fetching from Active.com...', 85, 100);
  // const activeRaces = await fetchActiveRaces();
  // allRaces.push(...activeRaces);

  onProgress?.('Processing races...', 90, 100);

  // Deduplicate
  let processedRaces = deduplicateRaces(allRaces);

  // Mark featured races
  processedRaces = markFeaturedRaces(processedRaces);

  // Sort by date
  processedRaces.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Cache the results
  if (useCache) {
    await cacheRaces(processedRaces);
  }

  onProgress?.('Done!', 100, 100);
  console.log(`Total races aggregated: ${processedRaces.length}`);

  return processedRaces;
}

// Quick fetch for initial load (just a few states)
export async function fetchQuickRaces(): Promise<Race[]> {
  const popularStates = ['CA', 'NY', 'TX', 'FL', 'CO', 'WA', 'MA', 'IL'];
  const races: Race[] = [];

  for (const state of popularStates) {
    const stateRaces = await fetchRunSignUpRacesForState(state);
    races.push(...stateRaces);
  }

  return markFeaturedRaces(deduplicateRaces(races));
}

// Get database stats
export async function getRaceStats(): Promise<{
  totalRaces: number;
  byCategory: Record<string, number>;
  byState: Record<string, number>;
  cacheAge: number | null;
}> {
  const cached = await getCachedRaces();

  if (!cached) {
    return {
      totalRaces: 0,
      byCategory: {},
      byState: {},
      cacheAge: null,
    };
  }

  const byCategory: Record<string, number> = {};
  const byState: Record<string, number> = {};

  for (const race of cached) {
    byCategory[race.category] = (byCategory[race.category] || 0) + 1;
    if (race.state) {
      byState[race.state] = (byState[race.state] || 0) + 1;
    }
  }

  const expiryStr = await AsyncStorage.getItem(CACHE_EXPIRY_KEY);
  const cacheAge = expiryStr
    ? Date.now() - (parseInt(expiryStr, 10) - CACHE_DURATION)
    : null;

  return {
    totalRaces: cached.length,
    byCategory,
    byState,
    cacheAge,
  };
}
