# LifePulse Frontend - Organized Structure

This directory contains the organized frontend code following SOLID principles and best practices.

## 📁 Directory Structure

```
src/
├── components/          # Reusable UI components
│   └── common/         # Common components (Button, Input, Card)
├── config/             # Configuration files
│   └── api.js         # API configuration and endpoints
├── screens/            # Screen components
│   └── auth/          # Authentication screens
├── services/           # Business logic and API services
└── App.js             # Main application component
```

## 🏗️ SOLID Principles Implementation

### 1. **Single Responsibility Principle (SRP)**
- Each service has a single responsibility:
  - `authService.js` - Handles authentication only
  - `userService.js` - Handles user operations only
  - `requestService.js` - Handles blood request operations only
  - `locationService.js` - Handles location operations only
  - `notificationService.js` - Handles push notifications only

### 2. **Open/Closed Principle (OCP)**
- Services are open for extension but closed for modification
- New functionality can be added by extending existing services
- Components can be extended without modifying existing code

### 3. **Liskov Substitution Principle (LSP)**
- All services follow consistent interfaces
- Components can be substituted with similar components
- API service provides consistent methods across all services

### 4. **Interface Segregation Principle (ISP)**
- Services expose only the methods they need
- Components receive only the props they require
- Clean separation of concerns between different services

### 5. **Dependency Inversion Principle (DIP)**
- High-level modules (screens) depend on abstractions (services)
- Low-level modules (services) depend on abstractions (API config)
- Dependencies are injected rather than hardcoded

## 🔧 Services Architecture

### API Service (`apiService.js`)
- Centralized HTTP client with axios
- Request/response interceptors for logging
- Authentication token management
- Error handling and timeout configuration

### Authentication Service (`authService.js`)
- User login and registration
- Token management
- Logout functionality

### User Service (`userService.js`)
- User profile management
- Location updates
- Availability toggling
- Donation history

### Request Service (`requestService.js`)
- Blood request creation
- Nearby requests fetching
- Request acceptance

### Location Service (`locationService.js`)
- Location permission handling
- Current location retrieval
- Distance calculations
- Location formatting

### Notification Service (`notificationService.js`)
- Push notification setup
- Permission handling
- Token management
- Notification listeners

## 🎨 Component Architecture

### Common Components
- **Button**: Reusable button with variants (primary, secondary, danger)
- **Input**: Form input with validation and error handling
- **Card**: Container component with consistent styling

### Screen Components
- **LoginScreen**: User authentication
- **RegisterScreen**: User registration
- **LocationPermissionScreen**: Location access setup
- **DonorDashboardScreen**: Donor-specific dashboard
- **RequesterDashboardScreen**: Requester-specific dashboard
- **NotificationsScreen**: Notification management

## 🚀 Benefits of This Structure

1. **Maintainability**: Easy to locate and modify specific functionality
2. **Testability**: Services can be easily unit tested
3. **Reusability**: Components and services can be reused across the app
4. **Scalability**: Easy to add new features without affecting existing code
5. **Readability**: Clear separation of concerns makes code easier to understand
6. **Debugging**: Isolated services make it easier to debug issues

## 📝 Usage Examples

### Using Services
```javascript
import { authService, userService } from '../services';

// Login
const { token, user } = await authService.login(phone);

// Update location
await userService.updateLocation(longitude, latitude);
```

### Using Components
```javascript
import { Button, Input, Card } from '../components/common';

// In your component
<Button title="Submit" onPress={handleSubmit} />
<Input label="Name" value={name} onChangeText={setName} />
<Card><Text>Content</Text></Card>
```

## 🔄 Migration from Monolithic App.js

The original `App.js` file has been refactored into:
- **Services**: Business logic and API calls
- **Components**: Reusable UI elements
- **Screens**: Individual screen components
- **Configuration**: Centralized settings

This makes the codebase more organized, maintainable, and follows industry best practices. 