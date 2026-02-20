/**
 * Location service for distance calculation and city geocoding
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Haversine formula to calculate distance between two coordinates (in miles)
export function getDistanceMiles(from: Coordinates, to: Coordinates): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Format distance for display
export function formatDistance(miles: number): string {
  if (miles < 1) return '<1 mi';
  if (miles < 10) return `${Math.round(miles)} mi`;
  if (miles < 100) return `${Math.round(miles)} mi`;
  return `${Math.round(miles)} mi`;
}

// US city coordinates lookup (major cities + race cities)
const cityCoordinates: Record<string, Coordinates> = {
  // Major metros
  'new york_NY': { latitude: 40.7128, longitude: -74.006 },
  'brooklyn_NY': { latitude: 40.6782, longitude: -73.9442 },
  'los angeles_CA': { latitude: 34.0522, longitude: -118.2437 },
  'chicago_IL': { latitude: 41.8781, longitude: -87.6298 },
  'houston_TX': { latitude: 29.7604, longitude: -95.3698 },
  'phoenix_AZ': { latitude: 33.4484, longitude: -112.074 },
  'philadelphia_PA': { latitude: 39.9526, longitude: -75.1652 },
  'san antonio_TX': { latitude: 29.4241, longitude: -98.4936 },
  'san diego_CA': { latitude: 32.7157, longitude: -117.1611 },
  'dallas_TX': { latitude: 32.7767, longitude: -96.797 },
  'san francisco_CA': { latitude: 37.7749, longitude: -122.4194 },
  'austin_TX': { latitude: 30.2672, longitude: -97.7431 },
  'seattle_WA': { latitude: 47.6062, longitude: -122.3321 },
  'denver_CO': { latitude: 39.7392, longitude: -104.9903 },
  'boston_MA': { latitude: 42.3601, longitude: -71.0589 },
  'nashville_TN': { latitude: 36.1627, longitude: -86.7816 },
  'portland_OR': { latitude: 45.5051, longitude: -122.675 },
  'atlanta_GA': { latitude: 33.749, longitude: -84.388 },
  'miami_FL': { latitude: 25.7617, longitude: -80.1918 },
  'orlando_FL': { latitude: 28.5383, longitude: -81.3792 },
  'minneapolis_MN': { latitude: 44.9778, longitude: -93.265 },
  'detroit_MI': { latitude: 42.3314, longitude: -83.0458 },
  'cincinnati_OH': { latitude: 39.1031, longitude: -84.512 },
  'pittsburgh_PA': { latitude: 40.4406, longitude: -79.9959 },
  'richmond_VA': { latitude: 37.5407, longitude: -77.436 },
  'arlington_VA': { latitude: 38.8816, longitude: -77.0910 },
  'charleston_SC': { latitude: 32.7765, longitude: -79.9311 },
  'new orleans_LA': { latitude: 29.9511, longitude: -90.0715 },
  'honolulu_HI': { latitude: 21.3069, longitude: -157.8583 },
  'duluth_MN': { latitude: 46.7867, longitude: -92.1005 },
  'burlington_VT': { latitude: 44.4759, longitude: -73.2121 },
  'mobile_AL': { latitude: 30.6954, longitude: -88.0399 },
  'boulder_CO': { latitude: 40.015, longitude: -105.2705 },

  // Race-specific locations
  'big sur_CA': { latitude: 36.2704, longitude: -121.8081 },
  'olympic valley_CA': { latitude: 39.1968, longitude: -120.2354 },
  'leadville_CO': { latitude: 39.2508, longitude: -106.2925 },
  'manitou springs_CO': { latitude: 38.8586, longitude: -104.9175 },
  'moab_UT': { latitude: 38.5733, longitude: -109.5498 },
  'springdale_UT': { latitude: 37.1889, longitude: -112.9988 },
  'fountain hills_AZ': { latitude: 33.6117, longitude: -111.7173 },
  'ashford_WA': { latitude: 46.7542, longitude: -122.0607 },
  'harpers ferry_WV': { latitude: 39.3251, longitude: -77.7286 },
  'marin_CA': { latitude: 37.9735, longitude: -122.5311 },
  'mill valley_CA': { latitude: 37.906, longitude: -122.5419 },
  'napa_CA': { latitude: 38.2975, longitude: -122.2869 },
  'grand canyon_AZ': { latitude: 36.0544, longitude: -112.1401 },
  'chamonix_': { latitude: 45.9237, longitude: 6.8694 },
};

// State center coordinates (fallback when city not found)
const stateCenters: Record<string, Coordinates> = {
  'AL': { latitude: 32.806, longitude: -86.791 },
  'AK': { latitude: 61.370, longitude: -152.404 },
  'AZ': { latitude: 34.049, longitude: -111.094 },
  'AR': { latitude: 34.800, longitude: -92.199 },
  'CA': { latitude: 36.778, longitude: -119.418 },
  'CO': { latitude: 39.550, longitude: -105.782 },
  'CT': { latitude: 41.597, longitude: -72.755 },
  'DE': { latitude: 39.319, longitude: -75.507 },
  'DC': { latitude: 38.907, longitude: -77.037 },
  'FL': { latitude: 27.665, longitude: -81.516 },
  'GA': { latitude: 33.040, longitude: -83.643 },
  'HI': { latitude: 21.094, longitude: -157.498 },
  'ID': { latitude: 44.068, longitude: -114.742 },
  'IL': { latitude: 40.633, longitude: -89.399 },
  'IN': { latitude: 40.267, longitude: -86.135 },
  'IA': { latitude: 42.011, longitude: -93.210 },
  'KS': { latitude: 38.527, longitude: -96.726 },
  'KY': { latitude: 37.839, longitude: -84.270 },
  'LA': { latitude: 30.985, longitude: -91.962 },
  'ME': { latitude: 45.254, longitude: -69.446 },
  'MD': { latitude: 39.046, longitude: -76.641 },
  'MA': { latitude: 42.407, longitude: -71.382 },
  'MI': { latitude: 44.314, longitude: -85.602 },
  'MN': { latitude: 46.730, longitude: -94.685 },
  'MS': { latitude: 32.354, longitude: -89.398 },
  'MO': { latitude: 38.573, longitude: -92.603 },
  'MT': { latitude: 46.879, longitude: -110.363 },
  'NE': { latitude: 41.493, longitude: -99.902 },
  'NV': { latitude: 38.802, longitude: -116.420 },
  'NH': { latitude: 43.193, longitude: -71.572 },
  'NJ': { latitude: 40.059, longitude: -74.406 },
  'NM': { latitude: 34.519, longitude: -105.870 },
  'NY': { latitude: 42.165, longitude: -74.948 },
  'NC': { latitude: 35.630, longitude: -79.806 },
  'ND': { latitude: 47.528, longitude: -99.784 },
  'OH': { latitude: 40.417, longitude: -82.907 },
  'OK': { latitude: 35.007, longitude: -97.093 },
  'OR': { latitude: 43.804, longitude: -120.554 },
  'PA': { latitude: 41.203, longitude: -77.195 },
  'RI': { latitude: 41.580, longitude: -71.478 },
  'SC': { latitude: 33.836, longitude: -81.164 },
  'SD': { latitude: 43.969, longitude: -99.902 },
  'TN': { latitude: 35.517, longitude: -86.580 },
  'TX': { latitude: 31.969, longitude: -99.902 },
  'UT': { latitude: 39.321, longitude: -111.093 },
  'VT': { latitude: 44.559, longitude: -72.578 },
  'VA': { latitude: 37.431, longitude: -78.656 },
  'WA': { latitude: 47.751, longitude: -120.740 },
  'WV': { latitude: 38.598, longitude: -80.455 },
  'WI': { latitude: 43.784, longitude: -88.788 },
  'WY': { latitude: 43.076, longitude: -107.290 },
};

/**
 * Get coordinates for a race based on its city and state
 */
