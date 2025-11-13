import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, Platform } from 'react-native';
import { wp, hp, fs } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeContext';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  console.log('[Splash] SplashScreen component rendering...');
  
  const { colors, theme } = useTheme();
  console.log('[Splash] Theme loaded:', theme, 'colors:', colors ? 'available' : 'not available');
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const hasFinished = useRef(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    const mountTime = Date.now();
    console.log('[Splash] SplashScreen mounted, Platform:', Platform.OS, 'Theme:', theme);
    
    // Ensure splash displays for minimum duration on both platforms
    const startDelay = Platform.OS === 'android' ? 400 : 200;
    const animationDuration = 4000;
    const fallbackTimeout = 5500;
    
    console.log('[Splash] Timing configuration - startDelay:', startDelay, 'ms, animationDuration:', animationDuration, 'ms, fallbackTimeout:', fallbackTimeout, 'ms');
    
    const timer = setTimeout(() => {
      const delayElapsed = Date.now() - mountTime;
      console.log('[Splash] Starting splash animations after', delayElapsed, 'ms delay');
      
      // Start all animations together
      Animated.parallel([
        // Logo fade in + scale animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        // Text fade in (delayed)
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 400,
          useNativeDriver: true,
        }),
        // Progress bar animation
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: false,
        }),
        // Shimmer effect
        Animated.loop(
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          })
        ),
      ]).start(() => {
        const totalElapsed = Date.now() - mountTime;
        console.log('[Splash] Animations complete after', totalElapsed, 'ms total, finishing splash...');
        if (!hasFinished.current) {
          hasFinished.current = true;
          onFinish();
        }
      });



      // Update loading percentage
      const percentageInterval = setInterval(() => {
        setLoadingPercentage((prev) => {
          if (prev >= 100) {
            clearInterval(percentageInterval);
            return 100;
          }
          return prev + 2;
        });
      }, animationDuration / 50);
    }, startDelay);

    // Fallback timeout to ensure splash finishes even if animations fail
    const fallbackTimer = setTimeout(() => {
      if (!hasFinished.current) {
        const totalElapsed = Date.now() - mountTime;
        console.warn('[Splash] Splash animation timeout after', totalElapsed, 'ms, forcing finish');
        hasFinished.current = true;
        onFinish();
      }
    }, fallbackTimeout);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-wp(100), wp(100)],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingHorizontal: wp(10),
    },
    logoContainer: {
      position: 'relative',
      marginBottom: hp(4),
    },
    icon: {
      width: wp(45),
      height: wp(45),
      ...Platform.select({
        android: {
          backgroundColor: 'transparent',
        },
      }),
    },
    brandName: {
      fontSize: fs(28),
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: 1,
      marginBottom: hp(1.5),
      ...Platform.select({
        android: {
          fontFamily: 'sans-serif-medium',
        },
      }),
    },
    subtext: {
      fontSize: fs(16),
      fontWeight: '600',
      color: colors.primary,
      textAlign: 'center',
      letterSpacing: 0.5,
      marginBottom: hp(2),
      ...Platform.select({
        android: {
          fontFamily: 'sans-serif-medium',
        },
      }),
    },
    loadingContainer: {
      position: 'absolute',
      bottom: hp(15),
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: fs(12),
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: hp(1),
      letterSpacing: 0.5,
    },
    progressContainer: {
      width: wp(80),
      alignItems: 'center',
    },
    progressBackground: {
      width: '100%',
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 10,
      overflow: 'hidden',
      position: 'relative',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      width: wp(20),
    },
    percentageText: {
      fontSize: fs(11),
      fontWeight: '700',
      color: colors.primary,
      marginTop: hp(0.8),
    },
    versionText: {
      position: 'absolute',
      bottom: hp(8),
      fontSize: fs(10),
      color: colors.textTertiary,
      fontWeight: '500',
    },

  });

  console.log('[Splash] Rendering splash screen UI');

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            { 
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image 
            source={require('../assets/images/s.png')}
            style={styles.icon}
            resizeMode="contain"
            fadeDuration={0}
            onLoad={() => console.log('[Splash] Logo image loaded successfully')}
            onError={(error) => console.error('[Splash] Logo image failed to load:', error)}
          />
        </Animated.View>

        {/* Brand Name */}
        <Animated.Text style={[styles.brandName, { opacity: textFadeAnim }]}>
          Scrapiz
        </Animated.Text>
        
        {/* Tagline */}
        <Animated.Text style={[styles.subtext, { opacity: textFadeAnim }]}>
          Sell Scrap, Get Cash
        </Animated.Text>
      </Animated.View>

      {/* Loading Progress at Bottom */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]} 
            />
            <Animated.View 
              style={[
                styles.shimmer,
                { transform: [{ translateX: shimmerTranslate }] }
              ]} 
            />
          </View>
          <Text style={styles.percentageText}>{loadingPercentage}%</Text>
        </View>
      </View>

      {/* Version Text */}
      <Text style={styles.versionText}>v1.0.0</Text>
    </View>
  );
}
