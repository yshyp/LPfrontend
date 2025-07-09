# ECG Pulse Loader Component

A realistic ECG (Electrocardiogram) monitor-style loading animation component for React Native applications, specifically designed for medical and health-related apps like LifePulse.

## Features

- **Realistic ECG Waveform**: Simulates actual ECG patterns with P wave, QRS complex, and T wave
- **Grid Lines**: Background grid lines for authentic monitor appearance
- **Moving Pulse Dot**: Animated dot that moves across the waveform
- **Heartbeat Animation**: Scale animation that mimics a heartbeat
- **Heart Icon Overlay**: Medical-themed heart icon in the corner
- **Customizable**: Size, color, speed, and text can be customized
- **Smooth Animations**: Uses React Native's Animated API for smooth performance

## Usage

```jsx
import ECGPulseLoader from './components/common/ECGPulseLoader';

// Basic usage
<ECGPulseLoader text="Loading..." />

// Customized
<ECGPulseLoader 
  size={200}
  color="#FF3B30"
  text="Processing your request..."
  speed={1.5}
  style={{ marginVertical: 20 }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | 200 | Width of the ECG monitor (height is 60% of width) |
| `color` | string | '#FF3B30' | Color of the ECG waveform and elements |
| `text` | string | null | Optional text to display below the loader |
| `style` | object | {} | Additional styles for the container |
| `speed` | number | 1.5 | Animation speed multiplier (higher = faster) |

## Implementation Details

### ECG Waveform Components

The loader creates a realistic ECG pattern using multiple animated lines:

1. **P Wave**: Small bump representing atrial depolarization
2. **QRS Complex**: Sharp spike representing ventricular depolarization
3. **T Wave**: Rounded bump representing ventricular repolarization
4. **Base Line**: Horizontal line connecting the waveform segments

### Animation System

- **Pulse Animation**: Controls the opacity of different waveform segments
- **Line Animation**: Moves the pulse dot across the monitor
- **Heartbeat Animation**: Scales the entire monitor to simulate heartbeat
- **Grid Lines**: Static background grid for authentic appearance

### Performance

- Uses `useNativeDriver: true` where possible for optimal performance
- Minimal re-renders with proper use of `useRef` and `useEffect`
- Efficient animation loops that clean up properly

## Integration

The ECG Pulse Loader has been integrated throughout the LifePulse app:

- **Login Screen**: "Sending verification code..." and "Verifying code..."
- **Register Screen**: "Creating your account..."
- **Dashboard Screens**: "Loading nearby requests..." and "Loading your requests..."
- **Blood Camps Screen**: "Loading blood camps..."
- **Leaderboard Screen**: "Loading leaderboard..."
- **Button Component**: Replaces ActivityIndicator in loading buttons
- **Verification Method Selector**: Loading state for code sending

## Styling

The component uses a medical-themed design:

- **Background**: Light gray (#F8F9FA) with subtle border
- **Grid Lines**: Light gray (#E5E5EA) with low opacity
- **Waveform**: Customizable color (default: medical red #FF3B30)
- **Heart Icon**: White background with shadow for depth
- **Text**: Bold, centered text below the monitor

## Accessibility

- Supports screen readers with proper text labels
- High contrast colors for visibility
- Scalable design that works with different screen sizes
- Smooth animations that respect user's motion preferences

## Future Enhancements

- Add sound effects for heartbeat (optional)
- Support for different ECG patterns (normal, abnormal)
- Configurable grid density
- Dark mode support
- More waveform variations 