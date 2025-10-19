/**
 * SearchBar Component
 * Search bar for finding scrap services and categories
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Search, X, ChevronRight } from 'lucide-react-native';
import { scrapData } from '../data/scrapData';
import { services } from '../app/(tabs)/services';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

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
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search across scrap categories and items
    scrapData.forEach((category) => {
      category.items.forEach((item) => {
        if (
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          category.title.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            id: `scrap-${category.id}-${item.name}`,
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
      if (
        service.title.toLowerCase().includes(lowerQuery) ||
        service.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: `service-${service.id}`,
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
  };

  const handleSelectResult = (result: SearchResult) => {
    setIsFocused(false);
    setSearchQuery('');
    setSearchResults([]);
    
    if (result.type === 'service') {
      const serviceId = result.id.replace('service-', '');
      router.push(`/services/${serviceId}`);
    } else {
      // Navigate to sell tab with the selected item
      router.push(`/(tabs)/sell?preSelectedItem=${encodeURIComponent(result.name)}&preSelectedCategory=${encodeURIComponent(result.category)}`);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const popularSearches = [
    { 
      label: 'Paper', 
      color: '#10b981',
      image: require('../assets/images/Scrap Rates Photos/Newspaper.jpg')
    },
    { 
      label: 'Plastic', 
      color: '#3b82f6',
      image: require('../assets/images/Scrap Rates Photos/Plastics.jpg')
    },
    { 
      label: 'Metal', 
      color: '#f59e0b',
      image: require('../assets/images/Scrap Rates Photos/Iron.jpg')
    },
    { 
      label: 'Electronics', 
      color: '#8b5cf6',
      image: require('../assets/images/Scrap Rates Photos/Laptops.jpg')
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
        onRequestClose={() => setIsFocused(false)}
      >
        <View style={styles.modalContainer}>
          {/* Search Header */}
          <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search scrap items & services..."
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsFocused(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.resultsContainer}>
            {searchQuery.length === 0 ? (
              /* Popular Searches */
              <View style={styles.popularContainer}>
                <Text style={styles.sectionTitle}>Popular Searches</Text>
                <View style={styles.popularGrid}>
                  {popularSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.popularChip,
                        { borderColor: item.color + '40' },
                      ]}
                      onPress={() => handleSearch(item.label)}
                    >
                      <Image
                        source={item.image}
                        style={styles.popularImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.popularLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Services Section */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                  Our Services
                </Text>
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.serviceItem}
                    onPress={() => {
                      setIsFocused(false);
                      router.push(`/services/${service.id}`);
                    }}
                  >
                    <View style={styles.serviceIconContainer}>
                      <service.icon size={22} color={service.color} strokeWidth={2.5} />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceTitle}>{service.title}</Text>
                      <Text style={styles.serviceDescription}>{service.description}</Text>
                    </View>
                    <ChevronRight size={18} color="#9ca3af" strokeWidth={2} />
                  </TouchableOpacity>
                ))}

                {/* Scrap Categories */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                  Browse Categories
                </Text>
                {scrapData.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryItem}
                    onPress={() => {
                      setIsFocused(false);
                      // Navigate to sell tab (first tab is index 0, sell is at index 2)
                      router.push('/(tabs)/sell');
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
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryCount}>
                        {category.items.length} items
                      </Text>
                    </View>
                    <ChevronRight size={18} color="#9ca3af" strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : searchResults.length > 0 ? (
              /* Search Results */
              <View style={styles.resultsContent}>
                <Text style={styles.resultsCount}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}{' '}
                  found
                </Text>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    style={styles.resultItem}
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
                      <Text style={styles.resultName}>{result.name}</Text>
                      <Text style={styles.resultDescription}>
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
                    <ChevronRight size={18} color="#9ca3af" strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              /* No Results */
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  placeholderText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
    fontWeight: '600',
  },
  searchBadge: {
    width: 28,
    height: 28,
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBadgeText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  cancelButton: {
    paddingHorizontal: 8,
  },
  cancelText: {
    fontSize: 15,
    color: '#16a34a',
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  popularContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 8,
  },
  popularImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  popularIcon: {
    fontSize: 18,
  },
  popularLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  categoryImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: '#6b7280',
  },
  resultsContent: {
    padding: 20,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 24,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  resultCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  noResultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
});
