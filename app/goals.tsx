import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoals } from '@/contexts/GoalsContext';
import { GoalTag, analyzeGoals } from '@/services/goalEngine';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

export default function GoalsScreen() {
  const router = useRouter();
  const {
    rawText,
    parsedGoals,
    confirmedTags,
    hasGoals,
    updateGoalText,
    confirmTag,
    dismissTag,
    clearGoals,
  } = useGoals();

  const [text, setText] = useState(rawText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(hasGoals);

  // Sync initial state
  useEffect(() => {
    setText(rawText);
    if (rawText) setShowResults(true);
  }, [rawText]);

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    // Small delay to make it feel like "AI is thinking"
    setTimeout(() => {
      updateGoalText(text);
      setIsAnalyzing(false);
      setShowResults(true);
    }, 800);
  }, [text, updateGoalText]);

  const handleClear = () => {
    setText('');
    setShowResults(false);
    clearGoals();
  };

  // Get tags that are detected but not yet confirmed or dismissed
  const suggestedTags = parsedGoals.tags.filter(
    (t) => !confirmedTags.find((ct) => ct.id === t.id)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Race Goals</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="sparkles" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Tell us about your goals</Text>
          <Text style={styles.heroSubtitle}>
            Describe what you want to achieve — we'll personalize your race recommendations
          </Text>
        </View>

        {/* Free-form text input */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.goalInput}
            multiline
            numberOfLines={6}
            placeholder="e.g., I want to qualify for Boston. I've been running for 2 years and my current marathon PR is 3:45. I love trail races and hilly courses. My dream is to run Western States someday..."
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <View style={styles.inputActions}>
            {text.trim().length > 0 && (
              <Pressable onPress={handleClear} style={styles.clearTextButton}>
                <Text style={styles.clearTextButtonText}>Clear</Text>
              </Pressable>
            )}
            <Pressable
              style={[
                styles.analyzeButton,
                (!text.trim() || isAnalyzing) && styles.analyzeButtonDisabled,
              ]}
              onPress={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#fff" />
                  <Text style={styles.analyzeButtonText}>Analyze Goals</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* Results section */}
        {showResults && (confirmedTags.length > 0 || suggestedTags.length > 0) && (
          <View style={styles.resultsSection}>
            {/* Confirmed goals */}
            {confirmedTags.length > 0 && (
              <View style={styles.tagSection}>
                <View style={styles.tagSectionHeader}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                  <Text style={styles.tagSectionTitle}>Your Goals</Text>
                </View>
                <View style={styles.tagGrid}>
                  {confirmedTags.map((tag) => (
                    <ConfirmedTagChip
                      key={tag.id}
                      tag={tag}
                      onDismiss={() => dismissTag(tag.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Suggested goals (not yet confirmed) */}
            {suggestedTags.length > 0 && (
              <View style={styles.tagSection}>
                <View style={styles.tagSectionHeader}>
                  <Ionicons name="bulb-outline" size={18} color={Colors.warning} />
                  <Text style={styles.tagSectionTitle}>Suggested Goals</Text>
                </View>
                <Text style={styles.tagSectionSubtitle}>
                  Tap to add these to your profile
                </Text>
                <View style={styles.tagGrid}>
                  {suggestedTags.map((tag) => (
                    <SuggestedTagChip
                      key={tag.id}
                      tag={tag}
                      onConfirm={() => confirmTag(tag)}
                      onDismiss={() => dismissTag(tag.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Summary */}
            {parsedGoals.experienceLevel && (
              <View style={styles.summaryCard}>
                <Ionicons name="analytics" size={20} color={Colors.primary} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryTitle}>Your Profile</Text>
                  <Text style={styles.summaryText}>
                    {parsedGoals.experienceLevel === 'beginner' && 'New to racing — we\'ll focus on beginner-friendly events'}
                    {parsedGoals.experienceLevel === 'intermediate' && 'Experienced runner — we\'ll match you with competitive races'}
                    {parsedGoals.experienceLevel === 'advanced' && 'Elite runner — we\'ll highlight challenging & prestigious events'}
                    {parsedGoals.targetTime && ` · Target: ${parsedGoals.targetTime}`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Empty results */}
        {showResults && confirmedTags.length === 0 && suggestedTags.length === 0 && !isAnalyzing && text.trim().length > 0 && (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.noResultsText}>
              Try being more specific — mention race distances, terrain preferences, time goals, or race names
            </Text>
          </View>
        )}

        {/* Tips */}
        {!showResults && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>What to mention:</Text>
            {[
              { icon: 'trophy', text: 'Race goals — "qualify for Boston", "first marathon"' },
              { icon: 'timer', text: 'Time targets — "sub-3:30", "break 4 hours"' },
              { icon: 'leaf', text: 'Terrain — "trail running", "hilly courses"' },
              { icon: 'flame', text: 'Challenges — "ultra", "100 miler", "endurance"' },
              { icon: 'image', text: 'Preferences — "scenic", "flat and fast", "coastal"' },
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Ionicons name={tip.icon as any} size={16} color={Colors.primary} />
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: Spacing.xxl * 2 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ConfirmedTagChip({ tag, onDismiss }: { tag: GoalTag; onDismiss: () => void }) {
  return (
    <View style={[styles.confirmedChip, { borderColor: tag.color + '40' }]}>
      <View style={[styles.chipIconBg, { backgroundColor: tag.color + '15' }]}>
        <Ionicons name={tag.icon as any} size={14} color={tag.color} />
      </View>
      <Text style={styles.confirmedChipText}>{tag.label}</Text>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <Ionicons name="close" size={14} color={Colors.textMuted} />
      </Pressable>
    </View>
  );
}

function SuggestedTagChip({
  tag,
  onConfirm,
  onDismiss,
}: {
  tag: GoalTag;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <Pressable
      style={[styles.suggestedChip, { borderColor: tag.color + '30' }]}
      onPress={onConfirm}
    >
      <View style={[styles.chipIconBg, { backgroundColor: tag.color + '10' }]}>
        <Ionicons name={tag.icon as any} size={14} color={tag.color} />
      </View>
      <Text style={styles.suggestedChipText}>{tag.label}</Text>
      <View style={styles.chipActions}>
        <Ionicons name="add-circle" size={18} color={Colors.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  goalInput: {
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 140,
    lineHeight: 22,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  clearTextButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  clearTextButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
  },
  analyzeButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  resultsSection: {
    gap: Spacing.lg,
  },
  tagSection: {
    gap: Spacing.sm,
  },
  tagSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tagSectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  tagSectionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: -4,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  confirmedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundCard,
    paddingLeft: 6,
    paddingRight: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    ...Shadows.sm,
  },
  chipIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmedChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundAccent,
    paddingLeft: 6,
    paddingRight: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  suggestedChipText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chipActions: {
    marginLeft: 2,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  summaryText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  noResults: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  noResultsText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsSection: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  tipsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
