import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  SearchBar,
  CategoryFilter,
  FeaturedRaces,
  RaceGridSection,
} from '@/components';
import { Race, RaceFilters } from '@/data/types';
import {
  filterRaces,
  fetchAllRaces,
  fetchQuickRaces,
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

  const [loadingMessage, setLoadingMessage] = useState('');

  const loadRaces = useCallback(async (fullSync = false) => {
    try {
      if (fullSync) {
        // Full sync from all sources
        const data = await fetchAllRaces({
          useCache: false,
          onProgress: (message) => {
            setLoadingMessage(message);
          },
        });
        setRaces(data.length > 0 ? data : getMockRaces());
      } else {
        // Try cached data first
        const cachedData = await fetchAllRaces({ useCache: true });
        if (cachedData.length > 0) {
          setRaces(cachedData);
        } else {
          // No cache - do a quick fetch from popular states
          setLoadingMessage('Loading races from RunSignUp...');
          const quickData = await fetchQuickRaces();
          // Use API data if available, otherwise fallback to curated races
          setRaces(quickData.length > 0 ? quickData : getMockRaces());
        }
      }
    } catch (error) {
      console.error('Failed to load races:', error);
      // Use fallback data on error
      setRaces(getMockRaces());
    } finally {
      setLoading(false);
      setLoadingMessage('');
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

  // Organize races by categories for Spotify-like sections
  const categorizedRaces = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      comingSoon: upcomingRaces
        .filter(r => new Date(r.date) <= thirtyDaysFromNow)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      marathons: upcomingRaces.filter(r => r.category === 'marathon'),
      halfMarathons: upcomingRaces.filter(r => r.category === 'half'),
      trailRaces: upcomingRaces.filter(r => r.terrain === 'trail'),
      ultraRaces: upcomingRaces.filter(r => r.category === 'ultra'),
      fiveKs: upcomingRaces.filter(r => r.category === '5k'),
      tenKs: upcomingRaces.filter(r => r.category === '10k'),
      roadRaces: upcomingRaces.filter(r => r.terrain === 'road'),
    };
  }, [upcomingRaces]);

  const isFiltering = filters.search !== '' || filters.categories.length > 0;

  // Hero text - using the "bold" style
  const renderHeroText = () => (
    <View style={styles.heroTextContainer}>
      <Text style={styles.heroBoldTitle}>DISCOVER</Text>
      <Text style={styles.heroBoldSubtitle}>Your next finish line</Text>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Hero header */}
      <View style={styles.header}>
        {renderHeroText()}
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
      {featuredRaces.length > 0 && !isFiltering && (
        <FeaturedRaces
          races={featuredRaces}
          onRacePress={handleRacePress}
          onSaveRace={toggleSaveRace}
          isRaceSaved={isRaceSaved}
        />
      )}
    </View>
  );

  const renderCategorizedSections = () => (
    <View>
      {/* Coming Soon - races in the next 30 days */}
      <RaceGridSection
        title="Coming Up Soon"
        icon="time-outline"
        races={categorizedRaces.comingSoon}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />

      {/* Trail Adventures */}
      <RaceGridSection
        title="Trail Adventures"
        icon="leaf-outline"
        races={categorizedRaces.trailRaces}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />

      {/* Marathons */}
      <RaceGridSection
        title="Marathons"
        icon="trophy-outline"
        races={categorizedRaces.marathons}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />

      {/* Half Marathons */}
      <RaceGridSection
        title="Half Marathons"
        icon="medal-outline"
        races={categorizedRaces.halfMarathons}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />

      {/* Ultra Races */}
      <RaceGridSection
        title="Ultra Challenges"
        icon="flame-outline"
        races={categorizedRaces.ultraRaces}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />

      {/* 5Ks & 10Ks */}
      <RaceGridSection
        title="5K Races"
        icon="walk-outline"
        races={categorizedRaces.fiveKs}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />

      <RaceGridSection
        title="10K Races"
        icon="fitness-outline"
        races={categorizedRaces.tenKs}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />
    </View>
  );

  const renderFilteredResults = () => (
    <View style={styles.filteredSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLeft}>
          <Ionicons name="search-outline" size={20} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>Search Results</Text>
        </View>
        <Text style={styles.sectionCount}>{upcomingRaces.length} found</Text>
      </View>
      <RaceGridSection
        title=""
        races={upcomingRaces}
        onRacePress={handleRacePress}
        onSaveRace={toggleSaveRace}
        isRaceSaved={isRaceSaved}
      />
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
          <Text style={styles.loadingText}>
            {loadingMessage || 'Finding races...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      >
        {renderHeader()}

        {isFiltering ? (
          upcomingRaces.length > 0 ? renderFilteredResults() : renderEmptyState()
        ) : (
          renderCategorizedSections()
        )}

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
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  heroTextContainer: {
    marginBottom: Spacing.sm,
  },
  // Gradient style (default)
  heroSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  heroTitleGradient: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  heroAccent: {
    color: Colors.primary,
  },
  // Bold style
  heroBoldTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 4,
  },
  heroBoldSubtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  // Minimal style
  heroMinimalTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
  heroMinimalSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Playful style
  heroPlayfulEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  heroPlayfulTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
  },
  heroPlayfulSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: 2,
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
  filteredSection: {
    marginTop: Spacing.sm,
  },
});
