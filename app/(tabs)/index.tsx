import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  RaceCard,
  SearchBar,
  CategoryFilter,
  FeaturedRaces,
} from '@/components';
import { Race, RaceFilters } from '@/data/types';
import {
  fetchRacesFromRunSignUp,
  filterRaces,
  getMockRaces,
} from '@/services/raceService';
import { useSavedRaces } from '@/contexts/SavedRacesContext';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function DiscoverScreen() {
  const router = useRouter();
  const { toggleSaveRace, isRaceSaved, savedRaces } = useSavedRaces();
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<RaceFilters>({
    search: '',
    categories: [],
    startDate: null,
    endDate: null,
    location: '',
    terrain: [],
  });

  const loadRaces = useCallback(async () => {
    try {
      // Try to fetch from API, fall back to mock data
      const data = await fetchRacesFromRunSignUp({ limit: 50 });
      if (data.length > 0) {
        setRaces(data);
      } else {
        // Use mock data as fallback
        setRaces(getMockRaces());
      }
    } catch (error) {
      console.error('Failed to load races:', error);
      setRaces(getMockRaces());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRaces();
  }, [loadRaces]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRaces();
    setRefreshing(false);
  }, [loadRaces]);

  const handleRacePress = (race: Race) => {
    router.push(`/race/${race.id}`);
  };

  const filteredRaces = filterRaces(races, filters);
  const featuredRaces = races.filter((race) => race.isFeatured);
  const upcomingRaces = filteredRaces.filter((race) => !race.isFeatured);

  const renderHeader = () => (
    <View>
      {/* Hero header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Find Your Next</Text>
          <Text style={styles.heroTitle}>Adventure</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{races.length}</Text>
            <Text style={styles.statLabel}>Races</Text>
          </View>
          {savedRaces.length > 0 && (
            <View style={[styles.stat, { marginTop: Spacing.xs }]}>
              <Text style={styles.statNumber}>{savedRaces.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search bar */}
      <SearchBar
        value={filters.search}
        onChangeText={(text) => setFilters({ ...filters, search: text })}
        placeholder="Search by name, city, or state..."
        onFilterPress={() => {
          // TODO: Open filter modal
        }}
      />

      {/* Category filters */}
      <CategoryFilter
        selectedCategories={filters.categories}
        onCategoryChange={(categories) =>
          setFilters({ ...filters, categories })
        }
      />

      {/* Featured races carousel */}
      {featuredRaces.length > 0 && filters.search === '' && filters.categories.length === 0 && (
        <FeaturedRaces races={featuredRaces} onRacePress={handleRacePress} />
      )}

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLeft}>
          <Ionicons name="calendar-outline" size={20} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>
            {filters.search || filters.categories.length > 0
              ? 'Search Results'
              : 'Upcoming Races'}
          </Text>
        </View>
        <Text style={styles.sectionCount}>
          {upcomingRaces.length} found
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No races found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or search terms
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding races...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={upcomingRaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RaceCard
            race={item}
            onPress={handleRacePress}
            onSave={toggleSaveRace}
            isSaved={isRaceSaved(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  stat: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  sectionCount: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
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
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
