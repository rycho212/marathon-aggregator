import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  RunnerPersonality,
  PersonalityType,
  getPersonalityDescription,
} from '@/data/runnerProfile';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@/constants/theme';

interface PersonalityProfileProps {
  personality: RunnerPersonality;
  onRetakeQuiz?: () => void;
}

// Gradient colors for each personality type
const personalityGradients: Record<PersonalityType, [string, string]> = {
  trail_seeker: ['#059669', '#047857'],
  urban_speedster: ['#3B82F6', '#2563EB'],
  bucket_lister: ['#8B5CF6', '#7C3AED'],
  community_runner: ['#F59E0B', '#D97706'],
  ultra_curious: ['#EF4444', '#DC2626'],
  casual_adventurer: ['#EC4899', '#DB2777'],
  pr_hunter: ['#14B8A6', '#0D9488'],
  scenic_explorer: ['#06B6D4', '#0891B2'],
  family_runner: ['#F97316', '#EA580C'],
  newbie: ['#00C9A7', '#00A88C'],
};

// Trait display config
const traitConfig = [
  { key: 'adventurous', label: 'Adventurous', icon: 'compass', color: '#059669' },
  { key: 'competitive', label: 'Competitive', icon: 'trophy', color: '#EF4444' },
  { key: 'social', label: 'Social', icon: 'people', color: '#F59E0B' },
  { key: 'endurance', label: 'Endurance', icon: 'fitness', color: '#8B5CF6' },
  { key: 'explorer', label: 'Explorer', icon: 'airplane', color: '#3B82F6' },
  { key: 'casual', label: 'Casual', icon: 'happy', color: '#EC4899' },
];

export default function PersonalityProfile({ personality, onRetakeQuiz }: PersonalityProfileProps) {
  const description = getPersonalityDescription(personality.primaryType);
  const gradientColors = personalityGradients[personality.primaryType] || [Colors.primary, Colors.primaryDark];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Card */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroEmoji}>{description.emoji}</Text>
        <Text style={styles.heroLabel}>Your Race Personality</Text>
        <Text style={styles.heroTitle}>{description.title}</Text>
        <Text style={styles.heroDescription}>{description.description}</Text>
      </LinearGradient>

      {/* Trait Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart-outline" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Your Traits</Text>
        </View>

        <View style={styles.traitsContainer}>
          {traitConfig.map((trait) => {
            const value = personality.traits[trait.key as keyof typeof personality.traits];
            return (
              <View key={trait.key} style={styles.traitRow}>
                <View style={styles.traitLabel}>
                  <Ionicons name={trait.icon as any} size={18} color={trait.color} />
                  <Text style={styles.traitName}>{trait.label}</Text>
                </View>
                <View style={styles.traitBarContainer}>
                  <View style={styles.traitBarBackground}>
                    <View
                      style={[
                        styles.traitBarFill,
                        { width: `${value}%`, backgroundColor: trait.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.traitValue}>{value}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Race Affinities */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="heart-outline" size={20} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>Race Affinities</Text>
        </View>

        <View style={styles.affinitiesGrid}>
          <AffinityCard
            label="5K"
            value={personality.raceAffinities['5k']}
            color={Colors.distance5k}
          />
          <AffinityCard
            label="10K"
            value={personality.raceAffinities['10k']}
            color={Colors.distance10k}
          />
          <AffinityCard
            label="Half"
            value={personality.raceAffinities.half}
            color={Colors.distanceHalf}
          />
          <AffinityCard
            label="Marathon"
            value={personality.raceAffinities.marathon}
            color={Colors.distanceMarathon}
          />
          <AffinityCard
            label="Ultra"
            value={personality.raceAffinities.ultra}
            color={Colors.distanceUltra}
          />
          <AffinityCard
            label="Trail"
            value={personality.raceAffinities.trail}
            color="#059669"
          />
        </View>
      </View>

      {/* Recommended Race Types */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="ribbon-outline" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Perfect For You</Text>
        </View>

        <View style={styles.recommendedList}>
          {description.recommendedRaces.map((raceType, index) => (
            <View key={index} style={styles.recommendedItem}>
              <View style={[styles.recommendedDot, { backgroundColor: gradientColors[0] }]} />
              <Text style={styles.recommendedText}>{raceType}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Fun Stats */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles-outline" size={20} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Fun Facts</Text>
        </View>

        <View style={styles.funFactsContainer}>
          <FunFact
            icon="people"
            label="Runners like you"
            value={`${Math.floor(Math.random() * 15 + 10)}%`}
            subtext="of GetABib users"
          />
          <FunFact
            icon="trophy"
            label="Your vibe match"
            value={personality.traits.competitive > 60 ? 'Eliud Kipchoge' :
                   personality.traits.adventurous > 60 ? 'Courtney Dauwalter' :
                   personality.traits.social > 60 ? 'Des Linden' : 'Meb Keflezighi'}
            subtext="Famous runner energy"
          />
        </View>
      </View>

      {/* Retake Quiz Button */}
      {onRetakeQuiz && (
        <Pressable
          style={({ pressed }) => [
            styles.retakeButton,
            pressed && styles.retakeButtonPressed,
          ]}
          onPress={onRetakeQuiz}
        >
          <Ionicons name="refresh-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.retakeText}>Retake Quiz</Text>
        </Pressable>
      )}

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

function AffinityCard({ label, value, color }: { label: string; value: number; color: string }) {
  const getAffinityLabel = (v: number) => {
    if (v >= 80) return 'Perfect Match';
    if (v >= 60) return 'Great Fit';
    if (v >= 40) return 'Good Match';
    if (v >= 20) return 'Might Enjoy';
    return 'Not Your Thing';
  };

  return (
    <View style={styles.affinityCard}>
      <View style={[styles.affinityCircle, { borderColor: color }]}>
        <Text style={[styles.affinityValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.affinityLabel}>{label}</Text>
      <Text style={styles.affinitySubtext}>{getAffinityLabel(value)}</Text>
    </View>
  );
}

function FunFact({ icon, label, value, subtext }: {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <View style={styles.funFactCard}>
      <Ionicons name={icon as any} size={24} color={Colors.primary} />
      <Text style={styles.funFactLabel}>{label}</Text>
      <Text style={styles.funFactValue}>{value}</Text>
      <Text style={styles.funFactSubtext}>{subtext}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroCard: {
    margin: Spacing.md,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  heroLabel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: Spacing.xs,
  },
  heroDescription: {
    fontSize: FontSizes.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: FontSizes.md * 1.5,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  traitsContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  traitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  traitLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: 120,
  },
  traitName: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  traitBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  traitBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 4,
    overflow: 'hidden',
  },
  traitBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  traitValue: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  affinitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  affinityCard: {
    width: '31%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  affinityCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  affinityValue: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
  },
  affinityLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  affinitySubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  recommendedList: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  recommendedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recommendedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  funFactsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  funFactCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  funFactLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  funFactValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  funFactSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  retakeButtonPressed: {
    opacity: 0.7,
  },
  retakeText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
