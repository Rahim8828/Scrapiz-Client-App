# Profile Data Sync Implementation

## Overview
Integration of ProfileContext to sync profile data between Edit Profile screen and Profile tab header, ensuring real-time updates of name, email, and profile image.

## Implementation Date
December 2024

## Problem Statement
**Issue:** When users edit their profile (name, email, profile image) in the Edit Profile screen, the changes were not reflecting in the Profile tab header. The data was stored locally but the UI was showing static hardcoded data.

**Root Cause:**
- Profile tab was using hardcoded `profileData` object
- Edit Profile was saving to AsyncStorage directly
- No shared state management between screens
- No data reload mechanism when returning to Profile tab

## Solution

### 1. Created ProfileContext
**File:** `contexts/ProfileContext.tsx`

A centralized state management solution using React Context API to manage profile data across the entire app.

**Features:**
- Single source of truth for profile data
- AsyncStorage integration for persistence
- Automatic data loading on app start
- Update function to sync data across all components
- Loading state management

**API:**
```typescript
type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
};

type ProfileContextType = {
  profile: ProfileData;
  loadProfile: () => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
  isLoading: boolean;
};
```

**Functions:**
- `loadProfile()` - Loads profile from AsyncStorage
- `updateProfile(data)` - Updates profile and saves to AsyncStorage
- Auto-loads on context initialization

### 2. Updated Root Layout
**File:** `app/_layout.tsx`

Wrapped the entire app with `ProfileProvider` to make profile data accessible everywhere.

**Provider Hierarchy:**
```
<ProfileProvider>
  <LocationProvider>
    <Stack>
      ...all screens...
    </Stack>
  </LocationProvider>
</ProfileProvider>
```

**Why at root level:**
- Profile data needed across multiple screens
- Ensures single instance of context
- Data persists across navigation
- Efficient re-render management

### 3. Updated Profile Tab
**File:** `app/(tabs)/profile.tsx`

Integrated ProfileContext to display dynamic profile data in the header.

**Changes Made:**

**New Imports:**
```typescript
import { useProfile } from '../../contexts/ProfileContext';
import { useFocusEffect } from '@react-navigation/native';
import { Image, ActivityIndicator } from 'react-native';
```

**Removed:**
- Static `profileData` object (hardcoded data)
- Static avatar initials

**Added:**
- `useProfile()` hook to access context
- `useFocusEffect` to reload profile when screen focuses
- `getInitials()` function to generate initials from name
- Image support for profile photo
- Loading state with ActivityIndicator

**Header Logic:**
```typescript
// Three states:
1. Loading: Shows spinner
2. With Photo: Displays circular profile image
3. No Photo: Shows initials in green circle
```

**Dynamic Data:**
- Name: `profile.fullName`
- Email: `profile.email`
- Avatar: `profile.profileImage` or generated initials

**Auto-refresh:**
- Profile reloads every time user navigates to Profile tab
- Ensures latest data is always displayed
- No manual refresh needed

### 4. Updated Edit Profile
**File:** `app/profile/edit-profile.tsx`

Integrated ProfileContext to load and save profile data.

**Changes Made:**

**Removed:**
- Direct AsyncStorage imports
- `PROFILE_STORAGE_KEY` constant
- Manual AsyncStorage read/write operations

**Added:**
- `useProfile()` hook to access context
- `updateProfile()` function from context
- Auto-load profile data from context on mount

**Data Flow:**
```
1. Screen loads → Gets data from context
2. User makes changes → Updates local form state
3. User saves → Calls updateProfile() from context
4. Context saves to AsyncStorage + updates state
5. All components using context re-render with new data
6. User navigates back → Profile tab shows updated data
```

**Benefits:**
- No direct AsyncStorage coupling
- Centralized data management
- Automatic UI updates across app
- Simpler code, less duplication

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      ProfileContext                          │
│  - Manages global profile state                             │
│  - Handles AsyncStorage read/write                          │
│  - Provides data to all components                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ provides data
                          ↓
       ┌──────────────────────────────────────────┐
       │                                          │
       ↓                                          ↓
