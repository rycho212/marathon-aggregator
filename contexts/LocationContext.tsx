import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Coordinates, reverseGeocode, geocodeCity } from '@/services/locationService';

const STORAGE_KEY = '@getabib_user_location';

export interface UserLocation {
  coordinates: Coordinates;
  city: string;
  state: string;
  radius: number; // in miles
  source: 'gps' | 'manual';
}

interface LocationContextType {
  location: UserLocation | null;
  isLoading: boolean;
  isDetecting: boolean;
  setManualLocation: (cityInput: string) => boolean;
  detectLocation: () => Promise<boolean>;
  setRadius: (radius: number) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  isLoading: true,
  isDetecting: false,
  setManualLocation: () => false,
  detectLocation: async () => false,
  setRadius: () => {},
  clearLocation: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  // Load saved location on mount
  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocation(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLocation = async (loc: UserLocation) => {
    setLocation(loc);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const detectLocation = useCallback(async (): Promise<boolean> => {
    setIsDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setIsDetecting(false);
        return false;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Try to reverse geocode with expo-location first
      let city = '';
      let state = '';
      try {
        const [address] = await Location.reverseGeocodeAsync(coords);
        if (address) {
          city = address.city || address.subregion || '';
          state = address.region || '';
        }
      } catch {
        // Fall back to our local lookup
        const local = reverseGeocode(coords);
        if (local) {
          city = local.city;
          state = local.state;
        }
      }

      await saveLocation({
        coordinates: coords,
        city,
        state,
        radius: location?.radius || 100,
        source: 'gps',
      });

      setIsDetecting(false);
      return true;
    } catch (error) {
      console.error('Error detecting location:', error);
      setIsDetecting(false);
      return false;
    }
  }, [location?.radius]);

  const setManualLocation = useCallback((cityInput: string): boolean => {
    const result = geocodeCity(cityInput);
    if (!result) return false;

    saveLocation({
      coordinates: result.coords,
      city: result.city,
      state: result.state,
      radius: location?.radius || 100,
      source: 'manual',
    });
    return true;
  }, [location?.radius]);

  const setRadius = useCallback((radius: number) => {
    if (location) {
      saveLocation({ ...location, radius });
    }
  }, [location]);

  const clearLocation = useCallback(async () => {
    setLocation(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing location:', error);
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        isDetecting,
        setManualLocation,
        detectLocation,
        setRadius,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
