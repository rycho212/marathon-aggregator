import { Race, RaceFilters } from '@/data/types';

const RUNSIGNUP_API_BASE = 'https://runsignup.com/Rest';

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
    // Fall back to mock data on error
    return getMockRaces();
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

// Mock data for development and fallback
export function getMockRaces(): Race[] {
  return [
    {
      id: '1',
      name: 'Boston Marathon',
      date: '2026-04-20',
      city: 'Boston',
      state: 'MA',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.baa.org/races/boston-marathon',
      description: 'The world\'s oldest annual marathon and one of the most prestigious road races.',
      price: 250,
      currency: 'USD',
      spotsRemaining: 1500,
      totalSpots: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38',
      terrain: 'road',
      elevation: 140,
      isFeatured: true,
      organizerName: 'Boston Athletic Association',
    },
    {
      id: '2',
      name: 'Big Sur International Marathon',
      date: '2026-04-26',
      city: 'Big Sur',
      state: 'CA',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.bigsurmarathon.org',
      description: 'One of the most scenic marathons in the world along Highway 1.',
      price: 200,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
      terrain: 'road',
      elevation: 580,
      isFeatured: true,
      organizerName: 'Big Sur Marathon Foundation',
    },
    {
      id: '3',
      name: 'Western States 100',
      date: '2026-06-27',
      city: 'Olympic Valley',
      state: 'CA',
      country: 'US',
      distance: 161,
      distanceLabel: '100 Mile Ultra',
      category: 'ultra',
      registrationUrl: 'https://www.wser.org',
      description: 'The world\'s oldest 100-mile trail race through the Sierra Nevada.',
      price: 425,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1682686580391-615b1f28e5ee',
      terrain: 'trail',
      elevation: 5500,
      isFeatured: true,
      organizerName: 'Western States Endurance Run',
    },
    {
      id: '4',
      name: 'Brooklyn Half Marathon',
      date: '2026-05-16',
      city: 'Brooklyn',
      state: 'NY',
      country: 'US',
      distance: 21.1,
      distanceLabel: 'Half Marathon',
      category: 'half',
      registrationUrl: 'https://www.nyrr.org/races/brooklyn-half',
      description: 'Run through the heart of Brooklyn finishing at the Coney Island Boardwalk.',
      price: 125,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571',
      terrain: 'road',
      elevation: 50,
      organizerName: 'New York Road Runners',
    },
    {
      id: '5',
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
      price: 50,
      currency: 'USD',
      spotsRemaining: 10000,
      totalSpots: 60000,
      imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571',
      terrain: 'road',
      elevation: 100,
      organizerName: 'Atlanta Track Club',
    },
    {
      id: '6',
      name: 'Couch to 5K Graduation Run',
      date: '2026-03-15',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      distance: 5,
      distanceLabel: '5K',
      category: '5k',
      registrationUrl: 'https://example.com/c25k',
      description: 'Perfect for beginners celebrating their running journey!',
      price: 35,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934- voices',
      terrain: 'road',
      elevation: 30,
      organizerName: 'SF Running Club',
    },
    {
      id: '7',
      name: 'Chicago Marathon',
      date: '2026-10-11',
      city: 'Chicago',
      state: 'IL',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.chicagomarathon.com',
      description: 'A World Marathon Major with a flat, fast course through downtown Chicago.',
      price: 230,
      currency: 'USD',
      totalSpots: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
      terrain: 'road',
      elevation: 25,
      isFeatured: true,
      organizerName: 'Bank of America',
    },
    {
      id: '8',
      name: 'NYC Marathon',
      date: '2026-11-01',
      city: 'New York',
      state: 'NY',
      country: 'US',
      distance: 42.195,
      distanceLabel: 'Marathon',
      category: 'marathon',
      registrationUrl: 'https://www.nyrr.org/tcsnycmarathon',
      description: 'The world\'s largest marathon through all five NYC boroughs.',
      price: 295,
      currency: 'USD',
      totalSpots: 53000,
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
      terrain: 'road',
      elevation: 80,
      isFeatured: true,
      organizerName: 'New York Road Runners',
    },
    {
      id: '9',
      name: 'UTMB Mont-Blanc',
      date: '2026-08-28',
      city: 'Chamonix',
      state: '',
      country: 'FR',
      distance: 171,
      distanceLabel: '171K Ultra',
      category: 'ultra',
      registrationUrl: 'https://utmbmontblanc.com',
      description: 'The ultimate trail running challenge around Mont Blanc.',
      price: 350,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
      terrain: 'trail',
      elevation: 10000,
      isFeatured: true,
      organizerName: 'UTMB Group',
    },
    {
      id: '10',
      name: 'Shamrock Shuffle',
      date: '2026-03-29',
      city: 'Chicago',
      state: 'IL',
      country: 'US',
      distance: 8,
      distanceLabel: '8K',
      category: '10k',
      registrationUrl: 'https://www.shamrockshuffle.com',
      description: 'Kick off spring running season with this fun 8K through downtown Chicago.',
      price: 55,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
      terrain: 'road',
      elevation: 15,
      organizerName: 'Bank of America',
    },
  ];
}
