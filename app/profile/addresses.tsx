import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { ArrowLeft, MapPin, Plus, Edit, Trash2, Home, Building, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLocation, SavedLocation } from '../../contexts/LocationContext';

export default function AddressesScreen() {
  const router = useRouter();
  const { savedLocations, saveLocation, removeLocation } = useLocation();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedLocation | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    type: 'other' as 'home' | 'office' | 'other',
    area: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  // Refs for input navigation
  const labelInputRef = useRef<TextInput>(null);
  const areaInputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const stateInputRef = useRef<TextInput>(null);
  const pincodeInputRef = useRef<TextInput>(null);

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeLocation(id);
          }
        }
      ]
    );
  };

  const handleAddAddress = () => {
    setFormData({
      label: '',
      type: 'other',
      area: '',
      city: '',
      state: '',
      pincode: '',
    });
    setEditingAddress(null);
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditAddress = (address: SavedLocation) => {
    setFormData({
      label: address.label,
      type: address.type,
      area: address.area,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingAddress(address);
    setFormErrors({});
    setShowAddModal(true);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.label.trim()) {
      errors.label = 'Label is required';
    }
    
    if (!formData.area.trim()) {
      errors.area = 'Area is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be 6 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newLocation: SavedLocation = {
      id: editingAddress?.id || Date.now().toString(),
      type: formData.type,
      label: formData.label,
      latitude: 0,
      longitude: 0,
      address: formData.area,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      area: formData.area,
    };
    
    saveLocation(newLocation);
    setShowAddModal(false);
    setFormData({
      label: '',
      type: 'other',
      area: '',
      city: '',
      state: '',
      pincode: '',
    });
    setFormErrors({});
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color="#16a34a" />;
      case 'office':
        return <Building size={20} color="#3b82f6" />;
      default:
        return <MapPin size={20} color="#6b7280" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Plus size={20} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.addAddressCard} onPress={handleAddAddress}>
          <View style={styles.addAddressIcon}>
            <Plus size={24} color="#16a34a" />
          </View>
          <View style={styles.addAddressContent}>
            <Text style={styles.addAddressTitle}>Add New Address</Text>
            <Text style={styles.addAddressSubtitle}>Add a new pickup location</Text>
          </View>
        </TouchableOpacity>

        {savedLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <MapPin size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Addresses Yet</Text>
            <Text style={styles.emptyStateText}>
              Add your first address to get started with faster pickups
            </Text>
          </View>
        ) : (
          <View style={styles.addressesList}>
            {savedLocations.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressTitleRow}>
                    {getAddressIcon(address.type)}
                    <Text style={styles.addressTitle}>{address.label}</Text>
                  </View>
                  <View style={styles.addressActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditAddress(address)}
                    >
                      <Edit size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.addressText}>
                  {address.address}, {address.city}, {address.state} - {address.pincode}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Addresses</Text>
          <Text style={styles.infoText}>
            • You can save multiple pickup addresses for convenience{'\n'}
            • Edit or delete addresses anytime{'\n'}
            • All addresses are securely stored{'\n'}
            • Use addresses in location selector
          </Text>
        </View>
      </ScrollView>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.formContainer}>
                {/* Label Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.formLabel}>Label *</Text>
                  <TextInput
                    ref={labelInputRef}
                    style={[styles.formInput, formErrors.label && styles.formInputError]}
                    placeholder="e.g., Home, Office, Other"
                    value={formData.label}
                    onChangeText={(text) => {
                      setFormData({ ...formData, label: text });
                      if (formErrors.label) {
                        setFormErrors(prev => ({ ...prev, label: '' }));
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => areaInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {formErrors.label && <Text style={styles.errorText}>{formErrors.label}</Text>}
                </View>

                {/* Type Selection */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.formLabel}>Type</Text>
                  <View style={styles.typeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.type === 'home' && styles.typeButtonActive
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'home' })}
                    >
                      <Home size={18} color={formData.type === 'home' ? '#16a34a' : '#6b7280'} />
                      <Text style={[
                        styles.typeButtonText,
                        formData.type === 'home' && styles.typeButtonTextActive
                      ]}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.type === 'office' && styles.typeButtonActive
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'office' })}
                    >
                      <Building size={18} color={formData.type === 'office' ? '#16a34a' : '#6b7280'} />
                      <Text style={[
                        styles.typeButtonText,
                        formData.type === 'office' && styles.typeButtonTextActive
                      ]}>Office</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.type === 'other' && styles.typeButtonActive
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'other' })}
                    >
                      <MapPin size={18} color={formData.type === 'other' ? '#16a34a' : '#6b7280'} />
                      <Text style={[
                        styles.typeButtonText,
                        formData.type === 'other' && styles.typeButtonTextActive
                      ]}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Area Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.formLabel}>Area/Street *</Text>
                  <TextInput
                    ref={areaInputRef}
                    style={[styles.formInput, formErrors.area && styles.formInputError]}
                    placeholder="Enter area or street"
                    value={formData.area}
                    onChangeText={(text) => {
                      setFormData({ ...formData, area: text });
                      if (formErrors.area) {
                        setFormErrors(prev => ({ ...prev, area: '' }));
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => cityInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {formErrors.area && <Text style={styles.errorText}>{formErrors.area}</Text>}
                </View>

                {/* City Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.formLabel}>City *</Text>
                  <TextInput
                    ref={cityInputRef}
                    style={[styles.formInput, formErrors.city && styles.formInputError]}
                    placeholder="Enter city"
                    value={formData.city}
                    onChangeText={(text) => {
                      setFormData({ ...formData, city: text });
                      if (formErrors.city) {
                        setFormErrors(prev => ({ ...prev, city: '' }));
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => stateInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {formErrors.city && <Text style={styles.errorText}>{formErrors.city}</Text>}
                </View>

                {/* State Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.formLabel}>State *</Text>
                  <TextInput
                    ref={stateInputRef}
                    style={[styles.formInput, formErrors.state && styles.formInputError]}
                    placeholder="Enter state"
                    value={formData.state}
                    onChangeText={(text) => {
                      setFormData({ ...formData, state: text });
                      if (formErrors.state) {
                        setFormErrors(prev => ({ ...prev, state: '' }));
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => pincodeInputRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {formErrors.state && <Text style={styles.errorText}>{formErrors.state}</Text>}
                </View>

                {/* Pincode Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.formLabel}>Pincode *</Text>
                  <TextInput
                    ref={pincodeInputRef}
                    style={[styles.formInput, formErrors.pincode && styles.formInputError]}
                    placeholder="Enter 6-digit pincode"
                    value={formData.pincode}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, pincode: cleaned });
                      if (formErrors.pincode) {
                        setFormErrors(prev => ({ ...prev, pincode: '' }));
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  {formErrors.pincode && <Text style={styles.errorText}>{formErrors.pincode}</Text>}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!formData.label.trim() ||
                      !formData.area.trim() ||
                      !formData.city.trim() ||
                      !formData.state.trim() ||
                      !formData.pincode.trim() ||
                      formData.pincode.length !== 6) && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={
                    !formData.label.trim() ||
                    !formData.area.trim() ||
                    !formData.city.trim() ||
                    !formData.state.trim() ||
                    !formData.pincode.trim() ||
                    formData.pincode.length !== 6
                  }
                >
                  <Text style={styles.submitButtonText}>
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addAddressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  addAddressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addAddressContent: {
    flex: 1,
  },
  addAddressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  addAddressSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  addressesList: {
    marginBottom: 24,
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  setDefaultText: {
    fontSize: 12,
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  infoCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginVertical: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
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
    maxHeight: '90%',
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
    fontFamily: 'Inter-SemiBold',
  },
  modalScroll: {
    padding: 20,
  },
  formContainer: {
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  formInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
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
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  typeButtonTextActive: {
    color: '#16a34a',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});
