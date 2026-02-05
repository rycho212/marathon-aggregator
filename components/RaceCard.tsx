import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Race } from '@/data/types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';

interface RaceCardProps {
  race: Race;
  onPress?: (race: Race) => void;
}

const categoryColors: Record<string, string> = {
  '5k': Colors.distance5k,
  '10k': Colors.distance10k,
  'half': Colors.distanceHalf,
  'marathon': Colors.distanceMarathon,
  'ultra': Colors.distanceUltra,
};

export default function RaceCard({ race, onPress }: RaceCardProps) {
  const raceDate = new Date(race.date);
  const categoryColor = categoryColors[race.category] || Colors.primary;

  const handlePress = () => {
    if (onPress) {
      onPress(race);
    }
  };

  const handleRegister = async () => {
    if (race.registrationUrl) {
      await Linking.openURL(race.registrationUrl);
    }
  };

  const formatLocation = () => {
    const parts = [race.city];
    if (race.state) parts.push(race.state);
    if (race.country && race.country !== 'US') parts.push(race.country);
    return parts.join(', ');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
    >
      {/* Category indicator bar */}
      <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.badgeText, { color: categoryColor }]}>
              {race.distanceLabel}
            </Text>
          </View>
          {race.isFeatured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Race name */}
        <Text style={styles.name} numberOfLines={2}>
          {race.name}
        </Text>

        {/* Date */}
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {format(raceDate, 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{formatLocation()}</Text>
        </View>

        {/* Terrain badge if available */}
        {race.terrain && (
          <View style={styles.row}>
            <Ionicons
              name={race.terrain === 'trail' ? 'trail-sign-outline' : 'speedometer-outline'}
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={styles.detailText}>
              {race.terrain.charAt(0).toUpperCase() + race.terrain.slice(1)}
              {race.elevation ? ` • ${race.elevation}m elevation` : ''}
            </Text>
          </View>
        )}

        {/* Footer with price and register button */}
        <View style={styles.footer}>
          <View>
            {race.price && (
              <Text style={styles.price}>
                {race.currency === 'EUR' ? '€' : '$'}{race.price}
              </Text>
            )}
            {race.spotsRemaining && race.totalSpots && (
              <Text style={styles.spots}>
                {race.spotsRemaining.toLocaleString()} spots left
              </Text>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              { backgroundColor: categoryColor },
              pressed && styles.registerButtonPressed,
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.registerText}>Register</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    overflow: 'hidden',
    flexDirection: 'row',
    ...Shadows.md,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  categoryBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredText: {
    color: Colors.warning,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: FontSizes.lg * 1.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundLight,
  },
  price: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  spots: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  registerButtonPressed: {
    opacity: 0.8,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});
