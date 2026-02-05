import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Race } from '@/data/types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');
// Card width: 72% on mobile, max 320px on larger screens
const CARD_WIDTH = Math.min(screenWidth * 0.72, 320);

interface FeaturedRacesProps {
  races: Race[];
  onRacePress?: (race: Race) => void;
}

// Uniform gradient colors for featured cards
const categoryColors: Record<string, [string, string]> = {
  '5k': ['#00C9A7', '#00A88C'],
  '10k': ['#00C9A7', '#00A88C'],
  'half': ['#00C9A7', '#00A88C'],
  'marathon': ['#00C9A7', '#00A88C'],
  'ultra': ['#00C9A7', '#00A88C'],
};

export default function FeaturedRaces({ races, onRacePress }: FeaturedRacesProps) {
  if (races.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="flame" size={24} color={Colors.primary} />
          <Text style={styles.title}>Featured Races</Text>
        </View>
        <Text style={styles.subtitle}>{races.length} races</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + Spacing.md}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        {races.map((race) => (
          <FeaturedCard key={race.id} race={race} onPress={onRacePress} />
        ))}
      </ScrollView>
    </View>
  );
}

function FeaturedCard({
  race,
  onPress,
}: {
  race: Race;
  onPress?: (race: Race) => void;
}) {
  const gradientColors = categoryColors[race.category] || ['#FF6B35', '#E85A2C'];
  const raceDate = new Date(race.date);

  const handleRegister = async () => {
    if (race.registrationUrl) {
      await Linking.openURL(race.registrationUrl);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(race)}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Top badges */}
        <View style={styles.badgeRow}>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{race.distanceLabel}</Text>
          </View>
          <View style={styles.featuredStar}>
            <Ionicons name="star" size={16} color={Colors.warning} />
          </View>
        </View>

        {/* Race info */}
        <View style={styles.cardContent}>
          <Text style={styles.raceName} numberOfLines={2}>
            {race.name}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.infoText}>
              {format(raceDate, 'MMM d, yyyy')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.infoText}>
              {race.city}, {race.state || race.country}
            </Text>
          </View>

          {race.terrain && (
            <View style={styles.infoRow}>
              <Ionicons
                name={race.terrain === 'trail' ? 'trail-sign' : 'speedometer'}
                size={14}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.infoText}>
                {race.terrain.charAt(0).toUpperCase() + race.terrain.slice(1)}
                {race.elevation ? ` • ${race.elevation}m gain` : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom action */}
        <Pressable
          style={({ pressed }) => [
            styles.registerButton,
            pressed && styles.registerButtonPressed,
          ]}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>
            {race.price ? `$${race.price} - Register` : 'Register Now'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={gradientColors[0]} />
        </Pressable>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    padding: Spacing.lg,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  distanceBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textTransform: 'uppercase',
  },
  featuredStar: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 6,
    borderRadius: BorderRadius.sm,
  },
  cardContent: {
    gap: Spacing.xs,
  },
  raceName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSizes.sm,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  registerButtonPressed: {
    opacity: 0.9,
  },
  registerText: {
    color: '#1A1A2E',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});
