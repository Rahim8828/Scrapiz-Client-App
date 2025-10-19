# Rates Tab Color Update

## Overview
Updated all category headers in the Rates tab to use a consistent green gradient background, and changed all price range text to green color for maximum readability and brand consistency.

## Changes Made

### 1. File: `data/scrapData.ts`

#### Updated All Category Colors
Changed all categories to use green color scheme:
- **Metal Scrap**: Changed from yellow (#f59e0b) to green (#16a34a)
- **Electronic Scrap**: Changed from purple (#8b5cf6) to green (#16a34a)
- **Paper Scrap**: Was already green (#10b981) → standardized to #16a34a
- **Plastic Scrap**: Changed from blue (#3b82f6) to green (#16a34a)

**Before:**
```typescript
{
  id: 'metal',
  color: '#f59e0b',      // Yellow
  bgColor: '#fef3c7',    // Light yellow background
}
{
  id: 'electronics',
  color: '#8b5cf6',      // Purple
  bgColor: '#ede9fe',    // Light purple background
}
// etc...
```

**After:**
```typescript
{
  id: 'metal',
  color: '#16a34a',      // Green
  bgColor: '#16a34a',    // Green (for gradient)
}
{
  id: 'electronics',
  color: '#16a34a',      // Green
  bgColor: '#16a34a',    // Green (for gradient)
}
// All categories now use green
```

### 2. File: `app/(tabs)/rates.tsx`

#### A. Category Header - Changed to LinearGradient

**Before:**
```tsx
<View style={[styles.categoryHeader, { backgroundColor: category.bgColor }]}>
  <Text style={[styles.categoryTitle, { color: category.color }]}>
    {category.title}
  </Text>
</View>
```

**After:**
```tsx
<LinearGradient
  colors={['#16a34a', '#15803d']}
  style={styles.categoryHeader}
>
  <Text style={styles.categoryTitle}>
    {category.title}
  </Text>
</LinearGradient>
```

#### B. Price Text - Changed to Black

**Before:**
```tsx
<Text style={[styles.itemRate, { color: category.color }]}>{item.rate}</Text>
```

**After:**
```tsx
<Text style={styles.itemRate}>{item.rate}</Text>
```

#### C. Updated Styles

**categoryTitle style:**
```typescript
categoryTitle: {
  fontSize: 18,
  fontWeight: '600',
  fontFamily: 'Inter-SemiBold',
  color: 'white',  // Added white color for gradient background
},
```

**itemRate style:**
```typescript
itemRate: {
  fontSize: 16,
  fontWeight: '600',
  fontFamily: 'Inter-SemiBold',
  marginBottom: 2,
  color: '#16a34a',  // Added green color for all prices
},
```

## Visual Changes

### Before:
- **Types of Metal Scrap**: Yellow gradient header, orange price text
- **Types of Electronic Scrap**: Purple gradient header, purple price text
- **Types of Paper Scrap**: Light green header, green price text
- **Types of Plastic Scrap**: Blue gradient header, blue price text

### After:
- **All Categories**: Green gradient header (#16a34a → #15803d)
- **All Category Titles**: White text
- **All Price Ranges**: Green text (#16a34a)

## Benefits

1. **Consistent Branding**: All categories now use the app's primary green color
2. **Maximum Readability**: Green price text stands out beautifully on white card backgrounds
3. **Professional Look**: Uniform design creates a more polished appearance
4. **Visual Hierarchy**: Green headers and green prices create perfect brand harmony

## Design Specifications

### Category Headers
- **Gradient**: #16a34a (light green) → #15803d (dark green)
- **Text Color**: White (#FFFFFF)
- **Border Radius**: 12px
- **Padding**: 16px
- **Font**: Inter-SemiBold, 18px

### Price Text
- **Color**: Green (#16a34a)
- **Font**: Inter-SemiBold, 16px
- **Weight**: 600

### Category Icons
- Still use the individual category color for icon backgrounds (when no image)
- This provides subtle visual differentiation while maintaining consistency

## Related Files
- `app/(tabs)/rates.tsx` - Main rates screen component
- `data/scrapData.ts` - Scrap categories and items data

## Testing Checklist
- [ ] All category headers display green gradient
- [ ] All category titles are white and readable
- [ ] All price ranges are green (#16a34a)
- [ ] Green gradient matches app header
- [ ] Cards display correctly on both iOS and Android
- [ ] No color bleeding or rendering issues
- [ ] Icon backgrounds still work when no image available

## Notes
- The LinearGradient component was already imported and used in the header
- No new dependencies were added
- The change is purely visual and doesn't affect functionality
- Category icons still use individual colors for subtle differentiation
