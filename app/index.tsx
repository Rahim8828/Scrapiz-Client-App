import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import SplashScreen from '../components/SplashScreen';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const { currentLocation, serviceAvailable, locationSet, checkServiceAvailability } = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const handleSplashFinish = () => {
    setShowSplash(false);
    handleNavigation();
  };

  const handleNavigation = () => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    console.log('🚀 Navigation Debug:', {
      locationSet,
      hasCurrentLocation: !!currentLocation,
      serviceAvailable,
      isAuthenticated,
      currentLocation: currentLocation ? {
        city: currentLocation.city,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      } : null,
    });

    // First priority: Check if location has been set
    if (!locationSet) {
      console.log('➡️ Navigating to: location-permission (location not set)');
      // Location not set yet - go to location permission screen
      router.replace('/(auth)/location-permission');
      return;
    }

    // Location set, check if we have location data
    if (!currentLocation) {
      console.log('➡️ Navigating to: location-permission (no location data)');
      // Location set but no location data - go to permission screen to fetch
      router.replace('/(auth)/location-permission');
      return;
    }

    // We have permission and location - check if service is available
    const isServiceable = checkServiceAvailability();
    console.log('🔍 Service check:', { isServiceable });
    
    if (isServiceable) {
      // Service available - check authentication
      if (isAuthenticated) {
        console.log('➡️ Navigating to: tabs (authenticated)');
        router.replace('/(tabs)');
      } else {
        console.log('➡️ Navigating to: login (not authenticated)');
        router.replace('/(auth)/login');
      }
    } else {
      console.log('➡️ Navigating to: service-unavailable');
      // Service not available - show unavailable screen
      router.replace('/(auth)/service-unavailable');
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
