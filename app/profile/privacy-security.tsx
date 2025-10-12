import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { ArrowLeft, Shield, Lock, Eye, Smartphone, Key, Trash2, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    biometricAuth: true,
    dataSharing: false,
    locationTracking: true,
    analyticsData: false,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This would navigate to change password screen in a real app.');
  };

  const handleTwoFactorAuth = () => {
    Alert.alert('Two-Factor Authentication', 'This would set up 2FA in a real app.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  const securityOptions = [
    {
      icon: Lock,
      title: 'Change Password',
      subtitle: 'Update your account password',
      action: handleChangePassword,
      color: '#3b82f6',
    },
    {
      icon: Key,
      title: 'Two-Factor Authentication',
      subtitle: 'Add an extra layer of security',
      action: handleTwoFactorAuth,
      color: '#16a34a',
    },
  ];

  const privacySettings = [
    {
      key: 'biometricAuth',
      title: 'Biometric Authentication',
      subtitle: 'Use fingerprint or face ID to unlock',
      icon: Smartphone,
      color: '#8b5cf6',
    },
    {
      key: 'locationTracking',
      title: 'Location Services',
      subtitle: 'Allow location access for pickup services',
      icon: Eye,
      color: '#f59e0b',
    },
    {
      key: 'dataSharing',
      title: 'Data Sharing',
      subtitle: 'Share usage data with partners',
      icon: Shield,
      color: '#06b6d4',
    },
    {
      key: 'analyticsData',
      title: 'Analytics Data',
      subtitle: 'Help improve app performance',
      icon: Eye,
      color: '#ec4899',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          {securityOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionItem} onPress={option.action}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                  <option.icon size={20} color={option.color} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          {privacySettings.map((setting) => (
            <View key={setting.key} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${setting.color}20` }]}>
                  <setting.icon size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={settings[setting.key as keyof typeof settings] as boolean}
                onValueChange={(value) => updateSetting(setting.key, value)}
                trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
                thumbColor={settings[setting.key as keyof typeof settings] ? '#16a34a' : '#f3f4f6'}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <View style={styles.dangerLeft}>
              <View style={styles.dangerIcon}>
                <Trash2 size={20} color="#dc2626" />
              </View>
              <View style={styles.dangerContent}>
                <Text style={styles.dangerTitle}>Delete Account</Text>
                <Text style={styles.dangerSubtitle}>Permanently delete your account and data</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Privacy Matters</Text>
          <Text style={styles.infoText}>
            We take your privacy seriously. Your personal data is encrypted and stored securely. 
            You have full control over what information you share with us.
          </Text>
          <TouchableOpacity style={styles.privacyPolicyButton}>
            <Text style={styles.privacyPolicyText}>Read Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  optionItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  dangerItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dangerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerContent: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  dangerSubtitle: {
    fontSize: 12,
    color: '#991b1b',
    fontFamily: 'Inter-Regular',
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0c4a6e',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  privacyPolicyButton: {
    alignSelf: 'flex-start',
  },
  privacyPolicyText: {
    fontSize: 14,
    color: '#0369a1',
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
});
