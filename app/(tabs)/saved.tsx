import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RaceCard } from '@/components';
import { useSavedRaces } from '@/contexts/SavedRacesContext';
import { Race } from '@/data/types';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function SavedScreen() {
  const router = useRouter();
  const { savedRaces, toggleSaveRace, isRaceSaved, clearAllSaved } = useSavedRaces();

  const handleRacePress = (race: Race) => {
    router.push(`/race/${race.id}`);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>Saved Races</Text>
          <Text style={styles.subtitle}>
            {savedRaces.length} {savedRaces.length === 1 ? 'race' : 'races'} saved
          </Text>
        </View>
        {savedRaces.length > 0 && (
          <Pressable
            onPress={clearAllSaved}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.iconContainer}>
        <Ionicons name="heart-outline" size={64} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No Saved Races Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any race to save it here for quick access
      </Text>

      <View style={styles.tipContainer}>
        <Ionicons name="bulb-outline" size={24} color={Colors.primary} />
        <Text style={styles.tipText}>
          Pro tip: Save races you're interested in to track registration
          deadlines and compare options!
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.browseButton,
          pressed && styles.browseButtonPressed,
        ]}
        onPress={() => router.push('/')}
      >
        <Text style={styles.browseButtonText}>Browse Races</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  if (savedRaces.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={savedRaces}
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
  headerContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  clearButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSizes.md * 1.5,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.5,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  browseButtonPressed: {
    opacity: 0.8,
  },
  browseButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: '#FFFFFF',
  },
});
