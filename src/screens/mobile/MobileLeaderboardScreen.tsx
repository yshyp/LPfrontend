import React, { useState } from 'react';
import { DonorProfile } from '../../types/blood';
import {
  Trophy,
  Award,
  Flame,
  FileCheck,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { LifePulseIcon } from '../../components/common/LifePulseIcon';

interface MobileLeaderboardScreenProps {
  donors: DonorProfile[];
  onOpenCertificate: (donor: DonorProfile) => void;
}

const BADGES = [
  { min: 10, label: '🥇 Gold Lifesaver' },
  { min: 5, label: '🥈 Silver Lifesaver' },
  { min: 1, label: '🥉 Bronze Lifesaver' },
];

function getBadge(totalDonations: number) {
  for (const b of BADGES) {
    if (totalDonations >= b.min) return b.label;
  }
  return 'Registered Donor';
}

export const MobileLeaderboardScreen: React.FC<MobileLeaderboardScreenProps> = ({
  donors,
  onOpenCertificate,
}) => {
  const currentUser = donors.find((d) => d.name.includes('You')) || donors[0];

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-700/50">
            Leaderboard & Badges
          </span>
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold font-['Syne'] text-white">
            Community Hall of Fame
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Every voluntary donation saves up to 3 patient lives in acute critical care.
          </p>
        </div>

        {/* User Card inside banner */}
        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex flex-col items-center justify-center font-['Syne'] font-black">
              <span>{currentUser.bloodGroup}</span>
            </div>
            <div>
              <div className="font-bold text-white text-xs">{currentUser.name}</div>
              <div className="text-[11px] text-amber-300">{getBadge(currentUser.totalDonations)}</div>
            </div>
          </div>

          <button
            onClick={() => onOpenCertificate(currentUser)}
            className="px-3 py-1.5 bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs rounded-xl shadow-xs"
          >
            Certificate
          </button>
        </div>
      </div>

      {/* Donors List matching LPfrontend LeaderboardScreen */}
      <div className="space-y-2">
        {donors.map((donor, index) => {
          const isTop3 = index < 3;
          const isMe = donor.name.includes('You');
          const badge = getBadge(donor.totalDonations);

          return (
            <div
              key={donor.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                isMe
                  ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-500/20'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank container */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-['JetBrains_Mono'] ${
                    index === 0
                      ? 'bg-amber-500 text-white shadow-xs'
                      : index === 1
                      ? 'bg-slate-400 text-white'
                      : index === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  #{index + 1}
                </div>

                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>{donor.name}</span>
                    {isMe && (
                      <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="font-semibold text-rose-600 font-['Syne']">{donor.bloodGroup}</span>
                    <span>·</span>
                    <span>{badge}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-900 font-['JetBrains_Mono'] text-xs">
                  {donor.totalDonations} Donations
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  ~{donor.livesSaved} Lives Saved
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
