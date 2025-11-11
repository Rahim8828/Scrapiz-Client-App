import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { TrendingUp, CircleAlert as AlertCircle, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { scrapData } from '../../data/scrapData';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, fs } from '../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

export default function RatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const renderCategorySection = (category: typeof scrapData[0]) => {
    return (
      <View key={category.id} style={styles.categorySection}>
        <LinearGradient
          colors={isDark ? ['#22c55e', '#16a34a'] : ['#16a34a', '#15803d']}
          style={styles.categoryHeader}
        >
          <Text style={styles.categoryTitle}>
            {category.title}
          </Text>
        </LinearGradient>
        
        <View style={styles.itemsGrid}>
          {category.items.map((item, index) => (
            <View key={index} style={[styles.rateItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[
                styles.itemIcon, 
                item.image ? { 
                  backgroundColor: isDark ? colors.surface : '#ffffff',
                  borderWidth: 2,
                  borderColor: colors.border,
                  overflow: 'hidden'
                } : { backgroundColor: category.color }
              ]}>
                {item.image ? (
                  <Image source={item.image} style={styles.itemImage} />
                ) : (
                  <Text style={styles.itemEmoji}>{category.icon}</Text>
                )}
              </View>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemRate, { color: colors.primary }]}>{item.rate}</Text>
              <Text style={[styles.itemUnit, { color: colors.textSecondary }]}>Per kg</Text>
              <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#22c55e', '#16a34a'] : ['#16a34a', '#15803d']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={fs(24)} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scrap Rates</Text>
        <View style={styles.headerRight}>
          <TrendingUp size={fs(24)} color="white" />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Disclaimer */}
        <View style={[styles.disclaimerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.disclaimerHeader}>
            <AlertCircle size={fs(20)} color={colors.primary} />
            <Text style={[styles.disclaimerTitle, { color: colors.text }]}>Important Note</Text>
          </View>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            The prices shown are for reference only. Actual rates may vary based on:
          </Text>
          <View style={styles.disclaimerList}>
            <Text style={[styles.disclaimerItem, { color: colors.textSecondary }]}>• Current market conditions</Text>
            <Text style={[styles.disclaimerItem, { color: colors.textSecondary }]}>• Quality and quantity of materials</Text>
            <Text style={[styles.disclaimerItem, { color: colors.textSecondary }]}>• Location and transportation costs</Text>
            <Text style={[styles.disclaimerItem, { color: colors.textSecondary }]}>• Seasonal demand fluctuations</Text>
          </View>
          <Text style={[styles.disclaimerFooter, { color: colors.textSecondary }]}>
            Contact us for accurate pricing based on your specific materials.
          </Text>
        </View>

        {/* Last Updated */}
        <View style={[styles.lastUpdated, { backgroundColor: colors.card }]}>
          <Text style={[styles.lastUpdatedText, { color: colors.textSecondary }]}>
            Last updated: {new Date().toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </View>

        {/* Rate Categories */}
        {scrapData.map((category) => 
          renderCategorySection(category)
        )}

        {/* Market Trends */}
        <View style={styles.trendsSection}>
          <Text style={[styles.trendsTitle, { color: colors.text }]}>Market Trends</Text>
          <View style={[styles.trendsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.trendItem}>
              <View style={[styles.trendIndicator, { backgroundColor: '#16a34a' }]} />
              <Text style={[styles.trendText, { color: colors.textSecondary }]}>Metal prices trending downwards</Text>
            </View>
            <View style={styles.trendItem}>
              <View style={[styles.trendIndicator, { backgroundColor: '#f59e0b' }]} />
              <Text style={[styles.trendText, { color: colors.textSecondary }]}>Paper rates stable this month</Text>
            </View>
            <View style={styles.trendItem}>
              <View style={[styles.trendIndicator, { backgroundColor: '#3b82f6' }]} />
              <Text style={[styles.trendText, { color: colors.textSecondary }]}>Electronics demand increasing</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={[styles.contactSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>Need Accurate Pricing?</Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            Get real-time quotes for your specific materials by scheduling a pickup.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push('/sell')}
          >
            <Text style={styles.contactButtonText}>Schedule Pickup</Text>
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
    paddingTop: hp(6.5), // Reduced from 7.4
    paddingHorizontal: wp(4.5), // Reduced from 5.3
    paddingBottom: hp(2), // Reduced from 2.5
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: wp(9.5), // Reduced from 10.7
    height: wp(9.5), // Reduced from 10.7
    borderRadius: wp(4.75), // Reduced from 5.3
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fs(18), // Reduced from 20
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  headerRight: {
    width: wp(9.5), // Reduced from 10.7
    height: wp(9.5), // Reduced from 10.7
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: wp(5.3), // 20
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? hp(12.3) : hp(9.9), // 100 : 80
  },
  disclaimerCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: wp(4.3), // Reduced from 5.3
    marginBottom: hp(2), // Reduced from 2.5
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2), // Reduced from 1.5
  },
  disclaimerTitle: {
    fontSize: fs(15), // Reduced from 16
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginLeft: wp(2.1), // 8
  },
  disclaimerText: {
    fontSize: fs(13), // Reduced from 14
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: hp(2.2), // Reduced from 2.5
    marginBottom: hp(1.2), // Reduced from 1.5
  },
  disclaimerList: {
    marginBottom: hp(1.2), // Reduced from 1.5
  },
  disclaimerItem: {
    fontSize: fs(12), // Reduced from 13
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: hp(2), // Reduced from 2.2
    marginBottom: hp(0.4), // Reduced from 0.5
  },
  disclaimerFooter: {
    fontSize: fs(12), // Reduced from 13
    color: '#166534',
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  lastUpdated: {
    alignItems: 'center',
    marginBottom: hp(3), // 24
  },
  lastUpdatedText: {
    fontSize: fs(12), // 12
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  categorySection: {
    marginBottom: hp(3.9), // 32
  },
  categoryHeader: {
    borderRadius: 12,
    padding: wp(4.3), // 16
    marginBottom: hp(2), // 16
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: fs(18), // 18
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rateItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: wp(3.5), // Reduced from 4.3 (16 -> 13)
    width: '48%', // 48% width for 2 columns with space between
    alignItems: 'center',
    marginBottom: hp(1.5), // 12
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: {
    width: wp(22), // Reduced from 25.6 (96 -> 82)
    height: wp(22), // Reduced from 25.6
    borderRadius: wp(3), // Rounded square instead of circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.2), // Reduced from 1.5
  },
  itemEmoji: {
    fontSize: fs(42), // Reduced from 48
  },
  itemImage: {
    width: wp(22), // Reduced from 25.6
    height: wp(22), // Reduced from 25.6
    resizeMode: 'contain',
    borderRadius: wp(3), // Rounded square instead of circle
  },
  itemName: {
    fontSize: fs(13), // Reduced from 14
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: hp(0.5), // 4
  },
  itemRate: {
    fontSize: fs(15), // Reduced from 16
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: hp(0.2), // 2
    color: '#16a34a',
  },
  itemUnit: {
    fontSize: fs(10), // Reduced from 11
    color: '#6b7280',
    fontFamily: 'Inter-regular',
    marginBottom: hp(0.8), // Reduced from 1
  },
  itemDescription: {
    fontSize: fs(10), // Reduced from 11
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: hp(1.5), // Reduced from 1.7
  },
  trendsSection: {
    marginBottom: hp(2.5), // Reduced from 3
  },
  trendsTitle: {
    fontSize: fs(16), // Reduced from 18
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: hp(1.5), // Reduced from 2
  },
  trendsCard: {
    borderRadius: 16,
    padding: wp(4.3), // Reduced from 5.3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2), // Reduced from 1.5
  },
  trendIndicator: {
    width: wp(2.1), // 8
    height: wp(2.1), // 8
    borderRadius: wp(1.1), // 4
    marginRight: wp(3.2), // 12
  },
  trendText: {
    fontSize: fs(13), // Reduced from 14
    fontFamily: 'Inter-Regular',
  },
  contactSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: wp(5), // Reduced from 6.4
    alignItems: 'center',
    marginBottom: hp(2), // Reduced from 2.5
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactTitle: {
    fontSize: fs(16), // Reduced from 18
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: hp(0.8), // Reduced from 1
    textAlign: 'center',
  },
  contactText: {
    fontSize: fs(13), // Reduced from 14
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: hp(2.2), // Reduced from 2.5
    marginBottom: hp(2), // Reduced from 2.5
    maxWidth: wp(74.7), // 280
  },
  contactButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingHorizontal: wp(5.5), // Reduced from 6.4
    paddingVertical: hp(1.2), // Reduced from 1.5
  },
  contactButtonText: {
    fontSize: fs(15), // Reduced from 16
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});