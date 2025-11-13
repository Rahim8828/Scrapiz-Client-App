import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '../components/SplashScreen';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  
  const { currentLocation, locationSet, checkServiceAvailability } = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent native splash from auto-hiding
        try {
          await ExpoSplashScreen.preventAutoHideAsync();
        } catch (preventError) {
          // Non-critical error, continue
        }
        
        // Wait for initial setup
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Hide native Expo splash screen on both platforms
        try {
          await ExpoSplashScreen.hideAsync();
        } catch (hideError) {
          // Non-critical error, continue
        }
        
        setAppIsReady(true);
      } catch (error) {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleNavigation = useCallback(() => {
    if (authLoading) {
      return;
    }

    try {
      if (!locationSet || !currentLocation) {
        router.replace('/(auth)/location-permission' as any);
        return;
      }

      const isServiceable = checkServiceAvailability();
      
      if (isServiceable) {
        const targetRoute = isAuthenticated ? '/(tabs)' : '/(auth)/login';
        router.replace(targetRoute as any);
      } else {
        router.replace('/(auth)/service-unavailable' as any);
      }
    } catch (error) {
      // Fallback to login on error
      try {
        router.replace('/(auth)/login' as any);
      } catch (fallbackError) {
        // Silent fail
      }
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
