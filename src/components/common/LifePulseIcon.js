import React from 'react';
import { View } from 'react-native';
import Svg, { 
  Circle, 
  Path, 
  Defs, 
  LinearGradient, 
  Stop,
  Filter,
  FeDropShadow,
  Ellipse
} from 'react-native-svg';

const LifePulseIcon = ({ 
  size = 100, 
  heartColor = '#e74c3c', 
  pulseColor = '#ffffff',
  backgroundColor = '#ffffff',
  showShadow = true 
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        <Defs>
          <LinearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={heartColor} />
            <Stop offset="100%" stopColor="#c0392b" />
          </LinearGradient>
          {showShadow && (
            <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <FeDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(231, 76, 60, 0.2)"/>
            </Filter>
          )}
        </Defs>

        {/* Background */}
        <Circle 
          cx="512" 
          cy="512" 
          r="480" 
          fill={backgroundColor} 
          stroke="#e0e6ed" 
          strokeWidth="4"
        />
        
        {/* Heart */}
        <Path 
          d="M512 750c-8-6.4-160-128-160-224 0-64 48-112 112-112 32 0 60 13.6 80 36 20-22.4 48-36 80-36 64 0 112 48 112 112 0 96-152 217.6-160 224z"
          fill="url(#heartGradient)"
          filter={showShadow ? "url(#shadow)" : undefined}
        />
        
        {/* Heart Highlight */}
        <Ellipse 
          cx="480" 
          cy="420" 
          rx="25" 
          ry="35" 
          fill="rgba(255,255,255,0.3)" 
          transform="rotate(-25 480 420)"
        />
        
        {/* Pulse Line */}
        <Path 
          d="M200 512 L320 512 L350 480 L380 544 L410 400 L440 624 L470 512 L500 512 L530 480 L560 544 L590 512 L720 512"
          fill="none"
          stroke={pulseColor}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Pulse Shadow */}
        <Path 
          d="M200 516 L320 516 L350 484 L380 548 L410 404 L440 628 L470 516 L500 516 L530 484 L560 548 L590 516 L720 516"
          fill="none"
          stroke="rgba(192, 57, 43, 0.3)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default LifePulseIcon; 