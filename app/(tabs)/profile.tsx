import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import {
  RunnerPersonality,
  getPersonalityDescription,
  calculatePersonalityType,
} from '@/data/runnerProfile';
import PersonalityQuiz from '@/components/PersonalityQuiz';
import PersonalityProfile from '@/components/PersonalityProfile';

const menuItems = [
  {
    icon: 'fitness-outline',
    label: 'Running Goals',
    description: 'Set and track your running goals',
  },
  {
    icon: 'trophy-outline',
    label: 'Race History',
    description: 'View your past races and results',
  },
  {
    icon: 'notifications-outline',
    label: 'Notifications',
    description: 'Manage race alerts and reminders',
  },
  {
    icon: 'settings-outline',
    label: 'Settings',
    description: 'App preferences and account settings',
  },
];

// Demo personality for preview (would come from storage in real app)
const createDemoPersonality = (): RunnerPersonality => ({
  primaryType: 'trail_seeker',
  secondaryTypes: ['scenic_explorer'],
  traits: {
    adventurous: 75,
    competitive: 45,
    social: 60,
    endurance: 70,
    explorer: 80,
    casual: 35,
  },
  raceAffinities: {
    '5k': 45,
    '10k': 55,
    'half': 70,
    'marathon': 75,
    'ultra': 85,
    'trail': 90,
    'road': 40,
    'themed': 30,
    'destination': 85,
    'local': 50,
  },
});

export default function ProfileScreen() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [personality, setPersonality] = useState<RunnerPersonality | null>(null);
  const [showPersonalityDetail, setShowPersonalityDetail] = useState(false);

  const handleQuizComplete = (result: RunnerPersonality) => {
    setPersonality(result);
    setShowQuiz(false);
  };

  const handleSkipQuiz = () => {
    setShowQuiz(false);
  };

  // Show quiz screen
  if (showQuiz) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <PersonalityQuiz onComplete={handleQuizComplete} onSkip={handleSkipQuiz} />
      </SafeAreaView>
    );
  }

  // Show full personality profile
  if (showPersonalityDetail && personality) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.detailHeader}>
          <Pressable
            onPress={() => setShowPersonalityDetail(false)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.detailTitle}>Race Personality</Text>
          <View style={{ width: 40 }} />
        </View>
        <PersonalityProfile
          personality={personality}
          onRetakeQuiz={() => {
            setShowPersonalityDetail(false);
            setShowQuiz(true);
          }}
        />
      </SafeAreaView>
    );
  }

  const description = personality
    ? getPersonalityDescription(personality.primaryType)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={Colors.textMuted} />
          </View>
          <Text style={styles.name}>Runner</Text>
          <Text style={styles.email}>Sign in to save your races</Text>

          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.signInButtonPressed,
            ]}
          >
            <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>
        </View>

        {/* Race Personality Card */}
        {personality ? (
          <Pressable
            onPress={() => setShowPersonalityDetail(true)}
            style={({ pressed }) => pressed && { opacity: 0.9 }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.personalityCard}
            >
              <View style={styles.personalityHeader}>
                <Text style={styles.personalityEmoji}>{description?.emoji}</Text>
                <View style={styles.personalityInfo}>
                  <Text style={styles.personalityLabel}>Your Race Personality</Text>
                  <Text style={styles.personalityType}>{description?.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={styles.personalityDesc} numberOfLines={2}>
                {description?.description}
              </Text>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setShowQuiz(true)}
            style={({ pressed }) => pressed && { opacity: 0.9 }}
          >
            <View style={styles.discoverCard}>
              <View style={styles.discoverIconContainer}>
                <Ionicons name="sparkles" size={32} color={Colors.primary} />
              </View>
              <View style={styles.discoverContent}>
                <Text style={styles.discoverTitle}>Discover Your Race Personality</Text>
                <Text style={styles.discoverSubtitle}>
                  Take a quick quiz to get personalized race recommendations
                </Text>
              </View>
              <View style={styles.discoverButton}>
                <Text style={styles.discoverButtonText}>Start Quiz</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuContainer}>
          {/* Personality menu item if they have one */}
          {personality && (
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => setShowPersonalityDetail(true)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: Colors.primary + '20' }]}>
                <Text style={{ fontSize: 20 }}>{description?.emoji}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Race Personality</Text>
                <Text style={styles.menuDescription}>View your {description?.title} profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </Pressable>
          )}

          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textMuted}
              />
            </Pressable>
          ))}
        </View>

        {/* Version info */}
        <View style={styles.footer}>
          <Text style={styles.version}>RaceRadar v1.0.0</Text>
          <Text style={styles.copyright}>
            Built with ❤️ for runners everywhere
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  name: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  signInButtonPressed: {
    opacity: 0.8,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  // Personality Card (when they have one)
  personalityCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  personalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  personalityEmoji: {
    fontSize: 40,
    marginRight: Spacing.sm,
  },
  personalityInfo: {
    flex: 1,
  },
  personalityLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  personalityType: {
    fontSize: FontSizes.lg,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  personalityDesc: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: FontSizes.sm * 1.4,
  },
  // Discover Card (when they haven't taken quiz)
  discoverCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
    ...Shadows.sm,
  },
  discoverIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  discoverContent: {
    marginBottom: Spacing.md,
  },
  discoverTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  discoverSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.4,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  // Menu
  menuContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  version: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  copyright: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  // Detail view header
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
});
