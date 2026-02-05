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
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function MobileNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, Spacing.sm) }
    ]}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Pressable
            key={item.path}
            onPress={() => handleNavigate(item.path)}
            style={({ pressed }) => [
              styles.navItem,
              pressed && styles.navItemPressed,
            ]}
          >
            <Ionicons
              name={(active ? item.iconFocused : item.icon) as any}
              size={22}
              color={active ? Colors.primary : Colors.textMuted}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navItemPressed: {
    opacity: 0.7,
  },
  navLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
});
