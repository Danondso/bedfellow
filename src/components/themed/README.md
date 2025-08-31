# Themed Components

This directory contains themed components that automatically adapt to the current theme settings.

## ThemedButton

A themed button component with multiple variants and sizes.

### Usage

```tsx
import { ThemedButton } from '@components/themed/ThemedButton';

<ThemedButton variant="primary" onPress={handlePress}>
  Click Me
</ThemedButton>;
```

### Props

- `variant`: Button style variant
  - `'primary'` - Primary brand color (teal)
  - `'secondary'` - Secondary brand color (sage)
  - `'accent'` - Accent color (rust)
  - `'ghost'` - Transparent background with primary text
  - `'outline'` - Transparent with primary border
  - `'sage-outline'` - Transparent with sage border
  - `'danger'` - Solid red background for destructive actions
  - `'danger-outline'` - Transparent with red border for destructive actions
  - `'success'` - Green background for success actions
  - `'gradient'` - Gradient background
  - `'spotify'` - Spotify green theme

- `size`: Button size
  - `'small'`
  - `'medium'` (default)
  - `'large'`

- `fullWidth`: Boolean - Makes button full width
- `rounded`: Boolean - Makes button fully rounded
- `loading`: Boolean - Shows loading indicator
- `disabled`: Boolean - Disables button interaction
- `icon`: ReactNode - Icon to display in button
- `iconPosition`: `'left'` | `'right'` - Icon placement

### Variants

#### danger-outline

The `danger-outline` variant is designed for destructive actions that need visual prominence without being too aggressive. It features:

- Transparent background
- Red border and text color
- Subtle red tint on press
- Proper contrast for accessibility

Example:

```tsx
<ThemedButton variant="danger-outline" onPress={handleReset}>
  Reset All Settings
</ThemedButton>
```

## Other Themed Components

- `ThemedText` - Text component with typography variants
- `ThemedView` - View component with theme-aware styling
- `ThemedSafeAreaView` - SafeAreaView with theme colors
- `ThemedCallout` - Callout/alert component
- `ThemeSwitcher` - Theme mode selector component

## Testing

All themed components have corresponding test files in the `__tests__` directory. Run tests with:

```bash
yarn test src/components/themed/__tests__
```
