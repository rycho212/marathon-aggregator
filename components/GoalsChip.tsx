import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGoals } from '@/contexts/GoalsContext';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface GoalsChipProps {
  onPress: () => void;
}

export default function GoalsChip({ onPress }: GoalsChipProps) {
  const { confirmedTags, hasGoals } = useGoals();

  const label = hasGoals
    ? confirmedTags.length === 1
      ? confirmedTags[0].label
      : `${confirmedTags.length} Goals`
    : 'Set Goals';

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={onPress}
    >
      <Ionicons
        name={hasGoals ? 'sparkles' : 'sparkles-outline'}
        size={14}
        color={hasGoals ? Colors.primary : Colors.textMuted}
      />
      <Text
        style={[styles.label, hasGoals && styles.labelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Ionicons name="chevron-down" size={12} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundAccent,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 180,
  },
  chipPressed: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.text,
  },
});
