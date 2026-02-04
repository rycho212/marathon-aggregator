import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, DistanceCategories } from '@/constants/theme';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export default function CategoryFilter({
  selectedCategories,
  onCategoryChange,
}: CategoryFilterProps) {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const clearAll = () => {
    onCategoryChange([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All button */}
        <Pressable
          style={({ pressed }) => [
            styles.chip,
            selectedCategories.length === 0 && styles.chipSelected,
            pressed && styles.chipPressed,
          ]}
          onPress={clearAll}
        >
          <Text
            style={[
              styles.chipText,
              selectedCategories.length === 0 && styles.chipTextSelected,
            ]}
          >
            All
          </Text>
        </Pressable>

        {/* Category chips */}
        {DistanceCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.chip,
                isSelected && { backgroundColor: category.color },
                pressed && styles.chipPressed,
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isSelected ? Colors.text : category.color },
                ]}
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.text,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
