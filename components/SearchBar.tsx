/**
 * SearchBar Component
 * Search bar for finding scrap services and categories
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import { Search, X, ChevronRight } from 'lucide-react-native';
import { scrapData } from '../data/scrapData';
import { services } from '../app/(tabs)/services';
import { useRouter } from 'expo-router';
import { wp, hp, fs, spacing } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeContext';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  type: 'scrap' | 'service';
  image?: any;
}

export default function SearchBar() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    const addedIds = new Set<string>(); // Prevent duplicates

    // Search across scrap categories and items
    scrapData.forEach((category) => {
      category.items.forEach((item) => {
        const itemId = `scrap-${category.id}-${item.name}`;
        
        // Check if already added and if matches search criteria
        if (
          !addedIds.has(itemId) &&
          (item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          category.title.toLowerCase().includes(lowerQuery))
        ) {
          addedIds.add(itemId);
          results.push({
            id: itemId,
            name: item.name,
            description: item.description,
            category: category.title,
            categoryIcon: category.icon,
            categoryColor: category.color,
            type: 'scrap',
            image: item.image,
          });
        }
      });
    });

    // Search across services
    services.forEach((service) => {
      const serviceId = `service-${service.id}`;
      
      if (
        !addedIds.has(serviceId) &&
        (service.title.toLowerCase().includes(lowerQuery) ||
        service.description.toLowerCase().includes(lowerQuery))
      ) {
        addedIds.add(serviceId);
        results.push({
          id: serviceId,
          name: service.title,
          description: service.description,
          category: 'Services',
          categoryIcon: '🛠️',
          categoryColor: '#16a34a',
          type: 'service',
        });
      }
    });

    setSearchResults(results);
  }, []);

  const handleSelectResult = useCallback((result: SearchResult) => {
    if (isNavigating) return; // Prevent multiple taps
    
    setIsNavigating(true);
    Keyboard.dismiss();
    setIsFocused(false);
    setSearchQuery('');
    setSearchResults([]);
    
    if (result.type === 'service') {
      // Navigate to services screen
      const serviceId = result.id.replace('service-', '');
      router.push(`/services/${serviceId}` as any);
    } else {
      // Navigate to sell tab with pre-selected item
      router.push({
        pathname: '/(tabs)/sell',
        params: {
          preSelectedItem: result.name,
          preSelectedCategory: result.category,
        }
      } as any);
    }
    
    // Reset navigation state after a delay
    setTimeout(() => setIsNavigating(false), 1000);
  }, [isNavigating, router]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const handleCloseModal = useCallback(() => {
    Keyboard.dismiss();
    setIsFocused(false);
    setSearchQuery('');
    setSearchResults([]);
    setIsNavigating(false);
  }, []);

  const popularSearches = [
    { 
      label: 'Paper', 
      color: '#10b981',
      image: require('../assets/images/Scrap Rates Photos/Newspaper.jpg'),
      category: 'Types of Paper Scrap'
    },
    { 
      label: 'Plastic', 
      color: '#3b82f6',
      image: require('../assets/images/Scrap Rates Photos/Plastics.jpg'),
      category: 'Types of Plastic Scrap'
    },
    { 
      label: 'Metal', 
      color: '#f59e0b',
      image: require('../assets/images/Scrap Rates Photos/Iron.jpg'),
      category: 'Types of Metal Scrap'
    },
    { 
      label: 'Electronics', 
      color: '#8b5cf6',
      image: require('../assets/images/Scrap Rates Photos/Laptops.jpg'),
      category: 'Types of Electronic Scrap'
    },
  ];

  return (
    <>
      {/* Search Input */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => setIsFocused(true)}
        activeOpacity={0.85}
      >
        <View style={styles.searchIconContainer}>
          <Search size={18} color="#16a34a" strokeWidth={2.5} />
        </View>
        <Text style={styles.placeholderText}>Search scrap items & services...</Text>
      </TouchableOpacity>

      {/* Search Modal */}
      <Modal
        visible={isFocused}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Search Header */}
          <View style={[styles.searchHeader, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
            <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search scrap items & services..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseModal}
            >
              <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.resultsContainer}>
            {searchQuery.length === 0 ? (
              /* Popular Searches */
              <View style={styles.popularContainer}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Popular Searches</Text>
                <View style={styles.popularGrid}>
                  {popularSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.popularChip,
                        { backgroundColor: colors.card, borderColor: item.color + '40' },
                      ]}
                      onPress={() => {
                        if (isNavigating) return;
                        setIsNavigating(true);
                        Keyboard.dismiss();
                        setIsFocused(false);
                        setSearchQuery('');
                        router.push({
                          pathname: '/(tabs)/sell',
                          params: {
                            preSelectedCategory: item.category,
                          }
                        } as any);
                        setTimeout(() => setIsNavigating(false), 1000);
                      }}
                    >
                      <Image
                        source={item.image}
                        style={styles.popularImage}
                        resizeMode="cover"
                      />
                      <Text style={[styles.popularLabel, { color: colors.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Services Section */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>
                  Our Services
                </Text>
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.serviceItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => {
                      if (isNavigating) return;
                      setIsNavigating(true);
                      Keyboard.dismiss();
                      setIsFocused(false);
                      router.push(`/services/${service.id}`);
                      setTimeout(() => setIsNavigating(false), 1000);
                    }}
                  >
                    <View style={[styles.serviceIconContainer, { backgroundColor: colors.primaryLight + '30' }]}>
                      <service.icon size={22} color={service.color} strokeWidth={2.5} />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={[styles.serviceTitle, { color: colors.text }]}>{service.title}</Text>
                      <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>{service.description}</Text>
                    </View>
                    <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2} />
                  </TouchableOpacity>
                ))}

                {/* Scrap Categories */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>
                  Browse Categories
                </Text>
                {scrapData.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryItem, { backgroundColor: colors.card }]}
                    onPress={() => {
                      if (isNavigating) return;
                      setIsNavigating(true);
                      Keyboard.dismiss();
                      setIsFocused(false);
                      setSearchQuery('');
                      router.push({
                        pathname: '/(tabs)/sell',
                        params: {
                          preSelectedCategory: category.title,
                        }
                      } as any);
                      setTimeout(() => setIsNavigating(false), 1000);
                    }}
                  >
                    {category.items[0]?.image && (
                      <Image
                        source={category.items[0].image}
                        style={styles.categoryImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.categoryInfo}>
                      <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                      <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                        {category.items.length} items
                      </Text>
                    </View>
                    <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : searchResults.length > 0 ? (
              /* Search Results */
              <View style={styles.resultsContent}>
                <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}{' '}
                  found
                </Text>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    style={[styles.resultItem, { backgroundColor: colors.card }]}
                    onPress={() => handleSelectResult(result)}
                  >
                    {result.type === 'scrap' && result.image ? (
                      <Image
                        source={result.image}
                        style={styles.resultImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.resultIcon,
                          { backgroundColor: result.categoryColor + '20' },
                        ]}
                      >
                        <Text style={styles.resultEmoji}>
                          {result.categoryIcon}
                        </Text>
                      </View>
                    )}
                    <View style={styles.resultInfo}>
                      <Text style={[styles.resultName, { color: colors.text }]}>{result.name}</Text>
                      <Text style={[styles.resultDescription, { color: colors.textSecondary }]}>
                        {result.description}
                      </Text>
                      <Text
                        style={[
                          styles.resultCategory,
                          { color: result.categoryColor },
                        ]}
                      >
                        {result.category}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : searchResults.length > 0 ? (
              /* Search Results */
              <View style={styles.resultsContent}>
                <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}{' '}
                  found
                </Text>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    style={[styles.resultItem, { backgroundColor: colors.card }]}
                    onPress={() => handleSelectResult(result)}
                  >
                    {result.type === 'scrap' && result.image ? (
                      <Image
                        source={result.image}
                        style={styles.resultImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.resultIcon,
                          { backgroundColor: result.categoryColor + '20' },
                        ]}
                      >
                        <Text style={styles.resultEmoji}>
                          {result.categoryIcon}
                        </Text>
                      </View>
                    )}
                    <View style={styles.resultInfo}>
                      <Text style={[styles.resultName, { color: colors.text }]}>{result.name}</Text>
                      <Text style={[styles.resultDescription, { color: colors.textSecondary }]}>
                        {result.description}
                      </Text>
                      <Text
                        style={[
                          styles.resultCategory,
                          { color: result.categoryColor },
                        ]}
                      >
                        {result.category}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              /* No Results */
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={[styles.noResultsText, { color: colors.text }]}>No results found</Text>
                <Text style={[styles.noResultsSubtext, { color: colors.textSecondary }]}>
                  Try searching for paper, plastic, metal, electronics, or services
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(12),
    gap: spacing(10),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIconContainer: {
    width: wp(8.5),
    height: wp(8.5),
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  placeholderText: {
    fontSize: fs(13),
    color: '#6b7280',
    flex: 1,
    fontWeight: '600',
  },
  searchBadge: {
    width: wp(7.5),
    height: wp(7.5),
    backgroundColor: '#fef3c7',
    borderRadius: wp(3.75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBadgeText: {
    fontSize: fs(14),
  },
  modalContainer: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(16),
    paddingTop: Platform.OS === 'ios' ? spacing(50) : spacing(16),
    paddingBottom: spacing(12),
    borderBottomWidth: 1,
    gap: spacing(12),
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing(12),
    paddingVertical: Platform.OS === 'android' ? spacing(8) : spacing(10),
    gap: spacing(8),
  },
  searchInput: {
    flex: 1,
    fontSize: fs(15),
    ...Platform.select({
      android: {
        paddingVertical: 0,
      },
    }),
  },
  cancelButton: {
    paddingHorizontal: spacing(8),
  },
  cancelText: {
    fontSize: fs(15),
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  popularContainer: {
    padding: spacing(20),
  },
  sectionTitle: {
    fontSize: fs(14),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing(16),
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing(12),
  },
  popularChip: {
    width: '48%', // Ensures 2x2 grid on all devices
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(16),
    borderRadius: 16,
    borderWidth: 1.5,
    gap: spacing(10),
    minHeight: hp(15), // Ensures consistent height
  },
  popularImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  popularIcon: {
    fontSize: fs(18),
  },
  popularLabel: {
    fontSize: fs(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(16),
    borderRadius: 12,
    marginBottom: spacing(12),
    gap: spacing(12),
  },
  categoryImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  categoryIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: fs(24),
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: fs(15),
    fontWeight: '600',
    marginBottom: spacing(4),
  },
  categoryCount: {
    fontSize: fs(13),
  },
  resultsContent: {
    padding: spacing(20),
  },
  resultsCount: {
    fontSize: fs(14),
    fontWeight: '500',
    marginBottom: spacing(16),
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing(16),
    borderRadius: 12,
    marginBottom: spacing(12),
    gap: spacing(12),
  },
  resultIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: fs(24),
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: fs(16),
    fontWeight: '600',
    marginBottom: spacing(4),
  },
  resultDescription: {
    fontSize: fs(13),
    marginBottom: spacing(6),
  },
  resultCategory: {
    fontSize: fs(12),
    fontWeight: '600',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  noResultsEmoji: {
    fontSize: fs(64),
    marginBottom: spacing(16),
  },
  noResultsText: {
    fontSize: fs(18),
    fontWeight: '600',
    marginBottom: spacing(8),
  },
  noResultsSubtext: {
    fontSize: fs(14),
    textAlign: 'center',
    paddingHorizontal: spacing(40),
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(16),
    borderRadius: 12,
    marginBottom: spacing(10),
    gap: spacing(12),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIconContainer: {
    width: wp(11),
    height: wp(11),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: fs(15),
    fontWeight: '600',
    marginBottom: spacing(3),
  },
  serviceDescription: {
    fontSize: fs(13),
    lineHeight: fs(18),
  },
  resultImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
});
