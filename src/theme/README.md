# Bedfellow Brand Theme System

## Overview

The Bedfellow theme system implements a comprehensive brand color palette that provides consistent visual identity across the application. The theme system supports light/dark modes, dynamic color extraction from album artwork, and maintains WCAG accessibility standards.

## Brand Colors

### Primary Palette

- **Teal (#008585)**: Primary brand color for buttons, links, and key accents
- **Sage (#74A892)**: Secondary brand color for secondary CTAs and badges
- **Rust (#C7522A)**: Accent color for error states and critical actions

### Base Colors

- **Sand-50 (#FEF9E0)**: Base page background
- **Sand-100 (#FBF2C4)**: Subtle sections and tiles
- **Sand-300 (#E5C185)**: Surfaces and warm highlights

### Text Colors

- **Slate-900 (#343941)**: Primary text color
- **Slate-600 (#535A63)**: Muted text color
- **Info-600 (#64748B)**: Info states and messages

## Theme Structure

```typescript
interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: SpacingScale;
  typography: TypographyScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  gradients?: GradientPresets;
}
```

## Color Scales

Each brand color has a complete scale from 50 (lightest) to 900 (darkest):

- **Sand Scale**: Warm, natural tones for backgrounds
- **Teal Scale**: Primary brand color variations
- **Sage Scale**: Secondary brand color variations
- **Rust Scale**: Accent/danger color variations
- **Slate Scale**: Text and neutral UI elements
- **Info Scale**: Informational states

## Gradients

The theme includes predefined gradients:

- **Brand Gradient**: Sage to Teal transition (90deg, #74A892 → #008585)
- **Button Gradient**: Subtle teal variations for interactive elements
- **Header Gradient**: Sand to light teal for headers
- **Accent Gradient**: Rust variations for emphasis
- **Overlay Gradient**: Dark fade for content overlays

## Dynamic Color Integration

The theme system integrates with album artwork color extraction:

1. Colors are extracted from album artwork
2. Extracted colors are blended with brand colors (30% brand influence by default)
3. Brand colors (teal, sage) are preserved to maintain visual identity
4. Contrast is automatically enhanced for accessibility

### Configuration Options

```typescript
interface ColorExtractionOptions {
  blendWithBrand?: boolean; // Enable brand color blending
  brandInfluence?: number; // 0-100% brand influence strength
  enhanceContrast?: boolean; // Ensure WCAG compliance
}
```

## Accessibility

### Contrast Standards

The theme maintains WCAG AA compliance:

- **Normal Text**: 4.5:1 contrast ratio
- **Large Text**: 3:1 contrast ratio (18pt+ or 14pt+ bold)

### Key Contrast Ratios

- Primary text on sand backgrounds: **10.98:1** ✓
- Muted text on sand backgrounds: **7.38:1** ✓
- Interactive elements (buttons): **4.2-4.3:1** (passes Large Text AA)

### Usage Guidelines

- Use brand colors (teal, sage, rust) for interactive elements with large/bold text
- For body text, use slate-900 (#343941) and slate-600 (#535A63)
- Ensure touch targets meet minimum size requirements

## Shadow System

Shadows use the brand slate color (#343941) with varying opacity:

- **sm**: 12% opacity
- **base**: 14% opacity (card shadow)
- **md**: 16% opacity
- **lg**: 18% opacity
- **xl**: 20% opacity

## Usage Examples

### Using Theme in Components

```typescript
import { useTheme } from '../../context/ThemeContext';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background[50] }}>
      <Text style={{ color: theme.colors.text[900] }}>
        Hello World
      </Text>
    </View>
  );
};
```

### Creating Themed Styles

```typescript
import { createThemedStyles } from '../../theme/utils';

export const styles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface[100],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.base,
  },
  text: {
    color: theme.colors.text[600],
    fontSize: theme.typography.base,
  },
}));
```

### Using Gradients

```typescript
import LinearGradient from 'react-native-linear-gradient';
import { getGradientForRN } from '../../theme/gradients';

const GradientButton = () => {
  const gradient = getGradientForRN('brand');

  return (
    <LinearGradient
      colors={gradient.colors}
      start={gradient.start}
      end={gradient.end}
      locations={gradient.locations}
    >
      <Text>Gradient Button</Text>
    </LinearGradient>
  );
};
```

## File Structure

```
src/theme/
├── colors/
│   ├── brandColors.ts        # Brand color definitions and scales
│   └── semanticColors.ts     # Semantic color mappings
├── themes/
│   ├── dark.ts              # Dark theme configuration
│   ├── light.ts             # Light theme configuration
│   └── *.test.ts            # Theme tests
├── scales/
│   └── index.ts             # Spacing, typography, shadows
├── utils/
│   └── colorGenerator.ts    # Color scale generation utilities
├── gradients.ts             # Gradient system
└── types/
    └── index.ts             # TypeScript type definitions
```

## Testing

Run theme tests:

```bash
# Accessibility tests
npx jest src/theme/themes/accessibility.test.ts

# Theme integration tests
npx jest src/theme/themes/dark.test.ts

# Color generator tests
npx jest src/theme/utils/colorGenerator.test.ts
```

## Migration Notes

When updating from the previous theme:

1. Components using old green primary colors should now use teal (#008585)
2. Orange secondary colors are replaced with sage (#74A892)
3. Error colors now use rust (#C7522A) instead of generic red
4. Backgrounds use warm sand tones instead of pure grays
5. Shadows use brand slate color with adjusted opacity

## Performance

- Theme object access: < 10ms
- Color scale generation: Cached after first generation
- Dynamic color extraction: Cached for 7 days
- Theme transitions: < 300ms animation duration
