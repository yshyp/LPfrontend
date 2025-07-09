# LifePulse Icon Set

## Icon Concept: Heart + Pulse/ECG

This icon set features a red heart with a white ECG pulse line running through it, designed to be:
- **Clean and medical**: Professional appearance suitable for healthcare apps
- **Recognizable**: Clear heart and pulse line that's instantly identifiable
- **Scalable**: Works well at all sizes from favicon to app store icons

## Icon Files

### SVG Versions (Source Files)
- `heart-pulse-icon.svg` - Full version with detailed ECG line and background circle
- `heart-pulse-icon-simple.svg` - Simplified version for smaller sizes
- `heart-pulse-app-icon.svg` - App icon version (square format, no background)

### Required PNG Conversions

To generate the required PNG files for your React Native app, you'll need to convert the SVG files to the following sizes:

#### For `icon.png` (App Icon)
- **Size**: 1024x1024 pixels
- **Source**: Use `heart-pulse-app-icon.svg`
- **Usage**: Main app icon for app stores

#### For `adaptive-icon.png` (Android Adaptive Icon)
- **Size**: 1024x1024 pixels  
- **Source**: Use `heart-pulse-app-icon.svg`
- **Usage**: Android adaptive icon foreground

#### For `splash-icon.png` (Splash Screen)
- **Size**: 1024x1024 pixels
- **Source**: Use `heart-pulse-icon.svg` (with background circle)
- **Usage**: App splash screen

#### For `favicon.png` (Web Favicon)
- **Size**: 32x32 pixels
- **Source**: Use `heart-pulse-icon-simple.svg`
- **Usage**: Web favicon

## Conversion Tools

### Option 1: Online SVG to PNG Converters
- [Convertio](https://convertio.co/svg-png/)
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [SVG to PNG](https://svgtopng.com/)

### Option 2: Command Line (if you have ImageMagick)
```bash
# Install ImageMagick first, then:
magick heart-pulse-app-icon.svg -resize 1024x1024 icon.png
magick heart-pulse-app-icon.svg -resize 1024x1024 adaptive-icon.png
magick heart-pulse-icon.svg -resize 1024x1024 splash-icon.png
magick heart-pulse-icon-simple.svg -resize 32x32 favicon.png
```

### Option 3: Design Software
- **Figma**: Import SVG and export as PNG
- **Adobe Illustrator**: Open SVG and export as PNG
- **Inkscape**: Open SVG and export as PNG

## Color Scheme

- **Heart**: Red (#e74c3c) with darker stroke (#c0392b)
- **ECG Line**: White (#ffffff)
- **Background**: White (#ffffff) with light gray border (#e0e0e0)

## Design Features

1. **Medical Authenticity**: The ECG line follows realistic pulse patterns
2. **High Contrast**: Red heart on white background ensures visibility
3. **Scalability**: Clean vector design works at any size
4. **Brand Recognition**: Heart + pulse clearly communicates health/life monitoring

## Implementation

After converting to PNG, update your `app.json` to use the new icons:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## Testing

After implementing the new icons:
1. Test on different device sizes
2. Verify visibility in app stores
3. Check splash screen appearance
4. Test favicon on web version 