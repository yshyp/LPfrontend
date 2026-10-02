import React, { useState } from 'react';
import { DonorProfile } from '../types/blood';
import {
  Trophy,
  Medal,
  Award,
  Heart,
  Flame,
  ShieldCheck,
  Download,
  Share2,
  FileCheck
} from 'lucide-react';

interface LeaderboardViewProps {
  donors: DonorProfile[];
  onOpenCertificate: (donor: DonorProfile) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  donors,
  onOpenCertificate,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all_time' | 'this_year'>('all_time');

  const top3 = donors.slice(0, 3);
  const currentUser = donors.find((d) => d.name.includes('You')) || donors[0];

  return (
    <div className="space-y-6">
      {/* Hero Impact Metrics */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Community Hall of Fame</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Syne']">
              Lifesavers & Donor Rankings
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Celebrating dedicated blood heroes who step up in critical moments. 1 donation can preserve up to 3 patient lives.
            </p>
          </div>

          <button
            onClick={() => onOpenCertificate(currentUser)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all whitespace-nowrap"
          >
            <FileCheck className="w-4 h-4" />
            <span>Generate Donor Certificate</span>
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-['JetBrains_Mono'] text-white">
              8,490
            </div>
            <div className="text-[11px] text-slate-400">Total Units Contributed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-['JetBrains_Mono'] text-rose-400">
              25,470
            </div>
            <div className="text-[11px] text-slate-400">Estimated Lives Saved</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-['JetBrains_Mono'] text-emerald-400">
              1,420
            </div>
            <div className="text-[11px] text-slate-400">Active Verified Donors</div>
          </div>
        </div>
      </div>

      {/* Podium Showcase for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((donor, idx) => {
          const medalColors = [
            'from-amber-500 to-yellow-600 text-white',
            'from-slate-400 to-slate-500 text-white',
            'from-amber-700 to-amber-800 text-white',
          ];
          const rankNames = ['1st Place · Gold', '2nd Place · Silver', '3rd Place · Bronze'];

          return (
            <div
              key={donor.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs relative overflow-hidden flex flex-col justify-between ${
                idx === 0 ? 'border-amber-300 ring-1 ring-amber-400/30' : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r ${medalColors[idx]}`}>
                    {rankNames[idx]}
                  </span>
                  <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-bold font-['Syne'] flex items-center justify-center text-xs">
                    {donor.bloodGroup}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-base font-['Syne'] shadow-xs">
                    {donor.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{donor.name}</h3>
                    <div className="text-xs text-slate-500">{donor.tier}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center p-3 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <div className="font-bold text-slate-900 font-['JetBrains_Mono']">{donor.totalDonations}</div>
                    <div className="text-[10px] text-slate-500">Donations</div>
                  </div>
                  <div>
                    <div className="font-bold text-rose-600 font-['JetBrains_Mono']">{donor.livesSaved}</div>
                    <div className="text-[10px] text-slate-500">Lives Saved</div>
                  </div>
                </div>

                {/* Badges preview */}
                <div className="flex flex-wrap gap-1">
                  {donor.badges.slice(0, 2).map((b) => (
                    <span key={b} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>{donor.streakMonths} mo streak</span>
                </span>
                <button
                  onClick={() => onOpenCertificate(donor)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  View Certificate
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Donors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Regional Donor Standings
          </h3>
          <span className="text-xs text-slate-500">Updated in real-time</span>
        </div>

        <div className="divide-y divide-slate-100">
          {donors.map((donor) => {
            const isMe = donor.name.includes('You');

            return (
              <div
                key={donor.id}
                className={`p-4 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
                  isMe ? 'bg-rose-50/50 font-semibold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-slate-500 font-['JetBrains_Mono']">
                    #{donor.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
                    {donor.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{donor.name}</span>
                      {isMe && (
                        <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-medium">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {donor.tier} · Blood Type {donor.bloodGroup}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-slate-900 font-['JetBrains_Mono']">
                      {donor.totalDonations} Donations
                    </div>
                    <div className="text-[11px] text-rose-600">
                      ~{donor.livesSaved} Lives Impacted
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCertificate(donor)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
                  >
                    Certificate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
