import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Slot } from 'expo-router';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Colors } from '@/constants/theme';

const SIDEBAR_BREAKPOINT = 768;

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const showSidebar = width >= SIDEBAR_BREAKPOINT;

  return (
    <View style={styles.container}>
      {showSidebar && <Sidebar />}
      <View style={[
        styles.content,
        showSidebar && styles.contentWithSidebar,
      ]}>
        <Slot />
      </View>
      {!showSidebar && <MobileNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentWithSidebar: {
    marginLeft: 220,
  },
});
