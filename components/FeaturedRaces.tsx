import React, { useRef, useState } from 'react';
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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Race } from '@/data/types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { getRaceImageUrl } from '@/utils/raceImages';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = Math.min(screenWidth * 0.78, 340);
const CARD_HEIGHT = 260;

interface FeaturedRacesProps {
  races: Race[];
  onRacePress?: (race: Race) => void;
  onSaveRace?: (race: Race) => void;
  isRaceSaved?: (raceId: string) => boolean;
}

/**
 * Get higher resolution image for featured cards
 */
function getFeaturedImageUrl(race: Race): string {
  const url = getRaceImageUrl(race);
  // Replace dimensions for higher resolution featured cards
  return url.replace('w=400&h=400', 'w=600&h=400');
}

export default function FeaturedRaces({
  races,
  onRacePress,
  onSaveRace,
  isRaceSaved
}: FeaturedRacesProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const STEP = CARD_WIDTH + Spacing.md;
  const maxScroll = (races.length - 1) * STEP;

  if (races.length === 0) return null;

  const scrollTo = (direction: 'left' | 'right') => {
    const next = direction === 'right'
      ? Math.min(scrollX + STEP, maxScroll)
      : Math.max(scrollX - STEP, 0);
    scrollRef.current?.scrollTo({ x: next, animated: true });
    setScrollX(next);
  };

  const showLeft = scrollX > 10;
  const showRight = scrollX < maxScroll - 10;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="flame" size={22} color={Colors.primary} />
          <Text style={styles.title}>Featured Races</Text>
        </View>
        <Text style={styles.subtitle}>{races.length} races</Text>
      </View>

      <View style={styles.scrollWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={STEP}
          snapToAlignment="start"
          contentContainerStyle={styles.scrollContent}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
            setScrollX(e.nativeEvent.contentOffset.x)
          }
          scrollEventThrottle={16}
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

        {/* Left arrow */}
        {showLeft && (
          <Pressable
            style={[styles.arrowButton, styles.arrowLeft]}
            onPress={() => scrollTo('left')}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.0)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.arrowGradient}
            >
              <View style={styles.arrowCircle}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {/* Right arrow */}
        {showRight && (
          <Pressable
            style={[styles.arrowButton, styles.arrowRight]}
            onPress={() => scrollTo('right')}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.55)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.arrowGradient}
            >
              <View style={styles.arrowCircle}>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </Pressable>
        )}
      </View>
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
  const imageUrl = getFeaturedImageUrl(race);

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
  scrollWrapper: {
    position: 'relative',
  },
  arrowButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 64,
    justifyContent: 'center',
    zIndex: 10,
  },
  arrowLeft: {
    left: 0,
  },
  arrowRight: {
    right: 0,
  },
  arrowGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
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
