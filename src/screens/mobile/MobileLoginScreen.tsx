import React, { useState } from 'react';
import { Droplet, Phone, Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

interface MobileLoginScreenProps {
  onSendOTP: (phone: string, role: 'donor' | 'requester') => void;
  onBack: () => void;
}

export const MobileLoginScreen: React.FC<MobileLoginScreenProps> = ({
  onSendOTP,
  onBack,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 782-9011');
  const [selectedRole, setSelectedRole] = useState<'donor' | 'requester'>('donor');
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [email, setEmail] = useState('alex.donor@lifepulse.org');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendOTP(method === 'phone' ? phoneNumber : email, selectedRole);
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
          Secure Access
        </span>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="my-auto py-4 space-y-6">
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-bold font-['Syne'] text-slate-900 tracking-tight">
            Sign In or Register
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter your mobile number or email to receive a 6-digit one-time passcode.
          </p>
        </div>

        {/* Role Selector Pill Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Select Your Primary Role
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedRole('donor')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                selectedRole === 'donor'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blood Donor
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('requester')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                selectedRole === 'requester'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hospital / Seeker
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">
                {method === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>
              <button
                type="button"
                onClick={() => setMethod(method === 'phone' ? 'email' : 'phone')}
                className="text-rose-600 hover:underline text-[11px]"
              >
                Use {method === 'phone' ? 'Email instead' : 'Phone instead'}
              </button>
            </div>

            <div className="relative">
              {method === 'phone' ? (
                <>
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              By continuing, you agree to LifePulse emergency dispatch protocols and verified medical terms.
            </span>
          </div>

          <button
            type="submit"
            className="w-full h-13 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform"
          >
            <span>Send 6-Digit OTP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="pb-2 text-center text-[11px] text-slate-400">
        Demo test mode: Auto-verification enabled
      </div>
    </div>
  );
};
