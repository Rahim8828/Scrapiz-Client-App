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
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocation } from '../../contexts/LocationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { wp, hp, fs, spacing } from '../../utils/responsive';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { setLocationFromPincode, validatePincode: isValidPincode } = useLocation();
  const { isAuthenticated } = useAuth();
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const validatePincode = (code: string): boolean => {
    // Check if pincode is exactly 6 digits
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(code);
  };

  const handlePincodeSubmit = async () => {
    // Clear previous error
    setError('');

    // Validate pincode
    if (!pincode.trim()) {
      setError('Please enter your pin code');
      return;
    }

    if (!validatePincode(pincode)) {
      setError('Please enter a valid 6-digit pin code');
      return;
    }

    setLoading(true);

    try {
      // Use LocationContext to validate and set location from pincode
      const success = await setLocationFromPincode(pincode.trim());

      if (!success) {
        setError('Sorry, we don\'t service this pin code yet. We\'re expanding soon!');
        setLoading(false);
        // Show option to try another pincode or go back
        return;
      }

      // Success - check if user is already authenticated
      if (isAuthenticated) {
        // Already logged in, go directly to main app
        console.log('✅ Location set, user already authenticated → Navigate to tabs');
        router.replace('/(tabs)');
      } else {
        // Not logged in, navigate to login page
        console.log('✅ Location set, user not authenticated → Navigate to login');
        router.replace('/(auth)/login');
      }
      
    } catch (error) {
      console.error('Error setting pincode:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setPincode('');
  };

  const handlePincodeChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setPincode(numericText);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
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
          {/* Icon - New Modern Design */}
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
            {/* Outer Ring */}
            <View style={[styles.outerRing, { backgroundColor: colors.primaryLight + '15' }]}>
              <View style={[styles.middleRing, { backgroundColor: colors.primaryLight + '25' }]}>
                <LinearGradient
                  colors={['#16a34a', '#15803d', '#166534']}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.iconInnerCircle}>
                    <Text style={styles.pinCodeIcon}>📍</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
            {/* Floating Dots */}
            <View style={[styles.floatingDot, styles.dot1, { backgroundColor: colors.primary }]} />
            <View style={[styles.floatingDot, styles.dot2, { backgroundColor: colors.primary }]} />
            <View style={[styles.floatingDot, styles.dot3, { backgroundColor: colors.primary }]} />
          </Animated.View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>Enter Your Pin Code</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We need your pin code to check service availability in your area
          </Text>

          {/* Benefits */}
          <View style={[styles.benefitsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.benefitItem}>
              <View style={[styles.checkmark, { backgroundColor: colors.primaryLight + '30' }]}>
                <Text style={[styles.checkmarkText, { color: colors.primary }]}>✓</Text>
              </View>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>Check service availability</Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.checkmark, { backgroundColor: colors.primaryLight + '30' }]}>
                <Text style={[styles.checkmarkText, { color: colors.primary }]}>✓</Text>
              </View>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>Calculate accurate pickup rates</Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.checkmark, { backgroundColor: colors.primaryLight + '30' }]}>
                <Text style={[styles.checkmarkText, { color: colors.primary }]}>✓</Text>
              </View>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>Get best prices for your scrap</Text>
            </View>
          </View>

          {/* Pin Code Input */}
          <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MapPin size={20} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter 6-digit pin code"
              placeholderTextColor={colors.textTertiary}
              value={pincode}
              onChangeText={handlePincodeChange}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus={false}
              returnKeyType="done"
              onSubmitEditing={handlePincodeSubmit}
            />
            {pincode.length === 6 && (
              <View style={[styles.validIndicator, { backgroundColor: colors.primaryLight + '30' }]}>
                <Text style={[styles.validCheck, { color: colors.primary }]}>✓</Text>
              </View>
            )}
          </View>

          {/* Error Message with Retry */}
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '15', borderColor: colors.error + '30' }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              <TouchableOpacity 
                style={[styles.retryButton, { backgroundColor: colors.error }]}
                onPress={handleRetry}
                activeOpacity={0.7}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Helper Text */}
          <Text style={[styles.helperText, { color: colors.textTertiary }]}>
            Mumbai Pincodes: 400001, 400102, 400095
          </Text>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!pincode || pincode.length !== 6) && styles.submitButtonDisabled
            ]}
            onPress={handlePincodeSubmit}
            disabled={loading || !pincode || pincode.length !== 6}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                loading || !pincode || pincode.length !== 6
                  ? ['#9ca3af', '#6b7280']
                  : ['#16a34a', '#15803d']
              }
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Verify Pin Code</Text>
                  <ChevronRight size={20} color="white" strokeWidth={2.5} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Privacy Note */}
          <Text style={[styles.privacyNote, { color: colors.textTertiary }]}>
            🔒 Your pin code data is secure and used only for service delivery
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing(24),
    paddingVertical: spacing(30),
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing(24),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    width: wp(26.7),
    height: wp(26.7),
    borderRadius: wp(13.35),
    backgroundColor: 'rgba(22, 163, 74, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRing: {
    width: wp(21.3),
    height: wp(21.3),
    borderRadius: wp(10.65),
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGradient: {
    width: wp(17.1),
    height: wp(17.1),
    borderRadius: wp(8.55),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconInnerCircle: {
    width: wp(12.8),
    height: wp(12.8),
    borderRadius: wp(6.4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCodeIcon: {
    fontSize: fs(28),
  },
  floatingDot: {
    position: 'absolute',
    width: spacing(8),
    height: spacing(8),
    borderRadius: spacing(4),
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  dot1: {
    top: spacing(10),
    right: spacing(15),
  },
  dot2: {
    bottom: spacing(12),
    left: spacing(12),
  },
  dot3: {
    top: spacing(35),
    left: spacing(5),
  },
  title: {
    fontSize: fs(24),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: spacing(8),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fs(14),
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: fs(20),
    maxWidth: wp(74.7),
    marginBottom: spacing(24),
  },
  benefitsContainer: {
    width: '100%',
    borderRadius: spacing(16),
    padding: spacing(20),
    marginBottom: spacing(24),
    borderWidth: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(12),
  },
  checkmark: {
    width: fs(24),
    height: fs(24),
    borderRadius: fs(12),
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(12),
  },
  checkmarkText: {
    fontSize: fs(14),
    fontWeight: '700',
    color: '#16a34a',
  },
  benefitText: {
    flex: 1,
    fontSize: fs(13),
    color: '#374151',
    fontFamily: 'Inter-Medium',
    lineHeight: fs(18),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing(16),
    gap: spacing(8),
  },
  buttonText: {
    fontSize: fs(16),
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: spacing(12),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: spacing(16),
    height: hp(6.6),
    marginBottom: spacing(12),
  },
  searchIcon: {
    marginRight: spacing(10),
  },
  input: {
    flex: 1,
    fontSize: fs(16),
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  validIndicator: {
    width: fs(28),
    height: fs(28),
    borderRadius: fs(14),
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  validCheck: {
    fontSize: fs(16),
    fontWeight: '700',
    color: '#16a34a',
  },
  errorContainer: {
    width: '100%',
    backgroundColor: '#fee2e2',
    borderRadius: spacing(10),
    padding: spacing(14),
    marginBottom: spacing(12),
    borderLeftWidth: 3,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    fontSize: fs(13),
    color: '#dc2626',
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
    marginBottom: spacing(12),
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: spacing(8),
    paddingHorizontal: spacing(16),
    borderRadius: spacing(6),
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    fontSize: fs(13),
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  helperText: {
    fontSize: fs(12),
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: spacing(20),
  },
  submitButton: {
    width: '100%',
    borderRadius: spacing(12),
    overflow: 'hidden',
    marginBottom: spacing(16),
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  privacyNote: {
    fontSize: fs(11),
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: spacing(12),
    maxWidth: wp(80),
    lineHeight: fs(16),
  },
});
