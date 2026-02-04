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
}

export interface RaceFilters {
  search: string;
  categories: string[];
  startDate: Date | null;
  endDate: Date | null;
  location: string;
  terrain: string[];
  maxPrice?: number;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}
