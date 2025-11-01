import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { ArrowLeft, Bell, Truck, IndianRupee, MessageCircle, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    pickupReminders: true,
    orderUpdates: true,
    paymentAlerts: true,
    promotionalOffers: false,
    weeklyReports: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const notificationGroups = [
    {
      title: 'Order Notifications',
      items: [
        {
          key: 'pickupReminders',
          title: 'Pickup Reminders',
          subtitle: 'Get notified before scheduled pickups',
          icon: Truck,
          color: '#3b82f6',
        },
        {
          key: 'orderUpdates',
          title: 'Order Updates',
          subtitle: 'Status updates for your orders',
          icon: Bell,
          color: '#16a34a',
        },
        {
          key: 'paymentAlerts',
          title: 'Payment Alerts',
          subtitle: 'Payment confirmations and receipts',
          icon: IndianRupee,
          color: '#f59e0b',
        },
      ]
    },
    {
      title: 'Marketing & Updates',
      items: [
        {
          key: 'promotionalOffers',
          title: 'Promotional Offers',
          subtitle: 'Special deals and discounts',
          icon: Zap,
          color: '#8b5cf6',
        },
        {
          key: 'weeklyReports',
          title: 'Weekly Reports',
          subtitle: 'Your recycling impact summary',
          icon: MessageCircle,
          color: '#06b6d4',
        },
      ]
    },
    {
      title: 'Communication Preferences',
      items: [
        {
          key: 'emailNotifications',
          title: 'Email Notifications',
          subtitle: 'Receive notifications via email',
          icon: MessageCircle,
          color: '#dc2626',
        },
        {
          key: 'smsNotifications',
          title: 'SMS Notifications',
          subtitle: 'Receive notifications via SMS',
          icon: MessageCircle,
          color: '#059669',
        },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.masterToggle}>
          <View style={styles.masterToggleContent}>
            <Bell size={24} color="#16a34a" />
            <View style={styles.masterToggleText}>
              <Text style={styles.masterToggleTitle}>Push Notifications</Text>
              <Text style={styles.masterToggleSubtitle}>
                Enable or disable all push notifications
              </Text>
            </View>
          </View>
          <Switch
            value={settings.pushNotifications}
            onValueChange={(value) => updateSetting('pushNotifications', value)}
            trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
            thumbColor={settings.pushNotifications ? '#16a34a' : '#f3f4f6'}
          />
        </View>

        {notificationGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.notificationGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item) => (
              <View key={item.key} style={styles.notificationItem}>
                <View style={styles.notificationLeft}>
                  <View style={[styles.notificationIcon, { backgroundColor: `${item.color}20` }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Switch
                  value={settings[item.key as keyof typeof settings] as boolean}
                  onValueChange={(value) => updateSetting(item.key, value)}
                  trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
                  thumbColor={settings[item.key as keyof typeof settings] ? '#16a34a' : '#f3f4f6'}
                  disabled={!settings.pushNotifications}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Notifications</Text>
          <Text style={styles.infoText}>
            • Notifications help you stay updated on your orders{'\n'}
            • You can customize which notifications you receive{'\n'}
            • Turn off promotional offers to reduce marketing messages{'\n'}
            • Some critical notifications cannot be disabled
          </Text>
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
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 100 : 80,
  },
  masterToggle: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  masterToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  masterToggleText: {
    marginLeft: 16,
    flex: 1,
  },
  masterToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  masterToggleSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  notificationGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  notificationItem: {
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
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});
