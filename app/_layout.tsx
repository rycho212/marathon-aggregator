import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SavedRacesProvider } from '@/contexts/SavedRacesContext';
import { Colors } from '@/constants/theme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <SavedRacesProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="race/[id]"
              options={{
                headerShown: true,
                headerTitle: 'Race Details',
                headerStyle: { backgroundColor: Colors.backgroundLight },
                headerTintColor: Colors.text,
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="goals"
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />
          </Stack>
        </View>
      </SavedRacesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
