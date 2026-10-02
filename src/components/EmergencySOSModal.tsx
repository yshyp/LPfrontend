import React, { useState } from 'react';
import { X, AlertTriangle, Radio, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BloodGroup } from '../types/blood';
import { BLOOD_GROUPS } from '../data/mockData';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSOS: (data: { bloodGroup: BloodGroup; hospital: string; units: number }) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  onBroadcastSOS,
}) => {
  if (!isOpen) return null;

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [units, setUnits] = useState(3);
  const [hospital, setHospital] = useState('Metro Trauma ICU - Trauma Bay 1');
  const [broadcasted, setBroadcasted] = useState(false);

  const handleBroadcast = () => {
    onBroadcastSOS({ bloodGroup, hospital, units });
    setBroadcasted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-300">
        {/* Pulsing Emergency Red Banner */}
        <div className="bg-rose-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white text-rose-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black font-['Syne'] tracking-wide">
              EMERGENCY SOS BROADCAST
            </h3>
            <p className="text-xs text-rose-100 max-w-xs mx-auto">
              Sends an immediate high-priority audio & push alert to all registered compatible donors within a 15km perimeter.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-800">
          {broadcasted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-['Syne']">
                SOS Broadcast Dispatched!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Emergency dispatch transmitted to <span className="font-bold text-slate-900">42 nearby donors</span> and on-call trauma teams. Responses will stream to your phone.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl text-xs mt-3"
              >
                Return to Live Network
              </button>
            </div>
          ) : (
            <>
              {/* Select Emergency Blood Group */}
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-500 block">
                  Critical Blood Type Required
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        bloodGroup === bg
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-600/30'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units & Hospital */}
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-500 block">
                  Units Needed Immediately
                </label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 6].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnits(u)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                        units === u
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {u} Units
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-slate-500 block">
                  Emergency Facility Location
                </label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-2.5 text-rose-800 text-[11px]">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>
                  Please use SOS exclusively for immediate surgical hemorrhage, mass trauma, or acute life-threatening emergencies.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBroadcast}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 transition-all"
                >
                  <Radio className="w-4 h-4 animate-ping" />
                  <span>BROADCAST SOS NOW</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
