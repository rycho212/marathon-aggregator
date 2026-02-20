import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CategoryFilter } from '@/components';
import { Race, RaceFilters } from '@/data/types';
import { filterRaces, getMockRaces, fetchRacesFromRunSignUp } from '@/services/raceService';
import { useSavedRaces } from '@/contexts/SavedRacesContext';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { format } from 'date-fns';
import { getRaceImageUrl } from '@/utils/raceImages';

const { width: screenWidth } = Dimensions.get('window');
// Match the compact card size from RaceGridSection (capped at 180px)
const CARD_WIDTH = Math.min((screenWidth - Spacing.md * 3) / 2.3, 180);

// US states for location filter
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function SearchScreen() {
  const router = useRouter();
  const { toggleSaveRace, isRaceSaved } = useSavedRaces();
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RaceFilters>({
    search: '',
    categories: [],
    startDate: null,
    endDate: null,
    location: '',
    terrain: [],
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Boston',
    'Chicago Marathon',
    'Trail running California',
  ]);

  useEffect(() => {
    loadRaces();
  }, []);

  const loadRaces = async () => {
    try {
      const data = await fetchRacesFromRunSignUp({ limit: 100 });
      setRaces(data.length > 0 ? data : getMockRaces());
    } catch {
      setRaces(getMockRaces());
    } finally {
      setLoading(false);
    }
  };

  const handleRacePress = (race: Race) => {
    router.push(`/race/${race.id}`);
  };

  const handleRecentSearch = (term: string) => {
    setFilters({ ...filters, search: term });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      startDate: null,
      endDate: null,
      location: '',
      terrain: [],
    });
  };

  const filteredRaces = filterRaces(races, filters);
  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.location ||
    filters.terrain.length > 0;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={filters.search}
          onChangeText={(text) => setFilters({ ...filters, search: text })}
          placeholder="Search races, cities, events..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {filters.search.length > 0 && (
          <Pressable onPress={() => setFilters({ ...filters, search: '' })}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Category filters */}
      <Text style={styles.filterLabel}>Distance</Text>
      <CategoryFilter
        selectedCategories={filters.categories}
        onCategoryChange={(categories) =>
          setFilters({ ...filters, categories })
        }
      />

      {/* Location filter */}
      <Text style={styles.filterLabel}>Location</Text>
      <Pressable
        style={styles.locationButton}
        onPress={() => setShowLocationPicker(!showLocationPicker)}
      >
        <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
        <Text style={styles.locationText}>
          {filters.location || 'All Locations'}
        </Text>
        <Ionicons
          name={showLocationPicker ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textMuted}
        />
      </Pressable>

      {showLocationPicker && (
        <View style={styles.locationPicker}>
          <Pressable
            style={[
              styles.locationOption,
              !filters.location && styles.locationOptionSelected,
            ]}
            onPress={() => {
              setFilters({ ...filters, location: '' });
              setShowLocationPicker(false);
            }}
          >
            <Text
              style={[
                styles.locationOptionText,
                !filters.location && styles.locationOptionTextSelected,
              ]}
            >
              All Locations
            </Text>
          </Pressable>
          {US_STATES.map((state) => (
            <Pressable
              key={state}
              style={[
                styles.locationOption,
                filters.location === state && styles.locationOptionSelected,
              ]}
              onPress={() => {
                setFilters({ ...filters, location: state });
                setShowLocationPicker(false);
              }}
            >
              <Text
                style={[
                  styles.locationOptionText,
                  filters.location === state && styles.locationOptionTextSelected,
                ]}
              >
                {state}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Terrain filter */}
      <Text style={styles.filterLabel}>Terrain</Text>
      <View style={styles.terrainContainer}>
        {['road', 'trail', 'track'].map((terrain) => {
          const isSelected = filters.terrain.includes(terrain);
          return (
            <Pressable
              key={terrain}
              style={[
                styles.terrainChip,
                isSelected && styles.terrainChipSelected,
              ]}
              onPress={() => {
                if (isSelected) {
                  setFilters({
                    ...filters,
                    terrain: filters.terrain.filter((t) => t !== terrain),
                  });
                } else {
                  setFilters({
                    ...filters,
                    terrain: [...filters.terrain, terrain],
                  });
                }
              }}
            >
              <Ionicons
                name={
                  terrain === 'trail'
                    ? 'trail-sign-outline'
                    : terrain === 'track'
                    ? 'fitness-outline'
                    : 'car-outline'
                }
                size={16}
                color={isSelected ? Colors.text : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.terrainText,
                  isSelected && styles.terrainTextSelected,
                ]}
              >
                {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Active filters bar */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersBar}>
          <Text style={styles.resultsCount}>
            {filteredRaces.length} races found
          </Text>
          <Pressable onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        </View>
      )}

      {/* Recent searches (only when no search) */}
      {!filters.search && !hasActiveFilters && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          <View style={styles.recentChips}>
            {recentSearches.map((term, index) => (
              <Pressable
                key={index}
                style={styles.recentChip}
                onPress={() => handleRecentSearch(term)}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={Colors.textMuted}
                />
                <Text style={styles.recentChipText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No races found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  const renderCompactCard = (race: Race) => {
    const raceDate = new Date(race.date);
    const imageUrl = getRaceImageUrl(race);
    const isSaved = isRaceSaved(race.id);

    return (
      <Pressable
        key={race.id}
        style={({ pressed }) => [styles.compactCard, pressed && styles.cardPressed]}
        onPress={() => handleRacePress(race)}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{race.distanceLabel}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
            onPress={(e) => {
              e.stopPropagation();
              toggleSaveRace(race);
            }}
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={16}
              color={isSaved ? '#EF4444' : '#FFFFFF'}
            />
          </Pressable>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={2}>
            {race.name}
          </Text>
          <Text style={styles.cardInfo} numberOfLines={1}>
            {format(raceDate, 'MMM d')} • {race.city}
          </Text>
          {race.price && (
            <Text style={styles.cardPrice}>${race.price}</Text>
          )}
        </View>
      </Pressable>
    );
  };

  const renderResultsGrid = () => {
    const racesToShow = hasActiveFilters ? filteredRaces : [];

    if (racesToShow.length === 0 && hasActiveFilters) {
      return renderEmptyState();
    }

    return (
      <View style={styles.resultsGrid}>
        {racesToShow.map(race => renderCompactCard(race))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {renderHeader()}
        {renderResultsGrid()}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 52,
    color: Colors.text,
    fontSize: FontSizes.md,
  },
  filterLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.md,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  locationText: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSizes.md,
  },
  locationPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
  },
  locationOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  locationOptionSelected: {
    backgroundColor: Colors.primary,
  },
  locationOptionText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  locationOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: FontWeights.medium,
  },
  terrainContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  terrainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  terrainChipSelected: {
    backgroundColor: Colors.primary,
  },
  terrainText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  terrainTextSelected: {
    color: '#FFFFFF',
    fontWeight: FontWeights.medium,
  },
  activeFiltersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundCard,
  },
  resultsCount: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  clearButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  clearText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  recentContainer: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  recentTitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.md,
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  recentChipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  resultsGrid: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  compactCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundAccent,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: Spacing.xs,
    left: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  saveButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonPressed: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  cardContent: {
    padding: Spacing.sm,
  },
  cardName: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: FontSizes.sm * 1.3,
    marginBottom: 2,
  },
  cardInfo: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});
