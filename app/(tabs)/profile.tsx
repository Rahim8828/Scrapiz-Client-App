import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  StatusBar,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { User, MapPin, Bell, Shield, CircleHelp as HelpCircle, Star, Gift, ChevronRight, Award, LogOut, Phone, Mail, Package, Clock, CheckCircle, Plus, Moon, Sun } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { mockOrders, getStatusColor, getStatusText, type Order } from '../../data/orderData';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../../contexts/ProfileContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { wp, hp, fs, spacing, responsiveValue, MIN_TOUCH_SIZE } from '../../utils/responsive';

const profileData = {
  name: 'Anas Farooqui',
  email: 'Farooquianas05@gmail.com',
  phone: '+91 9920397636',
  address: 'R M 8, Zaheer Residential Society, Jogeshwari West, Mumbai - 400102',
  joinDate: 'January 2024',
  totalOrders: 24,
  totalEarnings: 8420,
  totalRecycled: 186,
  rating: 4.8,
  avatar: 'AF',
};

type MenuItem = {
  icon: any;
  title: string;
  subtitle: string;
  action: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

type MenuSection = {
  section: string;
  items: MenuItem[];
};

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { profile, loadProfile, updateProfile, isLoading } = useProfile();
  const { logout } = useAuth();
  const { theme, setThemeMode, isDark, colors } = useTheme();

  // Reload profile when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const toggleTheme = async () => {
    // Toggle between light and dark mode (no auto for simple toggle)
    const newTheme = isDark ? 'light' : 'dark';
    await setThemeMode(newTheme);
  };

  const getInitials = () => {
    return profile.fullName
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0].toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleProfileImagePick = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to update your profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Update profile with new image
        await updateProfile({
          ...profile,
          profileImage: imageUri,
        });
        
        Alert.alert(
          'Success!',
          'Profile photo updated successfully.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit-profile');
  };

  const handleAddresses = () => {
    router.push('/profile/addresses');
  };

  const handleNotifications = () => {
    router.push('/profile/notification-settings');
  };

  const handlePrivacySecurity = () => {
    router.push('/profile/privacy-security');
  };

  const handleHelpSupport = () => {
    router.push('/profile/help-support');
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Scrapiz',
      'Would you like to rate our app on the App Store?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rate Now', 
          onPress: () => {
            Alert.alert('Thank you!', 'This would open the app store in a real app.');
          }
        }
      ]
    );
  };

  const handleReferFriends = () => {
    router.push('/profile/refer-friends');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };
  const handleViewOrders = () => {
    router.push('/profile/orders');
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/profile/orders/${orderId}`);
  };

  const menuItems: MenuSection[] = [
    {
      section: 'Account',
      items: [
        { icon: User, title: 'Edit Profile', subtitle: 'Update your personal information', action: handleEditProfile },
        { icon: MapPin, title: 'Addresses', subtitle: 'Manage pickup addresses', action: handleAddresses },
      ]
    },
    {
      section: 'Orders & Services',
      items: [
        { icon: Package, title: 'My Orders', subtitle: `${mockOrders.length} orders • View all`, action: handleViewOrders },
      ]
    },
    {
      section: 'Support & Feedback',
      items: [
        { icon: HelpCircle, title: 'Help & Support', subtitle: 'FAQs and contact support', action: handleHelpSupport },
        { icon: Gift, title: 'Refer Friends', subtitle: 'Earn rewards for referrals', action: handleReferFriends },
      ]
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <LinearGradient
          colors={isDark ? ['#22c55e', '#16a34a'] : ['#16a34a', '#15803d']}
          style={styles.header}
        >
          {/* Dark Mode Toggle Button - Top Right */}
          <TouchableOpacity 
            style={styles.themeToggleButton}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.themeToggleIcon}>
              {isDark ? (
                <Sun size={fs(20)} color="#ffffff" strokeWidth={2.5} />
              ) : (
                <Moon size={fs(20)} color="#ffffff" strokeWidth={2.5} />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleProfileImagePick} style={styles.avatarWrapper}>
              {isLoading ? (
                <View style={styles.avatar}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : profile.profileImage ? (
                <Image 
                  source={{ uri: profile.profileImage }} 
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials()}</Text>
                </View>
              )}
              <View style={styles.plusIconContainer}>
                <Plus size={fs(16)} color="#16a34a" strokeWidth={3} />
              </View>
            </TouchableOpacity>
              <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile.fullName}</Text>
                  <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
          </View>
        </LinearGradient>

      {/* Menu Sections */}
      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.section}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity 
              key={itemIndex} 
              style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={item.action}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIcon, { backgroundColor: colors.primary + '15' }]}>
                  <item.icon size={fs(20)} color={colors.primary} />
                </View>
                <View style={styles.menuItemInfo}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                {item.hasSwitch ? (
                  <Switch
                    value={item.switchValue}
                    onValueChange={item.onSwitchChange}
                    trackColor={{ false: colors.border, true: colors.primary + '50' }}
                    thumbColor={item.switchValue ? colors.primary : colors.textTertiary}
                  />
                ) : (
                  <ChevronRight size={fs(16)} color={colors.textTertiary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Environmental Impact */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Environmental Impact</Text>
        <View style={[styles.impactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.impactEmoji}>🌱</Text>
          <View style={styles.impactContent}>
            <Text style={[styles.impactTitle, { color: colors.text }]}>Great Job!</Text>
            <Text style={[styles.impactDescription, { color: colors.textSecondary }]}>
              You've recycled {profileData.totalRecycled}kg of waste, helping save the environment!
            </Text>
            <View style={styles.impactStats}>
              <Text style={[styles.impactStat, { color: colors.text }]}>🌳 124 trees saved</Text>
              <Text style={[styles.impactStat, { color: colors.text }]}>💨 340kg CO₂ reduced</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <LogOut size={fs(20)} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingTop: Platform.select({ ios: hp(8.5), android: hp(7.5) }), // Reduced from 9.8/8.6
    paddingHorizontal: spacing(18), // Reduced from 20
    paddingBottom: spacing(16), // Reduced from 20
    borderBottomLeftRadius: spacing(24),
    borderBottomRightRadius: spacing(24),
  },
  themeToggleButton: {
    position: 'absolute',
    top: Platform.select({ ios: hp(6.5), android: hp(5.2) }), // Moved down from 7/5.5
    right: spacing(18), // Adjusted from 20
    zIndex: 10,
  },
  themeToggleIcon: {
    width: spacing(38), // Reduced from 42
    height: spacing(38), // Reduced from 42
    borderRadius: spacing(19), // Reduced from 21
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: spacing(14), // Reduced from 16
  },
  avatar: {
    width: wp(15), // Reduced from 17
    height: wp(15), // Reduced from 17
    borderRadius: wp(7.5), // Reduced from 8.5
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarImage: {
    width: wp(15), // Reduced from 17
    height: wp(15), // Reduced from 17
    borderRadius: wp(7.5), // Reduced from 8.5
    borderWidth: 2,
    borderColor: 'white',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp(5.5), // Reduced from 6.4
    height: wp(5.5), // Reduced from 6.4
    borderRadius: wp(2.75), // Reduced from 3.2
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  avatarText: {
    color: 'white',
    fontSize: fs(22), // Reduced from 24
    fontFamily: 'Inter-Bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fs(20), // Reduced from 22
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  profileEmail: {
    fontSize: fs(13), // Reduced from 14
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing(2),
  },
  section: {
    paddingHorizontal: spacing(20),
    paddingVertical: spacing(16),
  },
  sectionTitle: {
    fontSize: fs(16),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing(12),
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: spacing(12),
    padding: spacing(16),
    marginBottom: spacing(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: MIN_TOUCH_SIZE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: wp(10.6),
    height: wp(10.6),
    borderRadius: wp(5.3),
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(12),
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: fs(16),
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: spacing(2),
  },
  menuItemSubtitle: {
    fontSize: fs(12),
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  menuItemRight: {
    marginLeft: spacing(12),
  },
  impactCard: {
    backgroundColor: 'white',
    borderRadius: spacing(16),
    padding: spacing(20),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  impactEmoji: {
    fontSize: fs(48),
    marginRight: spacing(16),
  },
  impactContent: {
    flex: 1,
  },
  impactTitle: {
    fontSize: fs(16),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing(4),
  },
  impactDescription: {
    fontSize: fs(14),
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: spacing(8),
  },
  impactStats: {
    flexDirection: 'row',
    gap: spacing(16),
    flexWrap: 'wrap',
  },
  impactStat: {
    fontSize: fs(12),
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
  },
  logoutButton: {
    backgroundColor: 'white',
    borderRadius: spacing(12),
    padding: spacing(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_SIZE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutText: {
    fontSize: fs(16),
    fontWeight: '500',
    color: '#dc2626',
    fontFamily: 'Inter-Medium',
    marginLeft: spacing(8),
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing(20),
  },
  footerText: {
    fontSize: fs(12),
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
});
