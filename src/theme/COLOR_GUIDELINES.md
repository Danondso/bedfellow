# Bedfellow Color Usage Guidelines

## Overview

Bedfellow uses a warm, nostalgic color palette inspired by classic Apple design. Our colors create a welcoming, approachable atmosphere while maintaining professional polish and accessibility.

## Core Brand Colors

### Primary Colors

- **Teal (#008585)**: Primary brand color for main CTAs, links, and key interactive elements
- **Sage (#74A892)**: Secondary brand color for secondary actions and supporting elements
- **Rust (#C7522A)**: Accent color for important callouts and emphasis

### Background Colors (Sand Tones)

- **Sand 50 (#FEF9E0)**: Base page backgrounds, main content areas
- **Sand 100 (#FBF2C4)**: Elevated surfaces, cards, modals
- **Sand 200**: Higher elevation elements, filled components
- **Sand 300 (#E5C185)**: Strong surfaces, selected states

### Text Colors (Slate Tones)

- **Slate 900 (#343941)**: Primary text, headings, important content
- **Slate 700-800**: Body text, standard content
- **Slate 600 (#535A63)**: Muted text, secondary information, captions
- **Slate 500**: Placeholders, disabled text
- **White (#FFFFFF)**: Inverse text on dark backgrounds

## Semantic Colors

### States

- **Success**: Sage green - Positive actions, confirmations
- **Warning**: Amber (#D97706) - Cautions, important notices
- **Error**: Rust - Errors, destructive actions
- **Info**: Warm teal-gray (#5E7A7D) - Informational messages

## Usage Patterns

### Buttons

```
Primary Button:
- Background: Teal 500
- Text: White or Sand 50
- Hover/Press: Teal 600-700

Secondary Button:
- Background: Sage 500
- Text: White or Sand 50
- Hover/Press: Sage 600-700

Accent/Important Button:
- Background: Rust 500
- Text: White
- Hover/Press: Rust 600-700

Ghost Button:
- Background: Transparent
- Text: Teal 500
- Hover/Press: Teal 500 @ 10% opacity

Disabled Button:
- Background: Color 300
- Text: Slate 500
```

### Cards & Surfaces

```
Base Card:
- Background: Sand 100
- Border: Border 200 (optional)
- Shadow: Subtle slate shadow

Elevated Card:
- Background: Sand 100
- Shadow: Medium slate shadow

Selected Card:
- Background: Sand 200
- Border: Teal 500
```

### Forms & Inputs

```
Default Input:
- Background: Sand 50 or transparent
- Border: Border 200
- Text: Slate 900
- Placeholder: Slate 500

Focused Input:
- Border: Teal 500
- Background: Sand 50

Error Input:
- Border: Rust 500
- Helper text: Rust 600
```

### Navigation

```
Active Nav Item:
- Background: Sand 200
- Text: Teal 600
- Icon: Teal 600

Inactive Nav Item:
- Background: Transparent
- Text: Slate 700
- Icon: Slate 600

Hover Nav Item:
- Background: Sand 100
- Text: Slate 900
```

### Badges & Chips

```
Default Badge:
- Background: Teal 500
- Text: White

Important Badge:
- Background: Rust 500
- Text: White

Neutral Badge:
- Background: Sand 200
- Text: Slate 700

Success Badge:
- Background: Sage 500
- Text: White
```

### Callouts & Alerts

```
Important Callout:
- Background: Rust 500 @ 15% opacity
- Border: Rust 500
- Text: Slate 700
- Title: Rust 700

Warning Callout:
- Background: Amber 500 @ 20% opacity
- Border: Amber 500
- Text: Slate 700
- Title: Amber 700

Info Callout:
- Background: Info 500 @ 15% opacity
- Border: Info 500
- Text: Slate 700
- Title: Info 700
```

## Accessibility Guidelines

### Contrast Requirements

All color combinations must meet WCAG AA standards:

- Normal text: 4.5:1 contrast ratio minimum
- Large text (18pt+): 3:1 contrast ratio minimum
- Interactive elements: 3:1 contrast ratio minimum

### Tested Combinations

✅ **High Contrast (AAA)**

- Slate 900 on Sand 50
- White on Teal 600
- White on Rust 600

✅ **Good Contrast (AA)**

- Slate 700 on Sand 100
- Slate 600 on Sand 50
- Teal 600 on Sand 50
- Sage 700 on Sand 100

⚠️ **Use Carefully**

- Sand 300 on Sand 50 (only for decorative elements)
- Sage 500 on Sand 100 (ensure sufficient size)

❌ **Avoid**

- Light text (< Slate 500) on sand backgrounds
- Sand text on sand backgrounds
- Light colors on light backgrounds

## Color Application Best Practices

### Do's

- ✅ Use Teal for primary interactive elements
- ✅ Use Sage for secondary actions
- ✅ Use Rust sparingly for important callouts
- ✅ Maintain consistent color usage across similar elements
- ✅ Use Sand tones to create visual hierarchy through elevation
- ✅ Apply Slate 900 for primary text on light backgrounds
- ✅ Test color combinations for accessibility

### Don'ts

- ❌ Don't use more than 3 primary colors on a single screen
- ❌ Don't use Rust for non-critical elements
- ❌ Don't mix cool and warm grays
- ❌ Don't use pure black (#000000) except for special cases
- ❌ Don't use colors at less than 300 level for text
- ❌ Don't rely on color alone to convey information

## Dynamic Theming

When album artwork influences the theme:

- Maintain 70% brand colors, 30% dynamic colors
- Ensure dynamic colors are warmed to match palette
- Preserve semantic color meanings
- Maintain accessibility standards

## Dark Mode Considerations

Dark mode should maintain the warm aesthetic:

- Use darker sand/brown tones for backgrounds
- Maintain warm undertones in grays
- Adjust teal/sage for sufficient contrast
- Keep rust accent for important elements
- Ensure all text meets contrast requirements

## Implementation Examples

### TypeScript Usage

```typescript
// Using theme colors
const styles = {
  primaryButton: {
    backgroundColor: theme.colors.primary[500], // Teal
    color: theme.colors.text[50], // White
  },
  mutedText: {
    color: theme.colors.text[600], // Muted slate
  },
  warningBadge: {
    backgroundColor: theme.colors.warning[500], // Amber
  },
  cardSurface: {
    backgroundColor: theme.colors.surface[100], // Sand 100
  },
};
```

### Component Variants

```typescript
// Button with semantic variants
<ThemedButton variant="primary">Save Changes</ThemedButton> // Teal
<ThemedButton variant="secondary">Cancel</ThemedButton> // Sage
<ThemedButton variant="danger">Delete</ThemedButton> // Rust

// Callouts with appropriate colors
<ThemedCallout variant="important">Critical update available</ThemedCallout>
<ThemedCallout variant="warning">Your session will expire soon</ThemedCallout>
<ThemedCallout variant="success">Changes saved successfully</ThemedCallout>
```

## Color Palette Reference

For detailed color values and scales, refer to:

- `/src/theme/colors/brandColors.ts` - Brand color definitions
- `/src/theme/themes/brand.ts` - Brand theme implementation
- `/src/theme/scales/` - Color scale utilities

---

_Last updated: 2024_
_Version: 1.0_