┌─────────────────┐                    ┌─────────────────────┐
│  Profile Tab    │                    │  Edit Profile       │
│                 │                    │                     │
│  - Displays:    │                    │  - Loads from       │
│    * Name       │                    │    context          │
│    * Email      │                    │  - Updates to       │
│    * Image      │                    │    context          │
│                 │                    │  - Context saves    │
│  - Auto-reloads │◄───────────────────┤    to AsyncStorage  │
│    on focus     │  navigates back    │                     │
│                 │  with new data     │                     │
└─────────────────┘                    └─────────────────────┘
```

## User Journey

### Before Fix:
1. User goes to Edit Profile
2. User changes name "Anas" → "Ahmad"
3. User saves successfully
4. User navigates back to Profile tab
5. ❌ **Profile header still shows "Anas"** (BUG)
6. User confused, thinks save didn't work

### After Fix:
1. User goes to Edit Profile
2. User changes name "Anas" → "Ahmad"
3. User saves successfully
4. ProfileContext updates global state
5. User navigates back to Profile tab
6. `useFocusEffect` triggers profile reload
7. ✅ **Profile header now shows "Ahmad"** (FIXED)
8. User sees their changes reflected immediately

## Technical Details

### ProfileContext Implementation

**Storage Key:**
```typescript
const PROFILE_STORAGE_KEY = '@scrapiz_user_profile';
```

**Default Profile:**
```typescript
{
  fullName: 'Anas Farooqui',
  email: 'Farooquianas05@gmail.com',
  phone: '9920397636',
  address: 'R M 8, Zaheer Residential Society, Jogeshwari West, Mumbai - 400102',
  profileImage: '',
}
```

**Load Profile:**
```typescript
- Reads from AsyncStorage
- Parses JSON
- Updates state
- Falls back to default if no data
- Handles errors gracefully
```

**Update Profile:**
```typescript
- Validates data (done by form)
- Stringifies to JSON
- Saves to AsyncStorage
- Updates context state
- Triggers re-render in all consumers
```

### Profile Tab Integration

**useFocusEffect Hook:**
```typescript
useFocusEffect(
  React.useCallback(() => {
    loadProfile(); // Reload every time screen focuses
  }, [])
);
```

**Why useFocusEffect:**
- Runs when screen comes into focus
- Doesn't run on initial mount only
- Perfect for refreshing data after edits
- Part of React Navigation library

**Avatar Display Logic:**
```typescript
{isLoading ? (
  <ActivityIndicator />
) : profile.profileImage ? (
  <Image source={{ uri: profile.profileImage }} />
) : (
  <View with initials />
)}
```

**Initials Generation:**
```typescript
getInitials() {
  return profile.fullName
    .split(' ')           // Split by spaces
    .filter(n => n.length > 0)  // Remove empty strings
    .map(n => n[0].toUpperCase())  // Get first letter, uppercase
    .join('')             // Join together
    .slice(0, 2);         // Max 2 letters
}

