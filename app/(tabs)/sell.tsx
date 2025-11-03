import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Plus,
  Minus,
  Calendar,
  MapPin,
  Camera,
  IndianRupee,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Phone,
  User,
  X,
  Wallet,
  FileText,
  Scale,
  AlertCircle,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scrapData, getAverageRate, type ScrapItem } from '../../data/scrapData';
import { addOrder, type OrderItem } from '../../data/orderData';
import { useReferral } from '../../contexts/ReferralContext';
import { useLocation } from '../../contexts/LocationContext';

import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Extended type for selected items
type SelectedScrapItem = ScrapItem & {
  categoryId: string;
  categoryColor: string;
  quantity: number;
  id: string; // unique identifier
  icon: string;
};

const timeSlots = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM'
];

const stepTitles = [
  'Select Items',
  'Schedule Pickup',
  'Pickup Address',
  'Order Summary'
];

export default function SellScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { walletBalance, setWalletBalance, applyReferralDiscount } = useReferral();
  const { savedLocations, currentLocation } = useLocation();
  
  const [selectedItems, setSelectedItems] = useState<SelectedScrapItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [useReferralBalance, setUseReferralBalance] = useState(false);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(true);
  const [addressForm, setAddressForm] = useState({
    title: '',
    addressLine: '',
    landmark: '',
    city: '',
    pinCode: ''
  });
  const [contactForm, setContactForm] = useState({
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210'
  });
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [hasProcessedParams, setHasProcessedParams] = useState(false);
  const [notes, setNotes] = useState('');

  // Handle pre-selected item from search
  useEffect(() => {
    if (params.preSelectedItem && params.preSelectedCategory && !hasProcessedParams) {
      const itemName = params.preSelectedItem as string;
      const categoryTitle = params.preSelectedCategory as string;
      
      // Find the category and item
      const category = scrapData.find(cat => cat.title === categoryTitle);
      if (category) {
        const item = category.items.find(i => i.name === itemName);
        if (item) {
          // Check if item is not already selected
          const itemId = `${category.id}-${item.name}`;
          
          // Use functional update to avoid dependency on selectedItems
          setSelectedItems(prevItems => {
            const alreadyExists = prevItems.some(selectedItem => selectedItem.id === itemId);
            
            if (!alreadyExists) {
              const newSelectedItem: SelectedScrapItem = {
                ...item,
                categoryId: category.id,
                categoryColor: category.color,
                quantity: 1,
                id: itemId,
                icon: category.icon
              };
              return [...prevItems, newSelectedItem];
            }
            return prevItems;
          });
          
          setHasProcessedParams(true);
        }
      }
    }
  }, [params.preSelectedItem, params.preSelectedCategory, hasProcessedParams]);

  // Auto-select first saved address when switching to saved addresses
  useEffect(() => {
    if (!useNewAddress && savedLocations.length > 0 && !selectedSavedAddressId) {
      setSelectedSavedAddressId(savedLocations[0].id);
    }
  }, [useNewAddress, savedLocations, selectedSavedAddressId]);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...uris]);
    }
  };

  const removeImage = (uri: string) => {
    setSelectedImages(prev => prev.filter(imageUri => imageUri !== uri));
  };

  const addItem = (item: ScrapItem, categoryId: string, categoryColor: string, categoryIcon: string) => {
    const itemId = `${categoryId}-${item.name}`;
    const existingItem = selectedItems.find(selectedItem => selectedItem.id === itemId);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(selectedItem =>
        selectedItem.id === itemId
          ? { ...selectedItem, quantity: selectedItem.quantity + 1 }
          : selectedItem
      ));
    } else {
      const newSelectedItem: SelectedScrapItem = {
        ...item,
        categoryId,
        categoryColor,
        quantity: 1,
        id: itemId,
        icon: categoryIcon
      };
      setSelectedItems([...selectedItems, newSelectedItem]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as SelectedScrapItem[]);
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + (getAverageRate(item) * item.quantity), 0);
  };

  const getReferralDiscount = () => {
    if (!useReferralBalance || walletBalance === 0) return 0;
    const totalAmount = getTotalAmount();
    return applyReferralDiscount(totalAmount);
  };

  const getFinalAmount = () => {
    return getTotalAmount() + getReferralDiscount(); // ADD referral bonus, not subtract!
  };

  const getFormattedAddress = () => {
    const { title, addressLine, landmark, city, pinCode } = addressForm;
    let address = '';
    if (addressLine) address += addressLine;
    if (landmark) address += landmark ? `, ${landmark}` : '';
    if (city) address += city ? `, ${city}` : '';
    if (pinCode) address += pinCode ? ` - ${pinCode}` : '';
    return address || 'Address not provided';
  };

  const getSelectedSavedAddress = () => {
    if (!selectedSavedAddressId) return null;
    return savedLocations.find(loc => loc.id === selectedSavedAddressId);
  };

  const getDisplayAddress = () => {
    if (useNewAddress) {
      return getFormattedAddress();
    } else {
      const savedAddress = getSelectedSavedAddress();
      if (savedAddress) {
        return `${savedAddress.address}, ${savedAddress.city} - ${savedAddress.pincode}`;
      }
      return 'No address selected';
    }
  };

  const getAddressTitle = () => {
    if (useNewAddress) {
      return addressForm.title;
    } else {
      const savedAddress = getSelectedSavedAddress();
      if (savedAddress) {
        return savedAddress.label || savedAddress.type.charAt(0).toUpperCase() + savedAddress.type.slice(1);
      }
      return '';
    }
  };

  const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (currentStep === 1 && selectedItems.length === 0) {
      newErrors.items = '📦 Please select at least one item to sell';
    }

    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      newErrors.schedule = '📅 Please select date and time for pickup';
    }

    if (currentStep === 3) {
      if (useNewAddress) {
        if (!addressForm.title.trim()) newErrors.title = '🏠 Address title is required';
        if (!addressForm.addressLine.trim()) newErrors.addressLine = '📍 Address line is required';
        if (!addressForm.city.trim()) newErrors.city = '🏙️ City is required';
        if (!addressForm.pinCode.trim()) newErrors.pinCode = '📮 PIN code is required';
        else if (!/^\d{6}$/.test(addressForm.pinCode)) newErrors.pinCode = '📮 PIN code must be 6 digits';
      } else {
        // Using saved address
        if (!selectedSavedAddressId) {
          newErrors.savedAddress = '📍 Please select a saved address';
        }
      }
      
      if (!contactForm.name.trim()) newErrors.name = '👤 Name is required';
      if (!contactForm.mobile.trim()) newErrors.mobile = '📱 Mobile number is required';
      else if (!validateMobileNumber(contactForm.mobile)) {
        newErrors.mobile = '📱 Please enter a valid 10-digit mobile number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedItems([]);
    setSelectedDate('');
    setSelectedTime('');
    setAddressForm({
      title: '',
      addressLine: '',
      landmark: '',
      city: '',
      pinCode: ''
    });
    setContactForm({
      name: 'Rajesh Kumar',
      mobile: '+91 98765 43210'
    });
    setUseNewAddress(true);
    setErrors({});
    setSelectedImages([]);
    setNotes('');
    setHasProcessedParams(false); // Reset the flag for new searches
  };

  const handleNext = () => {
    // Clear previous errors when moving to next step
    setErrors({});
    
    // Use setTimeout to ensure errors are cleared before validation
    setTimeout(() => {
      if (!validateForm()) {
        return;
      }
      
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleOrderSubmission();
      }
    }, 0);
  };

  const handlePrevious = () => {
    // Clear errors when going back
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOrderSubmission = () => {
    // Convert selected items to order items
    const orderItems: OrderItem[] = selectedItems.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      rate: getAverageRate(item),
      categoryColor: item.categoryColor
    }));

    const estimatedAmount = getTotalAmount();
    const referralAmount = useReferralBalance ? getReferralDiscount() : 0;
    const totalPayout = getFinalAmount();

    // Create the order
    const newOrder = addOrder({
      type: 'scrap',
      status: 'scheduled',
      items: orderItems,
      totalAmount: estimatedAmount,
      referralBonus: referralAmount > 0 ? referralAmount : undefined,
      finalAmount: referralAmount > 0 ? totalPayout : undefined,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      address: {
        title: getAddressTitle(),
        fullAddress: getDisplayAddress()
      },
      contact: {
        name: contactForm.name,
        mobile: contactForm.mobile
      },
      notes: notes.trim() || undefined,
      photos: selectedImages
    });

    // Deduct referral balance if used
    if (useReferralBalance && referralAmount > 0) {
      setWalletBalance(walletBalance - referralAmount);
    }

    const message = referralAmount > 0
      ? `Your scrap pickup has been scheduled successfully!\n\n📋 Order Number: ${newOrder.orderNumber}\n💰 Estimated Value: ₹${estimatedAmount}\n🎁 Referral Bonus: +₹${referralAmount}\n💸 Total Payout: ₹${totalPayout}\n📅 Pickup: ${selectedDate} at ${selectedTime}\n\nOur team will arrive at your doorstep at the scheduled time.`
      : `Your scrap pickup has been scheduled successfully!\n\n📋 Order Number: ${newOrder.orderNumber}\n💰 Total Amount: ₹${estimatedAmount}\n📅 Pickup: ${selectedDate} at ${selectedTime}\n\nOur team will arrive at your doorstep at the scheduled time.`;

    Alert.alert(
      '✅ Booking Confirmed!', 
      message,
      [
        { 
          text: '📦 View Orders', 
          onPress: () => {
            resetForm();
            router.push('/(tabs)/profile');
          }
        },
        {
          text: '✨ Schedule Another',
          onPress: () => {
            resetForm();
          }
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive
          ]}>
            {currentStep >= step ? (
              <LinearGradient
                colors={['#16a34a', '#15803d']}
                style={styles.stepGradient}
              >
                <Text style={styles.stepNumberActive}>
                  {step}
                </Text>
              </LinearGradient>
            ) : (
              <Text style={styles.stepNumber}>
                {step}
              </Text>
            )}
          </View>
          {step < 4 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineActive
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Items to Sell</Text>
      <Text style={styles.stepSubtitle}>Choose the scrap materials you want to sell</Text>
      
      <ScrollView 
        style={styles.categoriesContainer} 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {scrapData.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            {/* Category Header */}
            <LinearGradient
              colors={['#16a34a', '#15803d']}
              style={styles.categoryHeaderSell}
            >
              <Text style={styles.categoryTitleSell}>
                {category.title}
              </Text>
            </LinearGradient>
            
            {/* Category Items */}
            <View style={styles.categoryItems}>
              {category.items.map((item, index) => (
                <TouchableOpacity
                  key={`${category.id}-${index}`}
                  style={styles.itemCard}
                  onPress={() => addItem(item, category.id, category.color, category.icon)}
                >
                  <View style={styles.itemLeft}>
                    <Image source={item.image} style={styles.itemIconImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemRate}>
                        {item.rate}/kg
                      </Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <View style={styles.addButton}>
                    <Plus size={16} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedItems.length > 0 && (
        <View style={styles.selectedItems}>
          <Text style={styles.selectedItemsTitle}>Selected Items ({selectedItems.length})</Text>
          {selectedItems.map((item) => (
            <View key={item.id} style={styles.selectedItemCard}>
              <View style={styles.selectedItemLeft}>
                <Image source={item.image} style={styles.selectedItemIconImage} />
                <View>
                  <Text style={styles.selectedItemName}>{item.name}</Text>
                  <Text style={styles.selectedItemRate}>
                    {item.rate}/kg
                  </Text>
                </View>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Minus size={16} color="#6b7280" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}kg</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Plus size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Trash2 size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {errors.items && (
        <Text style={styles.errorTextCentered}>{errors.items}</Text>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Schedule Pickup</Text>
      <Text style={styles.stepSubtitle}>Choose your preferred date and time</Text>
      
      <View style={styles.dateSection}>
        <Text style={styles.sectionLabel}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dateCard,
                  selectedDate === dateStr && styles.dateCardSelected
                ]}
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[
                  styles.dateText,
                  selectedDate === dateStr && styles.dateTextSelected
                ]}>
                  {dateStr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.sectionLabel}>Select Time Slot</Text>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.timeSlot,
              selectedTime === slot && styles.timeSlotSelected
            ]}
            onPress={() => setSelectedTime(slot)}
          >
            <Text style={[
              styles.timeSlotText,
              selectedTime === slot && styles.timeSlotTextSelected
            ]}>
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {errors.schedule && (
        <Text style={styles.errorTextCentered}>{errors.schedule}</Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Contact & Address</Text>
      <Text style={styles.stepSubtitle}>Provide your contact details and pickup address</Text>
      
      {/* Contact Information */}
      <View style={styles.contactCard}>
        <View style={styles.contactHeader}>
          <User size={20} color="#111827" />
          <Text style={styles.contactHeaderTitle}>Contact Information</Text>
        </View>
        
        <View style={styles.contactForm}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Full Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.formInput, errors.name && styles.formInputError]}
              placeholder="Enter your full name"
              value={contactForm.name}
              onChangeText={(text) => {
                setContactForm(prev => ({ ...prev, name: text }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Mobile Number <Text style={styles.required}>*</Text></Text>
            <View style={styles.mobileInputContainer}>
              <Phone size={16} color="#6b7280" style={styles.mobileIcon} />
              <TextInput
                style={[styles.mobileInput, errors.mobile && styles.formInputError]}
                placeholder="+91 98765 43210"
                value={contactForm.mobile}
                onChangeText={(text) => {
                  setContactForm(prev => ({ ...prev, mobile: text }));
                  if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                }}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
            {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
          </View>
        </View>
      </View>
      
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <MapPin size={20} color="#111827" />
          <Text style={styles.addressHeaderTitle}>Select or Add Address</Text>
        </View>

        <View style={styles.addressTabs}>
          <TouchableOpacity
            style={[styles.addressTab, useNewAddress && styles.addressTabActive]}
            onPress={() => {
              setUseNewAddress(true);
              // Clear saved address errors when switching to new address
              if (errors.savedAddress) {
                setErrors(prev => ({ ...prev, savedAddress: '' }));
              }
            }}
          >
            <Text style={[styles.addressTabText, useNewAddress && styles.addressTabTextActive]}>
              Add New Address
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addressTab, !useNewAddress && styles.addressTabActive]}
            onPress={() => {
              setUseNewAddress(false);
              // Clear new address form errors when switching to saved address
              const addressErrors = ['title', 'addressLine', 'city', 'pinCode'];
              if (addressErrors.some(key => errors[key])) {
                const newErrors = { ...errors };
                addressErrors.forEach(key => delete newErrors[key]);
                setErrors(newErrors);
              }
            }}
          >
            <Text style={[styles.addressTabText, !useNewAddress && styles.addressTabTextActive]}>
              Use Saved Address
            </Text>
          </TouchableOpacity>
        </View>

        {useNewAddress ? (
          <View style={styles.addressForm}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Address Title <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.formInput, errors.title && styles.formInputError]}
                placeholder="e.g., Home, Office"
                value={addressForm.title}
                onChangeText={(text) => {
                  setAddressForm(prev => ({ ...prev, title: text }));
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Address Line <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.formInput, errors.addressLine && styles.formInputError]}
                placeholder="House/Flat no, Street name"
                value={addressForm.addressLine}
                onChangeText={(text) => {
                  setAddressForm(prev => ({ ...prev, addressLine: text }));
                  if (errors.addressLine) setErrors(prev => ({ ...prev, addressLine: '' }));
                }}
              />
              {errors.addressLine && <Text style={styles.errorText}>{errors.addressLine}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Area/Landmark</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Nearby landmark or area"
                value={addressForm.landmark}
                onChangeText={(text) => setAddressForm(prev => ({ ...prev, landmark: text }))}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.formLabel}>City <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.formInput, errors.city && styles.formInputError]}
                  placeholder="City"
                  value={addressForm.city}
                  onChangeText={(text) => {
                    setAddressForm(prev => ({ ...prev, city: text }));
                    if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                  }}
                />
                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.formLabel}>PIN Code <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.formInput, errors.pinCode && styles.formInputError]}
                  placeholder="123456"
                  keyboardType="numeric"
                  maxLength={6}
                  value={addressForm.pinCode}
                  onChangeText={(text) => {
                    setAddressForm(prev => ({ ...prev, pinCode: text }));
                    if (errors.pinCode) setErrors(prev => ({ ...prev, pinCode: '' }));
                  }}
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
                    selectedSavedAddressId === location.id && styles.savedAddressCardActive
                  ]}
                  onPress={() => setSelectedSavedAddressId(location.id)}
                >
                  <View style={styles.savedAddressInfo}>
                    <Text style={styles.savedAddressTitle}>
                      {location.label || location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                    </Text>
                    <Text style={styles.savedAddressText}>
                      {location.address}, {location.city} - {location.pincode}
                    </Text>
                  </View>
                  <View style={styles.savedAddressRadio}>
                    {selectedSavedAddressId === location.id && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noSavedAddress}>
                <MapPin size={48} color="#9ca3af" />
                <Text style={styles.noSavedAddressText}>No saved addresses yet</Text>
                <Text style={styles.noSavedAddressSubtext}>
                  Add addresses from Location Selector or use "Add New Address"
                </Text>
              </View>
            )}
          </View>
        )}
        {errors.savedAddress && !useNewAddress && (
          <Text style={styles.errorText}>{errors.savedAddress}</Text>
        )}
      </View>

      {/* Photo Upload Section */}
      <View style={styles.photoCard}>
        <View style={styles.photoHeader}>
          <Camera size={20} color="#111827" />
          <Text style={styles.photoHeaderTitle}>Upload Photos (Optional)</Text>
        </View>

        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Camera size={24} color="#6b7280" />
          <Text style={styles.photoButtonText}>Add Photos</Text>
          <Text style={styles.photoButtonSubtext}>Help us identify your scrap better</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <View style={styles.selectedImagesContainer}>
            <Text style={styles.selectedImagesTitle}>Selected Photos ({selectedImages.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.selectedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(uri)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Order Summary</Text>
      <Text style={styles.stepSubtitle}>Review your pickup details</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Items</Text>
        {selectedItems.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}>
              <Image source={item.image} style={styles.summaryItemIconImage} />
              <Text style={styles.summaryItemName} numberOfLines={2}>
                {item.name} ({item.quantity}kg)
              </Text>
            </View>
            <Text style={styles.summaryItemAmount}>
              ₹{getAverageRate(item) * item.quantity}
            </Text>
          </View>
        ))}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryTotal}>
          <Text style={styles.summaryTotalLabel}>Estimated Total</Text>
          <Text style={styles.summaryTotalAmount}>₹{getTotalAmount()}</Text>
        </View>
      </View>

      {/* Referral Wallet Section */}
      {walletBalance > 0 && (
        <View style={styles.referralCard}>
          <View style={styles.referralHeader}>
            <View style={styles.referralHeaderLeft}>
              <View style={styles.referralIconContainer}>
                <Wallet size={20} color="#16a34a" />
              </View>
              <View>
                <Text style={styles.referralTitle}>Referral Wallet</Text>
                <Text style={styles.referralBalance}>₹{walletBalance} available</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.referralToggle,
                useReferralBalance && styles.referralToggleActive
              ]}
              onPress={() => setUseReferralBalance(!useReferralBalance)}
            >
              <View style={[
                styles.referralToggleCircle,
                useReferralBalance && styles.referralToggleCircleActive
              ]} />
            </TouchableOpacity>
          </View>
          
          {useReferralBalance && (
            <View style={styles.referralDiscountInfo}>
              <Text style={styles.referralDiscountText}>
                💰 Referral Applied: +₹{getReferralDiscount()}
              </Text>
              <Text style={styles.referralDiscountSubtext}>
                Bonus amount will be added to your total payout
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Final Amount Summary */}
      {useReferralBalance && getReferralDiscount() > 0 && (
        <View style={styles.finalAmountCard}>
          <View style={styles.finalAmountRow}>
            <Text style={styles.finalAmountLabel}>Estimated Value</Text>
            <Text style={styles.finalAmountValue}>₹{getTotalAmount()}</Text>
          </View>
          <View style={styles.finalAmountRow}>
            <Text style={styles.finalAmountLabelBonus}>Referral Bonus</Text>
            <Text style={styles.finalAmountValueBonus}>+₹{getReferralDiscount()}</Text>
          </View>
          <View style={styles.finalAmountDivider} />
          <View style={styles.finalAmountRow}>
            <Text style={styles.finalAmountLabelFinal}>Total Payout</Text>
            <Text style={styles.finalAmountValueFinal}>₹{getFinalAmount()}</Text>
          </View>
          <Text style={styles.finalAmountNote}>
            💸 You will receive this amount from us
          </Text>
        </View>
      )}

      {/* Improved Pickup Details Section */}
      <View style={styles.pickupDetailsCard}>
        <View style={styles.pickupDetailsHeader}>
          <View style={styles.pickupDetailsIconWrapper}>
            <Calendar size={20} color="#16a34a" />
          </View>
          <Text style={styles.pickupDetailsTitle}>Pickup Details</Text>
        </View>
        
        <View style={styles.pickupDetailsContent}>
          {/* Date & Time */}
          <View style={styles.pickupDetailRow}>
            <View style={styles.pickupDetailLabel}>
              <Calendar size={16} color="#6b7280" />
              <Text style={styles.pickupDetailLabelText}>Schedule</Text>
            </View>
            <View style={styles.pickupDetailValue}>
              <Text style={styles.pickupDetailValueText}>{selectedDate}</Text>
              <View style={styles.pickupTimeBadge}>
                <Text style={styles.pickupTimeText}>{selectedTime}</Text>
              </View>
            </View>
          </View>

          <View style={styles.pickupDetailDivider} />

          {/* Address */}
          <View style={styles.pickupDetailRow}>
            <View style={styles.pickupDetailLabel}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.pickupDetailLabelText}>Location</Text>
            </View>
            <View style={styles.pickupDetailValue}>
              {getAddressTitle() && (
                <View style={styles.addressTitleBadge}>
                  <Text style={styles.addressTitleText}>{getAddressTitle()}</Text>
                </View>
              )}
              <Text style={styles.pickupAddressText}>
                {getDisplayAddress()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Contact Information</Text>
        <View style={styles.summaryDetail}>
          <User size={16} color="#6b7280" />
          <Text style={styles.summaryDetailText}>{contactForm.name}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Phone size={16} color="#6b7280" />
          <Text style={styles.summaryDetailText}>{contactForm.mobile}</Text>
        </View>
      </View>

      {/* Notes Section */}
      <View style={styles.summaryCard}>
        <View style={styles.notesTitleContainer}>
          <FileText size={18} color="#16a34a" />
          <Text style={styles.summaryTitle}>Notes (Optional)</Text>
        </View>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any special instructions or details for pickup..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
        <Text style={styles.notesHint}>
          E.g., Gate code, parking instructions, specific location details, etc.
        </Text>
      </View>

      {/* Pickup Charges Section - Enhanced UI */}
      <View style={styles.pickupChargesCard}>
        <View style={styles.pickupChargesHeader}>
          <View style={styles.pickupChargesTitleContainer}>
            <View style={styles.pickupChargesIconWrapper}>
              <Scale size={22} color="#16a34a" />
            </View>
            <Text style={styles.pickupChargesTitle}>Pickup Charges</Text>
          </View>
          <TouchableOpacity style={styles.infoIconContainer}>
            <AlertCircle size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.chargeOptionsContainer}>
          {/* Free Pickup Card */}
          <View style={styles.freeChargeCard}>
            <View style={styles.chargeCardHeader}>
              <View style={styles.freeTagLarge}>
                <Text style={styles.freeTagLargeText}>FREE</Text>
              </View>
            </View>
            <View style={styles.chargeConditionsContainer}>
              <View style={styles.chargeCondition}>
                <View style={styles.conditionIconCircle}>
                  <Text style={styles.conditionIcon}>⚖️</Text>
                </View>
                <Text style={styles.conditionText}>Weight above{'\n'}<Text style={styles.conditionBold}>20 kg</Text></Text>
              </View>
              <View style={styles.orDividerContainer}>
                <View style={styles.orDividerLine} />
                <Text style={styles.orDividerText}>OR</Text>
                <View style={styles.orDividerLine} />
              </View>
              <View style={styles.chargeCondition}>
                <View style={styles.conditionIconCircle}>
                  <Text style={styles.conditionIcon}>💰</Text>
                </View>
                <Text style={styles.conditionText}>Amount above{'\n'}<Text style={styles.conditionBold}>₹200</Text></Text>
              </View>
            </View>
          </View>

          {/* Paid Pickup Card */}
          <View style={styles.paidChargeCard}>
            <View style={styles.chargeCardHeader}>
              <View style={styles.paidTagLarge}>
                <Text style={styles.paidTagLargeText}>₹30</Text>
              </View>
            </View>
            <View style={styles.chargeConditionsContainer}>
              <View style={styles.chargeCondition}>
                <View style={styles.conditionIconCircle}>
                  <Text style={styles.conditionIcon}>⚖️</Text>
                </View>
                <Text style={styles.conditionText}>Weight below{'\n'}<Text style={styles.conditionBold}>20 kg</Text></Text>
              </View>
              <View style={styles.andDividerContainer}>
                <View style={styles.andDividerLine} />
                <Text style={styles.andDividerText}>AND</Text>
                <View style={styles.andDividerLine} />
              </View>
              <View style={styles.chargeCondition}>
                <View style={styles.conditionIconCircle}>
                  <Text style={styles.conditionIcon}>💰</Text>
                </View>
                <Text style={styles.conditionText}>Amount below{'\n'}<Text style={styles.conditionBold}>₹200</Text></Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Please Keep in Mind Section */}
      <View style={styles.keepInMindCard}>
        <Text style={styles.keepInMindTitle}>Please keep in mind</Text>
        
        <View style={styles.keepInMindGrid}>
          {/* Wood & Glass */}
          <View style={styles.keepInMindItem}>
            <View style={styles.keepInMindIconContainer}>
              <Text style={styles.keepInMindEmoji}>🪵🍾</Text>
              <View style={styles.keepInMindCross}>
                <X size={32} color="#dc2626" strokeWidth={3} />
              </View>
            </View>
            <Text style={styles.keepInMindText}>We do not buy{'\n'}Wood & Glass</Text>
          </View>

          {/* Clothes */}
          <View style={styles.keepInMindItem}>
            <View style={styles.keepInMindIconContainer}>
              <Text style={styles.keepInMindEmoji}>👕👖</Text>
              <View style={styles.keepInMindCross}>
                <X size={32} color="#dc2626" strokeWidth={3} />
              </View>
            </View>
            <Text style={styles.keepInMindText}>We do not buy{'\n'}Clothes</Text>
          </View>

          {/* Furniture & Electronics */}
          <View style={styles.keepInMindItem}>
            <View style={styles.keepInMindIconContainer}>
              <Text style={styles.keepInMindEmoji}>🪑💻</Text>
              <View style={styles.keepInMindCross}>
                <X size={32} color="#dc2626" strokeWidth={3} />
              </View>
            </View>
            <Text style={styles.keepInMindText}>We buy only in{'\n'}scrap rates</Text>
          </View>

          {/* Minimum Weight */}
          <View style={styles.keepInMindItem}>
            <View style={styles.keepInMindIconContainer}>
              <Text style={styles.keepInMindEmoji}>⚖️📦</Text>
              <Text style={styles.keepInMindWeight}>20 kg</Text>
            </View>
            <Text style={styles.keepInMindText}>Free pickup only{'\n'}above 20 kg</Text>
          </View>
        </View>
      </View>

      {selectedImages.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Attached Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryImagesScroll}>
            {selectedImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.summaryImage} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sell Scrap</Text>
        <Text style={styles.stepTitle}>{stepTitles[currentStep - 1]}</Text>
        {renderStepIndicator()}
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {selectedItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.navigationButtons}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <ArrowLeft size={20} color="#6b7280" />
                <Text style={styles.previousButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <View style={styles.totalAmount}>
                <IndianRupee size={16} color="#16a34a" />
                <Text style={styles.totalValue}>{getTotalAmount()}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
              <LinearGradient
                colors={['#16a34a', '#15803d', '#166534']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                }}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === 4 ? 'Schedule' : 'Next'}
                </Text>
                <ArrowRight size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Guidelines Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showGuidelinesModal}
        onRequestClose={() => setShowGuidelinesModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Please keep in mind</Text>
            </View>

            <ScrollView 
              style={styles.guidelinesScroll} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.guidelinesScrollContent}
              bounces={false}
            >
              <View style={styles.guidelinesGrid}>
                {/* Wood & Glass */}
                <View style={styles.guidelineCard}>
                  <View style={styles.guidelineImageContainer}>
                    <Text style={styles.guidelineEmoji}>🪵🍾</Text>
                    <View style={styles.crossMark}>
                      <X size={36} color="#dc2626" strokeWidth={3.5} />
                    </View>
                  </View>
                  <Text style={styles.guidelineText}>We do not buy Wood & Glass</Text>
                </View>

                {/* Clothes */}
                <View style={styles.guidelineCard}>
                  <View style={styles.guidelineImageContainer}>
                    <Text style={styles.guidelineEmoji}>👕👖</Text>
                    <View style={styles.crossMark}>
                      <X size={36} color="#dc2626" strokeWidth={3.5} />
                    </View>
                  </View>
                  <Text style={styles.guidelineText}>We do not buy Clothes</Text>
                </View>

                {/* Scrap Rates */}
                <View style={styles.guidelineCard}>
                  <View style={styles.guidelineImageContainer}>
                    <Text style={styles.guidelineEmoji}>🪑💻</Text>
                    <View style={styles.crossMark}>
                      <X size={36} color="#dc2626" strokeWidth={3.5} />
                    </View>
                  </View>
                  <Text style={styles.guidelineText}>We buy only in scrap rates</Text>
                </View>

                {/* 20 kg Minimum */}
                <View style={styles.guidelineCard}>
                  <View style={styles.guidelineImageContainer}>
                    <Text style={styles.guidelineEmoji}>⚖️📦</Text>
                    <Text style={styles.weightBadge}>20 kg</Text>
                  </View>
                  <Text style={styles.guidelineText}>Free pickup only above 20 kg</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowGuidelinesModal(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#16a34a', '#15803d']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Okay, I understand</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stepCircleActive: {
    backgroundColor: 'transparent',
  },
  stepGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    fontFamily: 'Inter-SemiBold',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#16a34a',
  },
  content: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' ? 100 : 80, // Extra padding for Android
  },
  stepContent: {
    padding: 20,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
  categoriesContainer: {
    flexGrow: 0,
    flexShrink: 1,
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeaderSell: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryTitleSell: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  categoryItems: {
    gap: 8,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  itemRate: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
    color: '#16a34a',
  },
  itemDescription: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItems: {
    marginTop: 24,
  },
  selectedItemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  selectedItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  selectedItemIconImage: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 6,
  },

  itemIconImage: {
    width: 44,
    height: 44,
    marginRight: 12,
    borderRadius: 10,
  },

  summaryItemIconImage: {
    width: 28,
    height: 28,
    marginRight: 10,
    borderRadius: 6,
  },
  selectedItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  selectedItemRate: {
    fontSize: 12,
    color: '#16a34a',
    fontFamily: 'Inter-Regular',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    minWidth: 40,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  datesScroll: {
    marginHorizontal: -8,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  dateTextSelected: {
    color: '#16a34a',
  },
  timeSection: {
    marginBottom: 24,
  },
  timeSlot: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotSelected: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  timeSlotTextSelected: {
    color: '#16a34a',
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addressHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  addressTabs: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  addressTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  addressTabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addressTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  addressTabTextActive: {
    color: '#111827',
  },
  addressForm: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  required: {
    color: '#dc2626',
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  savedAddresses: {
    gap: 12,
  },
  savedAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  savedAddressCardActive: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  savedAddressInfo: {
    flex: 1,
  },
  savedAddressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  savedAddressText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  savedAddressRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16a34a',
  },
  noSavedAddress: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  noSavedAddressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  noSavedAddressSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  photoButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
  photoButtonSubtext: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItemName: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    flex: 1,
    marginLeft: 8,
    flexWrap: 'wrap',
  },
  summaryItemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  summaryTotalAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  summaryDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryDetailText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  summaryAddressContainer: {
    marginLeft: 8,
    flex: 1,
  },
  summaryAddressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  summaryImagesScroll: {
    marginTop: 12,
  },
  summaryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  previousButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  totalSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  totalLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
    textAlign: 'center',
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  nextButton: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    flexShrink: 1,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  contactForm: {
    gap: 16,
  },
  formInputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  errorTextCentered: {
    fontSize: 14,
    color: '#dc2626',
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mobileInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  mobileIcon: {
    marginLeft: 12,
  },
  photoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  selectedImagesContainer: {
    marginTop: 20,
  },
  selectedImagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  imagesScroll: {
    marginHorizontal: -8,
  },
  imageContainer: {
    marginHorizontal: 8,
    position: 'relative',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#dcfce7',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  referralHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  referralIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  referralBalance: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  referralToggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e5e7eb',
    padding: 3,
    justifyContent: 'center',
  },
  referralToggleActive: {
    backgroundColor: '#16a34a',
  },
  referralToggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  referralToggleCircleActive: {
    alignSelf: 'flex-end',
  },
  referralDiscountInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  referralDiscountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  referralDiscountSubtext: {
    fontSize: 13,
    color: '#15803d',
    fontFamily: 'Inter-Regular',
  },
  finalAmountCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  finalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  finalAmountLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  finalAmountValue: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-SemiBold',
  },
  finalAmountLabelDiscount: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
  },
  finalAmountValueDiscount: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  finalAmountLabelBonus: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
  },
  finalAmountValueBonus: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  finalAmountDivider: {
    height: 1,
    backgroundColor: '#16a34a',
    marginVertical: 12,
    opacity: 0.3,
  },
  finalAmountLabelFinal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  finalAmountValueFinal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  finalAmountNote: {
    fontSize: 12,
    color: '#15803d',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#bbf7d0',
  },
  // Guidelines Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: Platform.OS === 'android' ? height * 0.75 : height * 0.80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  guidelinesScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  guidelinesScrollContent: {
    paddingBottom: 12,
  },
  guidelinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 10,
  },
  guidelineCard: {
    width: '48%',
    backgroundColor: '#fef9f0',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    minHeight: 150,
  },
  guidelineImageContainer: {
    width: '100%',
    height: 90,
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  guidelineEmoji: {
    fontSize: 44,
  },
  crossMark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -18,
    marginLeft: -18,
  },
  weightBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  guidelineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    lineHeight: 17,
  },
  modalButton: {
    margin: 16,
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  // Improved Pickup Details Styles
  pickupDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  pickupDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
  },
  pickupDetailsIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupDetailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  pickupDetailsContent: {
    padding: 20,
  },
  pickupDetailRow: {
    gap: 12,
  },
  pickupDetailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pickupDetailLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickupDetailValue: {
    gap: 8,
  },
  pickupDetailValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  pickupTimeBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pickupTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  pickupDetailDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  addressTitleBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  addressTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    fontFamily: 'Inter-Bold',
  },
  pickupAddressText: {
    fontSize: 15,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  // Notes Section Styles
  notesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    minHeight: 100,
    maxHeight: 150,
  },
  notesHint: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Pickup Charges Section Styles - Enhanced UI
  pickupChargesCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  pickupChargesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
  },
  pickupChargesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pickupChargesIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupChargesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  chargeOptionsContainer: {
    padding: 16,
    gap: 12,
  },
  freeChargeCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#16a34a',
    overflow: 'hidden',
  },
  paidChargeCard: {
    backgroundColor: '#fef9f0',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#f59e0b',
    overflow: 'hidden',
  },
  chargeCardHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  freeTagLarge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  freeTagLargeText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  paidTagLarge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  paidTagLargeText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  chargeConditionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  chargeCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
  },
  conditionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conditionIcon: {
    fontSize: 24,
  },
  conditionText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    flex: 1,
  },
  conditionBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#16a34a',
    opacity: 0.3,
  },
  orDividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 8,
  },
  andDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  andDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f59e0b',
    opacity: 0.3,
  },
  andDividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 8,
  },
  // Please Keep in Mind Section Styles
  keepInMindCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  keepInMindTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  keepInMindGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  keepInMindItem: {
    width: '48%',
    backgroundColor: '#fef9f0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minHeight: 140,
    marginBottom: 12,
  },
  keepInMindIconContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  keepInMindEmoji: {
    fontSize: 36,
  },
  keepInMindCross: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
  keepInMindWeight: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  keepInMindText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    lineHeight: 16,
  },
});
