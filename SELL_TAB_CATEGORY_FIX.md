# Sell Tab Step 1 Category Text Fix

## Issue
Category titles in the Sell tab's first step (Select Items) were invisible/missing because green text was being displayed on green background.

## Root Cause
After updating `scrapData.ts` to use green colors for all categories:
- `bgColor: '#16a34a'` (green background)
- `color: '#16a34a'` (green text)

The Sell tab's Step 1 was using:
```tsx
<View style={[styles.categoryHeaderSell, { backgroundColor: category.bgColor }]}>
  <Text style={[styles.categoryTitleSell, { color: category.color }]}>
    {category.title}
  </Text>
</View>
```

This resulted in green text on green background = invisible text!

## Solution Applied

### 1. Updated Category Headers to Use LinearGradient
Changed from solid color View to LinearGradient (consistent with Rates tab):

**Before:**
```tsx
<View style={[styles.categoryHeaderSell, { backgroundColor: category.bgColor }]}>
  <Text style={[styles.categoryTitleSell, { color: category.color }]}>
    {category.title}
  </Text>
</View>
```

**After:**
```tsx
<LinearGradient
  colors={['#16a34a', '#15803d']}
  style={styles.categoryHeaderSell}
>
  <Text style={styles.categoryTitleSell}>
    {category.title}
  </Text>
</LinearGradient>
```

### 2. Updated Category Title Style
Added white color for text on gradient background:

```typescript
categoryTitleSell: {
  fontSize: 16,
  fontWeight: '600',
  fontFamily: 'Inter-SemiBold',
  color: 'white',  // NEW: White text on green gradient
},
```

### 3. Standardized Item Rate Colors
Updated all item rate text to use consistent green color:

**Item rates in category list:**
```typescript
itemRate: {
  fontSize: 13,
  fontWeight: '500',
  fontFamily: 'Inter-Medium',
  marginBottom: 2,
  color: '#16a34a',  // NEW: Green color
},
```

**Item rates in selected items list:**
```typescript
selectedItemRate: {
  fontSize: 12,
  color: '#16a34a',  // Changed from #6b7280 (gray) to green
  fontFamily: 'Inter-Regular',
},
```

### 4. Standardized Add Button Color
Set consistent green background for all add buttons:

```typescript
addButton: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#16a34a',  // NEW: Consistent green
  justifyContent: 'center',
  alignItems: 'center',
},
```

## Changes Summary

### File: `app/(tabs)/sell.tsx`

1. **Category Headers**: Changed from View with dynamic background to LinearGradient
2. **Category Titles**: Now display in white on green gradient (was green on green)
3. **Item Rates**: Changed to green (#16a34a) throughout
4. **Add Buttons**: Standardized to green (#16a34a)
5. **Selected Item Rates**: Changed from gray to green

## Visual Result

### Before (Broken):
- ❌ Category titles invisible (green on green)
- 🎨 Mixed colors for add buttons
- 🔘 Gray selected item rates

### After (Fixed):
- ✅ Category titles visible in white on green gradient
- 🟢 All rates displayed in green (#16a34a)
- 🟢 All add buttons in consistent green
- ✨ Professional, branded appearance throughout

## Benefits

1. **Fixed Visibility Issue**: Category titles now clearly visible
2. **Consistent Branding**: All elements use green theme
3. **Visual Harmony**: Matches Rates tab design
4. **Professional Polish**: Unified color scheme throughout

## Related Files
- `app/(tabs)/sell.tsx` - Main sell/booking screen
- `data/scrapData.ts` - Category data with green colors

## Testing Checklist
- [x] Category titles visible on Step 1
- [x] White text readable on green gradient headers
- [x] Item rates display in green
- [x] Add buttons show in green
- [x] Selected items show green rates
- [x] No TypeScript errors
- [x] Consistent with Rates tab styling

## Notes
- LinearGradient component was already imported in the file
- No new dependencies added
- Fixed critical UX issue where category text was invisible
- Now consistent with Rates tab design pattern
