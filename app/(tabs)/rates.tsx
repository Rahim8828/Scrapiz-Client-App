import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { TrendingUp, CircleAlert as AlertCircle, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { scrapData } from '../../data/scrapData';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RatesScreen() {
  const router = useRouter();

  const renderCategorySection = (category: typeof scrapData[0]) => {
    return (
      <View key={category.id} style={styles.categorySection}>
        <LinearGradient
          colors={['#16a34a', '#15803d']}
          style={styles.categoryHeader}
        >
          <Text style={styles.categoryTitle}>
            {category.title}
          </Text>
        </LinearGradient>
        
        <View style={styles.itemsGrid}>
          {category.items.map((item, index) => (
            <View key={index} style={styles.rateItem}>
              <View style={[styles.itemIcon, item.image ? {} : { backgroundColor: category.color }]}>
                {item.image ? (
                  <Image source={item.image} style={styles.itemImage} />
                ) : (
                  <Text style={styles.itemEmoji}>{category.icon}</Text>
                )}
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemRate}>{item.rate}</Text>
              <Text style={styles.itemUnit}>Per kg</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <LinearGradient
        colors={['#16a34a', '#15803d']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scrap Rates</Text>
        <View style={styles.headerRight}>
          <TrendingUp size={24} color="white" />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <AlertCircle size={20} color="#16a34a" />
            <Text style={styles.disclaimerTitle}>Important Note</Text>
          </View>
          <Text style={styles.disclaimerText}>
            The prices shown are for reference only. Actual rates may vary based on:
          </Text>
          <View style={styles.disclaimerList}>
            <Text style={styles.disclaimerItem}>• Current market conditions</Text>
            <Text style={styles.disclaimerItem}>• Quality and quantity of materials</Text>
            <Text style={styles.disclaimerItem}>• Location and transportation costs</Text>
            <Text style={styles.disclaimerItem}>• Seasonal demand fluctuations</Text>
          </View>
          <Text style={styles.disclaimerFooter}>
            Contact us for accurate pricing based on your specific materials.
          </Text>
        </View>

        {/* Last Updated */}
        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
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
          <Text style={styles.trendsTitle}>Market Trends</Text>
          <View style={styles.trendsCard}>
            <View style={styles.trendItem}>
              <View style={[styles.trendIndicator, { backgroundColor: '#16a34a' }]} />
              <Text style={styles.trendText}>Metal prices trending downwards</Text>
            </View>
            <View style={styles.trendItem}>
              <View style={[styles.trendIndicator, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.trendText}>Paper rates stable this month</Text>
            </View>
            <View style={styles.trendItem}>
              <View style={[styles.trendIndicator, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.trendText}>Electronics demand increasing</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need Accurate Pricing?</Text>
          <Text style={styles.contactText}>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 100 : 80,
  },
  disclaimerCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  disclaimerList: {
    marginBottom: 12,
  },
  disclaimerItem: {
    fontSize: 13,
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 4,
  },
  disclaimerFooter: {
    fontSize: 13,
    color: '#166534',
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  lastUpdated: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  rateItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemEmoji: {
    fontSize: 48,
  },
  itemImage: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemRate: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
    color: '#16a34a',
  },
  itemUnit: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'Inter-regular',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 14,
  },
  trendsSection: {
    marginBottom: 24,
  },
  trendsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  trendsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  trendText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
  },
  contactSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 280,
  },
  contactButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});
