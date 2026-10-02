import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  Heart,
  Scale,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface EligibilityCheckerProps {
  onGoToRequests?: () => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onGoToRequests }) => {
  const [lastDonationDate, setLastDonationDate] = useState<string>('2026-06-15');
  const [weightKg, setWeightKg] = useState<number>(68);
  const [ageYears, setAgeYears] = useState<number>(28);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [donationType, setDonationType] = useState<'whole_blood' | 'platelets'>('whole_blood');

  // Medical questionnaire flags
  const [hasTattooRecent, setHasTattooRecent] = useState<boolean>(false);
  const [hasInfection, setHasInfection] = useState<boolean>(false);
  const [onAntibiotics, setOnAntibiotics] = useState<boolean>(false);
  const [hadVaccineRecent, setHadVaccineRecent] = useState<boolean>(false);

  // Calculation logic:
  // Whole blood: 90 days gap
  // Platelets: 14 days gap
  const cooldownDays = donationType === 'whole_blood' ? 90 : 14;

  const calculateDaysSinceLast = () => {
    if (!lastDonationDate) return 999;
    const last = new Date(lastDonationDate).getTime();
    const today = new Date('2026-10-02').getTime(); // App current time context
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysSince = calculateDaysSinceLast();
  const daysRemaining = Math.max(0, cooldownDays - daysSince);
  const cooldownPassed = daysRemaining === 0;

  // Criteria validation
  const isWeightValid = weightKg >= 50;
  const isAgeValid = ageYears >= 18 && ageYears <= 65;
  const hasNoExclusions = !hasTattooRecent && !hasInfection && !onAntibiotics && !hadVaccineRecent;

  const isFullyEligible = cooldownPassed && isWeightValid && isAgeValid && hasNoExclusions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Donor Readiness Protocol</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Syne']">
          Donation Eligibility & Cooldown Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Blood banks enforce strict safety standards to protect both donors and transfusion recipients. Check your cooldown interval and physical criteria below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs & Health Questionnaire (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>Donation History & Physicals</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Donation Type */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Donation Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDonationType('whole_blood')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition-colors ${
                    donationType === 'whole_blood'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Whole Blood (90d)
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType('platelets')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition-colors ${
                    donationType === 'platelets'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Platelets (14d)
                </button>
              </div>
            </div>

            {/* Last Donation Date */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Date of Last Donation</label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">kg</span>
              </div>
              {weightKg < 50 && (
                <span className="text-[10px] text-rose-600">Min 50kg required</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Age (Years)</label>
              <input
                type="number"
                min="14"
                max="100"
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {(ageYears < 18 || ageYears > 65) && (
                <span className="text-[10px] text-rose-600">Must be 18–65</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Quick Health Checklist */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Clinical Exclusion Screen
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Tattoo or body piercing in the past 6 months?</span>
                <input
                  type="checkbox"
                  checked={hasTattooRecent}
                  onChange={(e) => setHasTattooRecent(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Active cold, fever, cough, or sore throat today?</span>
                <input
                  type="checkbox"
                  checked={hasInfection}
                  onChange={(e) => setHasInfection(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Currently taking prescription antibiotic course?</span>
                <input
                  type="checkbox"
                  checked={onAntibiotics}
                  onChange={(e) => setOnAntibiotics(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Received a live attenuated vaccine within 4 weeks?</span>
                <input
                  type="checkbox"
                  checked={hadVaccineRecent}
                  onChange={(e) => setHadVaccineRecent(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Card: Instant Eligibility Certificate & Status (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isFullyEligible
                ? 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white border-emerald-700/50 shadow-xl'
                : 'bg-white border-slate-200 text-slate-800 shadow-xs'
            }`}
          >
            {isFullyEligible ? (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                    Ready to Save Lives
                  </div>
                  <h3 className="text-xl font-bold font-['Syne'] text-white">
                    You Are Eligible To Donate Today!
                  </h3>
                  <p className="text-xs text-emerald-100/90 leading-relaxed mt-1">
                    It has been <span className="font-bold text-white">{daysSince} days</span> since your last donation, surpassing the {cooldownDays}-day cooldown interval safely.
                  </p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs space-y-1 text-slate-200">
                  <div className="font-semibold text-white">Donation Day Quick Tips:</div>
                  <div>• Drink 500ml of water 30 mins prior</div>
                  <div>• Eat an iron-rich snack (fruits/nuts)</div>
                  <div>• Bring government photo ID to center</div>
                </div>

                {onGoToRequests && (
                  <button
                    onClick={onGoToRequests}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>View Hospital Emergencies Seeking Blood</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Clock className="w-8 h-8 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-amber-600">
                    Cooldown / Restrictions Active
                  </div>
                  <h3 className="text-xl font-bold font-['Syne'] text-slate-900">
                    Not Yet Eligible Today
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Your body needs time to replenish hemoglobin and iron stores before the next donation.
                  </p>
                </div>

                {/* Cooldown progress indicator */}
                {daysRemaining > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">Days Remaining in Cooldown:</span>
                      <span className="font-bold text-rose-600 font-['JetBrains_Mono']">
                        {daysRemaining} Days
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${Math.min(100, Math.round((daysSince / cooldownDays) * 100))}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Eligible on or after: <span className="font-semibold text-slate-800">
                        {new Date(new Date(lastDonationDate).getTime() + cooldownDays * 24 * 3600 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* List failed conditions */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-700">Criteria Status:</div>
                  {!isWeightValid && (
                    <div className="text-rose-600 flex items-center gap-1.5 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Weight must be at least 50 kg (Current: {weightKg} kg)</span>
                    </div>
                  )}
                  {!isAgeValid && (
                    <div className="text-rose-600 flex items-center gap-1.5 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Age must be between 18 and 65 (Current: {ageYears})</span>
                    </div>
                  )}
                  {hasTattooRecent && (
                    <div className="text-rose-600 flex items-center gap-1.5 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Wait 6 months after receiving a tattoo or piercing</span>
                    </div>
                  )}
                  {(hasInfection || onAntibiotics) && (
                    <div className="text-rose-600 flex items-center gap-1.5 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Wait 48 hours after completing antibiotics or acute infection</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
