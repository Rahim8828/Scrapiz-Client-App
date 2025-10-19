
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
  Coins,
  User,
} from 'lucide-react-native';
import { services } from './services';

const serviceGradients = {
  demolition: ['#16a34a', '#15803d'] as const,
  dismantling: ['#16a34a', '#15803d'] as const,
  'paper-shredding': ['#16a34a', '#15803d'] as const,
  'society-tieup': ['#15803d', '#166534'] as const,
  'junk-removal': ['#16a34a', '#15803d'] as const,
} as const;
import { useRouter } from 'expo-router';
import { scrapData } from '../../data/scrapData';
import { LinearGradient } from 'expo-linear-gradient';
import { mockOrders, getStatusColor, getStatusText } from '../../data/orderData';
import Carousel from '@/components/Carousel';
import AppHeader from '@/components/AppHeader';
import SearchBar from '@/components/SearchBar';
import LocationSelector from '@/components/LocationSelector';

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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Combined Header Section with Green Background */}
        <LinearGradient 
          colors={['#16a34a', '#15803d', '#166534']} 
          style={styles.headerSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative circles */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
          
          {/* Top Row: Location & Profile */}
          <View style={styles.topRow}>
            {/* Location Selector */}
            <View style={styles.locationContainer}>
              <LocationSelector />
            </View>

            {/* Right Side: Profile */}
            <View style={styles.rightContainer}>
              {/* Coins Badge - Hidden for future use */}
              {/* <TouchableOpacity 
                style={styles.coinsContainer}
                activeOpacity={0.7}
                onPress={() => router.push('/profile/rewards-wallet' as any)}
              >
                <View style={styles.coinsIconWrapper}>
                  <Coins size={16} color="#f59e0b" strokeWidth={2.8} />
                </View>
                <Text style={styles.coinsText}>120</Text>
              </TouchableOpacity> */}

              {/* Profile Icon */}
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push('/(tabs)/profile')}
                activeOpacity={0.7}
              >
                <View style={styles.profileIconWrapper}>
                  <User size={20} color="#16a34a" strokeWidth={2.8} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <SearchBar />
          </View>
        </LinearGradient>

        <Carousel />

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>Popular</Text>
          </View>
        </View>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/(tabs)/sell')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#16a34a', '#15803d']}
              style={styles.actionCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'white' }]}>
                <PackagePlus size={22} color="#16a34a" strokeWidth={2.5} />
              </View>
              <Text style={[styles.actionTitle, {color: 'white'}]}>Sell Scrap</Text>
              <Text style={[styles.actionSubtitle, {color: '#d1fae5'}]}>Schedule pickup</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/(tabs)/rates')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0ea5e9', '#0284c7']}
              style={styles.actionCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'white' }]}>
                <AreaChart size={22} color="#0ea5e9" strokeWidth={2.5} />
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
          colors={['#ecfdf5', '#d1fae5']}
          style={styles.tipCard}
        >
          <View style={styles.tipIconContainer}>
            <Lightbulb size={24} color="#059669" />
          </View>
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
        <TouchableOpacity 
          style={styles.referCard} 
          onPress={() => handleNavigate('/profile/refer-friends')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#fef3c7', '#fde68a']}
            style={styles.referCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.referIconContainer}>
              <Gift size={28} color="#f59e0b" strokeWidth={2.5} />
            </View>
            <View style={styles.referTextContainer}>
              <Text style={styles.referTitle}>Refer & Earn Rewards 🎁</Text>
              <Text style={styles.referSubtitle}>Share with friends and earn ₹20 per referral!</Text>
            </View>
            <ChevronRight size={20} color="#f59e0b" strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, styles.impactSection]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your Impact 🌍</Text>
        </View>
        <LinearGradient
          colors={['#10b981', '#059669', '#047857']}
          style={styles.impactCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.impactIconContainer}>
            <Text style={styles.impactEmoji}>🌱</Text>
          </View>
          <View style={styles.impactTextContainer}>
            <Text style={styles.impactText}>
              You've helped save{' '}
              <Text style={styles.impactHighlight}>124 trees</Text> and reduced{' '}
              <Text style={styles.impactHighlight}>340kg CO₂</Text> emissions this year!
            </Text>
            <View style={styles.impactStats}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>🌳 +124</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>♻️ 340kg</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Branding Section */}
      <View style={styles.brandingSection}>
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155']}
          style={styles.brandingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative Elements */}
          <View style={styles.brandingCircle1} />
          <View style={styles.brandingCircle2} />
          
          <View style={styles.brandingContent}>
            <View style={styles.brandingBadge}>
              <Text style={styles.brandingBadgeText}>🇮🇳 INDIA'S #1</Text>
            </View>
            
            <Text style={styles.brandingTagline}>Online Scrap</Text>
            <Text style={styles.brandingTagline}>Selling Platform</Text>
            
            <View style={styles.brandingDivider} />
            
            <View style={styles.brandingLogoContainer}>
              <Text style={styles.brandingLogo}>Scrapiz</Text>
              <Text style={styles.brandingRegistered}>®</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  // New consolidated header section
  headerSection: {
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -60,
    right: -60,
    opacity: 0.6,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -40,
    left: -40,
    opacity: 0.5,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 40,
    left: 100,
    opacity: 0.4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationContainer: {
    // Don't let location take the full row; allow it to shrink
    flexGrow: 0,
    flexShrink: 1,
    marginRight: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  coinsIconWrapper: {
    width: 26,
    height: 26,
    backgroundColor: '#fef3c7',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: -0.3,
  },
  profileButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(22, 163, 74, 0.15)',
    marginLeft: 4,
  },
  profileIconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    marginBottom: 8,
  },
  greetingContainer: {
    paddingTop: 4,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waveEmoji: {
    fontSize: 16,
  },
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
    marginTop: -10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#f0fdf4',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
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
    fontSize: 13,
    color: '#d1fae5',
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f59e0b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
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
    width: 48,
    height: 48,
    marginBottom: 10,
    borderRadius: 24,
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
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  actionCardGradient: {
    padding: 18,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
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
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  impactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  impactEmoji: {
    fontSize: 32,
  },
  impactTextContainer: {
    flex: 1,
  },
  impactText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 12,
  },
  impactHighlight: {
    fontWeight: '800',
    color: '#ffffff',
    fontSize: 16,
  },
  impactStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  statBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  referCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  referCardGradient: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  referIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  referTextContainer: {
    flex: 1,
    marginHorizontal: 14,
  },
  referTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
    fontFamily: 'Inter-Bold',
    marginBottom: 3,
  },
  referSubtitle: {
    fontSize: 12,
    color: '#b45309',
    fontFamily: 'Inter-Medium',
  },
  tipCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tipTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#065f46',
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  // Branding Section
    brandingSection: {
      marginTop: 0,
      marginBottom: 20,
      marginHorizontal: 20,
      overflow: 'hidden',
      borderRadius: 24,
    },
    brandingGradient: {
      paddingVertical: 40,
      paddingHorizontal: 24,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 24,
    },
    brandingCircle1: {
      position: 'absolute',
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      top: -100,
      right: -80,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    brandingCircle2: {
      position: 'absolute',
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: 'rgba(59, 130, 246, 0.06)',
      bottom: -80,
      left: -60,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.12)',
    },
    brandingContent: {
      position: 'relative',
      zIndex: 1,
    },
    brandingBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 18,
      alignSelf: 'flex-start',
      marginBottom: 18,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    brandingBadgeText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#10b981',
      letterSpacing: 1.2,
    },
    brandingTagline: {
      fontSize: 32,
      fontWeight: '900',
      color: '#ffffff',
      textAlign: 'left',
      letterSpacing: -1,
      lineHeight: 40,
    },
    brandingDivider: {
      width: 70,
      height: 3,
      backgroundColor: '#10b981',
      borderRadius: 2,
      marginVertical: 18,
    },
    brandingLogoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  brandingLogo: {
    fontSize: 44,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: -1.5,
  },
  brandingRegistered: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
    marginLeft: 3,
    marginTop: -6,
  },
  brandingSubtext: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '600',
  },
  brandingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  brandingStat: {
    flex: 1,
    alignItems: 'center',
  },
  brandingStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 4,
  },
  brandingStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  },
  brandingStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
});
