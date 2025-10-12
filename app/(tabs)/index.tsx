
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {
  TrendingUp,
  ChevronRight,
  PackagePlus,
  AreaChart,
  Gift,
  Lightbulb,
  MapPin,
} from 'lucide-react-native';
import { services } from './services';

const serviceGradients = {
  demolition: ['#dc2626', '#b91c1c'] as const,
  dismantling: ['#ea580c', '#c2410c'] as const,
  'paper-shredding': ['#0891b2', '#0e7490'] as const,
  'society-tieup': ['#7c3aed', '#6d28d9'] as const,
  'junk-removal': ['#059669', '#047857'] as const,
} as const;
import { useRouter } from 'expo-router';
import { scrapData } from '../../data/scrapData';
import { LinearGradient } from 'expo-linear-gradient';
import { mockOrders, getStatusColor, getStatusText } from '../../data/orderData';
import Carousel from '@/components/Carousel';

const { width } = Dimensions.get('window');

const getHomeRateItems = () => {
  return scrapData.slice(0, 4).map(category => {
    const firstItem = category.items[0];
    return {
      id: firstItem.name.toLowerCase().replace(/\s+/g, '-'),
      name: firstItem.name,
      rate: firstItem.rate,
      image: firstItem.image,
      color: category.color,
      categoryId: category.id,
    };
  });
};

const homeRateItems = getHomeRateItems();

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  return 'Good evening!';
};

const tips = [
  'Recycling one aluminum can saves enough energy to run a TV for 3 hours.',
  'The U.S. throws away $11.4 billion worth of recyclable containers and packaging every year.',
  'Recycling plastic saves twice as much energy as burning it in an incinerator.',
  'Around 1 billion trees worth of paper are thrown away every year in the U.S.',
  'Glass is 100% recyclable and can be recycled endlessly without loss in quality or purity.',
];

export default function HomeScreen() {
  const router = useRouter();
  const userName = 'Anas Farooqui';
  const greeting = getGreeting();
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const handleNavigate = (path: string) => {
    router.push(path as any);
  };
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/profile/orders/${orderId}`);
  };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#16a34a', '#15803d']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
      </LinearGradient>

      <Carousel />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/(tabs)/sell')}
          >
            <LinearGradient
              colors={['#16a34a', '#15803d']}
              style={styles.actionCardGradient}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'white' }]}>
                <PackagePlus size={24} color="#16a34a" />
              </View>
              <Text style={[styles.actionTitle, {color: 'white'}]}>Sell Scrap</Text>
              <Text style={[styles.actionSubtitle, {color: '#d1fae5'}]}>Schedule pickup</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/(tabs)/rates')}
          >
            <LinearGradient
              colors={['#0ea5e9', '#0284c7']}
              style={styles.actionCardGradient}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'white' }]}>
                <AreaChart size={24} color="#0ea5e9" />
              </View>
              <Text style={[styles.actionTitle, {color: 'white'}]}>View Rates</Text>
              <Text style={[styles.actionSubtitle, {color: '#eff6ff'}]}>Today's prices</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Market Rates</Text>
          <TouchableOpacity onPress={() => handleNavigate('/(tabs)/rates')}>
            <TrendingUp size={16} color="#16a34a" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ratesScroll}
        >
          {homeRateItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.rateCard}
              onPress={() => handleNavigate('/(tabs)/rates')}
            >
              <Image source={item.image} style={styles.itemImage} />
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text
                style={[styles.categoryRate, { color: item.color }]}
              >
                {item.rate}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <LinearGradient
          colors={['#f0f9ff', '#e0f2fe']}
          style={styles.tipCard}
        >
          <Lightbulb size={24} color="#0284c7" />
            <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>Tip of the Day</Text>
                <Text style={styles.tipText}>
                  {randomTip}
                </Text>
            </View>
        </LinearGradient>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity
            onPress={() => handleNavigate('/(tabs)/services')}
          >
            <Text style={styles.moreServicesText}>More Services</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.servicesList}>
          {services.map(service => (
            <LinearGradient
              key={service.id}
              colors={serviceGradients[service.id as keyof typeof serviceGradients]}
              style={styles.serviceCard}
            >
              <TouchableOpacity
                style={styles.serviceCardTouchable}
                onPress={() => handleNavigate(`/services/${service.id}`)}
              >
                <View
                  style={[
                    styles.serviceIconContainer,
                    { backgroundColor: 'white' },
                  ]}
                >
                  <service.icon size={22} color={service.color} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceTitle, { color: 'white' }]}>{service.title}</Text>
                  <Text style={[styles.serviceDescription, { color: 'white' }]}>
                    {service.description}
                  </Text>
                </View>
                <ChevronRight size={18} color="#f1f5f9" />
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.referCard} onPress={() => handleNavigate('/profile/refer-friends')}>
            <LinearGradient
              colors={['#fffbeb', '#fef3c7']}
              style={styles.referCardGradient}
            >
              <Gift size={32} color="#f59e0b" />
              <View style={styles.referTextContainer}>
                  <Text style={styles.referTitle}>Refer & Earn</Text>
                  <Text style={styles.referSubtitle}>Share with friends and earn exciting rewards!</Text>
              </View>
              <ChevronRight size={20} color="#d4d4d8" />
            </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, styles.impactSection]}>
        <Text style={styles.sectionTitle}>Environmental Impact</Text>
        <LinearGradient
          colors={['#ecfdf5', '#a7f3d0']}
          style={styles.impactCard}
        >
          <Text style={styles.impactEmoji}>🌱</Text>
          <Text style={styles.impactText}>
            You've helped save{' '}
            <Text style={styles.impactHighlight}>124 trees</Text> and reduced{' '}
            <Text style={styles.impactHighlight}>340kg CO₂</Text> emissions this
            year!
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#d1fae5',
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  ratesScroll: {
    marginHorizontal: -8,
  },
  rateCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 32,
    height: 32,
    marginBottom: 8,
    borderRadius: 16,
  },
  categoryName: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryRate: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionCardGradient: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  moreServicesText: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  viewAllText: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceCardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  impactSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  impactCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  impactText: {
    flex: 1,
    fontSize: 14,
    color: '#065f46',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  impactHighlight: {
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  referCard: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  referCardGradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  referTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  referTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b45309',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  referSubtitle: {
    fontSize: 13,
    color: '#d97706',
    fontFamily: 'Inter-Regular',
  },
  tipCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#075985',
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
});
