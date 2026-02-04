import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  personalityQuizQuestions,
  RunnerPersonality,
  calculatePersonalityType,
  getPersonalityDescription,
} from '@/data/runnerProfile';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface PersonalityQuizProps {
  onComplete: (personality: RunnerPersonality) => void;
  onSkip?: () => void;
}

export default function PersonalityQuiz({ onComplete, onSkip }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [traits, setTraits] = useState({
    adventurous: 50,
    competitive: 50,
    social: 50,
    endurance: 50,
    explorer: 50,
    casual: 50,
  });
  const [showResults, setShowResults] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const questions = personalityQuizQuestions;
  const progress = (currentQuestion + 1) / questions.length;

  const handleAnswer = (questionId: string, optionValue: string, traitChanges: Record<string, number>) => {
    // Update answers
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));

    // Update traits
    const newTraits = { ...traits };
    Object.entries(traitChanges).forEach(([trait, change]) => {
      if (trait in newTraits) {
        newTraits[trait as keyof typeof newTraits] = Math.max(0, Math.min(100,
          newTraits[trait as keyof typeof newTraits] + change
        ));
      }
    });
    setTraits(newTraits);

    // Animate transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Move to next question or show results
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        Animated.timing(progressAnim, {
          toValue: (currentQuestion + 2) / questions.length,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // Quiz complete - calculate personality
        finishQuiz(newTraits);
      }
    }, 200);
  };

  const finishQuiz = (finalTraits: typeof traits) => {
    setShowResults(true);

    const personalityType = calculatePersonalityType(finalTraits);

    // Build the full personality object
    const personality: RunnerPersonality = {
      primaryType: personalityType,
      secondaryTypes: [], // Could calculate these based on close trait scores
      traits: finalTraits,
      raceAffinities: calculateRaceAffinities(finalTraits),
    };

    // Short delay to show results before completing
    setTimeout(() => {
      onComplete(personality);
    }, 3000);
  };

  const calculateRaceAffinities = (t: typeof traits) => {
    return {
      '5k': Math.round(50 + t.casual * 0.3 - t.endurance * 0.2),
      '10k': Math.round(50 + t.competitive * 0.2),
      'half': Math.round(50 + t.endurance * 0.2 + t.competitive * 0.1),
      'marathon': Math.round(50 + t.endurance * 0.3 + t.competitive * 0.2),
      'ultra': Math.round(30 + t.endurance * 0.4 + t.adventurous * 0.3),
      'trail': Math.round(30 + t.adventurous * 0.5 + t.explorer * 0.2),
      'road': Math.round(50 + t.competitive * 0.3 - t.adventurous * 0.1),
      'themed': Math.round(40 + t.casual * 0.4 + t.social * 0.2),
      'destination': Math.round(30 + t.explorer * 0.5 + t.adventurous * 0.2),
      'local': Math.round(50 + t.social * 0.3 - t.explorer * 0.2),
    };
  };

  if (showResults) {
    const personalityType = calculatePersonalityType(traits);
    const description = getPersonalityDescription(personalityType);

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.resultsContainer}
        >
          <View style={styles.resultsContent}>
            <Text style={styles.resultsEmoji}>{description.emoji}</Text>
            <Text style={styles.resultsTitle}>You're a</Text>
            <Text style={styles.resultsType}>{description.title}!</Text>
            <Text style={styles.resultsDescription}>{description.description}</Text>

            <View style={styles.loadingDots}>
              <Text style={styles.loadingText}>Finding your perfect races...</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const question = questions[currentQuestion];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
          <Text style={styles.questionCount}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Question */}
      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionText}>{question.question}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <Pressable
              key={option.value}
              style={({ pressed }) => [
                styles.optionButton,
                pressed && styles.optionButtonPressed,
                answers[question.id] === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => handleAnswer(question.id, option.value, option.traits)}
            >
              <Text style={[
                styles.optionLabel,
                answers[question.id] === option.value && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Footer hint */}
      <View style={styles.footer}>
        <Ionicons name="sparkles" size={16} color={Colors.textMuted} />
        <Text style={styles.footerText}>
          This helps us find races you'll love
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  questionCount: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: Spacing.xl,
  },
  progressBackground: {
    height: 6,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  questionText: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xl,
    lineHeight: FontSizes.xxl * 1.2,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonPressed: {
    backgroundColor: Colors.backgroundAccent,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  // Results screen
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  resultsEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  resultsTitle: {
    fontSize: FontSizes.lg,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  resultsType: {
    fontSize: FontSizes.hero,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  resultsDescription: {
    fontSize: FontSizes.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: FontSizes.md * 1.5,
    marginBottom: Spacing.xl,
  },
  loadingDots: {
    marginTop: Spacing.lg,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSizes.sm,
  },
});