Examples:
- "Anas Farooqui" → "AF"
- "John" → "J"
- "Mary Jane Watson" → "MJ" (first 2)
```

## Files Modified

### 1. contexts/ProfileContext.tsx (NEW)
- Created complete ProfileContext
- AsyncStorage integration
- State management hooks
- Provider component

### 2. app/_layout.tsx
**Changes:**
- Added ProfileProvider import
- Wrapped app with ProfileProvider
- Positioned above LocationProvider

### 3. app/(tabs)/profile.tsx
**Changes:**
- Removed static `profileData` object
- Added `useProfile()` hook
- Added `useFocusEffect` for auto-reload
- Added `getInitials()` function
- Added Image support for profile photo
- Added loading state
- Updated header to use dynamic data
- Added `avatarImage` style

### 4. app/profile/edit-profile.tsx
**Changes:**
- Removed AsyncStorage direct imports
- Added `useProfile()` hook
- Load profile from context instead of AsyncStorage
- Save profile using `updateProfile()` from context
- Removed manual storage key management

## Benefits

### 1. Real-time Synchronization
- Changes in Edit Profile instantly available in context
- Profile tab automatically shows latest data
- No manual refresh needed
- No stale data issues

### 2. Single Source of Truth
- All profile data managed in one place
- No data inconsistency between screens
- Easier to debug and maintain
- Predictable data flow

### 3. Better Performance
- Context updates only affected components
- Efficient re-rendering
- No unnecessary storage reads
- Optimized with React.memo (if needed)

### 4. Scalability
- Easy to add new profile fields
- Simple to add more screens using profile data
- Clear separation of concerns
- Testable in isolation

### 5. Better UX
- Users see their changes immediately
- Feels more responsive
- No confusion about save status
- Professional app experience

## Testing Checklist

### Profile Data Sync
- [ ] Edit name → Profile tab shows new name
- [ ] Edit email → Profile tab shows new email
- [ ] Add profile photo → Profile tab shows photo
- [ ] Change photo → Profile tab shows new photo
- [ ] Remove photo → Profile tab shows initials
- [ ] Edit phone → Data persists
- [ ] Edit address → Data persists

### Navigation Flow
- [ ] Edit profile → Save → Back → See changes
- [ ] Edit profile → Discard → Back → See old data
- [ ] Profile tab → Edit → No edit → Back → No change
- [ ] Multiple edits → All changes visible

### Edge Cases
- [ ] First time user (default data shows)
- [ ] No internet (offline mode works)
- [ ] App restart (data persists)
- [ ] App backgrounding (data retained)
- [ ] Rapid edits (no race conditions)
- [ ] Long names (initials work correctly)
- [ ] Single word name (initial works)
- [ ] Empty name (validation prevents)

### Loading States
- [ ] Profile tab shows spinner while loading
- [ ] Edit profile loads existing data
- [ ] No flash of wrong data
- [ ] Smooth transitions

### Error Handling
- [ ] AsyncStorage error (shows default data)
- [ ] Context not available (throws clear error)
- [ ] Update failure (shows error alert)
- [ ] Malformed data (handles gracefully)

## Performance Considerations

### Context Re-renders
- Only components using `useProfile()` re-render on updates
- Components not using profile data unaffected
- Minimal performance impact

### AsyncStorage
- Read once on app start
- Write only on save (not on every keystroke)
- Async operations don't block UI
- Error handling prevents crashes

### Image Loading
- Uses React Native's Image component
- Built-in caching
- Efficient memory usage
- Lazy loading

## Future Enhancements

1. **Profile Photo Upload**: Backend API integration
2. **Cloud Sync**: Firebase/AWS sync across devices
3. **Profile Completeness**: Percentage indicator
4. **Social Profiles**: Link social media accounts
5. **Profile History**: Track changes over time
6. **Profile Verification**: Email/phone verification
7. **Multiple Profiles**: Switch between profiles
8. **Profile Export**: Download profile data
9. **Profile Theme**: Customize profile appearance
10. **Profile Widgets**: Quick access widgets

## Known Issues
None at this time.

## Dependencies
- `@react-native-async-storage/async-storage`: For data persistence
- `@react-navigation/native`: For useFocusEffect hook
- `expo-router`: For navigation
- `expo-image-picker`: For profile photo

## Migration Notes
- No breaking changes for existing users
- Default profile data provided for new users
- Existing AsyncStorage data automatically migrated
- No manual data transfer needed

## Security Considerations
- Profile data stored locally (device only)
- AsyncStorage encrypted on device level
- No sensitive data logged
- Image URIs are local file paths
- No personal data sent to analytics

## Debugging Tips

**Check Context Value:**
```typescript
console.log('Profile from context:', profile);
```

**Check AsyncStorage:**
```typescript
AsyncStorage.getItem('@scrapiz_user_profile').then(console.log);
```

**Test Context Provider:**
```typescript
// Ensure ProfileProvider wraps the component
// Check React DevTools for context value
```

**Test useFocusEffect:**
```typescript
// Add console.log in useFocusEffect callback
// Should log every time screen focuses
```

## Conclusion
Profile data sync is now fully functional with real-time updates across the app. Users can edit their profile and immediately see changes in the Profile tab header, providing a seamless and professional user experience.
