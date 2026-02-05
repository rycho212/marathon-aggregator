import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Race } from '@/data/types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';

interface RaceCardProps {
  race: Race;
  onPress?: (race: Race) => void;
  onSave?: (race: Race) => void;
  isSaved?: boolean;
}

const categoryColors: Record<string, string> = {
  '5k': Colors.distance5k,
  '10k': Colors.distance10k,
  'half': Colors.distanceHalf,
  'marathon': Colors.distanceMarathon,
  'ultra': Colors.distanceUltra,
};

// Fallback images for different terrains/categories
const fallbackImages: Record<string, string> = {
  trail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
  road: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
  marathon: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
  ultra: 'https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?w=400&h=300&fit=crop',
  default: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=300&fit=crop',
};

export default function RaceCard({ race, onPress, onSave, isSaved = false }: RaceCardProps) {
  const raceDate = new Date(race.date);
  const categoryColor = categoryColors[race.category] || Colors.primary;

  const handlePress = () => {
    if (onPress) {
      onPress(race);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(race);
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

  const getImageUrl = () => {
    if (race.imageUrl && !race.imageUrl.includes('voices')) {
      return race.imageUrl + '?w=400&h=300&fit=crop';
    }
    if (race.terrain === 'trail') return fallbackImages.trail;
    if (race.category === 'ultra') return fallbackImages.ultra;
    if (race.category === 'marathon') return fallbackImages.marathon;
    return fallbackImages.default;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
    >
      {/* Race image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getImageUrl() }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Save button overlay */}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={handleSave}
        >
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={20}
            color={isSaved ? '#EF4444' : '#FFFFFF'}
          />
        </Pressable>
        {/* Distance badge on image */}
        <View style={[styles.imageBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.imageBadgeText}>{race.distanceLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Header with featured badge */}
        <View style={styles.header}>
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
          <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {format(raceDate, 'MMM d, yyyy')}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>{formatLocation()}</Text>
        </View>

        {/* Terrain */}
        {race.terrain && (
          <View style={styles.row}>
            <Ionicons
              name={race.terrain === 'trail' ? 'trail-sign-outline' : 'speedometer-outline'}
              size={15}
              color={Colors.textSecondary}
            />
            <Text style={styles.detailText}>
              {race.terrain.charAt(0).toUpperCase() + race.terrain.slice(1)}
              {race.elevation ? ` • ${race.elevation}m` : ''}
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
                {race.spotsRemaining.toLocaleString()} spots
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
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
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
    ...Shadows.md,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundAccent,
  },
  saveButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonPressed: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  imageBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textTransform: 'uppercase',
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    minHeight: 18,
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
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: FontSizes.md * 1.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  price: {
    color: Colors.text,
    fontSize: FontSizes.md,
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
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
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
