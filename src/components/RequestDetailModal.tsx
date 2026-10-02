import React, { useState } from 'react';
import { BloodRequest } from '../types/blood';
import {
  X,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Heart,
  Navigation,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Droplet
} from 'lucide-react';

interface RequestDetailModalProps {
  request: BloodRequest | null;
  onClose: () => void;
  onConfirmPledge: (requestId: string, units: number) => void;
  onStartChat: (request: BloodRequest) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  onClose,
  onConfirmPledge,
  onStartChat,
}) => {
  if (!request) return null;

  const [pledgeUnits, setPledgeUnits] = useState(1);
  const [agreedChecklist, setAgreedChecklist] = useState({
    hydrated: true,
    healthy: true,
    ageWeight: true,
    noAlcohol: true
  });
  const [pledgedSuccess, setPledgedSuccess] = useState(false);

  const allChecked = Object.values(agreedChecklist).every(Boolean);

  const handlePledge = () => {
    onConfirmPledge(request.id, pledgeUnits);
    setPledgedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-rose-600 flex flex-col items-center justify-center shadow-lg font-['Syne']">
              <span className="text-2xl font-black leading-none">{request.bloodGroup}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700 mt-1">Needed</span>
            </div>
            <div>
              <div className="text-xs uppercase font-semibold tracking-wider text-rose-200">
                {request.urgency} Blood Emergency
              </div>
              <h3 className="text-xl font-bold font-['Syne'] leading-snug">
                Patient: {request.patientName}
              </h3>
              <div className="text-xs text-rose-100 mt-1">
                Age: {request.patientAge} years · Requires {request.unitsNeeded} units total
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {pledgedSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-['Syne']">
                Thank you for pledging!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your pledge of <span className="font-bold text-slate-900">{pledgeUnits} unit</span> has been recorded. The hospital coordinator has been notified of your commitment.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="font-semibold text-slate-900">Hospital Contact & Location:</div>
                <div className="text-slate-700">{request.hospitalName} - {request.hospitalAddress}</div>
                <div className="text-slate-700">Contact: {request.contactName} ({request.contactPhone})</div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(request.hospitalAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Start Navigation</span>
                </a>
                <button
                  onClick={() => {
                    onClose();
                    onStartChat(request);
                  }}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Coordinator Chat</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Medical Reason */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Medical Urgency Summary
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed text-xs">
                  {request.reason}
                </div>
              </div>

              {/* Hospital Location & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Hospital Location</span>
                  </div>
                  <div className="font-bold text-slate-900">{request.hospitalName}</div>
                  <div className="text-slate-500 text-[11px]">{request.hospitalAddress}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Time Window</span>
                  </div>
                  <div className="font-bold text-slate-900">{request.requiredBy}</div>
                  <div className="text-slate-500 text-[11px]">
                    Current Progress: {request.unitsPledged} of {request.unitsNeeded} units pledged
                  </div>
                </div>
              </div>

              {/* Coordinator Contact */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    {request.contactName[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{request.contactName}</div>
                    <div className="text-[11px] text-slate-500">{request.contactPhone}</div>
                  </div>
                </div>
                <a
                  href={`tel:${request.contactPhone}`}
                  className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              {/* Units Pledge Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Units You Can Donate
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setPledgeUnits(u)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        pledgeUnits === u
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {u} {u === 1 ? 'Unit (Whole Blood)' : 'Units (Double Red / Platelet)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pre-donation checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pre-Donation Donor Self-Check</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedChecklist.healthy}
                      onChange={(e) => setAgreedChecklist({ ...agreedChecklist, healthy: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>I am feeling well today with no cold, fever, or infectious symptoms.</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedChecklist.ageWeight}
                      onChange={(e) => setAgreedChecklist({ ...agreedChecklist, ageWeight: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>I am between 18–65 years of age and weigh at least 50kg (110 lbs).</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedChecklist.noAlcohol}
                      onChange={(e) => setAgreedChecklist({ ...agreedChecklist, noAlcohol: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>I have not consumed alcohol in the last 24 hours.</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedChecklist.hydrated}
                      onChange={(e) => setAgreedChecklist({ ...agreedChecklist, hydrated: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>I am well hydrated and had a light meal recently.</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!allChecked}
                  onClick={handlePledge}
                  className={`flex-1 py-3 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    allChecked
                      ? 'bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-rose-600/30'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Confirm Donation Pledge</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
