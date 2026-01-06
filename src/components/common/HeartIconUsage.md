# HeartIcon Component Usage Guide

## Overview
The `HeartIcon` component provides a customizable heart icon for use throughout the LifePulse app. It supports different variants, sizes, and colors.

## Basic Usage

```jsx
import { HeartIcon } from '../components/common';

// Basic heart icon
<HeartIcon />

// Custom size and color
<HeartIcon size={32} color="#e74c3c" />

// Outline variant
<HeartIcon variant="outline" size={24} color="#c0392b" />

// With pulse indicator
<HeartIcon showPulse={true} size={40} color="#e74c3c" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | 24 | Size of the icon in pixels |
| `color` | string | '#e74c3c' | Color of the heart icon |
| `variant` | string | 'filled' | Icon variant: 'filled', 'outline', 'pulse' |
| `showPulse` | boolean | false | Whether to show a pulse indicator |
| `style` | object | undefined | Additional styles to apply |

## Variants

### Filled Heart (default)
```jsx
<HeartIcon variant="filled" />
```
- Solid red heart icon
- Default appearance for the app

### Outline Heart
```jsx
<HeartIcon variant="outline" />
```
- Hollow heart outline
- Good for secondary actions or inactive states

### Pulse Heart
```jsx
<HeartIcon variant="pulse" />
```
- Heart with pulse animation indicator
- Use for active states or notifications

## Color Options

The component supports any valid color value:

```jsx
// Brand colors
<HeartIcon color="#e74c3c" />  // Primary red
<HeartIcon color="#c0392b" />  // Darker red
<HeartIcon color="#e67e22" />  // Orange
<HeartIcon color="#9b59b6" />  // Purple

// Custom colors
<HeartIcon color="#ff6b6b" />  // Custom red
<HeartIcon color="#4ecdc4" />  // Teal
```

## Size Examples

```jsx
<HeartIcon size={16} />  // Small (16px)
<HeartIcon size={24} />  // Default (24px)
<HeartIcon size={32} />  // Medium (32px)
<HeartIcon size={48} />  // Large (48px)
<HeartIcon size={64} />  // Extra large (64px)
```

## Use Cases

### Navigation Icons
```jsx
// In tab navigation or header
<HeartIcon size={20} color="#e74c3c" />
```

### Action Buttons
```jsx
// Like/favorite button
<HeartIcon 
  size={24} 
  color={isLiked ? "#e74c3c" : "#ccc"} 
  variant={isLiked ? "filled" : "outline"}
/>
```

### Status Indicators
```jsx
// Active donation status
<HeartIcon 
  size={32} 
  color="#e74c3c" 
  showPulse={true}
/>
```

### List Items
```jsx
// In blood donation lists
<HeartIcon size={16} color="#e74c3c" />
```

## Styling

You can apply additional styles using the `style` prop:

```jsx
<HeartIcon 
  size={32} 
  style={{ 
    marginRight: 8,
    opacity: 0.8 
  }} 
/>
```

## Best Practices

1. **Consistent Sizing**: Use standard sizes (16, 20, 24, 32, 48) for consistency
2. **Color Hierarchy**: Use primary red (#e74c3c) for main actions, lighter colors for secondary
3. **Accessibility**: Ensure sufficient contrast between icon and background
4. **Performance**: The component is lightweight and can be used frequently

## Integration with App Theme

The heart icon integrates with the LifePulse app's medical/healthcare theme:

- **Primary Color**: #e74c3c (medical red)
- **Secondary Color**: #c0392b (darker red for emphasis)
- **Accent Colors**: Various colors for different states and categories

## Demo Component

See `HeartIconDemo.js` for a complete example of all variants and use cases. 