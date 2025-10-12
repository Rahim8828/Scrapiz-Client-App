import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle,
  Wrench
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Booking = {
  name: string;
  phone: string;
  address: string;
  datetime: string;
  service: string;
};

const { width } = Dimensions.get('window');

export default function ServiceBookingScreen() {
  const router = useRouter();
  const { service } = useLocalSearchParams<{ service?: string }>();
  const [form, setForm] = useState<Booking>({
    name: '',
    phone: '',
    address: '',
    datetime: '',
    service: (service as string) || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const update = (key: keyof Booking, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!form.datetime.trim()) {
      newErrors.datetime = 'Preferred date & time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Booking Confirmed! 🎉',
        'Your service booking has been submitted successfully. We\'ll contact you within 24 hours to confirm the details.',
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Book Service</Text>
            <Text style={styles.subtitle}>Fill in your details and we'll contact you</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Service Info Card */}
          <View style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
              <Wrench size={24} color="#16a34a" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Service Type</Text>
              <Text style={styles.serviceName}>{form.service || 'Selected Service'}</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                <User size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  value={form.name}
                  onChangeText={(text) => update('name', text)}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Phone Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <Phone size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#9ca3af"
                  value={form.phone}
                  onChangeText={(text) => update('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Address Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Complete Address *</Text>
              <View style={[styles.inputWrapper, styles.multilineWrapper, errors.address && styles.inputError]}>
                <MapPin size={20} color="#6b7280" style={[styles.inputIcon, styles.multilineIcon]} />
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="House no, street, area, city, PIN code"
                  placeholderTextColor="#9ca3af"
                  value={form.address}
                  onChangeText={(text) => update('address', text)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            {/* Date Time Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Preferred Date & Time *</Text>
              <View style={[styles.inputWrapper, errors.datetime && styles.inputError]}>
                <Calendar size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Tomorrow 10:00 AM"
                  placeholderTextColor="#9ca3af"
                  value={form.datetime}
                  onChangeText={(text) => update('datetime', text)}
                />
              </View>
              {errors.datetime && <Text style={styles.errorText}>{errors.datetime}</Text>}
              <Text style={styles.helpText}>We'll confirm the exact time with you</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={submit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.submitText}>Submitting...</Text>
              ) : (
                <>
                  <CheckCircle size={20} color="white" />
                  <Text style={styles.submitText}>Submit Booking</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Note */}
            <View style={styles.infoNote}>
              <Clock size={16} color="#6b7280" />
              <Text style={styles.infoText}>
                We'll contact you within 24 hours to confirm your booking details
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  formContainer: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  multilineWrapper: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  multilineIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
});
