/**
 * AppHeader Component
 * Top navigation bar with location, logo, coins, and profile
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import LocationSelector from './LocationSelector';
import ScrapizLogo from './ScrapizLogo';

const { width } = Dimensions.get('window');

interface AppHeaderProps {
  coinsBalance?: number;
  showLogo?: boolean;
}

export default function AppHeader({ coinsBalance = 100, showLogo = true }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Row: Location, Logo (optional), Coins, Profile */}
      <View style={styles.topRow}>
        {/* Left: Location Selector */}
        <View style={styles.leftSection}>
          <LocationSelector />
        </View>

        {/* Center: Logo (optional) */}
        {showLogo && (
          <View style={styles.centerSection}>
            <ScrapizLogo width={100} />
          </View>
        )}

        {/* Right: Coins & Profile */}
        <View style={styles.rightSection}>
          {/* Coins Display */}
          <TouchableOpacity style={styles.coinsContainer}>
            <Text style={styles.coinsIcon}>💰</Text>
            <View style={styles.coinsInfo}>
              <Text style={styles.coinsLabel}>MY COINS</Text>
              <Text style={styles.coinsValue}>{coinsBalance}</Text>
            </View>
          </TouchableOpacity>

          {/* Profile Icon */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <User size={22} color="#16a34a" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: Platform.select({ ios: 60, android: 50 }),
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  leftSection: {
    flex: 1,
    maxWidth: 180,
  },
  centerSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
  },
  coinsIcon: {
    fontSize: 18,
  },
  coinsInfo: {
    alignItems: 'flex-start',
  },
  coinsLabel: {
    fontSize: 9,
    color: '#16a34a',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  coinsValue: {
    fontSize: 15,
    color: '#16a34a',
    fontWeight: '700',
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
});
