import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, ArrowRight } from 'lucide-react';

interface MobileLocationScreenProps {
  onEnableLocation: (city: string) => void;
  onSkip: () => void;
}

export const MobileLocationScreen: React.FC<MobileLocationScreenProps> = ({
  onEnableLocation,
  onSkip,
}) => {
  const [selectedCity, setSelectedCity] = useState('Metro City');

  const cities = ['Metro City', 'North Health District', 'South Memorial Suburbs', 'East Harbor Area'];

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 justify-between p-6 select-none">
      {/* Top indicator */}
      <div className="pt-2 flex items-center justify-between">
        <div className="w-10" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Step 2 of 2
        </span>
        <button
          onClick={onSkip}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="my-auto py-4 space-y-6 text-center">
        {/* Animated Radar Pulse */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping [animation-duration:2.5s]" />
          <div className="absolute w-24 h-24 rounded-full bg-rose-500/20" />
          <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 relative z-10">
            <Navigation className="w-8 h-8 fill-current stroke-[1.5]" />
          </div>
        </div>

        <div className="space-y-2 max-w-xs mx-auto">
          <h2 className="text-2xl font-bold font-['Syne'] text-slate-900">
            Enable Location Access
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            LifePulse uses your approximate geolocation to alert you to critical blood emergencies at hospitals within your immediate 5–15 km travel perimeter.
          </p>
        </div>

        {/* City selection pills */}
        <div className="space-y-2 text-left pt-2">
          <label className="text-xs font-semibold text-slate-700 block text-center">
            Or select your primary medical zone:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                  selectedCity === city
                    ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-2">
        <button
          onClick={() => onEnableLocation(selectedCity)}
          className="w-full h-13 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform"
        >
          <MapPin className="w-4 h-4" />
          <span>Allow While Using App ({selectedCity})</span>
        </button>

        <button
          onClick={onSkip}
          className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
        >
          I will select location later
        </button>
      </div>
    </div>
  );
};
