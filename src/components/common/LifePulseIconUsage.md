# LifePulseIcon Component

A customizable React Native SVG component featuring a heart with ECG pulse line, perfect for the LifePulse app.

## Installation

First, install the required dependency:

```bash
npm install react-native-svg
# or
yarn add react-native-svg
```

## Basic Usage

```jsx
import { LifePulseIcon } from '../components/common';

// Default usage
<LifePulseIcon />

// Custom size
<LifePulseIcon size={150} />

// Custom colors
<LifePulseIcon 
  size={100}
  heartColor="#ff6b6b"
  pulseColor="#ffffff"
  backgroundColor="#2c3e50"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | 100 | Size of the icon in pixels |
| `heartColor` | string | '#e74c3c' | Color of the heart |
| `pulseColor` | string | '#ffffff' | Color of the ECG pulse line |
| `backgroundColor` | string | '#ffffff' | Background color |
| `showShadow` | boolean | true | Whether to show the drop shadow |

## Features

### 🎨 Customizable Colors
- Heart color with gradient effect
- Pulse line color
- Background color
- Optional shadow

### 📏 Scalable
- Vector-based design
- Maintains quality at any size
- Responsive to different screen densities

### 🎯 Medical Authenticity
- Realistic ECG pulse pattern
- Professional healthcare appearance
- Clear visual hierarchy

## Examples

### Default Icon
```jsx
<LifePulseIcon />
```

### Small Icon for Lists
```jsx
<LifePulseIcon size={40} />
```

### Large Icon for Headers
```jsx
<LifePulseIcon size={200} />
```

### Custom Theme Colors
```jsx
<LifePulseIcon 
  size={120}
  heartColor="#ff6b6b"
  pulseColor="#ffffff"
  backgroundColor="#2c3e50"
/>
```

### No Shadow Version
```jsx
<LifePulseIcon size={100} showShadow={false} />
```

### Custom Pulse Color
```jsx
<LifePulseIcon 
  size={100}
  pulseColor="#f39c12"
/>
```

## Integration Examples

### In a Header
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifePulseIcon } from '../components/common';

const Header = () => (
  <View style={styles.header}>
    <LifePulseIcon size={40} />
    <Text style={styles.title}>LifePulse</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#2c3e50',
  },
});
```

### In a Card
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifePulseIcon, Card } from '../components/common';

const HealthCard = () => (
  <Card style={styles.card}>
    <View style={styles.cardHeader}>
      <LifePulseIcon size={60} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Heart Rate</Text>
        <Text style={styles.cardValue}>72 BPM</Text>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});
```

### In a Loading State
```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LifePulseIcon } from '../components/common';

const LoadingScreen = () => (
  <View style={styles.container}>
    <LifePulseIcon size={120} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});
```

## Performance Notes

- The component uses React Native SVG for optimal performance
- Vector-based design ensures crisp rendering at all sizes
- Minimal re-renders due to efficient prop handling
- Lightweight and fast loading

## Accessibility

The component is designed to be accessible:
- High contrast colors for visibility
- Scalable for different text sizes
- Clear visual hierarchy
- Recognizable medical symbolism 