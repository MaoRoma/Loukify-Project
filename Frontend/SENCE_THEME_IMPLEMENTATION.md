# Sence Theme Implementation

## Overview
Successfully implemented the **Sence** theme to match the Figma design provided. The theme features a modern, elegant design with golden accents and a clean layout.

## Theme Characteristics

### Color Palette
- **Primary Color**: `#1a1a1a` (Dark charcoal for header and text)
- **Secondary Color**: `#D4AF37` (Rich gold for buttons and accents)
- **Accent Color**: `#C9A961` (Lighter gold for hover states)
- **Background**: `#F5F5F5` (Light gray)
- **Text**: `#1a1a1a` (Dark charcoal)

### Typography
- **Heading Font**: Inter
- **Body Font**: Inter
- **Heading Size**: 48px
- **Body Size**: 14px

### Layout
- **Products Per Row**: 3 (masonry layout)
- **Spacing**: 20px
- **Card Style**: Minimal
- **Button Style**: Rounded

## Key Features

### 1. Dark Announcement Bar
- Dark background (#1a1a1a) with white text
- Displays promotional messages like "Free shipping on orders over $50"

### 2. Golden Action Buttons
- All primary action buttons use the golden color (#D4AF37)
- White text for contrast
- Includes:
  - "Shop Now" button in hero section
  - "Add to Cart" buttons on product cards
  - "Subscribe" button in newsletter section

### 3. Golden Promotional Banner
- Full-width banner with golden background
- White text and contrasting white button
- Perfect for highlighting sales and promotions

### 4. Clean Product Cards
- Minimal design with 3-column grid layout
- Product image placeholder
- Product name and price
- Golden "Add to Cart" button

### 5. Newsletter Section
- Centered layout with email input
- Golden subscribe button
- Matches overall theme aesthetic

## Files Modified

1. **`/src/lib/constants/themePresets.ts`** (NEW)
   - Created theme preset configurations
   - Defined `senceTheme` with all settings
   - Helper function `getThemeById()`

2. **`/src/components/admin/online-store/customize/theme/ThemeCards.tsx`**
   - Added preview modal functionality
   - Connected preview button to theme presets
   - Added navigation to customize page with theme parameter

3. **`/src/components/admin/online-store/customize/theme/ThemeCustomize.tsx`**
   - Added support for URL theme parameter
   - Dynamic theme loading based on selected theme
   - Updates when theme changes

4. **`/src/components/admin/online-store/customize/preview/HomePageStore.tsx`**
   - Updated button colors to use `colors.secondary` (golden)
   - Updated promotional banner to use golden background

5. **`/src/components/admin/online-store/customize/preview/PreviewFooter.tsx`**
   - Updated subscribe button to use golden color

## How to Use

### Preview the Sence Theme
1. Navigate to **Admin > Online Store > Themes**
2. Find the "Sence" theme card
3. Click the **"Preview"** button
4. View the theme in a modal with full preview

### Customize the Sence Theme
1. Navigate to **Admin > Online Store > Themes**
2. Find the "Sence" theme card
3. Click **"Add Theme"** or **"Customize"** (if it's the current theme)
4. The customizer will load with Sence theme settings
5. Modify colors, typography, layout, and sections as needed
6. Click **"Save Changes"** to apply

### Switch Between Themes
- The URL parameter `?theme=sense` or `?theme=dawn` controls which theme is loaded
- Reset button restores theme to original preset values
- All changes are live-previewed

## Matching Figma Design

The implementation closely matches the Figma design:

✅ **Header**: Dark background with navigation and cart icon  
✅ **Hero Section**: Large heading with golden "Shop Now" button  
✅ **Product Grid**: 3-column layout with minimal cards  
✅ **Product Cards**: Clean design with golden "Add to Cart" buttons  
✅ **Promotional Banner**: Full-width golden banner with "Summer Sale"  
✅ **Newsletter**: Clean subscription form with golden button  
✅ **Footer**: Multi-column layout with contact info and copyright  

## Testing

To test the implementation:

```bash
# Make sure the dev server is running
npm run dev

# Navigate to:
http://localhost:3000/admin/online-store

# Click on "Themes" or "Customize"
```

## Future Enhancements

Potential improvements:
- Add theme installation/activation workflow
- Save customizations to database
- Export theme settings
- Import custom themes
- A/B testing between themes
- Theme marketplace integration

## Notes

- All button colors now use the `secondary` color for consistency
- The theme automatically adapts to different viewport sizes
- Color scheme provides excellent contrast and accessibility
- Easy to extend with additional themes using the same pattern
