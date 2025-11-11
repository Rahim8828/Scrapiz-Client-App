/**
 * AppHeader Component
 * Top navigation bar with location, logo, coins, and profile
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import LocationSelector from './LocationSelector';
import ScrapizLogo from './ScrapizLogo';
import { wp, hp, fs, spacing } from '../utils/responsive';

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
            <User size={fs(22)} color="#16a34a" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: Platform.select({ ios: hp(7.4), android: hp(6.2) }), // 60/50px
    paddingBottom: spacing(12),
    paddingHorizontal: spacing(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing(12),
  },
  leftSection: {
    flex: 1,
    maxWidth: wp(48), // ~180px responsive
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
    gap: spacing(10),
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingVertical: spacing(6),
    paddingHorizontal: spacing(10),
    borderRadius: spacing(20),
    gap: spacing(6),
    minHeight: hp(4.9), // ~40px
  },
  coinsIcon: {
    fontSize: fs(18),
  },
  coinsInfo: {
    alignItems: 'flex-start',
  },
  coinsLabel: {
    fontSize: fs(9),
    color: '#16a34a',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  coinsValue: {
    fontSize: fs(15),
    color: '#16a34a',
    fontWeight: '700',
  },
  profileButton: {
    width: wp(11.2), // ~42px
    height: wp(11.2),
    borderRadius: wp(5.6), // Perfect circle
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
});
