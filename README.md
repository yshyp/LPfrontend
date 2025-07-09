# LifePulse Mobile App

A comprehensive React Native mobile application for blood donation management, connecting donors with those in need.

## 🚀 Features

- **User Authentication**
  - Secure login/registration with OTP verification
  - Biometric authentication support
  - Social media integration
  - Password recovery

- **User Profiles**
  - Complete donor/seeker profiles
  - Medical history tracking
  - Blood group verification
  - Donation history

- **Blood Request Management**
  - Create urgent blood requests
  - Real-time request notifications
  - Location-based donor matching
  - Request status tracking

- **Interactive Maps**
  - Find nearby donors/blood banks
  - Real-time location sharing
  - Route optimization
  - Offline map support

- **Push Notifications**
  - Instant emergency alerts
  - Donation reminders
  - Request updates
  - Achievement notifications

- **Gamification**
  - Donation streaks and badges
  - Leaderboards
  - Achievement system
  - Referral rewards

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Maps**: Expo Location + MapView
- **Notifications**: Expo Notifications
- **Storage**: Expo SecureStore
- **UI Components**: Custom components with React Native Elements
- **Icons**: Expo Vector Icons
- **Charts**: Victory Native
- **Animations**: React Native Reanimated

## 📋 Prerequisites

- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- Physical device or emulator for testing

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lifepulse/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the frontend root directory:
   ```env
   # API Configuration
   API_BASE_URL=http://192.168.1.6:5000
   API_TIMEOUT=10000

   # Maps & Location
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Firebase
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abcdef

   # Expo
   EXPO_PROJECT_ID=your-expo-project-id

   # App Configuration
   APP_VERSION=1.0.0
   BUILD_NUMBER=1
   ```

4. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "LifePulse",
       "slug": "lifepulse",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "userInterfaceStyle": "light",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "plugins": [
         "expo-location",
         "expo-notifications",
         "expo-secure-store"
       ],
       "ios": {
         "bundleIdentifier": "com.yourcompany.lifepulse"
       },
       "android": {
         "package": "com.yourcompany.lifepulse",
         "permissions": [
           "ACCESS_FINE_LOCATION",
           "ACCESS_COARSE_LOCATION",
           "CAMERA",
           "NOTIFICATIONS"
         ]
       }
     }
   }
   ```

5. **Start the development server**
   ```bash
   expo start
   ```

## 📁 Project Structure

```
frontend/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── ECGPulseLoader.js
│   │   │   └── Header.js
│   │   ├── forms/
│   │   └── maps/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── OTPVerificationScreen.js
│   │   ├── main/
│   │   │   ├── HomeScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   ├── RequestScreen.js
│   │   │   └── MapScreen.js
│   │   └── onboarding/
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── TabNavigator.js
│   ├── services/
│   │   ├── apiService.js
│   │   ├── authService.js
│   │   ├── locationService.js
│   │   ├── notificationService.js
│   │   └── secureStorageService.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── LocationContext.js
│   │   └── NotificationContext.js
│   ├── config/
│   │   ├── api.js
│   │   ├── constants.js
│   │   └── theme.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── permissions.js
│   └── styles/
│       ├── globalStyles.js
│       └── colors.js
├── app.json
├── package.json
└── App.js
```

## 🚀 Getting Started

### Development

1. **Start Expo development server**
   ```bash
   expo start
   ```

2. **Run on device/simulator**
   ```bash
   # iOS Simulator (macOS only)
   expo start --ios

   # Android Emulator
   expo start --android

   # Web browser
   expo start --web
   ```

3. **Using Expo Go App**
   - Install Expo Go on your mobile device
   - Scan the QR code from the terminal
   - Enjoy live reloading and debugging

### Building for Production

1. **Configure EAS Build**
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. **Build for Android**
   ```bash
   eas build --platform android
   ```

3. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

4. **Submit to stores**
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

## 📱 App Features

### Authentication Flow
- **Splash Screen** with app branding
- **Onboarding** with feature highlights
- **Registration** with OTP verification
- **Login** with multiple verification methods
- **Biometric** authentication (fingerprint/face)

### Main Features
- **Dashboard** with quick actions and stats
- **Blood Requests** with real-time updates
- **Donor Search** with map integration
- **Profile Management** with medical history
- **Notifications** with push and in-app alerts
- **Settings** with preferences and privacy

### User Experience
- **Offline Support** for core features
- **Dark Mode** support
- **Accessibility** compliance
- **Multi-language** support
- **Smooth Animations** and transitions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

## 📊 Performance Optimization

- **Image Optimization** with WebP format
- **Bundle Splitting** for faster load times
- **Lazy Loading** for screens and components
- **Memory Management** for large lists
- **Network Caching** with AsyncStorage
- **Performance Monitoring** with Flipper

## 🔒 Security Features

- **Secure Storage** for sensitive data
- **API Token** management
- **Certificate Pinning** for API calls
- **Biometric Authentication** support
- **Data Encryption** at rest
- **Privacy Controls** for user data

## 📱 Platform Support

- **iOS**: 11.0+
- **Android**: API level 21+
- **Web**: Modern browsers (Chrome, Firefox, Safari)

## 🎨 Design System

- **Typography**: Poppins font family
- **Colors**: Material Design inspired palette
- **Spacing**: 8px base unit system
- **Components**: Reusable component library
- **Icons**: Consistent icon set
- **Animations**: Subtle and meaningful

## 🌐 Localization

Currently supported languages:
- English (default)
- Spanish
- French
- Hindi

To add a new language:
1. Create translation files in `src/locales/`
2. Update language selector in settings
3. Test all screens with new language

## 🚀 Deployment

### Expo Updates
```bash
# Publish update
expo publish

# Publish to specific channel
expo publish --release-channel production
```

### App Store Deployment
1. Build production app with EAS
2. Test thoroughly on TestFlight/Play Console
3. Submit for review
4. Monitor crash reports and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards
4. Write tests for new features
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@lifepulse.com
- Documentation: [User Guide](https://docs.lifepulse.com)
- Issues: [GitHub Issues](https://github.com/your-repo/lifepulse/issues)

## 🙏 Acknowledgments

- React Native community for the excellent framework
- Expo team for the development platform
- All open-source contributors
- Beta testers and early adopters
- Medical professionals who provided guidance

---

**Made with ❤️ for saving lives through blood donation**