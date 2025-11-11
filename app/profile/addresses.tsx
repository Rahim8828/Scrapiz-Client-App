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
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { ArrowLeft, MapPin, Plus, Edit, Trash2, Home, Building, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLocation, SavedLocation } from '../../contexts/LocationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { wp, hp, fs, spacing, MIN_TOUCH_SIZE } from '../../utils/responsive';

export default function AddressesScreen() {
  const router = useRouter();
  const { savedLocations, saveLocation, removeLocation } = useLocation();
  const { colors, isDark } = useTheme();
  
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
        return <Home size={fs(20)} color={colors.primary} />;
      case 'office':
        return <Building size={fs(20)} color="#3b82f6" />;
      default:
        return <MapPin size={fs(20)} color={colors.textSecondary} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <ArrowLeft size={fs(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Addresses</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.card }]} onPress={handleAddAddress}>
          <Plus size={fs(20)} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={[styles.addAddressCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleAddAddress}>
          <View style={[styles.addAddressIcon, { backgroundColor: colors.primaryLight + '20' }]}>
            <Plus size={fs(24)} color={colors.primary} />
          </View>
          <View style={styles.addAddressContent}>
            <Text style={[styles.addAddressTitle, { color: colors.text }]}>Add New Address</Text>
            <Text style={[styles.addAddressSubtitle, { color: colors.textSecondary }]}>Add a new pickup location</Text>
          </View>
        </TouchableOpacity>

        {savedLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <MapPin size={fs(48)} color={colors.border} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Addresses Yet</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Add your first address to get started with faster pickups
            </Text>
          </View>
        ) : (
          <View style={styles.addressesList}>
            {savedLocations.map((address) => (
              <View key={address.id} style={[styles.addressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressTitleRow}>
                    {getAddressIcon(address.type)}
                    <Text style={[styles.addressTitle, { color: colors.text }]}>{address.label}</Text>
                  </View>
                  <View style={styles.addressActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditAddress(address)}
                    >
                      <Edit size={fs(16)} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 size={fs(16)} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                  {address.address}, {address.city}, {address.state} - {address.pincode}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.infoCard, { backgroundColor: colors.primaryLight + '15', borderColor: colors.primaryLight }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>About Addresses</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, ' + (isDark ? '0.8' : '0.5') + ')' }]}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={fs(24)} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.formContainer}>
                {/* Label Field */}
                <View style={styles.fieldContainer}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Label *</Text>
                  <TextInput
                    ref={labelInputRef}
                    style={[
                      styles.formInput, 
                      { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
                      formErrors.label && styles.formInputError
                    ]}
                    placeholder="e.g., Home, Office, Other"
                    placeholderTextColor={colors.textTertiary}
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
                  <Text style={[styles.formLabel, { color: colors.text }]}>Type</Text>
                  <View style={styles.typeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        formData.type === 'home' && { backgroundColor: colors.primaryLight + '20', borderColor: colors.primary }
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'home' })}
                    >
                      <Home size={fs(18)} color={formData.type === 'home' ? colors.primary : colors.textSecondary} />
                      <Text style={[
                        styles.typeButtonText,
                        { color: colors.textSecondary },
                        formData.type === 'home' && { color: colors.primary }
                      ]}>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        formData.type === 'office' && { backgroundColor: colors.primaryLight + '20', borderColor: colors.primary }
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'office' })}
                    >
                      <Building size={fs(18)} color={formData.type === 'office' ? colors.primary : colors.textSecondary} />
                      <Text style={[
                        styles.typeButtonText,
                        { color: colors.textSecondary },
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
                      <MapPin size={fs(18)} color={formData.type === 'other' ? '#16a34a' : '#6b7280'} />
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
        </KeyboardAvoidingView>
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
    paddingTop: Platform.select({ ios: hp(7.4), android: hp(6.2) }),
    paddingHorizontal: spacing(20),
    paddingBottom: spacing(20),
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
    width: wp(10.6),
    height: wp(10.6),
    borderRadius: wp(5.3),
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fs(20),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    width: wp(10.6),
    height: wp(10.6),
    borderRadius: wp(5.3),
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing(20),
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? hp(12.3) : hp(9.8),
  },
  addAddressCard: {
    backgroundColor: 'white',
    borderRadius: spacing(16),
    padding: spacing(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(24),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    minHeight: MIN_TOUCH_SIZE,
  },
  addAddressIcon: {
    width: wp(12.8),
    height: wp(12.8),
    borderRadius: wp(6.4),
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(16),
  },
  addAddressContent: {
    flex: 1,
  },
  addAddressTitle: {
    fontSize: fs(16),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing(4),
  },
  addAddressSubtitle: {
    fontSize: fs(14),
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  addressesList: {
    marginBottom: spacing(24),
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: spacing(16),
    padding: spacing(20),
    marginBottom: spacing(16),
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
    marginBottom: spacing(12),
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTitle: {
    fontSize: fs(16),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginLeft: spacing(8),
  },
  defaultBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: spacing(12),
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(4),
    marginLeft: spacing(12),
  },
  defaultBadgeText: {
    fontSize: fs(10),
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  addressActions: {
    flexDirection: 'row',
    gap: spacing(8),
  },
  actionButton: {
    width: MIN_TOUCH_SIZE,
    height: MIN_TOUCH_SIZE,
    borderRadius: MIN_TOUCH_SIZE / 2,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    fontSize: fs(14),
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: fs(20),
    marginBottom: spacing(12),
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing(6),
    paddingHorizontal: spacing(12),
    borderRadius: spacing(8),
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  setDefaultText: {
    fontSize: fs(12),
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  infoCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: spacing(16),
    padding: spacing(20),
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  infoTitle: {
    fontSize: fs(16),
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing(8),
  },
  infoText: {
    fontSize: fs(14),
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: fs(20),
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing(40),
    marginVertical: spacing(20),
  },
  emptyStateTitle: {
    fontSize: fs(18),
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginTop: spacing(16),
    marginBottom: spacing(8),
  },
  emptyStateText: {
    fontSize: fs(14),
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: fs(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: spacing(24),
    borderTopRightRadius: spacing(24),
    maxHeight: '90%',
    paddingBottom: spacing(40),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(20),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: fs(20),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  modalScroll: {
    padding: spacing(20),
  },
  formContainer: {
    gap: spacing(16),
  },
  fieldContainer: {
    gap: spacing(8),
  },
  formLabel: {
    fontSize: fs(14),
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing(4),
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderRadius: spacing(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: spacing(16),
    fontSize: fs(15),
    color: '#111827',
    fontFamily: 'Inter-Regular',
    minHeight: MIN_TOUCH_SIZE,
  },
  formInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: fs(12),
    color: '#ef4444',
    fontFamily: 'Inter-Medium',
    marginLeft: spacing(4),
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing(12),
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(12),
    backgroundColor: '#f9fafb',
    borderRadius: spacing(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: spacing(6),
    minHeight: MIN_TOUCH_SIZE,
  },
  typeButtonActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
  },
  typeButtonText: {
    fontSize: fs(14),
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  typeButtonTextActive: {
    color: '#16a34a',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: spacing(12),
    padding: spacing(16),
    alignItems: 'center',
    marginTop: spacing(12),
    minHeight: MIN_TOUCH_SIZE,
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
    fontSize: fs(16),
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});
