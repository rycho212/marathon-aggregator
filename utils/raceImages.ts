import { Race } from '@/data/types';

// City/Location-based images from Unsplash
const cityImages: Record<string, string> = {
  // Major US Cities
  'boston': 'https://images.unsplash.com/photo-1501979376754-1d13f7da3d44?w=400&h=400&fit=crop', // Boston skyline
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop', // NYC skyline
  'brooklyn': 'https://images.unsplash.com/photo-1555424221-250de2a343ad?w=400&h=400&fit=crop', // Brooklyn Bridge
  'chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=400&fit=crop', // Chicago skyline
  'los angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&h=400&fit=crop', // LA skyline
  'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop', // Golden Gate
  'san diego': 'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?w=400&h=400&fit=crop', // San Diego beach
  'seattle': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=400&h=400&fit=crop', // Seattle skyline
  'portland': 'https://images.unsplash.com/photo-1507245351432-5f84dfc4261c?w=400&h=400&fit=crop', // Portland
  'denver': 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=400&h=400&fit=crop', // Denver mountains
  'boulder': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', // Boulder Flatirons
  'austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=400&fit=crop', // Austin skyline
  'dallas': 'https://images.unsplash.com/photo-1545194445-dddb8f4487c6?w=400&h=400&fit=crop', // Dallas skyline
  'houston': 'https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?w=400&h=400&fit=crop', // Houston skyline
  'phoenix': 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=400&h=400&fit=crop', // Phoenix desert
  'atlanta': 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=400&h=400&fit=crop', // Atlanta skyline
  'miami': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=400&fit=crop', // Miami beach
  'orlando': 'https://images.unsplash.com/photo-1575089776834-8be34c8a652e?w=400&h=400&fit=crop', // Orlando
  'nashville': 'https://images.unsplash.com/photo-1545419913-775d8b1a4971?w=400&h=400&fit=crop', // Nashville
  'minneapolis': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop', // Minneapolis
  'philadelphia': 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=400&h=400&fit=crop', // Philly
  'pittsburgh': 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=400&h=400&fit=crop', // Pittsburgh
  'cincinnati': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=400&fit=crop', // Cincinnati
  'detroit': 'https://images.unsplash.com/photo-1580910527160-8a66d8ba0579?w=400&h=400&fit=crop', // Detroit
  'new orleans': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=400&fit=crop', // New Orleans
  'charleston': 'https://images.unsplash.com/photo-1587162146766-e06b1189b907?w=400&h=400&fit=crop', // Charleston
  'richmond': 'https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?w=400&h=400&fit=crop', // Richmond
  'arlington': 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=400&h=400&fit=crop', // DC area
  'washington': 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=400&h=400&fit=crop', // DC
  'honolulu': 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=400&h=400&fit=crop', // Hawaii beach
  'duluth': 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=400&fit=crop', // Lake Superior
  'burlington': 'https://images.unsplash.com/photo-1600298882283-67627c8e8892?w=400&h=400&fit=crop', // Vermont
  'mobile': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=400&fit=crop', // Mobile AL

  // California specific
  'big sur': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', // Big Sur coast
  'napa': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop', // Napa vineyards
  'marin': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=400&fit=crop', // Marin Headlands
  'mill valley': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=400&fit=crop', // Marin area
  'olympic valley': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop', // Sierra mountains

  // Mountain/Trail locations
  'leadville': 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=400&fit=crop', // Colorado mountains
  'manitou springs': 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&h=400&fit=crop', // Pikes Peak area
  'moab': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop', // Red rocks Utah
  'springdale': 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=400&fit=crop', // Zion
  'grand canyon': 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&h=400&fit=crop', // Grand Canyon
  'fountain hills': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop', // Arizona desert
  'ashford': 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=400&h=400&fit=crop', // Mt Rainier
  'harpers ferry': 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=400&fit=crop', // Appalachian

  // International
  'chamonix': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop', // Mont Blanc Alps
};

