import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '@/contexts/LocationContext';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
}

const RADIUS_OPTIONS = [25, 50, 100, 250, 500];

export default function LocationModal({ visible, onClose }: LocationModalProps) {
  const {
    location,
    isDetecting,
    setManualLocation,
    detectLocation,
    setRadius,
    clearLocation,
  } = useLocation();

  const [cityInput, setCityInput] = useState('');
  const [error, setError] = useState('');

  const handleDetect = async () => {
    setError('');
    const success = await detectLocation();
    if (!success) {
      setError('Could not detect location. Please enter manually.');
    }
  };

  const handleManualSubmit = () => {
    setError('');
    if (!cityInput.trim()) return;
    const success = setManualLocation(cityInput.trim());
    if (success) {
      setCityInput('');
    } else {
      setError(`Couldn't find "${cityInput}". Try a major city or state abbreviation.`);
    }
  };

  const handleClear = () => {
    clearLocation();
    setCityInput('');
    setError('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            {/* Handle bar */}
            <View style={styles.handle} />

            <Text style={styles.title}>Your Location</Text>
            <Text style={styles.subtitle}>
              Set your location to see nearby races
            </Text>

            {/* Current location display */}
            {location && (
              <View style={styles.currentLocation}>
                <Ionicons name="location" size={18} color={Colors.primary} />
                <View style={styles.currentLocationText}>
                  <Text style={styles.currentCity}>
                    {location.city
                      ? `${location.city}, ${location.state}`
                      : location.state}
                  </Text>
                  <Text style={styles.currentSource}>
                    {location.source === 'gps' ? 'Auto-detected' : 'Manual'} · {location.radius} mi radius
                  </Text>
                </View>
                <Pressable onPress={handleClear} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                </Pressable>
              </View>
            )}

            {/* Auto-detect button */}
            <Pressable
              style={({ pressed }) => [
                styles.detectButton,
                pressed && styles.detectButtonPressed,
                isDetecting && styles.detectButtonDisabled,
              ]}
              onPress={handleDetect}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="navigate" size={18} color="#fff" />
              )}
              <Text style={styles.detectButtonText}>
                {isDetecting ? 'Detecting...' : 'Use My Current Location'}
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or enter manually</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Manual city input */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="City name or state (e.g., Boston, CA)"
                placeholderTextColor={Colors.textMuted}
                value={cityInput}
                onChangeText={(t) => {
                  setCityInput(t);
                  setError('');
                }}
                onSubmitEditing={handleManualSubmit}
                returnKeyType="search"
                autoCapitalize="words"
              />
              <Pressable
                style={[styles.goButton, !cityInput.trim() && styles.goButtonDisabled]}
                onPress={handleManualSubmit}
                disabled={!cityInput.trim()}
              >
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </Pressable>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Radius picker */}
            <Text style={styles.radiusLabel}>Search Radius</Text>
            <View style={styles.radiusRow}>
              {RADIUS_OPTIONS.map((r) => (
                <Pressable
                  key={r}
                  style={[
                    styles.radiusChip,
                    location?.radius === r && styles.radiusChipActive,
                  ]}
                  onPress={() => setRadius(r)}
                >
                  <Text
                    style={[
                      styles.radiusChipText,
                      location?.radius === r && styles.radiusChipTextActive,
                    ]}
                  >
                    {r} mi
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Done button */}
            <Pressable
              style={({ pressed }) => [styles.doneButton, pressed && styles.doneButtonPressed]}
              onPress={onClose}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
    ...Shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  currentLocationText: {
    flex: 1,
  },
  currentCity: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  currentSource: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  clearButton: {
    padding: 4,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detectButtonPressed: {
    backgroundColor: Colors.primaryDark,
  },
  detectButtonDisabled: {
    opacity: 0.7,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  error: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  radiusLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  radiusChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundAccent,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  radiusChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  radiusChipText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
  },
  radiusChipTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  doneButton: {
    backgroundColor: Colors.text,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  doneButtonPressed: {
    opacity: 0.9,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
