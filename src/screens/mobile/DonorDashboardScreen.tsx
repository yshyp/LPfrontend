import React, { useState, useMemo } from 'react';
import { BloodGroup, BloodRequest } from '../../types/blood';
import {
  Heart,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Share2,
  MessageCircle,
  Flame,
  Radio,
  Sliders,
  ChevronRight,
  Phone,
  Navigation
} from 'lucide-react';
import { LifePulseIcon } from '../../components/common/LifePulseIcon';

interface DonorDashboardScreenProps {
  userBloodGroup: BloodGroup;
  requests: BloodRequest[];
  onSelectRequest: (req: BloodRequest) => void;
  onOpenChat: (req: BloodRequest) => void;
  onShare: (req: BloodRequest) => void;
  onOpenSOS: () => void;
  onOpenCompatibility: () => void;
}

export const DonorDashboardScreen: React.FC<DonorDashboardScreenProps> = ({
  userBloodGroup,
  requests,
  onSelectRequest,
  onOpenChat,
  onShare,
  onOpenSOS,
  onOpenCompatibility,
}) => {
  // States from LPfrontend DonorDashboardScreen
  const [availability, setAvailability] = useState<boolean>(true);
  const [searchRadius, setSearchRadius] = useState<number>(20); // 5, 10, 20, 50, 100 km
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>('All');
  const [dashboardTab, setDashboardTab] = useState<'nearby' | 'accepted'>('nearby');
  const [acceptedIds, setAcceptedIds] = useState<string[]>(['req-101']); // sample accepted request
  const [isRefreshing, setIsRefreshing] = useState(false);

  const radiusOptions = [5, 10, 20, 50, 100];
  const bloodGroups: (string)[] = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle pull/click refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (r.distanceKm > searchRadius) return false;
      if (bloodTypeFilter !== 'All' && r.bloodGroup !== bloodTypeFilter) return false;
      return true;
    });
  }, [requests, searchRadius, bloodTypeFilter]);

  const acceptedRequests = requests.filter((r) => acceptedIds.includes(r.id));

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* Donor Availability & Status Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LifePulseIcon size={44} />
            <div>
              <div className="font-bold text-slate-900 text-sm font-['Syne'] flex items-center gap-1.5">
                <span>Blood Type {userBloodGroup}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-500">
                {availability ? 'Available for emergency dispatch' : 'Unavailable (Off Duty)'}
              </div>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <button
            type="button"
            onClick={() => setAvailability(!availability)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              availability ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
            aria-label="Toggle availability"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                availability ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Eligibility quick banner */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900">Eligible to Donate</span>
              <span className="text-emerald-700 text-[11px]"> · Cooldown complete (90d+)</span>
            </div>
          </div>
          <button
            onClick={onOpenCompatibility}
            className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-0.5"
          >
            <span>Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs: Nearby Urgent Requests vs Accepted Donations */}
      <div className="flex p-1 bg-slate-200/80 rounded-2xl font-semibold">
        <button
          onClick={() => setDashboardTab('nearby')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            dashboardTab === 'nearby'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Urgent Nearby ({filteredRequests.length})
        </button>
        <button
          onClick={() => setDashboardTab('accepted')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            dashboardTab === 'accepted'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Pledges ({acceptedRequests.length})
        </button>
      </div>

      {dashboardTab === 'nearby' ? (
        <div className="space-y-3">
          {/* Filters: Search Radius + Blood Type Pills */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            {/* Radius Options */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Search Radius:</span>
              <div className="flex items-center gap-1">
                {radiusOptions.map((rad) => (
                  <button
                    key={rad}
                    onClick={() => setSearchRadius(rad)}
                    className={`px-2 py-0.8 rounded-lg text-[11px] font-bold transition-all ${
                      searchRadius === rad
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {rad}km
                  </button>
                ))}
              </div>
            </div>

            {/* Blood Type Horizontal Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">Blood:</span>
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBloodTypeFilter(bg)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 transition-colors ${
                    bloodTypeFilter === bg
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Requests Feed */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <p className="font-semibold text-slate-700">No requests within {searchRadius}km</p>
              <p className="text-slate-400 text-[11px]">
                Widen your search radius or clear the blood type filter to see more emergency needs.
              </p>
              <button
                onClick={() => {
                  setSearchRadius(50);
                  setBloodTypeFilter('All');
                }}
                className="mt-2 text-rose-600 font-bold text-xs"
              >
                Reset to 50km
              </button>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isCritical = req.urgency === 'Critical';
              const isAccepted = acceptedIds.includes(req.id);

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border bg-white shadow-xs space-y-3 transition-all ${
                    isCritical
                      ? 'border-rose-300 ring-1 ring-rose-500/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-['Syne'] font-black text-base shrink-0 shadow-xs ${
                          isCritical ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
                        }`}
                      >
                        <span>{req.bloodGroup}</span>
                        <span className="text-[9px] font-bold opacity-80 -mt-1">{req.unitsNeeded}u</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{req.patientName}</span>
                          <span className="text-slate-400 text-xs">({req.patientAge}y)</span>
                        </div>
                        <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                          {req.hospitalName}
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{req.distanceKm} km away</span>
                          <span>·</span>
                          <span>{req.requiredBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          isCritical
                            ? 'bg-rose-100 text-rose-700'
                            : req.urgency === 'Urgent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {req.reason}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onShare(req)}
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Share request"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenChat(req)}
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Direct chat with coordinator"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectRequest(req)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                        isAccepted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{isAccepted ? 'Pledged (View Details)' : 'I Can Donate'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Accepted Pledges List */
        <div className="space-y-3">
          {acceptedRequests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <p className="font-semibold text-slate-700">No active donation pledges</p>
              <p className="text-slate-400 text-[11px]">
                When you accept an urgent blood request, patient and hospital coordination details will appear here.
              </p>
            </div>
          ) : (
            acceptedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 rounded-2xl border border-emerald-200 ring-1 ring-emerald-500/10 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-800 text-xs">Pledged & Coordinating</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs font-['Syne']">{req.bloodGroup}</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{req.patientName}</h4>
                  <div className="text-slate-500 text-[11px]">{req.hospitalName} - {req.hospitalAddress}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Contact: {req.contactName} ({req.contactPhone})</div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(req.hospitalAddress)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center font-bold text-[11px] flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </a>
                  <button
                    onClick={() => onOpenChat(req)}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-center font-bold text-[11px] flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
