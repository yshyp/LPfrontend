import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

interface MobileOTPScreenProps {
  contactValue: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export const MobileOTPScreen: React.FC<MobileOTPScreenProps> = ({
  contactValue,
  onVerifySuccess,
  onBack,
}) => {
  const [digits, setDigits] = useState(['4', '8', '2', '9', '1', '0']);
  const [countdown, setCountdown] = useState(45);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (val: string, idx: number) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = cleaned;
    setDigits(newDigits);

    if (cleaned && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const isComplete = digits.every((d) => d !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onVerifySuccess();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 justify-between p-6 select-none">
      {/* Top Header */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Verification
        </span>
        <div className="w-10" />
      </div>

      {/* Center Body */}
      <div className="my-auto py-4 space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-7 h-7 stroke-[2]" />
          </div>
          <h2 className="text-2xl font-bold font-['Syne'] text-slate-900">
            Enter 6-Digit Code
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            We sent a verification code to <span className="font-semibold text-slate-800">{contactValue}</span>
          </p>
        </div>

        {/* 6 Digit Input Boxes */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputsRef.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`w-11 h-14 text-center text-lg font-bold font-['JetBrains_Mono'] rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
                  digit
                    ? 'bg-rose-50/50 border-rose-400 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            ))}
          </div>

          <div className="text-center text-xs text-slate-500">
            {countdown > 0 ? (
              <span>Resend code in <strong className="text-slate-800">{countdown}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={() => setCountdown(45)}
                className="text-rose-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend OTP Code</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!isComplete}
            className={`w-full h-13 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform ${
              isComplete
                ? 'bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-rose-600/30 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Verify & Continue</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="pb-2 text-center text-[11px] text-slate-400">
        Demo Auto-Fill: 4 8 2 9 1 0 is loaded for rapid review
      </div>
    </div>
  );
};
