import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Camera, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../../contexts/ProfileContext';

type ValidationErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile: contextProfile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
  });
  const [originalData, setOriginalData] = useState(formData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Input refs for keyboard navigation
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, [contextProfile]);

  // Check for changes
  useEffect(() => {
    const changed = 
      formData.fullName !== originalData.fullName ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.address !== originalData.address ||
      formData.profileImage !== originalData.profileImage;
    setHasChanges(changed);
  }, [formData, originalData]);

  const loadProfile = () => {
    const profileData = {
      fullName: contextProfile.fullName,
      email: contextProfile.email,
      phone: contextProfile.phone,
      address: contextProfile.address,
      profileImage: contextProfile.profileImage || '',
    };
    setFormData(profileData);
    setOriginalData(profileData);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Full Name validation
    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = 'Full name is required';
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 50) {
      newErrors.fullName = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      newErrors.fullName = 'Name can only contain letters and spaces';
    }

    // Email validation
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const trimmedPhone = formData.phone.trim().replace(/\s+/g, '');
    if (!trimmedPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Address validation
    const trimmedAddress = formData.address.trim();
    if (!trimmedAddress) {
      newErrors.address = 'Address is required';
    } else if (trimmedAddress.length < 10) {
      newErrors.address = 'Please enter a complete address (min 10 characters)';
    } else if (trimmedAddress.length > 200) {
      newErrors.address = 'Address must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setFormData(prev => ({ ...prev, profileImage: '' }))
        }
      ]
    );
  };

  const handleSave = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }

    if (!hasChanges) {
      Alert.alert('No Changes', 'You haven\'t made any changes to your profile.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Trim all string fields
      const trimmedData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim().replace(/\s+/g, ''),
        address: formData.address.trim(),
        profileImage: formData.profileImage,
      };

      // Update profile using context
      await updateProfile(trimmedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOriginalData(trimmedData);
      setFormData(trimmedData);
      setHasChanges(false);
      
      Alert.alert(
        'Success! 🎉', 
        'Your profile has been updated successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    Alert.alert(
      'Discard Changes?',
      'You have unsaved changes. Are you sure you want to discard them?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const getInitials = () => {
    return formData.fullName
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0].toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const clearError = (field: keyof ValidationErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleDiscard}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            (!hasChanges || isLoading) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isLoading}
        >
          <Save size={20} color={hasChanges && !isLoading ? "#16a34a" : "#9ca3af"} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {formData.profileImage ? (
              <>
                <Image source={{ uri: formData.profileImage }} style={styles.avatarImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.avatarText}>{getInitials()}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.changePhotoButton}
            onPress={handlePickImage}
          >
            <Camera size={16} color="#16a34a" />
            <Text style={styles.changePhotoText}>
              {formData.profileImage ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={[
              styles.inputWrapper,
              errors.fullName && styles.inputWrapperError
            ]}>
              <User size={20} color={errors.fullName ? "#ef4444" : "#6b7280"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, fullName: text }));
                  clearError('fullName');
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={[
              styles.inputWrapper,
              errors.email && styles.inputWrapperError
            ]}>
              <Mail size={20} color={errors.email ? "#ef4444" : "#6b7280"} style={styles.inputIcon} />
              <TextInput
                ref={emailRef}
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text }));
                  clearError('email');
                }}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={[
              styles.inputWrapper,
              errors.phone && styles.inputWrapperError
            ]}>
              <Phone size={20} color={errors.phone ? "#ef4444" : "#6b7280"} style={styles.inputIcon} />
              <TextInput
                ref={phoneRef}
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => {
                  // Only allow digits
                  const cleanedText = text.replace(/[^0-9]/g, '');
                  if (cleanedText.length <= 10) {
                    setFormData(prev => ({ ...prev, phone: cleanedText }));
                    clearError('phone');
                  }
                }}
                placeholder="Enter 10-digit phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
            <Text style={styles.helperText}>Enter phone number without country code</Text>
          </View>

          {/* Address Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address *</Text>
            <View style={[
              styles.inputWrapper,
              errors.address && styles.inputWrapperError
            ]}>
              <MapPin size={20} color={errors.address ? "#ef4444" : "#6b7280"} style={styles.inputIcon} />
              <TextInput
                ref={addressRef}
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, address: text }));
                  clearError('address');
                }}
                placeholder="Enter your complete address"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity 
          style={[
            styles.updateButton, 
            (!hasChanges || isLoading) && styles.updateButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isLoading}
        >
          <Text style={styles.updateButtonText}>
            {isLoading ? 'Updating...' : hasChanges ? 'Save Changes' : 'No Changes'}
          </Text>
        </TouchableOpacity>

        {hasChanges && (
          <TouchableOpacity 
            style={styles.discardButton}
            onPress={handleDiscard}
          >
            <Text style={styles.discardButtonText}>Discard Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 100 : 80,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center', // Changed from 'flex-start' to 'center' for proper alignment
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: 'Inter-Medium',
    marginTop: 6,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    marginLeft: 4,
  },
  updateButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#9ca3af',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  discardButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    fontFamily: 'Inter-SemiBold',
  },
});