// State-based fallback images - All 50 US states + DC
const stateImages: Record<string, string> = {
  'AL': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=400&fit=crop', // Alabama
  'AK': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=400&fit=crop', // Alaska
  'AZ': 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=400&h=400&fit=crop', // Arizona desert
  'AR': 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=400&fit=crop', // Arkansas
  'CA': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=400&fit=crop', // California coast
  'CO': 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=400&h=400&fit=crop', // Colorado mountains
  'CT': 'https://images.unsplash.com/photo-1600298882283-67627c8e8892?w=400&h=400&fit=crop', // Connecticut
  'DE': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=400&fit=crop', // Delaware
  'DC': 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=400&h=400&fit=crop', // Washington DC
  'FL': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=400&fit=crop', // Florida beach
  'GA': 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=400&h=400&fit=crop', // Georgia
  'HI': 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=400&h=400&fit=crop', // Hawaii
  'ID': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop', // Idaho
  'IL': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=400&fit=crop', // Illinois/Chicago
  'IN': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=400&fit=crop', // Indiana
  'IA': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', // Iowa farmland
  'KS': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', // Kansas
  'KY': 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=400&fit=crop', // Kentucky
  'LA': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=400&fit=crop', // Louisiana
  'ME': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', // Maine coast
  'MD': 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=400&h=400&fit=crop', // Maryland
  'MA': 'https://images.unsplash.com/photo-1501979376754-1d13f7da3d44?w=400&h=400&fit=crop', // Massachusetts
  'MI': 'https://images.unsplash.com/photo-1580910527160-8a66d8ba0579?w=400&h=400&fit=crop', // Michigan
  'MN': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop', // Minnesota
  'MS': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=400&fit=crop', // Mississippi
  'MO': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=400&fit=crop', // Missouri
  'MT': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop', // Montana
  'NE': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', // Nebraska
  'NV': 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=400&h=400&fit=crop', // Nevada
  'NH': 'https://images.unsplash.com/photo-1600298882283-67627c8e8892?w=400&h=400&fit=crop', // New Hampshire
  'NJ': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=400&fit=crop', // New Jersey
  'NM': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop', // New Mexico
  'NY': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop', // NYC
  'NC': 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=400&fit=crop', // North Carolina
  'ND': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', // North Dakota
  'OH': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=400&fit=crop', // Ohio
  'OK': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', // Oklahoma
  'OR': 'https://images.unsplash.com/photo-1507245351432-5f84dfc4261c?w=400&h=400&fit=crop', // Oregon
  'PA': 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=400&h=400&fit=crop', // Pennsylvania
  'RI': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', // Rhode Island
  'SC': 'https://images.unsplash.com/photo-1587162146766-e06b1189b907?w=400&h=400&fit=crop', // South Carolina
  'SD': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', // South Dakota
  'TN': 'https://images.unsplash.com/photo-1545419913-775d8b1a4971?w=400&h=400&fit=crop', // Tennessee
  'TX': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=400&fit=crop', // Texas
  'UT': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop', // Utah red rocks
  'VT': 'https://images.unsplash.com/photo-1600298882283-67627c8e8892?w=400&h=400&fit=crop', // Vermont
  'VA': 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=400&h=400&fit=crop', // Virginia
  'WA': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=400&h=400&fit=crop', // Washington
  'WV': 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=400&fit=crop', // West Virginia
  'WI': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop', // Wisconsin
  'WY': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop', // Wyoming
};

// Country-based fallback images
const countryImages: Record<string, string> = {
  'FR': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop', // France/Alps
  'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=400&fit=crop', // London
  'DE': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=400&fit=crop', // Germany
  'JP': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=400&fit=crop', // Japan
  'AU': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=400&fit=crop', // Australia
};

// Terrain-based fallback (only used if no location match)
const terrainImages: Record<string, string> = {
  trail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop',
  road: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=400&fit=crop',
  track: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop',
};

// Default fallback
const defaultImage = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=400&fit=crop';

/**
 * Get the best image URL for a race based on its location
 */
export function getRaceImageUrl(race: Race): string {
  // 1. Check for specific race image URL
  if (race.imageUrl && !race.imageUrl.includes('voices') && !race.imageUrl.includes('undefined')) {
    return race.imageUrl + '?w=400&h=400&fit=crop';
  }

  // 2. Try to match city name
  const cityLower = race.city.toLowerCase().trim();
  if (cityImages[cityLower]) {
    return cityImages[cityLower];
  }

  // 3. Try partial city match (e.g., "San Francisco" in "South San Francisco")
  for (const [city, url] of Object.entries(cityImages)) {
    if (cityLower.includes(city) || city.includes(cityLower)) {
      return url;
    }
  }

  // 4. Try state-based image
  if (race.state && stateImages[race.state]) {
    return stateImages[race.state];
  }

  // 5. Try country-based image
  if (race.country && race.country !== 'US' && countryImages[race.country]) {
    return countryImages[race.country];
  }

  // 6. Fall back to terrain-based image
  if (race.terrain && terrainImages[race.terrain]) {
    return terrainImages[race.terrain];
  }

  // 7. Default image
  return defaultImage;
}

/**
 * Get high-resolution image URL for race detail page
 */
export function getRaceDetailImageUrl(race: Race): string {
  const url = getRaceImageUrl(race);
  // Replace dimensions for higher resolution
  return url.replace('w=400&h=400', 'w=800&h=600');
}
