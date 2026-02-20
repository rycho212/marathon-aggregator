import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '@/contexts/LocationContext';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface LocationChipProps {
  onPress: () => void;
}

export default function LocationChip({ onPress }: LocationChipProps) {
  const { location, isDetecting } = useLocation();

  const label = location
    ? location.city
      ? `${location.city}, ${location.state}`
      : location.state
    : 'Set Location';

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={onPress}
    >
      {isDetecting ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <Ionicons
          name={location ? 'location' : 'location-outline'}
          size={14}
          color={location ? Colors.primary : Colors.textMuted}
        />
      )}
      <Text
        style={[styles.label, location && styles.labelActive]}
        numberOfLines={1}
      >
        {isDetecting ? 'Detecting...' : label}
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
