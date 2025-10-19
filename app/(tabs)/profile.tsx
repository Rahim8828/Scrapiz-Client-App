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
} from 'react-native';
import { User, MapPin, Bell, Shield, CircleHelp as HelpCircle, Star, Gift, ChevronRight, Award, LogOut, Phone, Mail, Package, Clock, CheckCircle, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { mockOrders, getStatusColor, getStatusText, type Order } from '../../data/orderData';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../../contexts/ProfileContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

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
  const { profile, loadProfile, isLoading } = useProfile();

  // Reload profile when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

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
        // TODO: Upload to server and update profile context
        // For now, we'll just show a success message
        Alert.alert(
          'Profile Photo',
          'Profile photo will be updated once you save changes in Edit Profile.',
          [{ text: 'OK' }]
        );
        // You can add logic here to temporarily store the image URI
        // and navigate to edit-profile screen to save it
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
          onPress: () => {
            router.replace('/(auth)/login');
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#16a34a', '#15803d']}
          style={styles.header}
        >
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
                <Plus size={16} color="#16a34a" strokeWidth={3} />
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
          <Text style={styles.sectionTitle}>{section.section}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity 
              key={itemIndex} 
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <item.icon size={20} color="#6b7280" />
                </View>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                {item.hasSwitch ? (
                  <Switch
                    value={item.switchValue}
                    onValueChange={item.onSwitchChange}
                    trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
                    thumbColor={item.switchValue ? '#16a34a' : '#f3f4f6'}
                  />
                ) : (
                  <ChevronRight size={16} color="#d1d5db" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Environmental Impact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Impact</Text>
        <View style={styles.impactCard}>
          <Text style={styles.impactEmoji}>🌱</Text>
          <View style={styles.impactContent}>
            <Text style={styles.impactTitle}>Great Job!</Text>
            <Text style={styles.impactDescription}>
              You've recycled {profileData.totalRecycled}kg of waste, helping save the environment!
            </Text>
            <View style={styles.impactStats}>
              <Text style={styles.impactStat}>🌳 124 trees saved</Text>
              <Text style={styles.impactStat}>💨 340kg CO₂ reduced</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
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
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'white',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  menuItemRight: {
    marginLeft: 12,
  },
  impactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  impactEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  impactContent: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  impactStats: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  impactStat: {
    fontSize: 12,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
  },
  logoutButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
});