export function getRaceCoordinates(city: string, state: string): Coordinates | null {
  // Try exact city+state match
  const key = `${city.toLowerCase().trim()}_${state}`;
  if (cityCoordinates[key]) return cityCoordinates[key];

  // Try partial city match
  const cityLower = city.toLowerCase().trim();
  for (const [k, coords] of Object.entries(cityCoordinates)) {
    const [cityPart] = k.split('_');
    if (cityPart === cityLower) return coords;
  }

  // Fall back to state center
  if (state && stateCenters[state]) return stateCenters[state];

  return null;
}

/**
 * Get a user-friendly location string from coordinates via simple reverse geocoding
 * Uses the city coordinates lookup in reverse
 */
export function reverseGeocode(coords: Coordinates): { city: string; state: string } | null {
  let closest: { city: string; state: string; distance: number } | null = null;

  for (const [key, cityCoords] of Object.entries(cityCoordinates)) {
    const dist = getDistanceMiles(coords, cityCoords);
    const [city, state] = key.split('_');
    if (!closest || dist < closest.distance) {
      closest = {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        state,
        distance: dist,
      };
    }
  }

  // Only return if reasonably close (within 100 miles of a known city)
  if (closest && closest.distance < 100) {
    return { city: closest.city, state: closest.state };
  }

  // Fall back to state center matching
  let closestState: { state: string; distance: number } | null = null;
  for (const [state, stateCoords] of Object.entries(stateCenters)) {
    const dist = getDistanceMiles(coords, stateCoords);
    if (!closestState || dist < closestState.distance) {
      closestState = { state, distance: dist };
    }
  }

  if (closestState) {
    return { city: '', state: closestState.state };
  }

  return null;
}

/**
 * Lookup coordinates for a city name (user typed)
 */
export function geocodeCity(input: string): { coords: Coordinates; city: string; state: string } | null {
  const inputLower = input.toLowerCase().trim();

  // Try direct match
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    const [city, state] = key.split('_');
    if (city === inputLower || `${city}, ${state.toLowerCase()}` === inputLower) {
      return {
        coords,
        city: city.charAt(0).toUpperCase() + city.slice(1),
        state,
      };
    }
  }

  // Try partial match
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    const [city, state] = key.split('_');
    if (city.includes(inputLower) || inputLower.includes(city)) {
      return {
        coords,
        city: city.charAt(0).toUpperCase() + city.slice(1),
        state,
      };
    }
  }

  // Try state abbreviation
  const stateUpper = input.toUpperCase().trim();
  if (stateCenters[stateUpper]) {
    return {
      coords: stateCenters[stateUpper],
      city: '',
      state: stateUpper,
    };
  }

  return null;
}
