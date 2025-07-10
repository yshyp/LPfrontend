#!/bin/bash

echo "🚀 Starting Production APK Build for LifePulse..."

# Set production environment
export REACT_APP_ENV=production
export REACT_APP_API_URL=https://your-production-backend.com
export REACT_APP_DEBUG=false

echo "📦 Environment variables set for production"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf dist/

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Build APK for internal distribution
echo "🔨 Building APK for internal distribution..."
eas build --platform android --profile production

echo "✅ Production APK build completed!"
echo "📱 APK will be available for download from EAS" 