import { Race, RaceFilters } from '@/data/types';
import { fetchAllRaces, fetchQuickRaces, clearRaceCache, getRaceStats } from './raceAggregator';

const RUNSIGNUP_API_BASE = 'https://runsignup.com/Rest';

// Re-export aggregator functions
export { fetchAllRaces, fetchQuickRaces, clearRaceCache, getRaceStats };

// Helper to determine race category from distance
function getCategoryFromDistance(distanceKm: number): Race['category'] {
  if (distanceKm <= 5.5) return '5k';
  if (distanceKm <= 12) return '10k';
  if (distanceKm <= 25) return 'half';
  if (distanceKm <= 50) return 'marathon';
  return 'ultra';
}

// Helper to get readable distance label
function getDistanceLabel(distanceKm: number): string {
  if (Math.abs(distanceKm - 5) < 0.5) return '5K';
  if (Math.abs(distanceKm - 10) < 1) return '10K';
  if (Math.abs(distanceKm - 21.1) < 1) return 'Half Marathon';
  if (Math.abs(distanceKm - 42.2) < 1) return 'Marathon';
  if (distanceKm > 42.2) return `${Math.round(distanceKm)}K Ultra`;
  return `${distanceKm.toFixed(1)}K`;
}

// Transform RunSignUp API response to our Race format
function transformRunSignUpRace(apiRace: any): Race {
  const distanceKm = apiRace.distance_km || 42.2; // Default to marathon if unknown

  return {
    id: String(apiRace.race_id || apiRace.id || Math.random()),
    name: apiRace.name || 'Unknown Race',
    date: apiRace.next_date || apiRace.event_date || new Date().toISOString(),
    city: apiRace.address?.city || apiRace.city || 'Unknown',
    state: apiRace.address?.state || apiRace.state || '',
    country: apiRace.address?.country_code || apiRace.country || 'US',
    distance: distanceKm,
    distanceLabel: getDistanceLabel(distanceKm),
    category: getCategoryFromDistance(distanceKm),
    registrationUrl: apiRace.url || apiRace.registration_url || '#',
    websiteUrl: apiRace.website || apiRace.url,
    description: apiRace.description,
    imageUrl: apiRace.logo_url || apiRace.image_url,
    organizerName: apiRace.organization_name,
    isFeatured: false,
  };
}

