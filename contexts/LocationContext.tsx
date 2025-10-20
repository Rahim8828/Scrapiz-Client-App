/**
 * Location Context
 * Global state management for user location across the app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isLocationServiceable, isCityServiceable } from '../constants/ServiceAreas';

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
}

export interface SavedLocation extends LocationData {
  id: string;
  type: 'home' | 'office' | 'other';
  label: string;
}

interface LocationContextType {
  currentLocation: LocationData | null;
  savedLocations: SavedLocation[];
  serviceAvailable: boolean;
  permissionGranted: boolean;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  setManualLocation: (location: LocationData) => void;
  saveLocation: (location: SavedLocation) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: LocationData) => void;
  checkServiceAvailability: () => boolean;
  requestLocationPermission: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_LOCATION: '@scrapiz_current_location',
  SAVED_LOCATIONS: '@scrapiz_saved_locations',
  SERVICE_AVAILABLE: '@scrapiz_service_available',
  PERMISSION_GRANTED: '@scrapiz_permission_granted',
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [serviceAvailable, setServiceAvailable] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved data on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      // Check actual system permission status first
      const { status } = await Location.getForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      console.log('📍 Location Context - Permission Status:', { status, hasPermission });
      setPermissionGranted(hasPermission);

      // Only load cached data if permission is granted
      if (hasPermission) {
        const [storedLocation, storedSavedLocations, storedServiceAvailable] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LOCATION),
          AsyncStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS),
          AsyncStorage.getItem(STORAGE_KEYS.SERVICE_AVAILABLE),
        ]);

        console.log('📦 Loading cached data:', {
          hasStoredLocation: !!storedLocation,
          hasStoredServiceAvailable: !!storedServiceAvailable,
        });

        if (storedLocation) {
          const locationData = JSON.parse(storedLocation);
          console.log('✅ Restored location:', locationData.city);
          setCurrentLocation(locationData);
        }

        if (storedSavedLocations) {
          setSavedLocations(JSON.parse(storedSavedLocations));
        }

        if (storedServiceAvailable) {
          setServiceAvailable(storedServiceAvailable === 'true');
        }
      } else {
        console.log('🚫 No permission - clearing cached location');
        // No permission - clear any cached location data
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.CURRENT_LOCATION,
          STORAGE_KEYS.SERVICE_AVAILABLE,
        ]);
        setCurrentLocation(null);
        setServiceAvailable(false);
      }

      // Always sync permission status to storage
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_GRANTED, hasPermission.toString());
    } catch (err) {
      console.error('Failed to load location data:', err);
      setPermissionGranted(false);
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission denied');
        setPermissionGranted(false);
        await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_GRANTED, 'false');
        setIsLoading(false);
        return;
      }

      setPermissionGranted(true);
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_GRANTED, 'true');

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: `${geocode.name || ''}, ${geocode.street || ''}`.trim() || 'Address not available',
        city: geocode.city || geocode.subregion || 'Unknown City',
        state: geocode.region || geocode.isoCountryCode || 'Unknown State',
        pincode: geocode.postalCode || '000000',
        area: geocode.subregion || geocode.district || geocode.name || 'Unknown Area',
      };

      setCurrentLocation(locationData);
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_LOCATION,
        JSON.stringify(locationData)
      );

      // Check service availability
      const isServiceable = isLocationServiceable(
        position.coords.latitude,
        position.coords.longitude
      );
      setServiceAvailable(isServiceable);
      await AsyncStorage.setItem(STORAGE_KEYS.SERVICE_AVAILABLE, isServiceable.toString());
    } catch (err: any) {
      let errorMessage = 'Failed to get location. Please try again.';
      
      if (err.code === 'E_LOCATION_UNAVAILABLE') {
        errorMessage = 'Location services are unavailable. Please enable them in settings.';
      } else if (err.code === 'E_LOCATION_TIMEOUT') {
        errorMessage = 'Location request timed out. Please try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setPermissionGranted(granted);
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_GRANTED, granted.toString());
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const checkServiceAvailability = (): boolean => {
    if (currentLocation) {
      return isLocationServiceable(currentLocation.latitude, currentLocation.longitude);
    }
    return false;
  };

  const setManualLocation = async (location: LocationData) => {
    setCurrentLocation(location);
    await AsyncStorage.setItem(
      STORAGE_KEYS.CURRENT_LOCATION,
      JSON.stringify(location)
    );
  };

  const saveLocation = async (location: SavedLocation) => {
    const updated = [...savedLocations, location];
    setSavedLocations(updated);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SAVED_LOCATIONS,
      JSON.stringify(updated)
    );
  };

  const removeLocation = async (id: string) => {
    const updated = savedLocations.filter(loc => loc.id !== id);
    setSavedLocations(updated);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SAVED_LOCATIONS,
      JSON.stringify(updated)
    );
  };

  const selectLocation = async (location: LocationData) => {
    setCurrentLocation(location);
    await AsyncStorage.setItem(
      STORAGE_KEYS.CURRENT_LOCATION,
      JSON.stringify(location)
    );
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        savedLocations,
        serviceAvailable,
        permissionGranted,
        isLoading,
        error,
        getCurrentLocation,
        setManualLocation,
        saveLocation,
        removeLocation,
        selectLocation,
        checkServiceAvailability,
        requestLocationPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
