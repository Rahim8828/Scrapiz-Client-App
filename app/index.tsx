import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '../components/SplashScreen';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  console.log('[Index] IndexScreen component rendering, Platform:', Platform.OS);
  
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  
  console.log('[Index] Getting location context...');
  const { currentLocation, locationSet, checkServiceAvailability } = useLocation();
  console.log('[Index] Location context loaded - locationSet:', locationSet);
  
  console.log('[Index] Getting auth context...');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  console.log('[Index] Auth context loaded - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('[Splash] App initialization started, Platform:', Platform.OS);
        
        // Prevent native splash from auto-hiding
        try {
          console.log('[Splash] Preventing native splash auto-hide...');
          await ExpoSplashScreen.preventAutoHideAsync();
          console.log('[Splash] Native splash auto-hide prevented successfully');
        } catch (preventError) {
          console.warn('[Splash] Failed to prevent splash auto-hide (non-critical):', preventError);
        }
        
        // Wait for initial setup
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Hide native Expo splash screen on both platforms
        try {
          console.log('[Splash] Hiding native Expo splash screen...');
          await ExpoSplashScreen.hideAsync();
          console.log('[Splash] Native Expo splash screen hidden successfully');
        } catch (hideError) {
          console.warn('[Splash] Failed to hide native splash (non-critical):', hideError);
        }
        
        setAppIsReady(true);
        console.log('[Splash] App is ready, appIsReady set to true');
      } catch (error) {
        console.error('[Splash] Error during app preparation:', error);
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const handleSplashFinish = () => {
    console.log('[Splash] Custom splash screen finished');
    setShowSplash(false);
  };

  const handleNavigation = useCallback(() => {
    if (authLoading) {
      console.log('[Navigation] Waiting for auth to complete...');
      return;
    }

    const navigationStartTime = Date.now();
    console.log('[Navigation] Starting navigation logic - locationSet:', locationSet, 'isAuthenticated:', isAuthenticated);

    try {
      if (!locationSet || !currentLocation) {
        const targetRoute = '/(auth)/location-permission';
        console.log('[Navigation] No location set, navigating to:', targetRoute);
        router.replace(targetRoute as any);
        return;
      }

      const isServiceable = checkServiceAvailability();
      console.log('[Navigation] Service availability check:', isServiceable);
      
      if (isServiceable) {
        const targetRoute = isAuthenticated ? '/(tabs)' : '/(auth)/login';
        console.log('[Navigation] Service available, navigating to:', targetRoute);
        router.replace(targetRoute as any);
      } else {
        const targetRoute = '/(auth)/service-unavailable';
        console.log('[Navigation] Service unavailable, navigating to:', targetRoute);
        router.replace(targetRoute as any);
      }

      const navigationTime = Date.now() - navigationStartTime;
      console.log('[Navigation] Navigation completed in', navigationTime, 'ms');
    } catch (error) {
      console.error('[Navigation] Navigation failed:', error);
      console.log('[Navigation] Attempting fallback navigation to login screen');
      
      try {
        router.replace('/(auth)/login' as any);
        console.log('[Navigation] Fallback navigation successful');
      } catch (fallbackError) {
        console.error('[Navigation] Fallback navigation also failed:', fallbackError);
      }
    }
  }, [authLoading, locationSet, currentLocation, isAuthenticated, router, checkServiceAvailability]);

  useEffect(() => {
    if (!showSplash && !authLoading && appIsReady) {
      console.log('[Navigation] Conditions met for navigation - showSplash:', showSplash, 'authLoading:', authLoading, 'appIsReady:', appIsReady);
      handleNavigation();
    }
  }, [showSplash, authLoading, appIsReady, handleNavigation]);

  console.log('[Index] Render decision - appIsReady:', appIsReady, 'showSplash:', showSplash, 'authLoading:', authLoading);

  if (!appIsReady) {
    console.log('[Index] Rendering loading indicator (app not ready)');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (showSplash) {
    console.log('[Index] Rendering custom splash screen');
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (authLoading) {
    console.log('[Index] Rendering loading indicator (auth loading)');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  console.log('[Index] Rendering empty view (navigation should happen)');
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
