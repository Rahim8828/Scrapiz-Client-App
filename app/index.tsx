import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '../components/SplashScreen';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';

if (Platform.OS === 'ios') {
  ExpoSplashScreen.preventAutoHideAsync().catch(() => {});
}

export default function IndexScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  const { currentLocation, locationSet, checkServiceAvailability } = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (Platform.OS === 'ios') {
          await ExpoSplashScreen.hideAsync();
        }
        setAppIsReady(true);
      } catch (e) {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleNavigation = useCallback(() => {
    if (authLoading) return;

    if (!locationSet || !currentLocation) {
      router.replace('/(auth)/location-permission');
      return;
    }

    const isServiceable = checkServiceAvailability();
    
    if (isServiceable) {
      router.replace(isAuthenticated ? '/(tabs)' : '/(auth)/login');
    } else {
      router.replace('/(auth)/service-unavailable');
    }
  }, [authLoading, locationSet, currentLocation, isAuthenticated, router, checkServiceAvailability]);

  useEffect(() => {
    if (!showSplash && !authLoading && appIsReady) {
      handleNavigation();
    }
  }, [showSplash, authLoading, appIsReady, handleNavigation]);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
