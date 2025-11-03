/**
 * LocationSelector Component
 * Dropdown for selecting/changing user location
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { ChevronDown, MapPin, Plus, X, Home, Building } from 'lucide-react-native';
import { useLocation, SavedLocation } from '../contexts/LocationContext';

export default function LocationSelector() {
  const {
    currentLocation,
    savedLocations,
    selectLocation,
    saveLocation,
  } = useLocation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    area: '',
    city: '',
    state: '',
    pincode: '',
    label: 'Other',
    type: 'other' as 'home' | 'office' | 'other',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  // Refs for input navigation
  const cityInputRef = useRef<TextInput>(null);
  const stateInputRef = useRef<TextInput>(null);
  const pincodeInputRef = useRef<TextInput>(null);

  const handleSelectSavedLocation = (location: any) => {
    selectLocation(location);
    setIsModalVisible(false);
  };

  const handleManualSubmit = () => {
    // Validate form
    const errors: { [key: string]: string } = {};
    
    if (!manualAddress.label.trim()) {
      errors.label = 'Label is required';
    }
    
    if (!manualAddress.area.trim()) {
      errors.area = 'Area is required';
    }
    
    if (!manualAddress.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!manualAddress.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!manualAddress.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(manualAddress.pincode)) {
      errors.pincode = 'Pincode must be 6 digits';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const locationData: SavedLocation = {
      id: Date.now().toString(),
      type: manualAddress.type,
      label: manualAddress.label,
      latitude: 0,
      longitude: 0,
      address: manualAddress.area,
      city: manualAddress.city,
      state: manualAddress.state,
      pincode: manualAddress.pincode,
      area: manualAddress.area,
    };
    
    saveLocation(locationData);
    selectLocation(locationData);
    setShowManualEntry(false);
    setIsModalVisible(false);
    setManualAddress({ area: '', city: '', state: '', pincode: '', label: 'Other', type: 'other' });
    setFormErrors({});
  };

  return (
    <>
      {/* Location Display Button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.locationContent}>
          <MapPin size={22} color="#ffffff" strokeWidth={2.5} fill="#16a34a" />
          <View style={styles.textContainer}>
            <Text style={styles.locationMainText} numberOfLines={1}>
              {currentLocation
                ? `${currentLocation.area || currentLocation.city || 'Location'}`
                : 'Select location'}
            </Text>
            <Text style={styles.locationSubText} numberOfLines={1}>
              {currentLocation
                ? `${currentLocation.city}, ${currentLocation.state || 'India'}`
                : 'Choose your delivery location'}
            </Text>
          </View>
          <ChevronDown size={24} color="#ffffff" strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      {/* Location Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Location</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  setShowManualEntry(false);
                }}
              >
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {!showManualEntry ? (
              <ScrollView style={styles.modalScroll}>
                {/* Saved Locations */}
                {savedLocations.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Recent Locations</Text>
                    </View>
                    {savedLocations.map((location) => (
                      <TouchableOpacity
                        key={location.id}
                        style={styles.locationOption}
                        onPress={() => handleSelectSavedLocation(location)}
                      >
                        <View style={styles.optionIconContainer}>
                          <MapPin size={20} color="#6b7280" />
                        </View>
                        <View style={styles.optionTextContainer}>
                          <Text style={styles.optionTitle}>{location.label}</Text>
                          <Text style={styles.optionSubtitle} numberOfLines={1}>
                            {location.address}, {location.city}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {/* Add New Address */}
                <TouchableOpacity
                  style={styles.addNewButton}
                  onPress={() => setShowManualEntry(true)}
                >
                  <Plus size={20} color="#16a34a" />
                  <Text style={styles.addNewText}>Add New Address</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              /* Manual Entry Form */
              <ScrollView style={styles.modalScroll}>
                <View style={styles.formContainer}>
                  {/* Label Field */}
                  <Text style={styles.formLabel}>Label *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.label && styles.formInputError]}
                    placeholder="e.g., Home, Office, Other"
                    value={manualAddress.label}
                    onChangeText={(text) => {
                      setManualAddress({ ...manualAddress, label: text });
                      if (formErrors.label) {
                        setFormErrors(prev => ({ ...prev, label: '' }));
                      }
                    }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  {formErrors.label && <Text style={styles.errorText}>{formErrors.label}</Text>}

                  {/* Type Selection */}
                  <Text style={styles.formLabel}>Type</Text>
                  <View style={styles.typeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        manualAddress.type === 'home' && styles.typeButtonActive
                      ]}
                      onPress={() => setManualAddress({ ...manualAddress, type: 'home' })}
                    >
                      <Home size={18} color={manualAddress.type === 'home' ? '#16a34a' : '#6b7280'} />
                      <Text style={[
                        styles.typeButtonText,
                        manualAddress.type === 'home' && styles.typeButtonTextActive
                      ]}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        manualAddress.type === 'office' && styles.typeButtonActive
                      ]}
                      onPress={() => setManualAddress({ ...manualAddress, type: 'office' })}
                    >
                      <Building size={18} color={manualAddress.type === 'office' ? '#16a34a' : '#6b7280'} />
                      <Text style={[
                        styles.typeButtonText,
                        manualAddress.type === 'office' && styles.typeButtonTextActive
                      ]}>Office</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        manualAddress.type === 'other' && styles.typeButtonActive
                      ]}
                      onPress={() => setManualAddress({ ...manualAddress, type: 'other' })}
                    >
                      <MapPin size={18} color={manualAddress.type === 'other' ? '#16a34a' : '#6b7280'} />
                      <Text style={[
                        styles.typeButtonText,
                        manualAddress.type === 'other' && styles.typeButtonTextActive
                      ]}>Other</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.formLabel}>Area/Street *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.area && styles.formInputError]}
                    placeholder="Enter area or street"
                    value={manualAddress.area}
                    onChangeText={(text) => {
                      setManualAddress({ ...manualAddress, area: text });
                      if (formErrors.area) {
                        setFormErrors(prev => ({ ...prev, area: '' }));
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => cityInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {formErrors.area && <Text style={styles.errorText}>{formErrors.area}</Text>}

                  <Text style={styles.formLabel}>City *</Text>
                  <TextInput
                    ref={cityInputRef}
                    style={[styles.formInput, formErrors.city && styles.formInputError]}
                    placeholder="Enter city"
                    value={manualAddress.city}
                    onChangeText={(text) => {
                      setManualAddress({ ...manualAddress, city: text });
                      if (formErrors.city) {
                        setFormErrors(prev => ({ ...prev, city: '' }));
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => stateInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {formErrors.city && <Text style={styles.errorText}>{formErrors.city}</Text>}

                  <Text style={styles.formLabel}>State *</Text>
                  <TextInput
                    ref={stateInputRef}
                    style={[styles.formInput, formErrors.state && styles.formInputError]}
                    placeholder="Enter state"
                    value={manualAddress.state}
                    onChangeText={(text) => {
                      setManualAddress({ ...manualAddress, state: text });
                      if (formErrors.state) {
                        setFormErrors(prev => ({ ...prev, state: '' }));
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => pincodeInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {formErrors.state && <Text style={styles.errorText}>{formErrors.state}</Text>}

                  <Text style={styles.formLabel}>Pincode *</Text>
                  <TextInput
                    ref={pincodeInputRef}
                    style={[styles.formInput, formErrors.pincode && styles.formInputError]}
                    placeholder="Enter 6-digit pincode"
                    value={manualAddress.pincode}
                    onChangeText={(text) => {
                      // Only allow numbers
                      const cleaned = text.replace(/[^0-9]/g, '');
                      setManualAddress({ ...manualAddress, pincode: cleaned });
                      if (formErrors.pincode) {
                        setFormErrors(prev => ({ ...prev, pincode: '' }));
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={handleManualSubmit}
                  />
                  {formErrors.pincode && <Text style={styles.errorText}>{formErrors.pincode}</Text>}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!manualAddress.label.trim() ||
                        !manualAddress.area.trim() ||
                        !manualAddress.city.trim() ||
                        !manualAddress.state.trim() ||
                        !manualAddress.pincode.trim() ||
                        manualAddress.pincode.length !== 6) && styles.submitButtonDisabled
                    ]}
                    onPress={handleManualSubmit}
                    disabled={
                      !manualAddress.label.trim() ||
                      !manualAddress.area.trim() ||
                      !manualAddress.city.trim() ||
                      !manualAddress.state.trim() ||
                      !manualAddress.pincode.trim() ||
                      manualAddress.pincode.length !== 6
                    }
                  >
                    <Text style={styles.submitButtonText}>Save Location</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setShowManualEntry(false)}
                  >
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    paddingRight: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  textContainer: {
    // Let the text truncate and not push the chevron away
    flexShrink: 1,
    marginRight: 6,
    minWidth: 0,
  },
  homeText: {
    fontSize: 9,
    color: '#16a34a',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  locationMainText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  locationText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  locationSubText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '400',
    letterSpacing: -0.1,
    marginTop: 1,
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalScroll: {
    padding: 20,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(22, 163, 74, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#16a34a',
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
  },
  addNewText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16a34a',
  },
  formContainer: {
    gap: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 15,
    color: '#111827',
  },
  formInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#16a34a',
    fontWeight: '600',
  },
});