// Fetch races from RunSignUp API
export async function fetchRacesFromRunSignUp(params: {
  limit?: number;
  page?: number;
  state?: string;
  eventType?: string;
}): Promise<Race[]> {
  const { limit = 25, page = 1, state, eventType = 'running' } = params;

  try {
    const queryParams = new URLSearchParams({
      format: 'json',
      events: 'T',
      event_type: eventType,
      results_per_page: String(limit),
      page: String(page),
      sort: 'date+ASC',
      start_date: new Date().toISOString().split('T')[0],
      only_races_with_results: 'F',
    });

    if (state) {
      queryParams.append('state', state);
    }

    const response = await fetch(`${RUNSIGNUP_API_BASE}/races?${queryParams}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.races || !Array.isArray(data.races)) {
      console.warn('No races in API response');
      return [];
    }

    return data.races.map(transformRunSignUpRace);
  } catch (error) {
    console.error('Error fetching from RunSignUp:', error);
    return [];
  }
}

// Apply filters to races
export function filterRaces(races: Race[], filters: RaceFilters): Race[] {
  return races.filter((race) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        race.name.toLowerCase().includes(searchLower) ||
        race.city.toLowerCase().includes(searchLower) ||
        race.state.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(race.category)) {
      return false;
    }

    // Date range filter
    const raceDate = new Date(race.date);
    if (filters.startDate && raceDate < filters.startDate) return false;
    if (filters.endDate && raceDate > filters.endDate) return false;

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      const matchesLocation =
        race.city.toLowerCase().includes(locationLower) ||
        race.state.toLowerCase().includes(locationLower);
      if (!matchesLocation) return false;
    }

    // Terrain filter
    if (filters.terrain.length > 0 && race.terrain && !filters.terrain.includes(race.terrain)) {
      return false;
    }

    return true;
  });
}

// Fallback data with real races (used when API is unavailable)
export function getMockRaces(): Race[] {
  return [
    {
      id: 'boston-2026',
      name: 'Boston Marathon',
      date: '2026-04-20',
      city: 'Boston',
      state: 'MA',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.baa.org/races/boston-marathon',
      description: 'The world\'s oldest annual marathon.',
      terrain: 'road',
      isFeatured: true,
    },
    {
      id: 'chicago-2026',
      name: 'Chicago Marathon',
      date: '2026-10-11',
      city: 'Chicago',
      state: 'IL',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.chicagomarathon.com',
      description: 'A World Marathon Major with a flat, fast course.',
      terrain: 'road',
      isFeatured: true,
    },
    {
      id: 'nyc-2026',
      name: 'NYC Marathon',
      date: '2026-11-01',
      city: 'New York',
      state: 'NY',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.nyrr.org/tcsnycmarathon',
      description: 'The world\'s largest marathon.',
      terrain: 'road',
      isFeatured: true,
    },
    {
      id: 'la-2026',
      name: 'Los Angeles Marathon',
      date: '2026-03-08',
      city: 'Los Angeles',
      state: 'CA',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.lamarathon.com',
      description: 'Stadium to the sea - from Dodger Stadium to Santa Monica.',
      terrain: 'road',
      isFeatured: true,
    },
    {
      id: 'seattle-half-2026',
      name: 'Seattle Half Marathon',
      date: '2026-11-29',
      city: 'Seattle',
      state: 'WA',
      country: 'US',
      distance: 21.1,
      distanceLabel: 'Half Marathon',
      category: 'half',
      registrationUrl: 'https://www.seattlemarathon.org',
      description: 'A beautiful run through the Emerald City.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'denver-colfax-2026',
      name: 'Denver Colfax Marathon',
      date: '2026-05-17',
      city: 'Denver',
      state: 'CO',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.runcolfax.org',
      description: 'Mile high running along the longest commercial street in America.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'sf-half-2026',
      name: 'San Francisco Half Marathon',
      date: '2026-07-26',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      distance: 21.1,
      distanceLabel: 'Half Marathon',
      category: 'half',
      registrationUrl: 'https://www.thesfmarathon.com',
      description: 'Cross the iconic Golden Gate Bridge.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'peachtree-2026',
      name: 'Peachtree Road Race',
      date: '2026-07-04',
      city: 'Atlanta',
      state: 'GA',
      country: 'US',
      distance: 10,
      distanceLabel: '10K',
      category: '10k',
      registrationUrl: 'https://www.atlantatrackclub.org/peachtree',
      description: 'America\'s largest 10K, held every Fourth of July.',
      terrain: 'road',
      isFeatured: true,
    },
    {
      id: 'boulder-2026',
      name: 'Bolder Boulder 10K',
      date: '2026-05-25',
      city: 'Boulder',
      state: 'CO',
      country: 'US',
      distance: 10,
      distanceLabel: '10K',
      category: '10k',
      registrationUrl: 'https://www.bolderboulder.com',
      description: 'One of America\'s all-time great road races.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'western-states-2026',
      name: 'Western States 100',
      date: '2026-06-27',
      city: 'Olympic Valley',
      state: 'CA',
      country: 'US',
      distance: 161,
      distanceLabel: '100 Mile Ultra',
      category: 'ultra',
      registrationUrl: 'https://www.wser.org',
      description: 'The world\'s oldest 100-mile trail race.',
      terrain: 'trail',
      isFeatured: true,
    },
    {
      id: 'leadville-2026',
      name: 'Leadville Trail 100',
      date: '2026-08-15',
      city: 'Leadville',
      state: 'CO',
      country: 'US',
      distance: 161,
      distanceLabel: '100 Mile Ultra',
      category: 'ultra',
      registrationUrl: 'https://www.leadvilleraceseries.com',
      description: 'Race across the sky at 10,000+ feet elevation.',
      terrain: 'trail',
      isFeatured: false,
    },
    {
      id: 'miami-half-2026',
      name: 'Miami Half Marathon',
      date: '2026-02-01',
      city: 'Miami',
      state: 'FL',
      country: 'US',
      distance: 21.1,
      distanceLabel: 'Half Marathon',
      category: 'half',
      registrationUrl: 'https://www.themiamimarathon.com',
      description: 'Run through beautiful Miami Beach.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'austin-2026',
      name: 'Austin Marathon',
      date: '2026-02-15',
      city: 'Austin',
      state: 'TX',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.youraustinmarathon.com',
      description: 'Keep Austin running! A challenging course through Texas.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'portland-5k-2026',
      name: 'Portland Spring 5K',
      date: '2026-04-12',
      city: 'Portland',
      state: 'OR',
      country: 'US',
      distance: 5,
      distanceLabel: '5K',
      category: '5k',
      registrationUrl: 'https://www.portlandrunning.com',
      description: 'A scenic 5K through downtown Portland.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'phoenix-10k-2026',
      name: 'Phoenix 10K',
      date: '2026-03-15',
      city: 'Phoenix',
      state: 'AZ',
      country: 'US',
      distance: 10,
      distanceLabel: '10K',
      category: '10k',
      registrationUrl: 'https://www.phoenix10k.com',
      description: 'Desert running at its finest.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'nashville-half-2026',
      name: 'Nashville Half Marathon',
      date: '2026-04-25',
      city: 'Nashville',
      state: 'TN',
      country: 'US',
      distance: 21.1,
      distanceLabel: 'Half Marathon',
      category: 'half',
      registrationUrl: 'https://www.runrocknroll.com/nashville',
      description: 'Rock and run through Music City.',
      terrain: 'road',
      isFeatured: false,
    },
    {
      id: 'moab-trail-2026',
      name: 'Moab Trail Marathon',
      date: '2026-11-07',
      city: 'Moab',
      state: 'UT',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Trail Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.madmoose.com',
      description: 'Run through stunning red rock landscape.',
      terrain: 'trail',
      isFeatured: false,
    },
    {
      id: 'honolulu-2026',
      name: 'Honolulu Marathon',
      date: '2026-12-13',
      city: 'Honolulu',
      state: 'HI',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.honolulumarathon.org',
      description: 'No time limit. Beautiful Hawaiian scenery.',
      terrain: 'road',
      isFeatured: false,
    },
  ];
}
