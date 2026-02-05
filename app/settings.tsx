import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

const SETTINGS_STORAGE_KEY = '@getabib_settings';

interface AppSettings {
  notifications: {
    raceReminders: boolean;
    registrationAlerts: boolean;
    priceDrops: boolean;
    weeklyDigest: boolean;
    newRacesNearby: boolean;
  };
  preferences: {
    defaultDistance: string;
    measurementUnit: 'miles' | 'km';
    showPrices: boolean;
  };
}

const defaultSettings: AppSettings = {
  notifications: {
    raceReminders: true,
    registrationAlerts: true,
    priceDrops: false,
    weeklyDigest: true,
    newRacesNearby: true,
  },
  preferences: {
    defaultDistance: 'all',
    measurementUnit: 'miles',
    showPrices: true,
  },
};

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleNotification = (key: keyof AppSettings['notifications']) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    saveSettings(newSettings);
  };

  const togglePreference = (key: keyof AppSettings['preferences'], value: any) => {
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.card}>
            <SettingRow
              icon="alarm-outline"
              title="Race Reminders"
              subtitle="Get notified before your saved races"
              value={settings.notifications.raceReminders}
              onToggle={() => toggleNotification('raceReminders')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="ticket-outline"
              title="Registration Alerts"
              subtitle="Know when registration opens for popular races"
              value={settings.notifications.registrationAlerts}
              onToggle={() => toggleNotification('registrationAlerts')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="pricetag-outline"
              title="Price Drop Alerts"
              subtitle="Get notified when saved races go on sale"
              value={settings.notifications.priceDrops}
              onToggle={() => toggleNotification('priceDrops')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="mail-outline"
              title="Weekly Digest"
              subtitle="Curated race picks delivered weekly"
              value={settings.notifications.weeklyDigest}
              onToggle={() => toggleNotification('weeklyDigest')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="location-outline"
              title="New Races Nearby"
              subtitle="Discover new races in your area"
              value={settings.notifications.newRacesNearby}
              onToggle={() => toggleNotification('newRacesNearby')}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options-outline" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="speedometer-outline" size={22} color={Colors.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Distance Units</Text>
                  <Text style={styles.settingSubtitle}>How distances are displayed</Text>
                </View>
              </View>
              <View style={styles.toggleGroup}>
                <Pressable
                  style={[
                    styles.toggleOption,
                    settings.preferences.measurementUnit === 'miles' && styles.toggleOptionSelected,
                  ]}
                  onPress={() => togglePreference('measurementUnit', 'miles')}
                >
                  <Text
                    style={[
                      styles.toggleOptionText,
                      settings.preferences.measurementUnit === 'miles' && styles.toggleOptionTextSelected,
                    ]}
                  >
                    Miles
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.toggleOption,
                    settings.preferences.measurementUnit === 'km' && styles.toggleOptionSelected,
                  ]}
                  onPress={() => togglePreference('measurementUnit', 'km')}
                >
                  <Text
                    style={[
                      styles.toggleOptionText,
                      settings.preferences.measurementUnit === 'km' && styles.toggleOptionTextSelected,
                    ]}
                  >
                    KM
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.divider} />
            <SettingRow
              icon="cash-outline"
              title="Show Prices"
              subtitle="Display race registration prices"
              value={settings.preferences.showPrices}
              onToggle={() => togglePreference('showPrices', !settings.preferences.showPrices)}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <View style={styles.card}>
            <MenuItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="star-outline"
              title="Rate GetABib"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>GetABib</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appCopyright}>Built for runners everywhere</Text>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onToggle,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Ionicons name={icon as any} size={22} color={Colors.textSecondary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primaryLight }}
        thumbColor={value ? Colors.primary : Colors.textMuted}
      />
    </View>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={22} color={Colors.textSecondary} />
      <Text style={styles.menuItemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundAccent,
    borderRadius: BorderRadius.md,
    padding: 2,
  },
  toggleOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  toggleOptionSelected: {
    backgroundColor: Colors.primary,
  },
  toggleOptionText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  toggleOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: FontWeights.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  menuItemPressed: {
    backgroundColor: Colors.backgroundAccent,
  },
  menuItemText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  appVersion: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  appCopyright: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
