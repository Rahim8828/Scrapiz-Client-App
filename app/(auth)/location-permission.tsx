import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ChevronRight, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocation } from '../../contexts/LocationContext';
import { isCityServiceable } from '../../constants/ServiceAreas';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const { getCurrentLocation, setManualLocation, requestLocationPermission, isLoading } = useLocation();
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [manualCityLoading, setManualCityLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleEnableLocation = async () => {
    try {
      const granted = await requestLocationPermission();
      
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to check service availability. You can enter your city manually instead.',
          [
            { text: 'Enter Manually', onPress: () => setShowManualEntry(true) },
            { text: 'Try Again', onPress: handleEnableLocation }
          ]
        );
        return;
      }

      // Fetch location
      await getCurrentLocation();
      
      // Navigate based on service availability will be handled by parent component
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Error',
        'Failed to get your location. Please try entering your city manually.',
        [{ text: 'OK', onPress: () => setShowManualEntry(true) }]
      );
    }
  };

  const handleManualCitySubmit = async () => {
    if (!manualCity.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    setManualCityLoading(true);

    try {
      // Create a dummy location data with the city name
      const locationData = {
        latitude: 0,
        longitude: 0,
        address: manualCity.trim(),
        city: manualCity.trim(),
        state: '',
        pincode: '',
        area: manualCity.trim(),
      };

      await setManualLocation(locationData);

      // Check if serviceable
      const isServiceable = isCityServiceable(manualCity.trim());

      if (isServiceable) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/service-unavailable');
      }
    } catch (error) {
      console.error('Error setting manual city:', error);
      Alert.alert('Error', 'Failed to set your city. Please try again.');
    } finally {
      setManualCityLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Icon */}
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={['#16a34a', '#15803d', '#166534']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MapPin size={64} color="white" strokeWidth={2} />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>Enable Location Services</Text>
          <Text style={styles.subtitle}>
            We need your location to check service availability in your area
          </Text>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.benefitText}>Check service availability</Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.benefitText}>Calculate accurate pickup rates</Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.benefitText}>Get best prices for your scrap</Text>
            </View>
          </View>

          {!showManualEntry ? (
            <>
              {/* Enable Location Button */}
              <TouchableOpacity
                style={styles.enableButton}
                onPress={handleEnableLocation}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#16a34a', '#15803d']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <MapPin size={22} color="white" strokeWidth={2.5} />
                      <Text style={styles.buttonText}>Enable Location</Text>
                      <ChevronRight size={22} color="white" strokeWidth={2.5} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Manual Entry Link */}
              <TouchableOpacity
                style={styles.manualLink}
                onPress={() => setShowManualEntry(true)}
                disabled={isLoading}
              >
                <Text style={styles.manualLinkText}>Enter City Manually</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Manual City Entry */}
              <View style={styles.manualEntryContainer}>
                <View style={styles.inputWrapper}>
                  <Search size={20} color="#6b7280" style={styles.searchIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your city name"
                    placeholderTextColor="#9ca3af"
                    value={manualCity}
                    onChangeText={setManualCity}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleManualCitySubmit}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleManualCitySubmit}
                  disabled={manualCityLoading || !manualCity.trim()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#16a34a', '#15803d']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {manualCityLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Continue</Text>
                        <ChevronRight size={22} color="white" strokeWidth={2.5} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backLink}
                  onPress={() => setShowManualEntry(false)}
                  disabled={manualCityLoading}
                >
                  <Text style={styles.backLinkText}>← Use Location Instead</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Privacy Note */}
          <Text style={styles.privacyNote}>
            🔒 Your location data is secure and used only for service delivery
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 32,
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16a34a',
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  enableButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.3,
  },
  manualLink: {
    paddingVertical: 12,
  },
  manualLinkText: {
    fontSize: 15,
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
  manualEntryContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backLinkText: {
    fontSize: 15,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  privacyNote: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 24,
    maxWidth: 300,
    lineHeight: 18,
  },
});
