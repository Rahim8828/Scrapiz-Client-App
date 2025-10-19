import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScrapizLogo from './ScrapizLogo';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsating glow animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animation for background
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Rotation animation for textures
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    const timeout = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f0fdf4', '#dcfce7']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated Background Textures */}
        <View style={styles.bgPattern}>
          {/* Rotating Green Circles */}
          <Animated.View 
            style={[
              styles.patternCircle, 
              { 
                opacity: pulseAnim.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [0.08, 0.15]
                }),
                transform: [
                  { 
                    scale: pulseAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [1, 1.1]
                    })
                  },
                  { rotate: rotation }
                ]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.patternCircle2, 
              { 
                opacity: pulseAnim.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [0.1, 0.18]
                }),
                transform: [
                  { 
                    scale: pulseAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [1.1, 1]
                    })
                  },
                  { rotate: rotation }
                ]
              }
            ]} 
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo with Minimal Green Glow Effect */}
          <Animated.View style={[styles.logoGlowOuter, { 
            opacity: pulseAnim.interpolate({
              inputRange: [0.3, 1],
              outputRange: [0.1, 0.2]
            }),
            transform: [{ scale: scaleAnim }]
          }]} />
          
          {/* Animated Logo Container with Clean Design */}
          <Animated.View 
            style={[
              styles.logoContainer, 
              { 
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { 
                    rotate: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-3deg', '0deg']
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.logoWrapper}>
              <ScrapizLogo width={260} />
            </View>
          </Animated.View>

          {/* Minimal Tagline with Clean Design */}
          <Animated.View
            style={[
              styles.taglineContainer,
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              },
            ]}
          >
            <LinearGradient
              colors={['#16a34a', '#15803d']}
              style={styles.badgeContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.badgeText}>🇮🇳 INDIA'S #1</Text>
            </LinearGradient>
            
            <Text style={styles.mainTagline}>Online Scrap Selling</Text>
            <Text style={styles.mainTagline}>Platform</Text>
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
            </View>
            
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>💰</Text>
                </View>
                <Text style={styles.featureText}>Best Rates</Text>
              </View>
              
              <View style={styles.featureDivider} />
              
              <View style={styles.featureItem}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>🚀</Text>
                </View>
                <Text style={styles.featureText}>Quick Pickup</Text>
              </View>
            </View>
          </Animated.View>

          {/* Minimal Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  opacity: pulseAnim.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.15, 0.5]
                  }),
                  transform: [
                    {
                      translateY: pulseAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0, -15]
                      })
                    },
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.8, 1.2]
                      })
                    }
                  ]
                },
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  bgPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  patternCircle: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(22, 163, 74, 0.06)',
    top: -220,
    right: -180,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.12)',
  },
  patternCircle2: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(21, 128, 61, 0.05)',
    bottom: -180,
    left: -120,
    borderWidth: 1,
    borderColor: 'rgba(21, 128, 61, 0.1)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  logoGlowOuter: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(22, 163, 74, 0.08)',
    top: '16%',
    ...Platform.select({
      ios: {
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  logoWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 140,
    padding: 28,
    borderWidth: 2,
    borderColor: 'rgba(22, 163, 74, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 30,
  },
  badgeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    ...Platform.select({
      ios: {
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  mainTagline: {
    fontSize: 30,
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  dividerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: '#16a34a',
    borderRadius: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
    ...Platform.select({
      ios: {
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconText: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    opacity: 0.4,
    ...Platform.select({
      ios: {
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
