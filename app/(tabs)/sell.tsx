import React, { useState } from 'react';
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
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { scrapData, getAverageRate, type ScrapItem } from '../../data/scrapData';
import { addOrder, type OrderItem } from '../../data/orderData';

const { width } = Dimensions.get('window');

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
  const [selectedItems, setSelectedItems] = useState<SelectedScrapItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
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

  const getFormattedAddress = () => {
    const { title, addressLine, landmark, city, pinCode } = addressForm;
    let address = '';
    if (addressLine) address += addressLine;
    if (landmark) address += landmark ? `, ${landmark}` : '';
    if (city) address += city ? `, ${city}` : '';
    if (pinCode) address += pinCode ? ` - ${pinCode}` : '';
    return address || 'Address not provided';
  };

  const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (currentStep === 1 && selectedItems.length === 0) {
      newErrors.items = 'Please select at least one item to sell';
    }

    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      newErrors.schedule = 'Please select date and time for pickup';
    }

    if (currentStep === 3) {
      if (useNewAddress) {
        if (!addressForm.title.trim()) newErrors.title = 'Address title is required';
        if (!addressForm.addressLine.trim()) newErrors.addressLine = 'Address line is required';
        if (!addressForm.city.trim()) newErrors.city = 'City is required';
        if (!addressForm.pinCode.trim()) newErrors.pinCode = 'PIN code is required';
        else if (!/^\d{6}$/.test(addressForm.pinCode)) newErrors.pinCode = 'PIN code must be 6 digits';
      }
      
      if (!contactForm.name.trim()) newErrors.name = 'Name is required';
      if (!contactForm.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      else if (!validateMobileNumber(contactForm.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
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
    setErrors({});
    setSelectedImages([]);
  };

  const handleNext = () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors);
      if (errorMessages.length > 0) {
        Alert.alert('Validation Error', errorMessages[0]);
      }
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleOrderSubmission();
    }
  };

  const handlePrevious = () => {
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

    // Create the order
    const newOrder = addOrder({
      status: 'scheduled',
      items: orderItems,
      totalAmount: getTotalAmount(),
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      address: {
        title: useNewAddress ? addressForm.title : 'Home',
        fullAddress: useNewAddress ? getFormattedAddress() : '123, Green Valley Apartment, Sector 21, Pune - 411001'
      },
      photos: selectedImages
    });

    Alert.alert(
      'Success!', 
      `Your pickup has been scheduled successfully!\n\nOrder Number: ${newOrder.orderNumber}\nTotal Amount: ₹${newOrder.totalAmount}`,
      [
        { 
          text: 'View Orders', 
          onPress: () => {
            resetForm();
            router.push('/(tabs)/profile');
          }
        },
        {
          text: 'Schedule Another',
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
            <Text style={[
              styles.stepNumber,
              currentStep >= step && styles.stepNumberActive
            ]}>
              {step}
            </Text>
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
      
      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
        {scrapData.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            {/* Category Header */}
            <View style={[styles.categoryHeaderSell, { backgroundColor: category.bgColor }]}>
              <Text style={[styles.categoryTitleSell, { color: category.color }]}>
                {category.title}
              </Text>
            </View>
            
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
                      <Text style={[styles.itemRate, { color: category.color }]}>
                        {item.rate}/kg
                      </Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.addButton, { backgroundColor: category.color }]}>
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
                  <Text style={[styles.selectedItemRate, { color: item.categoryColor }]}>
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
            onPress={() => setUseNewAddress(true)}
          >
            <Text style={[styles.addressTabText, useNewAddress && styles.addressTabTextActive]}>
              Add New Address
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addressTab, !useNewAddress && styles.addressTabActive]}
            onPress={() => setUseNewAddress(false)}
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
            <TouchableOpacity style={styles.savedAddressCard}>
              <View style={styles.savedAddressInfo}>
                <Text style={styles.savedAddressTitle}>Home</Text>
                <Text style={styles.savedAddressText}>
                  123, Green Valley Apartment, Sector 21, Pune - 411001
                </Text>
              </View>
              <View style={styles.savedAddressRadio}>
                <View style={styles.radioSelected} />
              </View>
            </TouchableOpacity>
          </View>
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={item.image} style={styles.summaryItemIconImage} />
              <Text style={styles.summaryItemName}>
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

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Pickup Details</Text>
        <View style={styles.summaryDetail}>
          <Calendar size={16} color="#6b7280" />
          <Text style={styles.summaryDetailText}>{selectedDate} • {selectedTime}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <MapPin size={16} color="#6b7280" />
          <View style={styles.summaryAddressContainer}>
            {useNewAddress && addressForm.title && (
              <Text style={styles.summaryAddressTitle}>{addressForm.title}</Text>
            )}
            <Text style={styles.summaryDetailText}>
              {useNewAddress ? getFormattedAddress() : '123, Green Valley Apartment, Sector 21, Pune - 411001'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sell Scrap</Text>
        <Text style={styles.stepTitle}>{stepTitles[currentStep - 1]}</Text>
        {renderStepIndicator()}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep === 4 ? 'Schedule Pickup' : 'Next'}
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
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
  },
  stepCircleActive: {
    backgroundColor: '#16a34a',
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
    maxHeight: 500,
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
    color: '#6b7280',
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
    borderColor: '#16a34a',
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
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  totalSection: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  nextButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
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
});
