import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ScrapizLogo from '@/components/ScrapizLogo';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Refs for input navigation
  const passwordInputRef = useRef<TextInput>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
  }, [fadeAnim, slideAnim]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    // Improved email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!trimmedPassword) {
      newErrors.password = 'Password is required';
    } else if (trimmedPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Prevent multiple submissions
    if (isLoading) return;
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Trim inputs before sending
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid email/password
      if (trimmedEmail && trimmedPassword.length >= 6) {
        // Navigate to main app
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate successful Google login
      Alert.alert('Success', 'Google login successful!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundWrapper}>
        {/* Green Gradient Header */}
        <LinearGradient
          colors={['#16a34a', '#15803d', '#14532d']}
          style={styles.greenHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Texture Pattern */}
          <View style={styles.texturePattern}>
            {Array.from({ length: 80 }).map((_, i) => (
              <View key={i} style={styles.textureDot} />
            ))}
          </View>
          
          {/* Decorative Circles */}
          <Animated.View 
            style={[
              styles.bgCircle1,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.15]
                })
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.bgCircle2,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1]
                })
              }
            ]}
          />
          
          {/* Header Content in Green Section */}
          <Animated.View 
            style={[
              styles.headerInGreen,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <ScrapizLogo width={330} />
              <View style={styles.badge}>
                <Sparkles size={12} color="#ffffff" />
                <Text style={styles.badgeText}>Trusted by 10,000+ users</Text>
              </View>
            </View>
            
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>
              Sign in to turn your scrap into instant cash
            </Text>
          </Animated.View>
        </LinearGradient>

        <KeyboardAvoidingView 
          style={styles.keyboardView} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.scrollContent}>

            {/* Login Form */}
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Mail size={20} color="#10b981" />
              </View>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={(text) => {
                  // Auto-lowercase email but don't trim during typing
                  setEmail(text.toLowerCase());
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {errors.email && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {errors.email}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Lock size={20} color="#10b981" />
              </View>
              <TextInput
                ref={passwordInputRef}
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={22} color="#9ca3af" />
                ) : (
                  <Eye size={22} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {errors.password}</Text>
              </View>
            )}
          </View>

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password? →</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#16a34a', '#15803d', '#14532d']}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Signing in...</Text>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <ArrowRight size={22} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <Image
              source={require('@/assets/images/Gooogle Favicon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <Animated.View 
              style={[
                styles.footer,
                { opacity: fadeAnim }
              ]}
            >
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign Up →</Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>

            {/* Trust Indicators */}
            <Animated.View 
              style={[
                styles.trustIndicators,
                { opacity: fadeAnim }
              ]}
            >
              <View style={styles.trustItem}>
                <Shield size={18} color="#10b981" />
                <Text style={styles.trustText}>100% Secure</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Zap size={18} color="#f59e0b" />
                <Text style={styles.trustText}>Fast Payout</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Sparkles size={18} color="#8b5cf6" />
                <Text style={styles.trustText}>Best Rates</Text>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundWrapper: {
    flex: 1,
  },
  greenHeader: {
    position: 'absolute',
    width: '100%',
    height: height * 0.40,
    top: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  texturePattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textureDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    margin: 12,
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -60,
    left: -60,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.40 + 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  headerInGreen: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  logoGlow: {
    display: 'none',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    gap: 7,
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  badgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 5,
    marginTop: 0,
    textAlign: 'center',
    letterSpacing: -0.6,
    textDecorationLine: 'none',
  },
  subtitleText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
    fontWeight: '500',
    opacity: 0.95,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 4,
    height: 58,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  eyeIcon: {
    padding: 8,
  },
  errorContainer: {
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '700',
  },
  loginButton: {
    borderRadius: 16,
    height: 56,
    overflow: 'hidden',
    marginBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
    paddingHorizontal: 14,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 15,
    color: '#16a34a',
    fontWeight: '800',
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  trustText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '700',
    flexShrink: 1,
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#bbf7d0',
  },
});
