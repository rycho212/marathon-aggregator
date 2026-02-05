import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  iconFocused: string;
}

const navItems: NavItem[] = [
  { name: 'Discover', path: '/', icon: 'compass-outline', iconFocused: 'compass' },
  { name: 'Search', path: '/search', icon: 'search-outline', iconFocused: 'search' },
  { name: 'Saved', path: '/saved', icon: 'bookmark-outline', iconFocused: 'bookmark' },
  { name: 'Profile', path: '/profile', icon: 'person-outline', iconFocused: 'person' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Ionicons name="flash" size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.logoText}>GetABib</Text>
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Pressable
              key={item.path}
              onPress={() => handleNavigate(item.path)}
              style={({ pressed }) => [
                styles.navItem,
                active && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
            >
              <Ionicons
                name={(active ? item.iconFocused : item.icon) as any}
                size={20}
                color={active ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[
                styles.navLabel,
                active && styles.navLabelActive,
              ]}>
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom section */}
      <View style={styles.bottom}>
        <View style={styles.divider} />
        <Pressable style={styles.navItem}>
          <Ionicons name="settings-outline" size={20} color={Colors.textMuted} />
          <Text style={styles.navLabelMuted}>Settings</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="help-circle-outline" size={20} color={Colors.textMuted} />
          <Text style={styles.navLabelMuted}>Help</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: Colors.backgroundLight,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    ...Platform.select({
      web: {
        height: '100vh',
        position: 'fixed' as any,
        left: 0,
        top: 0,
      },
      default: {
        flex: 1,
      },
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  nav: {
    flex: 1,
    gap: Spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  navItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  navItemPressed: {
    opacity: 0.7,
  },
  navLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  navLabelMuted: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
    color: Colors.textMuted,
  },
  bottom: {
    gap: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
});
