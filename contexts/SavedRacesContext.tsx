import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Race } from '@/data/types';

const SAVED_RACES_KEY = '@getabib_saved_races';

interface SavedRacesContextType {
  savedRaces: Race[];
  savedRaceIds: Set<string>;
  isLoading: boolean;
  saveRace: (race: Race) => Promise<void>;
  unsaveRace: (raceId: string) => Promise<void>;
  toggleSaveRace: (race: Race) => Promise<void>;
  isRaceSaved: (raceId: string) => boolean;
  clearAllSaved: () => Promise<void>;
}

const SavedRacesContext = createContext<SavedRacesContextType | undefined>(undefined);

export function SavedRacesProvider({ children }: { children: ReactNode }) {
  const [savedRaces, setSavedRaces] = useState<Race[]>([]);
  const [savedRaceIds, setSavedRaceIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load saved races from AsyncStorage on mount
  useEffect(() => {
    loadSavedRaces();
  }, []);

  const loadSavedRaces = async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_RACES_KEY);
      if (stored) {
        const races: Race[] = JSON.parse(stored);
        setSavedRaces(races);
        setSavedRaceIds(new Set(races.map(r => r.id)));
      }
    } catch (error) {
      console.error('Error loading saved races:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistRaces = async (races: Race[]) => {
    try {
      await AsyncStorage.setItem(SAVED_RACES_KEY, JSON.stringify(races));
    } catch (error) {
      console.error('Error saving races:', error);
    }
  };

  const saveRace = useCallback(async (race: Race) => {
    if (savedRaceIds.has(race.id)) return;

    const newRaces = [...savedRaces, { ...race, savedAt: new Date().toISOString() }];
    setSavedRaces(newRaces);
    setSavedRaceIds(new Set([...savedRaceIds, race.id]));
    await persistRaces(newRaces);
  }, [savedRaces, savedRaceIds]);

  const unsaveRace = useCallback(async (raceId: string) => {
    const newRaces = savedRaces.filter(r => r.id !== raceId);
    const newIds = new Set(savedRaceIds);
    newIds.delete(raceId);

    setSavedRaces(newRaces);
    setSavedRaceIds(newIds);
    await persistRaces(newRaces);
  }, [savedRaces, savedRaceIds]);

  const toggleSaveRace = useCallback(async (race: Race) => {
    if (savedRaceIds.has(race.id)) {
      await unsaveRace(race.id);
    } else {
      await saveRace(race);
    }
  }, [savedRaceIds, saveRace, unsaveRace]);

  const isRaceSaved = useCallback((raceId: string) => {
    return savedRaceIds.has(raceId);
  }, [savedRaceIds]);

  const clearAllSaved = useCallback(async () => {
    setSavedRaces([]);
    setSavedRaceIds(new Set());
    await AsyncStorage.removeItem(SAVED_RACES_KEY);
  }, []);

  return (
    <SavedRacesContext.Provider
      value={{
        savedRaces,
        savedRaceIds,
        isLoading,
        saveRace,
        unsaveRace,
        toggleSaveRace,
        isRaceSaved,
        clearAllSaved,
      }}
    >
      {children}
    </SavedRacesContext.Provider>
  );
}

export function useSavedRaces() {
  const context = useContext(SavedRacesContext);
  if (context === undefined) {
    throw new Error('useSavedRaces must be used within a SavedRacesProvider');
  }
  return context;
}
