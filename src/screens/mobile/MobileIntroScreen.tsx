import React, { useState } from 'react';
import { Droplet, Heart, ShieldCheck, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface MobileIntroScreenProps {
  onGetStarted: () => void;
  onLoginDemo: (role: 'donor' | 'requester') => void;
}

export const MobileIntroScreen: React.FC<MobileIntroScreenProps> = ({
  onGetStarted,
  onLoginDemo,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      title: 'Urgent Blood Matching',
      desc: 'Connect directly with nearby verified donors in acute trauma, surgical, and thalassemia emergencies.',
      icon: Heart,
      stat: '14 min avg response',
    },
    {
      title: 'Real-time Donor Dispatch',
      desc: 'Instant GPS alerts based on exact blood compatibility (O-, A+, B+, AB-) and clinical hospital radius.',
      icon: MapPin,
      stat: '100% verified hospitals',
    },
    {
      title: 'Drives, Streaks & Badges',
      desc: 'Earn honors, track eligibility cooldowns, reserve slots at community blood camps, and download certificates.',
      icon: ShieldCheck,
      stat: '3 lives saved per unit',
    },
  ];

  const currentSlide = slides[slideIndex];
  const CurrentIcon = currentSlide.icon;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-6 justify-between relative overflow-hidden select-none">
      {/* Background ambient medical glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-rose-800/15 blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="pt-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-lg font-['Syne'] tracking-tight">LifePulse</span>
        </div>
        <button
          onClick={() => onLoginDemo('donor')}
          className="text-xs text-slate-400 hover:text-white font-medium px-2 py-1 rounded-lg transition-colors"
        >
          Skip Intro
        </button>
      </div>

      {/* Center Presentation Graphic & Carousel */}
      <div className="my-auto py-8 text-center space-y-6 z-10">
        {/* Pulsing Droplet Crest */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-600/30 animate-ping [animation-duration:3s]" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-2xl shadow-rose-600/40 border border-rose-400/30">
            <CurrentIcon className="w-12 h-12 text-white stroke-[2]" />
          </div>
        </div>

        <div className="space-y-2 max-w-xs mx-auto">
          <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/40">
            {currentSlide.stat}
          </div>
          <h2 className="text-2xl font-black font-['Syne'] tracking-tight leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentSlide.desc}
          </p>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                slideIndex === i ? 'w-6 bg-rose-500' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="space-y-3 z-10 pb-4">
        <button
          onClick={onGetStarted}
          className="w-full h-13 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 transition-transform"
        >
          <span>Get Started & Register</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onLoginDemo('donor')}
            className="py-3 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-800 transition-colors text-center"
          >
            Demo as Donor
          </button>
          <button
            onClick={() => onLoginDemo('requester')}
            className="py-3 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-800 transition-colors text-center"
          >
            Demo as Hospital
          </button>
        </div>
      </div>
    </div>
  );
};
