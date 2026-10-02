import React from 'react';
import { DonorProfile, BloodGroup } from '../../types/blood';
import {
  User,
  Heart,
  Award,
  Calendar,
  Flame,
  ShieldCheck,
  FileCheck,
  ChevronRight,
  LogOut,
  MapPin,
  Settings,
  AlertCircle
} from 'lucide-react';

interface MobileProfileScreenProps {
  donor: DonorProfile;
  userRole: 'donor' | 'requester';
  onToggleRole: () => void;
  onOpenCertificate: () => void;
  onOpenEligibility: () => void;
  onOpenMatrix: () => void;
  onChangeBloodGroup: (bg: BloodGroup) => void;
  onSignOut: () => void;
}

export const MobileProfileScreen: React.FC<MobileProfileScreenProps> = ({
  donor,
  userRole,
  onToggleRole,
  onOpenCertificate,
  onOpenEligibility,
  onOpenMatrix,
  onChangeBloodGroup,
  onSignOut,
}) => {
  return (
    <div className="space-y-4 p-4 pb-24 text-xs text-slate-800">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 bg-rose-900/60 px-2.5 py-0.5 rounded-full border border-rose-700/50">
            {donor.tier}
          </span>
          <span className="text-xs text-slate-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{donor.city}</span>
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-white text-rose-600 flex flex-col items-center justify-center font-['Syne'] shadow-lg shrink-0">
            <span className="text-2xl font-black leading-none">{donor.bloodGroup}</span>
            <span className="text-[9px] uppercase font-bold text-slate-600 mt-0.5">Type</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold font-['Syne'] text-white">
              {donor.name}
            </h2>
            <div className="text-xs text-slate-300">
              Verified Lifesaver ID: #LP-89240
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Medical Registry Verified</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-lg font-bold font-['JetBrains_Mono'] text-white">{donor.totalDonations}</div>
            <div className="text-[10px] text-slate-400">Donations</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-lg font-bold font-['JetBrains_Mono'] text-rose-400">{donor.livesSaved}</div>
            <div className="text-[10px] text-slate-400">Lives Saved</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-lg font-bold font-['JetBrains_Mono'] text-amber-400">{donor.streakMonths}mo</div>
            <div className="text-[10px] text-slate-400">Streak</div>
          </div>
        </div>
      </div>

      {/* Primary Action Button: Official Certificate */}
      <button
        onClick={onOpenCertificate}
        className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] border border-rose-200 rounded-2xl shadow-xs flex items-center justify-between text-left transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">Official Appreciation Certificate</div>
            <div className="text-[11px] text-slate-500">View, share or print your lifesaving recognition</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Navigation Menu List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        <button
          onClick={onOpenEligibility}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-rose-600" />
            <div>
              <div className="font-semibold text-slate-900">Check Donation Eligibility</div>
              <div className="text-[11px] text-slate-500">90-day cooldown countdown and health screen</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onOpenMatrix}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-rose-600" />
            <div>
              <div className="font-semibold text-slate-900">Transfusion Compatibility Matrix</div>
              <div className="text-[11px] text-slate-500">See all compatible recipients for your blood type</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="p-3.5 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-600" />
            <div>
              <div className="font-semibold text-slate-900">Active App Mode</div>
              <div className="text-[11px] text-slate-500">Switch between Lifesaver Donor and Hospital Seeker</div>
            </div>
          </div>
          <button
            onClick={onToggleRole}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-xs"
          >
            {userRole === 'donor' ? 'Donor Mode' : 'Seeker Mode'}
          </button>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xs">Achievement Badges</span>
          <span className="text-[11px] text-rose-600 font-semibold">{donor.badges.length} Unlocked</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {donor.badges.map((badge) => (
            <span
              key={badge}
              className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 text-[11px] font-medium"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={onSignOut}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out / Switch Account</span>
      </button>
    </div>
  );
};
