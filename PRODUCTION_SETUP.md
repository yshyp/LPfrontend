# LifePulse Production Setup Guide

## 🚀 Building for Production

### Prerequisites
- Node.js 16+ installed
- Expo CLI installed: `npm install -g @expo/cli`
- EAS CLI installed: `npm install -g @eas/cli`

### 1. Environment Setup

Create `.env.production` file:
```bash
REACT_APP_API_URL=https://your-production-backend.com
REACT_APP_ENV=production
REACT_APP_DEBUG=false
```

### 2. Build Commands

#### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @eas/cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

#### Using Expo Classic Build
```bash
# Build Android APK
npm run build:android

# Build iOS
npm run build:ios

# Production build with environment
npm run build:production
```

### 3. Production Checklist

- [ ] ✅ Set `development: false` in `app.json`
- [ ] ✅ Update API URLs to production endpoints
- [ ] ✅ Remove console.log statements (or disable in production)
- [ ] ✅ Test all features thoroughly
- [ ] ✅ Optimize images and assets
- [ ] ✅ Set up proper error handling
- [ ] ✅ Configure push notifications for production
- [ ] ✅ Test on real devices

### 4. Backend Production Setup

Make sure your backend is also configured for production:
- Set `NODE_ENV=production`
- Use production database
- Configure SSL certificates
- Set up proper logging
- Configure CORS for production domain

### 5. Testing Production Build

```bash
# Test production build locally
expo start --no-dev --minify

# Test on device
expo start --tunnel
```

### 6. Deployment

#### Android
- APK will be available for download
- Upload to Google Play Store
- Or distribute directly to users

#### iOS
- IPA will be available for download
- Upload to App Store Connect
- Or distribute via TestFlight

### 7. Monitoring

Set up monitoring for production:
- Crash reporting (Sentry, Bugsnag)
- Analytics (Firebase Analytics, Mixpanel)
- Performance monitoring

### 8. Security Checklist

- [ ] ✅ API endpoints use HTTPS
- [ ] ✅ Sensitive data is encrypted
- [ ] ✅ API keys are secure
- [ ] ✅ User data is protected
- [ ] ✅ Backend has proper authentication

## 🔧 Troubleshooting

### Common Issues

1. **Build fails**: Check environment variables
2. **API errors**: Verify production backend is running
3. **App crashes**: Test on real devices
4. **Performance issues**: Optimize images and code

### Support

For issues with production builds, check:
- Expo documentation
- React Native documentation
- Your backend logs 