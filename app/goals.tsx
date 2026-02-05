import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

const GOALS_STORAGE_KEY = '@getabib_goals';

interface RaceGoal {
  id: string;
  raceName: string;
  targetDate: string;
  targetTime?: string;
  distance: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}

const distanceOptions = ['5K', '10K', 'Half Marathon', 'Marathon', '50K', '100K', '100 Miles'];

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<RaceGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    raceName: '',
    targetDate: '',
    targetTime: '',
    distance: 'Marathon',
    notes: '',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const stored = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      if (stored) {
        setGoals(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async (updatedGoals: RaceGoal[]) => {
    try {
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const addGoal = () => {
    if (!newGoal.raceName.trim()) return;

    const goal: RaceGoal = {
      id: Date.now().toString(),
      raceName: newGoal.raceName.trim(),
      targetDate: newGoal.targetDate || 'TBD',
      targetTime: newGoal.targetTime || undefined,
      distance: newGoal.distance,
      notes: newGoal.notes || undefined,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    saveGoals([...goals, goal]);
    setNewGoal({ raceName: '', targetDate: '', targetTime: '', distance: 'Marathon', notes: '' });
    setShowAddForm(false);
  };

  const toggleGoalComplete = (goalId: string) => {
    const updatedGoals = goals.map(g =>
      g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g
    );
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    saveGoals(goals.filter(g => g.id !== goalId));
  };

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Race Goals</Text>
        <Pressable
          onPress={() => setShowAddForm(!showAddForm)}
          style={styles.addButton}
        >
          <Ionicons name={showAddForm ? 'close' : 'add'} size={24} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Goal Form */}
        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Goal</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Race Name</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.raceName}
                onChangeText={(text) => setNewGoal({ ...newGoal, raceName: text })}
                placeholder="e.g., Boston Marathon 2026"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Distance</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.distanceScroll}>
                <View style={styles.distanceOptions}>
                  {distanceOptions.map((dist) => (
                    <Pressable
                      key={dist}
                      style={[
                        styles.distanceChip,
                        newGoal.distance === dist && styles.distanceChipSelected,
                      ]}
                      onPress={() => setNewGoal({ ...newGoal, distance: dist })}
                    >
                      <Text
                        style={[
                          styles.distanceChipText,
                          newGoal.distance === dist && styles.distanceChipTextSelected,
                        ]}
                      >
                        {dist}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Target Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={newGoal.targetDate}
                  onChangeText={(text) => setNewGoal({ ...newGoal, targetDate: text })}
                  placeholder="Apr 2026"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                <Text style={styles.inputLabel}>Target Time (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newGoal.targetTime}
                  onChangeText={(text) => setNewGoal({ ...newGoal, targetTime: text })}
                  placeholder="3:30:00"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.notes}
                onChangeText={(text) => setNewGoal({ ...newGoal, notes: text })}
                placeholder="Training notes, motivation, etc."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
              onPress={addGoal}
            >
              <Text style={styles.submitButtonText}>Add Goal</Text>
            </Pressable>
          </View>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Goals ({activeGoals.length})</Text>
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggle={toggleGoalComplete}
                onDelete={deleteGoal}
              />
            ))}
          </View>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed ({completedGoals.length})</Text>
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggle={toggleGoalComplete}
                onDelete={deleteGoal}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {goals.length === 0 && !showAddForm && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="flag-outline" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Race Goals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Set your sights on a race! Tap + above to add your first goal.
            </Text>
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function GoalCard({
  goal,
  onToggle,
  onDelete,
}: {
  goal: RaceGoal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={[styles.goalCard, goal.isCompleted && styles.goalCardCompleted]}>
      <Pressable
        style={styles.checkbox}
        onPress={() => onToggle(goal.id)}
      >
        <Ionicons
          name={goal.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={goal.isCompleted ? Colors.primary : Colors.textMuted}
        />
      </Pressable>

      <View style={styles.goalContent}>
        <Text style={[styles.goalName, goal.isCompleted && styles.goalNameCompleted]}>
          {goal.raceName}
        </Text>
        <View style={styles.goalMeta}>
          <View style={styles.goalTag}>
            <Text style={styles.goalTagText}>{goal.distance}</Text>
          </View>
          <Text style={styles.goalDate}>{goal.targetDate}</Text>
          {goal.targetTime && (
            <Text style={styles.goalTime}>Goal: {goal.targetTime}</Text>
          )}
        </View>
        {goal.notes && (
          <Text style={styles.goalNotes} numberOfLines={2}>{goal.notes}</Text>
        )}
      </View>

      <Pressable
        style={styles.deleteButton}
        onPress={() => onDelete(goal.id)}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.textMuted} />
      </Pressable>
    </View>
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  formCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  formTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  textInput: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
  },
  distanceScroll: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  distanceOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  distanceChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundAccent,
  },
  distanceChipSelected: {
    backgroundColor: Colors.primary,
  },
  distanceChipText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  distanceChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: FontWeights.medium,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  goalCardCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: Spacing.sm,
  },
  goalContent: {
    flex: 1,
  },
  goalName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  goalNameCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  goalTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  goalTagText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  goalDate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  goalTime: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  goalNotes: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
