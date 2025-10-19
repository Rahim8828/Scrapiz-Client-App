# Profile Photo Upload Feature

## Overview
Added a plus icon overlay on the profile picture in the Profile tab header that allows users to add or update their profile photo directly from the gallery.

## Changes Made

### File: `app/(tabs)/profile.tsx`

#### 1. **New Imports**
- Added `Plus` icon from `lucide-react-native`
- Added `* as ImagePicker from 'expo-image-picker'`

#### 2. **New Function: `handleProfileImagePick`**
A complete image picker implementation that:
- Requests media library permissions from the user
- Shows a permission alert if access is denied
- Launches the image picker with:
  - Image-only selection
  - 1:1 aspect ratio cropping
  - 0.8 quality compression
- Handles the selected image URI
- Shows success/error alerts

```typescript
const handleProfileImagePick = async () => {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Please allow access...');
    return;
  }

  // Launch picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const imageUri = result.assets[0].uri;
    // TODO: Upload to server and update profile context
  }
};
```

#### 3. **UI Changes**
- Wrapped the avatar in a `TouchableOpacity` with `onPress={handleProfileImagePick}`
- Added a plus icon overlay positioned at the bottom-right of the avatar
- The plus icon is in a white circular container with a green border

**Avatar Structure:**
```tsx
<TouchableOpacity onPress={handleProfileImagePick} style={styles.avatarWrapper}>
  {/* Avatar Image or Initials */}
  <View style={styles.plusIconContainer}>
    <Plus size={16} color="#16a34a" strokeWidth={3} />
  </View>
</TouchableOpacity>
```

#### 4. **New Styles**
- **`avatarWrapper`**: Wraps the avatar with relative positioning for the plus icon overlay
- **`plusIconContainer`**: Absolutely positioned white circle with green border containing the plus icon
  - Positioned at bottom-right (bottom: 0, right: 0)
  - 24x24 circular container
  - White background with green border matching app theme

## User Experience Flow

1. **User taps the profile picture** → Image picker permissions requested (if not already granted)
2. **User grants permission** → Native photo library opens
3. **User selects a photo** → Crop/edit screen appears with 1:1 aspect ratio
4. **User confirms** → Alert shows success message
5. **Future:** Image should be uploaded to server and profile context updated

## Dependencies Used
- `expo-image-picker` (already installed in package.json v17.0.8)
- `lucide-react-native` (Plus icon)

## TODO / Future Enhancements
1. **Backend Integration**: Upload the selected image to your server
2. **Profile Context Update**: Save the image URI in ProfileContext
3. **Loading State**: Show a spinner while uploading
4. **Error Handling**: Better error messages for network failures
5. **Image Optimization**: Resize before upload to reduce bandwidth
6. **Camera Option**: Add option to take a new photo with the camera
7. **Remove Photo**: Add option to remove/delete profile photo

## Testing Checklist
- [ ] Plus icon appears on profile picture
- [ ] Tapping profile picture requests permissions
- [ ] Image picker opens after permission granted
- [ ] Selected image can be cropped to square
- [ ] Success alert appears after selection
- [ ] Works with existing profile images
- [ ] Works when no profile image (shows initials)
- [ ] Loading state shows spinner appropriately

## Visual Design
- Plus icon: 16px, green (#16a34a), stroke-width 3
- Icon container: 24x24px white circle
- Border: 2px green (#16a34a)
- Position: Bottom-right corner of avatar
- Avatar: 64x64px circular with white border

## Related Files
- `app/(tabs)/profile.tsx` - Main implementation
- `contexts/ProfileContext.tsx` - Profile data management (needs update for image upload)
- `app/profile/edit-profile.tsx` - Could also benefit from this feature

## Notes
- The feature uses the existing `expo-image-picker` package, no new dependencies needed
- Permissions are requested at runtime as per iOS/Android best practices
- Image quality is set to 0.8 to balance quality and file size
- The UI matches the existing green theme (#16a34a)
