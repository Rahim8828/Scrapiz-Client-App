import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import SplashScreen from '../components/SplashScreen';
import { useLocation } from '../contexts/LocationContext';

export default function IndexScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const { currentLocation, serviceAvailable, permissionGranted, checkServiceAvailability } = useLocation();

  const handleSplashFinish = () => {
    setShowSplash(false);
    handleNavigation();
  };

  const handleNavigation = () => {
    console.log('🚀 Navigation Debug:', {
      permissionGranted,
      hasCurrentLocation: !!currentLocation,
      serviceAvailable,
      currentLocation: currentLocation ? {
        city: currentLocation.city,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      } : null,
    });

    // First priority: Check if location permission has been granted
    if (!permissionGranted) {
      console.log('➡️ Navigating to: location-permission (no permission)');
      // No permission yet - go to location permission screen
      router.replace('/(auth)/location-permission');
      return;
    }

    // Permission granted, check if we have location data
    if (!currentLocation) {
      console.log('➡️ Navigating to: location-permission (no location data)');
      // Permission granted but no location data - go to permission screen to fetch
      router.replace('/(auth)/location-permission');
      return;
    }

    // We have permission and location - check if service is available
    const isServiceable = checkServiceAvailability();
    console.log('🔍 Service check:', { isServiceable });
    
    if (isServiceable) {
      // Service available - check authentication
      // TODO: Add actual authentication check
      const isAuthenticated = false; // Replace with actual auth check
      
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
