import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bell, Rocket } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocation } from '../../contexts/LocationContext';
import { SERVICE_CITIES, getComingSoonCityInfo } from '../../constants/ServiceAreas';

export default function ServiceUnavailableScreen() {
  const router = useRouter();
  const { currentLocation } = useLocation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const cityName = currentLocation?.city || 'your city';
  const comingSoonInfo = getComingSoonCityInfo(cityName);

  const handleNotifyMe = async () => {
    if (!email.trim() && !phone.trim()) {
      Alert.alert('Required', 'Please enter your email or phone number');
      return;
    }

    // Basic email validation
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Basic phone validation
    if (phone.trim() && !/^[6-9]\d{9}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // await saveToWaitlist({ email, phone, city: cityName });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        '🎉 Success!',
        `Thank you for your interest! We'll notify you as soon as Scrapiz launches in ${cityName}.`,
        [
          {
            text: 'OK',
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          {/* Illustration */}
          <Animated.View
            style={[
              styles.illustrationContainer,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            <View style={styles.rocketContainer}>
              <Rocket size={80} color="#16a34a" strokeWidth={1.5} />
            </View>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>Coming Soon to {cityName}!</Text>
          <Text style={styles.subtitle}>
            We're not in {cityName} yet, but we're expanding fast across India! 🚀
          </Text>

          {/* Expected Launch */}
          {comingSoonInfo && (
            <View style={styles.launchBadge}>
              <Text style={styles.launchText}>
                Expected Launch: {comingSoonInfo.expectedLaunch}
              </Text>
            </View>
          )}

          {/* Notify Me Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Get Notified When We Launch</Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (Optional)"
                  placeholderTextColor="#9ca3af"
                  value={phone}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, '');
                    if (cleaned.length <= 10) {
                      setPhone(cleaned);
                    }
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.notifyButton}
              onPress={handleNotifyMe}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#16a34a', '#15803d']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Bell size={20} color="white" strokeWidth={2.5} />
                    <Text style={styles.buttonText}>Notify Me</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Coming Soon Cities */}
          <View style={styles.citiesContainer}>
            <Text style={styles.citiesTitle}>Expanding to:</Text>
            <View style={styles.citiesGrid}>
              {SERVICE_CITIES.comingSoon.slice(0, 6).map((city, index) => (
                <View key={index} style={styles.cityChip}>
                  <MapPin size={14} color="#16a34a" />
                  <Text style={styles.cityName}>{city.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer Note */}
          <Text style={styles.footerNote}>
            🌱 As a bootstrapped startup, we're building Scrapiz sustainably. Every city we expand to is carefully planned for quality service!
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  rocketContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 30,
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
    marginBottom: 20,
  },
  launchBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  launchText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    fontFamily: 'Inter-Bold',
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  notifyButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.3,
  },
  citiesContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  citiesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  cityName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    fontFamily: 'Inter-SemiBold',
  },
  footerNote: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
    marginTop: 24,
  },
});
