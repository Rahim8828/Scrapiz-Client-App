import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle,
  Wrench,
  ChevronRight,
  X
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { services } from '../(tabs)/services';
import { addOrder } from '../../data/orderData';
import { wp, hp, fs, spacing } from '../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocation } from '../../contexts/LocationContext';
import { useTheme } from '../../contexts/ThemeContext';

type Booking = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  addressTitle: string;
  addressLine: string;
  landmark: string;
  city: string;
  pinCode: string;
};

// Time slots for booking
const timeSlots = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM'
];

// Generate next 7 days for date selection
const getNextSevenDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      fullDate: date.toLocaleDateString('en-IN'),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short' })
    });
  }
  return days;
};

export default function ServiceBookingScreen() {
  const router = useRouter();
  const { service } = useLocalSearchParams<{ service?: string }>();
  const insets = useSafeAreaInsets();
  const { savedLocations } = useLocation();
  const { colors, isDark } = useTheme();
  
  // Get service details from services array
  const serviceData = services.find(s => s.id === service);
  const serviceTitle = serviceData?.title || 'Service';
  
  const [form, setForm] = useState<Booking>({
    name: '',
    phone: '',
    service: serviceTitle,
    date: '',
    time: '',
    addressTitle: '',
    addressLine: '',
    landmark: '',
    city: '',
    pinCode: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null);
  
  // Refs for input navigation
  const phoneInputRef = useRef<TextInput>(null);

  const update = (key: keyof Booking, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();
    
    if (!trimmedName) {
      newErrors.name = 'Name is required';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Improved phone validation - Indian phone format
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    const cleanPhone = trimmedPhone.replace(/[\s()-]/g, '');
    
    if (!trimmedPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Date and time validation
    if (!form.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!form.time) {
      newErrors.time = 'Please select a time slot';
    }
    
    // Address validation
    if (useNewAddress) {
      if (!form.addressTitle.trim()) {
        newErrors.addressTitle = 'Address title is required';
      }
      if (!form.addressLine.trim()) {
        newErrors.addressLine = 'Address line is required';
      }
      if (!form.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!form.pinCode.trim()) {
        newErrors.pinCode = 'PIN code is required';
      } else if (form.pinCode.trim().length !== 6) {
        newErrors.pinCode = 'PIN code must be 6 digits';
      }
    } else {
      if (!selectedSavedAddressId) {
        newErrors.savedAddress = 'Please select a saved address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    // Prevent multiple submissions
    if (isLoading) return;
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare address
      let finalAddress = '';
      if (useNewAddress) {
        finalAddress = `${form.addressLine}, ${form.landmark ? form.landmark + ', ' : ''}${form.city} - ${form.pinCode}`;
      } else {
        const savedLocation = savedLocations.find(loc => loc.id === selectedSavedAddressId);
        if (savedLocation) {
          finalAddress = `${savedLocation.address}, ${savedLocation.city} - ${savedLocation.pincode}`;
        } else {
          // Fallback in case saved location not found
          Alert.alert('Error', 'Selected address not found. Please try again.');
          setIsLoading(false);
          return;
        }
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create service order
      const newOrder = addOrder({
        type: 'service',
        status: 'pending',
        items: [], // Service orders don't have items
        serviceDetails: {
          serviceName: serviceTitle,
          serviceId: service || '',
          customerName: form.name.trim(),
          customerPhone: form.phone.trim(),
          customerAddress: finalAddress,
          notes: `Date: ${form.date}, Time: ${form.time}`,
        },
        totalAmount: 0, // Service cost will be determined later
        scheduledDate: form.date,
        scheduledTime: form.time,
        address: {
          title: 'Service Location',
          fullAddress: finalAddress
        }
      });
      
      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your service booking for "${serviceTitle}" has been submitted successfully.\n\nOrder Number: ${newOrder.orderNumber}\n\nYou can track your booking in Profile → Orders section.`,
        [
          { 
            text: 'OK', 
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header with Back Button */}
        <View style={[styles.header, { 
          backgroundColor: colors.background,
          paddingTop: Platform.OS === 'android' ? insets.top + spacing(12) : insets.top + spacing(8) 
        }]}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.card }]} onPress={handleBack}>
            <ArrowLeft size={fs(24)} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>Book Service</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Fill in your details and we'll contact you</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: hp(15) + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Service Info Card */}
          <View style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.serviceIcon, { backgroundColor: colors.primaryLight + '30' }]}>
              <Wrench size={fs(24)} color={colors.primary} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceTitle, { color: colors.textSecondary }]}>Service Type</Text>
              <Text style={[styles.serviceName, { color: colors.text }]}>{form.service || 'Selected Service'}</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }, errors.name && styles.inputError]}>
                <User size={fs(20)} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textTertiary}
                  value={form.name}
                  onChangeText={(text) => update('name', text)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Phone Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }, errors.phone && styles.inputError]}>
                <Phone size={fs(20)} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  ref={phoneInputRef}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="+91 9876543210"
                  placeholderTextColor={colors.textTertiary}
                  value={form.phone}
                  onChangeText={(text) => update('phone', text)}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Date Selection */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Select Date *</Text>
              <TouchableOpacity 
                style={[styles.selectButton, { backgroundColor: colors.surface, borderColor: colors.border }, errors.date && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={fs(20)} color={colors.textSecondary} />
                <Text style={[styles.selectButtonText, { color: form.date ? colors.text : colors.textTertiary }]}>
                  {form.date || 'Choose a date'}
                </Text>
                <ChevronRight size={fs(20)} color={colors.textTertiary} />
              </TouchableOpacity>
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>

            {/* Time Selection */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Select Time Slot *</Text>
              <TouchableOpacity 
                style={[styles.selectButton, { backgroundColor: colors.surface, borderColor: colors.border }, errors.time && styles.inputError]}
                onPress={() => setShowTimePicker(true)}
              >
                <Clock size={fs(20)} color={colors.textSecondary} />
                <Text style={[styles.selectButtonText, { color: form.time ? colors.text : colors.textTertiary }]}>
                  {form.time || 'Choose a time slot'}
                </Text>
                <ChevronRight size={fs(20)} color={colors.textTertiary} />
              </TouchableOpacity>
              {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
            </View>

            {/* Address Section Header */}
            <View style={styles.addressHeader}>
              <MapPin size={fs(20)} color={colors.primary} />
              <Text style={[styles.addressHeaderTitle, { color: colors.text }]}>Pickup Address</Text>
            </View>

            {/* Address Tabs */}
            <View style={[styles.addressTabs, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={[styles.addressTab, useNewAddress && [styles.addressTabActive, { backgroundColor: colors.primary }]]}
                onPress={() => {
                  setUseNewAddress(true);
                  if (errors.savedAddress) {
                    setErrors(prev => ({ ...prev, savedAddress: '' }));
                  }
                }}
              >
                <Text style={[styles.addressTabText, { color: useNewAddress ? 'white' : colors.textSecondary }]}>
                  Add New
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addressTab, 
                  !useNewAddress && [styles.addressTabActive, { backgroundColor: colors.primary }],
                  savedLocations.length === 0 && [styles.addressTabDisabled, { opacity: 0.5 }]
                ]}
                onPress={() => {
                  if (savedLocations.length === 0) return; // Don't allow switching if no saved addresses
                  setUseNewAddress(false);
                  const addressErrors = ['addressTitle', 'addressLine', 'city', 'pinCode'];
                  if (addressErrors.some(key => errors[key])) {
                    const newErrors = { ...errors };
                    addressErrors.forEach(key => delete newErrors[key]);
                    setErrors(newErrors);
                  }
                }}
                disabled={savedLocations.length === 0}
              >
                <Text style={[
                  styles.addressTabText, 
                  { color: !useNewAddress ? 'white' : savedLocations.length === 0 ? colors.textTertiary : colors.textSecondary }
                ]}>
                  Saved Address {savedLocations.length === 0 && '(0)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Address Form - Conditional */}
            {useNewAddress ? (
              <View style={styles.addressForm}>
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Address Title *</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }, errors.addressTitle && styles.formInputError]}
                    placeholder="e.g., Home, Office"
                    placeholderTextColor={colors.textTertiary}
                    value={form.addressTitle}
                    onChangeText={(text) => update('addressTitle', text)}
                  />
                  {errors.addressTitle && <Text style={styles.errorText}>{errors.addressTitle}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Address Line *</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }, errors.addressLine && styles.formInputError]}
                    placeholder="House/Flat no, Street name"
                    placeholderTextColor={colors.textTertiary}
                    value={form.addressLine}
                    onChangeText={(text) => update('addressLine', text)}
                  />
                  {errors.addressLine && <Text style={styles.errorText}>{errors.addressLine}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Area/Landmark</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    placeholder="Nearby landmark or area"
                    placeholderTextColor={colors.textTertiary}
                    value={form.landmark}
                    onChangeText={(text) => update('landmark', text)}
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: spacing(12) }]}>
                    <Text style={[styles.formLabel, { color: colors.text }]}>City *</Text>
                    <TextInput
                      style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }, errors.city && styles.formInputError]}
                      placeholder="City"
                      placeholderTextColor={colors.textTertiary}
                      value={form.city}
                      onChangeText={(text) => update('city', text)}
                    />
                    {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                  </View>
                  <View style={[styles.formGroup, { flex: 1, marginLeft: spacing(12) }]}>
                    <Text style={[styles.formLabel, { color: colors.text }]}>PIN Code *</Text>
                    <TextInput
                      style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }, errors.pinCode && styles.formInputError]}
                      placeholder="123456"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="numeric"
                      maxLength={6}
                      value={form.pinCode}
                      onChangeText={(text) => update('pinCode', text)}
                    />
                    {errors.pinCode && <Text style={styles.errorText}>{errors.pinCode}</Text>}
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.savedAddresses}>
                {savedLocations.length > 0 ? (
                  savedLocations.map((location) => (
                    <TouchableOpacity 
                      key={location.id}
                      style={[
                        styles.savedAddressCard,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        selectedSavedAddressId === location.id && [styles.savedAddressCardActive, { borderColor: colors.primary }]
                      ]}
                      onPress={() => {
                        setSelectedSavedAddressId(location.id);
                        if (errors.savedAddress) {
                          setErrors(prev => ({ ...prev, savedAddress: '' }));
                        }
                      }}
                    >
                      <View style={styles.savedAddressInfo}>
                        <Text style={[styles.savedAddressTitle, { color: colors.text }]}>
                          {location.label || location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                        </Text>
                        <Text style={[styles.savedAddressText, { color: colors.textSecondary }]}>
                          {location.address}, {location.city} - {location.pincode}
                        </Text>
                      </View>
                      <View style={[styles.savedAddressRadio, { borderColor: colors.border }]}>
                        {selectedSavedAddressId === location.id && (
                          <View style={[styles.radioSelected, { backgroundColor: colors.primary }]} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noSavedAddress}>
                    <MapPin size={fs(48)} color={colors.textTertiary} />
                    <Text style={[styles.noSavedAddressText, { color: colors.textSecondary }]}>No saved addresses yet</Text>
                    <Text style={[styles.noSavedAddressSubtext, { color: colors.textTertiary }]}>
                      Use "Add New" tab to add an address
                    </Text>
                  </View>
                )}
                {errors.savedAddress && <Text style={styles.errorText}>{errors.savedAddress}</Text>}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }, isLoading && styles.submitButtonDisabled]}
              onPress={submit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.submitText}>Submitting...</Text>
              ) : (
                <>
                  <CheckCircle size={fs(20)} color="white" />
                  <Text style={styles.submitText}>Submit Booking</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Note */}
            <View style={[styles.infoNote, { backgroundColor: colors.primaryLight + '15' }]}>
              <Clock size={fs(16)} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                We'll contact you within 24 hours to confirm your booking details
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <X size={fs(24)} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.dateList}>
                {getNextSevenDays().map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateOption,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      form.date === day.fullDate && [styles.dateOptionActive, { backgroundColor: colors.primaryLight + '30', borderColor: colors.primary }]
                    ]}
                    onPress={() => {
                      update('date', day.fullDate);
                      setShowDatePicker(false);
                    }}
                  >
                    <View style={styles.dateInfo}>
                      <Text style={[
                        styles.dateDayName,
                        { color: form.date === day.fullDate ? colors.primary : colors.text }
                      ]}>
                        {day.dayName}
                      </Text>
                      <Text style={[
                        styles.dateText,
                        { color: form.date === day.fullDate ? colors.primary : colors.textSecondary }
                      ]}>
                        {day.date}
                      </Text>
                    </View>
                    {form.date === day.fullDate && (
                      <CheckCircle size={fs(20)} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Time Picker Modal */}
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowTimePicker(false)}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Time Slot</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <X size={fs(24)} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.timeList}>
                {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeOption,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      form.time === slot && [styles.timeOptionActive, { backgroundColor: colors.primaryLight + '30', borderColor: colors.primary }]
                    ]}
                    onPress={() => {
                      update('time', slot);
                      setShowTimePicker(false);
                    }}
                  >
                    <Clock size={fs(20)} color={form.time === slot ? colors.primary : colors.textSecondary} />
                    <Text style={[
                      styles.timeText,
                      { color: form.time === slot ? colors.primary : colors.text }
                    ]}>
                      {slot}
                    </Text>
                    {form.time === slot && (
                      <CheckCircle size={fs(20)} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing(18), // Reduced from 20
    paddingBottom: spacing(10), // Reduced from 12
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: wp(9.5), // Reduced from 10.7
    height: wp(9.5), // Reduced from 10.7
    borderRadius: wp(4.75), // Reduced from 5.35
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(14), // Reduced from 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: fs(20), // Reduced from 22
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginBottom: spacing(4),
  },
  subtitle: {
    fontSize: fs(12), // Reduced from 13
    fontFamily: 'Inter-Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing(18), // Reduced from 20
  },
  serviceCard: {
    borderRadius: spacing(10), // Reduced from 12
    padding: spacing(14), // Reduced from 16
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(18), // Reduced from 20
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
  },
  serviceIcon: {
    width: wp(10.5), // Reduced from 12
    height: wp(10.5), // Reduced from 12
    borderRadius: wp(5.25), // Reduced from 6
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing(12), // Reduced from 14
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: fs(10), // Reduced from 11
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing(4),
  },
  serviceName: {
    fontSize: fs(15), // Reduced from 16
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    textTransform: 'capitalize',
  },
  formContainer: {
    gap: spacing(16), // Reduced from 18
  },
  fieldContainer: {
    gap: spacing(7), // Reduced from 8
  },
  label: {
    fontSize: fs(12), // Reduced from 13
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginBottom: spacing(4),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing(10), // Reduced from 12
    borderWidth: 1.5,
    paddingHorizontal: spacing(14), // Reduced from 16
    minHeight: hp(5.7), // Reduced from 6.4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  multilineWrapper: {
    minHeight: hp(10), // Reduced from 11
    alignItems: 'flex-start',
    paddingVertical: spacing(12), // Reduced from 14
  },
  inputIcon: {
    marginRight: spacing(10), // Reduced from 12
  },
  multilineIcon: {
    marginTop: spacing(2),
  },
  input: {
    flex: 1,
    fontSize: fs(15), // Reduced from 16
    fontFamily: 'Inter-Regular',
  },
  multilineInput: {
    minHeight: hp(6.7), // Reduced from 7.4
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: fs(12),
    color: '#ef4444',
    fontFamily: 'Inter-Medium',
    marginLeft: spacing(4),
  },
  helpText: {
    fontSize: fs(12),
    fontFamily: 'Inter-Regular',
    marginLeft: spacing(4),
  },
  submitButton: {
    borderRadius: spacing(10), // Reduced from 12
    height: hp(5.9), // Reduced from 6.6
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(8),
    marginTop: spacing(10), // Reduced from 12
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: fs(16), // Reduced from 17
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing(9), // Reduced from 10
    padding: spacing(12), // Reduced from 14
    marginTop: spacing(12), // Reduced from 14
    gap: spacing(9), // Reduced from 10
  },
  infoText: {
    flex: 1,
    fontSize: fs(11), // Reduced from 12
    fontFamily: 'Inter-Medium',
    lineHeight: fs(16), // Reduced from 17
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing(10), // Reduced from 12
    borderWidth: 1.5,
    paddingHorizontal: spacing(14), // Reduced from 16
    paddingVertical: spacing(14), // Reduced from 16
    gap: spacing(10), // Reduced from 12
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectButtonText: {
    flex: 1,
    fontSize: fs(15), // Reduced from 16
    fontFamily: 'Inter-Regular',
  },
  selectButtonTextActive: {
    fontWeight: '600',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(9), // Reduced from 10
    marginTop: spacing(9), // Reduced from 10
    marginBottom: spacing(12), // Reduced from 14
  },
  addressHeaderTitle: {
    fontSize: fs(14), // Reduced from 15
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  addressTabs: {
    flexDirection: 'row',
    borderRadius: spacing(9), // Reduced from 10
    padding: spacing(4),
    marginBottom: spacing(14), // Reduced from 16
  },
  addressTab: {
    flex: 1,
    paddingVertical: spacing(9), // Reduced from 10
    borderRadius: spacing(7), // Reduced from 8
    alignItems: 'center',
  },
  addressTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressTabText: {
    fontSize: fs(13), // Reduced from 14
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  addressTabTextActive: {
  },
  addressTabDisabled: {
  },
  addressTabTextDisabled: {
  },
  addressForm: {
    gap: spacing(14), // Reduced from 16
  },
  formGroup: {
    gap: spacing(7), // Reduced from 8
  },
  formLabel: {
    fontSize: fs(12), // Reduced from 13
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  formInput: {
    borderRadius: spacing(10), // Reduced from 12
    borderWidth: 1.5,
    paddingHorizontal: spacing(14), // Reduced from 16
    paddingVertical: spacing(12), // Reduced from 14
    fontSize: fs(15), // Reduced from 16
    fontFamily: 'Inter-Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  formInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  savedAddresses: {
    gap: spacing(10), // Reduced from 12
  },
  savedAddressCard: {
    borderRadius: spacing(10), // Reduced from 12
    padding: spacing(14), // Reduced from 16
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  savedAddressCardActive: {
  },
  savedAddressInfo: {
    flex: 1,
    marginRight: spacing(10), // Reduced from 12
  },
  savedAddressTitle: {
    fontSize: fs(14), // Reduced from 15
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginBottom: spacing(4),
  },
  savedAddressText: {
    fontSize: fs(12), // Reduced from 13
    fontFamily: 'Inter-Regular',
    lineHeight: fs(17), // Reduced from 18
  },
  savedAddressRadio: {
    width: wp(5.5), // Reduced from 6
    height: wp(5.5), // Reduced from 6
    borderRadius: wp(2.75), // Reduced from 3
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: wp(2.9), // Reduced from 3.2
    height: wp(2.9), // Reduced from 3.2
    borderRadius: wp(1.45), // Reduced from 1.6
  },
  noSavedAddress: {
    alignItems: 'center',
    paddingVertical: spacing(35), // Reduced from 40
  },
  noSavedAddressText: {
    fontSize: fs(14), // Reduced from 15
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginTop: spacing(14), // Reduced from 16
  },
  noSavedAddressSubtext: {
    fontSize: fs(12), // Reduced from 13
    fontFamily: 'Inter-Regular',
    marginTop: spacing(5), // Reduced from 6
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: spacing(22), // Reduced from 24
    borderTopRightRadius: spacing(22), // Reduced from 24
    maxHeight: '70%',
    paddingBottom: spacing(26), // Reduced from 30
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(18), // Reduced from 20
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: fs(17), // Reduced from 18
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  dateList: {
    maxHeight: hp(50),
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(18), // Reduced from 20
    paddingVertical: spacing(14), // Reduced from 16
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderWidth: 1,
  },
  dateOptionActive: {
  },
  dateInfo: {
    flex: 1,
  },
  dateDayName: {
    fontSize: fs(14), // Reduced from 15
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginBottom: spacing(4),
  },
  dateText: {
    fontSize: fs(12), // Reduced from 13
    fontFamily: 'Inter-Regular',
  },
  dateTextActive: {
  },
  timeList: {
    maxHeight: hp(50),
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(12), // Reduced from 14
    paddingHorizontal: spacing(18), // Reduced from 20
    paddingVertical: spacing(16), // Reduced from 18
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderWidth: 1,
  },
  timeOptionActive: {
  },
  timeText: {
    flex: 1,
    fontSize: fs(14), // Reduced from 15
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  timeTextActive: {
    fontWeight: '700',
  },
});
