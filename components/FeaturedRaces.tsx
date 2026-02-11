import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Linking,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Race } from '@/data/types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = Math.min(screenWidth * 0.78, 340);
const CARD_HEIGHT = 260;

interface FeaturedRacesProps {
  races: Race[];
  onRacePress?: (race: Race) => void;
  onSaveRace?: (race: Race) => void;
  isRaceSaved?: (raceId: string) => boolean;
}

// Curated images for famous races (would come from API in production)
const raceImages: Record<string, string> = {
  'Boston Marathon': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop',
  'Big Sur International Marathon': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  'Western States 100': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
  'Chicago Marathon': 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&h=400&fit=crop',
  'NYC Marathon': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop',
  'UTMB Mont-Blanc': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
};

// Fallback images by category/terrain
const fallbackImages: Record<string, string> = {
  trail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
  ultra: 'https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?w=600&h=400&fit=crop',
  marathon: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop',
  half: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop',
  default: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop',
};

function getRaceImage(race: Race): string {
  // Check for specific race image
  if (raceImages[race.name]) {
    return raceImages[race.name];
  }
  // Use race's own image if available
  if (race.imageUrl && !race.imageUrl.includes('undefined')) {
    return race.imageUrl + '?w=600&h=400&fit=crop';
  }
  // Fallback based on terrain/category
  if (race.terrain === 'trail') return fallbackImages.trail;
  if (race.category === 'ultra') return fallbackImages.ultra;
  if (race.category === 'marathon') return fallbackImages.marathon;
  if (race.category === 'half') return fallbackImages.half;
  return fallbackImages.default;
}

export default function FeaturedRaces({
  races,
  onRacePress,
  onSaveRace,
  isRaceSaved
}: FeaturedRacesProps) {
  if (races.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="flame" size={22} color={Colors.primary} />
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
          <FeaturedCard
            key={race.id}
            race={race}
            onPress={onRacePress}
            onSave={onSaveRace}
            isSaved={isRaceSaved?.(race.id) ?? false}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function FeaturedCard({
  race,
  onPress,
  onSave,
  isSaved,
}: {
  race: Race;
  onPress?: (race: Race) => void;
  onSave?: (race: Race) => void;
  isSaved: boolean;
}) {
  const raceDate = new Date(race.date);
  const imageUrl = getRaceImage(race);

  const handleRegister = async () => {
    if (race.registrationUrl) {
      await Linking.openURL(race.registrationUrl);
    }
  };

  const handleSave = () => {
    onSave?.(race);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(race)}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        {/* Dark gradient overlay for text readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        >
          {/* Top row: badges and save button */}
          <View style={styles.topRow}>
            <View style={styles.badgeContainer}>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{race.distanceLabel}</Text>
              </View>
              {race.terrain && (
                <View style={styles.terrainBadge}>
                  <Ionicons
                    name={race.terrain === 'trail' ? 'leaf' : 'speedometer-outline'}
                    size={12}
                    color="#FFFFFF"
                  />
                  <Text style={styles.terrainText}>
                    {race.terrain.charAt(0).toUpperCase() + race.terrain.slice(1)}
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              onPress={handleSave}
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={22}
                color={isSaved ? '#EF4444' : '#FFFFFF'}
              />
            </Pressable>
          </View>

          {/* Bottom content */}
          <View style={styles.cardContent}>
            {/* Featured star */}
            <View style={styles.featuredRow}>
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={styles.featuredText}>Featured</Text>
            </View>

            {/* Race name */}
            <Text style={styles.raceName} numberOfLines={2}>
              {race.name}
            </Text>

            {/* Race details */}
            <View style={styles.detailsRow}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.85)" />
                <Text style={styles.infoText}>
                  {format(raceDate, 'MMM d, yyyy')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.85)" />
                <Text style={styles.infoText}>
                  {race.city}, {race.state || race.country}
                </Text>
              </View>
            </View>

            {/* Register button */}
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
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </Pressable>
          </View>
        </LinearGradient>
      </ImageBackground>
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
    fontSize: FontSizes.lg,
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
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: BorderRadius.lg,
  },
  gradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  distanceBadge: {
    backgroundColor: Colors.primary,
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
  terrainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  terrainText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonPressed: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardContent: {
    gap: Spacing.xs,
  },
  featuredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredText: {
    color: Colors.warning,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  raceName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: '#FFFFFF',
    lineHeight: FontSizes.xl * 1.2,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: 'rgba(255,255,255,0.85)',
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
    color: Colors.text,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});
