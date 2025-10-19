# Sell Tab Guidelines Modal

## Overview
Added an informational modal that appears when users enter the Sell tab, displaying important guidelines and restrictions about what Scrapiz accepts.

## Feature Details

### Modal Display
- **Trigger**: Automatically shows when user opens the Sell tab
- **State**: `showGuidelinesModal` initially set to `true`
- **Dismissal**: User clicks "Okay, I understand" button

### Guidelines Displayed

The modal shows 4 key guidelines in a 2x2 grid layout:

1. **We do not buy Wood & Glass**
   - Visual: 🪵🍾 emojis with red X mark
   - Message: Clearly states wood and glass items not accepted

2. **We do not buy Clothes**
   - Visual: 👕👖 emojis with red X mark
   - Message: Informs users clothing items are not accepted

3. **We buy only in scrap rates**
   - Visual: 🪑💻 emojis with red X mark
   - Message: Sets expectation that items valued at scrap rates only

4. **Free pickup only above 15 kg**
   - Visual: ⚖️📦 emojis with "15 kg" badge
   - Message: Minimum weight requirement for free pickup service

## Implementation

### File Modified
- `app/(tabs)/sell.tsx`

### Components Added

#### 1. Modal Import
```typescript
import { Modal } from 'react-native';
```

#### 2. State Management
```typescript
const [showGuidelinesModal, setShowGuidelinesModal] = useState(true);
```

#### 3. Modal Structure
```tsx
<Modal
  animationType="fade"
  transparent={true}
  visible={showGuidelinesModal}
  onRequestClose={() => setShowGuidelinesModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Header */}
      {/* Guidelines Grid */}
      {/* Close Button */}
    </View>
  </View>
</Modal>
```

#### 4. Guideline Cards
Each card includes:
- Light beige background (#fef9f0)
- Image container with yellow background (#fef3c7)
- Emojis representing the category
- Red X mark overlay for restrictions
- Descriptive text below

## Design Specifications

### Modal
- **Overlay**: Semi-transparent black (rgba(0, 0, 0, 0.6))
- **Background**: White with 24px border radius
- **Max Width**: 400px
- **Max Height**: 85% of screen
- **Shadow**: Heavy shadow for prominence

### Cards
- **Size**: 48% width (2 cards per row)
- **Background**: #fef9f0 (light beige)
- **Border Radius**: 16px
- **Padding**: 16px
- **Min Height**: 160px
- **Gap**: 12px between cards

### Image Container
- **Size**: 100% width × 100px height
- **Background**: #fef3c7 (light yellow)
- **Border Radius**: 12px
- **Content**: Emojis (48px font size)

### Cross Mark
- **Color**: #dc2626 (red)
- **Size**: 40px
- **Position**: Centered absolutely
- **Stroke Width**: 4px (bold)

### Weight Badge (15 kg card)
- **Position**: Bottom-right of image container
- **Background**: White
- **Padding**: 12px horizontal, 6px vertical
- **Border Radius**: 8px
- **Font**: 16px, bold

### Button
- **Type**: LinearGradient
- **Colors**: ['#16a34a', '#15803d'] (green gradient)
- **Padding**: 16px vertical, 32px horizontal
- **Border Radius**: 16px
- **Text**: White, 16px, semi-bold

## User Flow

1. User taps on "Sell" tab
2. Modal immediately appears with guidelines
3. User reads the 4 important points
4. User taps "Okay, I understand"
5. Modal closes with fade animation
6. User proceeds to select items

## Benefits

1. **Clear Communication**: Sets expectations upfront
2. **Prevents Invalid Requests**: Users know restrictions before selecting items
3. **Professional Appearance**: Well-designed informational screen
4. **Better User Experience**: Avoids disappointment and confusion
5. **Time Saving**: Reduces support queries about restrictions

## Future Enhancements

### Potential Additions
1. **Checkbox "Don't show again"**: Remember user preference
2. **Animated Illustrations**: Replace emojis with custom images
3. **More Guidelines**: Add additional rules as needed
4. **Multi-language Support**: Translate guidelines
5. **Interactive Tutorial**: Guide users through the booking process

### Analytics Tracking
- Track how many users see the modal
- Monitor dismissal rate
- Measure impact on valid orders

## Technical Details

### Animation
- **Type**: Fade in/out
- **Duration**: Default React Native animation timing
- **Transparent**: True (shows underlying screen)

### Accessibility
- Modal can be closed via back button (Android)
- Clear, readable text
- High contrast colors
- Large touch targets

### Performance
- Lightweight implementation
- No external dependencies
- Minimal re-renders
- Efficient state management

## Related Files
- `app/(tabs)/sell.tsx` - Main sell tab with modal

## Testing Checklist
- [ ] Modal appears on Sell tab load
- [ ] All 4 guidelines display correctly
- [ ] Emojis render properly
- [ ] Cross marks visible on restriction cards
- [ ] "15 kg" badge displays on weight card
- [ ] Button gradient renders correctly
- [ ] Button closes modal on tap
- [ ] Modal can be dismissed via back button (Android)
- [ ] Smooth fade animation
- [ ] No performance issues
- [ ] Text is readable on all devices
- [ ] Layout responsive on different screen sizes

## Notes
- Modal uses transparent overlay for better UX
- Cards use warm colors (beige/yellow) for friendly feel
- Green button matches app branding
- Design closely matches the provided screenshot
- Emojis used instead of images for simplicity (can be replaced with actual images later)
