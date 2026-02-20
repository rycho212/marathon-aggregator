import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalTag, ParsedGoals, analyzeGoals } from '@/services/goalEngine';

const STORAGE_KEY = '@getabib_user_goals_v2';

interface GoalsState {
  rawText: string;
  parsedGoals: ParsedGoals;
  confirmedTags: GoalTag[];
  dismissedTagIds: string[];
  updatedAt: string | null;
}

interface GoalsContextType {
  rawText: string;
  parsedGoals: ParsedGoals;
  confirmedTags: GoalTag[];
  isLoading: boolean;
  hasGoals: boolean;
  updateGoalText: (text: string) => void;
  confirmTag: (tag: GoalTag) => void;
  dismissTag: (tagId: string) => void;
  clearGoals: () => void;
}

const defaultParsedGoals: ParsedGoals = {
  tags: [],
  preferredDistances: [],
  preferredTerrain: [],
  experienceLevel: null,
  coursePreferences: [],
  specialGoals: [],
};

const GoalsContext = createContext<GoalsContextType>({
  rawText: '',
  parsedGoals: defaultParsedGoals,
  confirmedTags: [],
  isLoading: true,
  hasGoals: false,
  updateGoalText: () => {},
  confirmTag: () => {},
  dismissTag: () => {},
  clearGoals: () => {},
});

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GoalsState>({
    rawText: '',
    parsedGoals: defaultParsedGoals,
    confirmedTags: [],
    dismissedTagIds: [],
    updatedAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveState = async (newState: GoalsState) => {
    setState(newState);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const updateGoalText = useCallback((text: string) => {
    const parsed = analyzeGoals(text);

    // Auto-confirm newly detected tags (unless previously dismissed)
    const newConfirmed = parsed.tags.filter(
      (t) =>
        !state.dismissedTagIds.includes(t.id) &&
        !state.confirmedTags.find((ct) => ct.id === t.id)
    );

    const allConfirmed = [
      ...state.confirmedTags.filter((ct) =>
        parsed.tags.find((t) => t.id === ct.id)
      ),
      ...newConfirmed,
    ];

    saveState({
      rawText: text,
      parsedGoals: parsed,
      confirmedTags: allConfirmed,
      dismissedTagIds: state.dismissedTagIds,
      updatedAt: new Date().toISOString(),
    });
  }, [state.confirmedTags, state.dismissedTagIds]);

  const confirmTag = useCallback((tag: GoalTag) => {
    if (state.confirmedTags.find((t) => t.id === tag.id)) return;

    saveState({
      ...state,
      confirmedTags: [...state.confirmedTags, tag],
      dismissedTagIds: state.dismissedTagIds.filter((id) => id !== tag.id),
      updatedAt: new Date().toISOString(),
    });
  }, [state]);

  const dismissTag = useCallback((tagId: string) => {
    saveState({
      ...state,
      confirmedTags: state.confirmedTags.filter((t) => t.id !== tagId),
      dismissedTagIds: [...state.dismissedTagIds, tagId],
      updatedAt: new Date().toISOString(),
    });
  }, [state]);

  const clearGoals = useCallback(async () => {
    const cleared: GoalsState = {
      rawText: '',
      parsedGoals: defaultParsedGoals,
      confirmedTags: [],
      dismissedTagIds: [],
      updatedAt: null,
    };
    setState(cleared);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing goals:', error);
    }
  }, []);

  return (
    <GoalsContext.Provider
      value={{
        rawText: state.rawText,
        parsedGoals: state.parsedGoals,
        confirmedTags: state.confirmedTags,
        isLoading,
        hasGoals: state.confirmedTags.length > 0,
        updateGoalText,
        confirmTag,
        dismissTag,
        clearGoals,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  return useContext(GoalsContext);
}
