import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { ImageDetailScreen } from '../screens/Main/ImageDetailScreen';
import { useGalleryStore } from '../store/useGalleryStore';
import type { MainStackParamList } from '../types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
    <MainStack.Screen name="ImageDetail" component={ImageDetailScreen} options={{ title: 'Photo details' }} />
  </MainStack.Navigator>
);

export const RootNavigator = () => {
  const { colors, isDark } = useTheme();
  const { user, isAuthenticated, isHydrated, loadSession } = useAuth();
  const loadFavorites = useGalleryStore((state) => state.loadFavorites);
  const clearFavorites = useGalleryStore((state) => state.clearFavorites);
  const email = user?.email ?? null;

  // Restore a saved login session once at start-up.
  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  // Keep favorites in sync with whoever is logged in.
  useEffect(() => {
    if (email) {
      void loadFavorites(email);
    } else {
      clearFavorites();
    }
  }, [email, loadFavorites, clearFavorites]);

  if (!isHydrated) return <LoadingSpinner />;

  const base = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
