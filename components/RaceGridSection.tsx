import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Race } from '@/data/types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { getRaceImageUrl } from '@/utils/raceImages';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = Math.min((screenWidth - Spacing.md * 3) / 2.3, 180);
const CARD_HEIGHT = 200;

interface RaceGridSectionProps {
  title: string;
  icon?: string;
  races: Race[];
  onRacePress?: (race: Race) => void;
  onSaveRace?: (race: Race) => void;
  isRaceSaved?: (raceId: string) => boolean;
  showAll?: () => void;
}

export default function RaceGridSection({
  title,
  icon,
  races,
  onRacePress,
  onSaveRace,
  isRaceSaved,
  showAll,
}: RaceGridSectionProps) {
  if (races.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {icon && <Ionicons name={icon as any} size={20} color={Colors.primary} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        {showAll && (
          <Pressable onPress={showAll} style={styles.showAllButton}>
            <Text style={styles.showAllText}>Show all</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {races.slice(0, 10).map((race) => (
          <CompactRaceCard
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

function CompactRaceCard({
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
  const imageUrl = getRaceImageUrl(race);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(race)}
    >
      {/* Image container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Distance badge */}
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{race.distanceLabel}</Text>
        </View>
        {/* Save button */}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onSave?.(race);
          }}
        >
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={16}
            color={isSaved ? '#EF4444' : '#FFFFFF'}
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.raceName} numberOfLines={2}>
          {race.name}
        </Text>
        <Text style={styles.raceInfo} numberOfLines={1}>
          {format(raceDate, 'MMM d')} • {race.city}
        </Text>
        {race.price && (
          <Text style={styles.racePrice}>${race.price}</Text>
        )}
      </View>
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
    marginBottom: Spacing.sm,
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
  showAllButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  showAllText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: FontWeights.medium,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  card: {
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
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    position: 'relative',
  },
  image: {
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
    fontWeight: FontWeights.bold,
    textTransform: 'uppercase',
  },
  saveButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
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
  raceName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    lineHeight: FontSizes.sm * 1.3,
    marginBottom: 2,
  },
  raceInfo: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  racePrice: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
});
