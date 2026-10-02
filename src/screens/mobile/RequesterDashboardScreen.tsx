import React, { useState } from 'react';
import { BloodGroup, BloodRequest, UrgencyLevel } from '../../types/blood';
import {
  Plus,
  Radio,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MessageCircle,
  Share2
} from 'lucide-react';
import { LifePulseIcon } from '../../components/common/LifePulseIcon';

interface RequesterDashboardScreenProps {
  myRequests: BloodRequest[];
  onOpenCreateRequest: () => void;
  onOpenSOS: () => void;
  onOpenChat: (req: BloodRequest) => void;
  onShare: (req: BloodRequest) => void;
}

export const RequesterDashboardScreen: React.FC<RequesterDashboardScreenProps> = ({
  myRequests,
  onOpenCreateRequest,
  onOpenSOS,
  onOpenChat,
  onShare,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'In Progress' | 'Fulfilled'>('All');

  const filtered = myRequests.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* Hospital / Seeker Emergency Dispatch Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 bg-rose-900/60 px-2.5 py-0.5 rounded-full border border-rose-700/50">
            Hospital / Patient Seeker Console
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold font-['Syne'] text-white">
            Manage Blood Demands
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Broadcast emergency requests to compatible donors nearby and track donor arrivals in real time.
          </p>
        </div>

        {/* 2 Quick CTA Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={onOpenCreateRequest}
            className="py-3 px-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-2xl shadow-md shadow-rose-900/40 flex items-center justify-center gap-1.5 transition-all text-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Request</span>
          </button>

          <button
            onClick={onOpenSOS}
            className="py-3 px-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-2xl border border-white/20 flex items-center justify-center gap-1.5 transition-all text-xs"
          >
            <Radio className="w-4 h-4 text-rose-400 animate-ping" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between px-1">
        <span className="font-bold text-slate-900 text-xs">My Hospital Requests ({filtered.length})</span>
        <div className="flex items-center gap-1">
          {(['All', 'Open', 'Fulfilled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2 py-0.8 rounded-lg text-[10px] font-bold transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <p className="font-semibold text-slate-700">No active requests found</p>
            <p className="text-slate-400 text-[11px] max-w-xs mx-auto">
              You haven't posted any urgent blood requests yet. Click below to broadcast to nearby donors.
            </p>
            <button
              onClick={onOpenCreateRequest}
              className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs"
            >
              Post First Blood Request
            </button>
          </div>
        ) : (
          filtered.map((req) => {
            const isCritical = req.urgency === 'Critical';
            const progress = Math.min(100, Math.round((req.unitsPledged / req.unitsNeeded) * 100));

            return (
              <div
                key={req.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-['Syne'] font-black shrink-0">
                      <span>{req.bloodGroup}</span>
                      <span className="text-[9px] font-bold text-rose-400 -mt-1">{req.unitsNeeded}u</span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        Patient: {req.patientName}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                        {req.hospitalName}
                      </div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Needed: {req.requiredBy}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      isCritical ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Units Pledged: <strong className="text-slate-900">{req.unitsPledged}</strong> of {req.unitsNeeded}
                    </span>
                    <span className="font-bold text-slate-700">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Donors responding & actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong className="text-slate-900">{req.donorsResponding}</strong> donors responding</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onShare(req)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenChat(req)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat Donors</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
