import React from 'react';

interface LifePulseIconProps {
  size?: number;
  heartColor?: string;
  pulseColor?: string;
  backgroundColor?: string;
  showShadow?: boolean;
  className?: string;
}

export const LifePulseIcon: React.FC<LifePulseIconProps> = ({
  size = 56,
  heartColor = '#e11d48',
  pulseColor = '#ffffff',
  backgroundColor = '#ffffff',
  showShadow = true,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={heartColor} />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          {showShadow && (
            <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="rgba(225, 29, 72, 0.25)" />
            </filter>
          )}
        </defs>

        {/* Outer Circular Shield */}
        <circle
          cx="512"
          cy="512"
          r="480"
          fill={backgroundColor}
          stroke="#f1f5f9"
          strokeWidth="12"
        />

        {/* Heart Path */}
        <path
          d="M512 750c-8-6.4-160-128-160-224 0-64 48-112 112-112 32 0 60 13.6 80 36 20-22.4 48-36 80-36 64 0 112 48 112 112 0 96-152 217.6-160 224z"
          fill="url(#heartGradient)"
          filter={showShadow ? 'url(#iconShadow)' : undefined}
        />

        {/* Heart Soft Highlight */}
        <ellipse
          cx="480"
          cy="420"
          rx="26"
          ry="38"
          fill="rgba(255,255,255,0.3)"
          transform="rotate(-25 480 420)"
        />

        {/* Pulse ECG Line */}
        <path
          d="M200 512 L320 512 L350 480 L380 544 L410 400 L440 624 L470 512 L500 512 L530 480 L560 544 L590 512 L720 512"
          fill="none"
          stroke={pulseColor}
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulse Subtle Depth */}
        <path
          d="M200 516 L320 516 L350 484 L380 548 L410 404 L440 628 L470 516 L500 516 L530 484 L560 548 L590 516 L720 516"
          fill="none"
          stroke="rgba(190, 18, 60, 0.3)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
