import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Race } from '@/data/types';
import { getMockRaces } from '@/services/raceService';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

const categoryColors: Record<string, [string, string]> = {
  '5k': ['#4ECDC4', '#2CB5AC'],
  '10k': ['#45B7D1', '#2E97B0'],
  half: ['#96C93D', '#7AB32A'],
  marathon: ['#FF6B35', '#E85A2C'],
  ultra: ['#9B59B6', '#7D4896'],
};

export default function RaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [race, setRace] = useState<Race | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Find the race by ID
    const races = getMockRaces();
    const foundRace = races.find((r) => r.id === id);
    setRace(foundRace || null);
  }, [id]);

  if (!race) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading race details...</Text>
      </View>
    );
  }

  const gradientColors = categoryColors[race.category] || ['#FF6B35', '#E85A2C'];
  const raceDate = new Date(race.date);

  const handleRegister = async () => {
    if (race.registrationUrl) {
      await Linking.openURL(race.registrationUrl);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${race.name} on ${format(raceDate, 'MMMM d, yyyy')} in ${race.city}, ${race.state}!\n\n${race.registrationUrl}`,
        title: race.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={handleShare} style={styles.headerButton}>
                <Ionicons name="share-outline" size={24} color={Colors.text} />
              </Pressable>
              <Pressable onPress={handleSave} style={styles.headerButton}>
                <Ionicons
                  name={isSaved ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isSaved ? Colors.error : Colors.text}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{race.distanceLabel}</Text>
              </View>
              {race.terrain && (
                <View style={styles.badge}>
                  <Ionicons
                    name={race.terrain === 'trail' ? 'trail-sign' : 'speedometer'}
                    size={14}
                    color={Colors.text}
                  />
                  <Text style={styles.badgeText}>
                    {race.terrain.charAt(0).toUpperCase() + race.terrain.slice(1)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.heroTitle}>{race.name}</Text>
            <View style={styles.heroInfo}>
              <Ionicons name="calendar" size={18} color="rgba(255,255,255,0.9)" />
              <Text style={styles.heroInfoText}>
                {format(raceDate, 'EEEE, MMMM d, yyyy')}
              </Text>
            </View>
            <View style={styles.heroInfo}>
              <Ionicons name="location" size={18} color="rgba(255,255,255,0.9)" />
              <Text style={styles.heroInfoText}>
                {race.city}, {race.state || race.country}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {race.price && (
            <View style={styles.statCard}>
              <Ionicons name="ticket-outline" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>
                {race.currency === 'EUR' ? '€' : '$'}
                {race.price}
              </Text>
              <Text style={styles.statLabel}>Entry Fee</Text>
            </View>
          )}
          {race.elevation && (
            <View style={styles.statCard}>
              <Ionicons name="trending-up-outline" size={24} color={Colors.secondary} />
              <Text style={styles.statValue}>{race.elevation}m</Text>
              <Text style={styles.statLabel}>Elevation</Text>
            </View>
          )}
          {race.spotsRemaining && (
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color={Colors.distanceHalf} />
              <Text style={styles.statValue}>
                {race.spotsRemaining.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Spots Left</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {race.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Race</Text>
            <Text style={styles.description}>{race.description}</Text>
          </View>
        )}

        {/* Organizer */}
        {race.organizerName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organized By</Text>
            <View style={styles.organizerCard}>
              <View style={styles.organizerIcon}>
                <Ionicons name="business-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.organizerName}>{race.organizerName}</Text>
            </View>
          </View>
        )}

        {/* Race details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Race Details</Text>
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{race.distanceLabel}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {format(raceDate, 'MMM d, yyyy')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {race.city}, {race.state || race.country}
              </Text>
            </View>
            {race.terrain && (
              <View style={styles.detailItem}>
                <Ionicons name="trail-sign-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.detailLabel}>Terrain</Text>
                <Text style={styles.detailValue}>
                  {race.terrain.charAt(0).toUpperCase() + race.terrain.slice(1)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom padding for register button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed register button */}
      <View style={styles.registerContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.registerButton,
            { backgroundColor: gradientColors[0] },
            pressed && styles.registerButtonPressed,
          ]}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Register Now</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.text} />
        </Pressable>
      </View>
    </>
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
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  heroContent: {
    gap: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  badgeText: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  heroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroInfoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSizes.md,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: FontSizes.md * 1.6,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  organizerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  detailsList: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundLight,
    gap: Spacing.sm,
  },
  detailLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  registerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundCard,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  registerButtonPressed: {
    opacity: 0.9,
  },
  registerText: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
});
