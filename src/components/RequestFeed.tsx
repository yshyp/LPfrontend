import React, { useState, useMemo } from 'react';
import { BloodGroup, BloodRequest, UrgencyLevel } from '../types/blood';
import { BLOOD_GROUPS } from '../data/mockData';
import {
  Search,
  MapPin,
  Clock,
  Heart,
  Share2,
  MessageCircle,
  ShieldCheck,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

interface RequestFeedProps {
  requests: BloodRequest[];
  userBloodGroup: BloodGroup;
  onSelectRequest: (req: BloodRequest) => void;
  onOpenChat: (req: BloodRequest) => void;
  onPledgeDonation: (req: BloodRequest) => void;
  onShare: (req: BloodRequest) => void;
  onOpenCreateRequest: () => void;
  onOpenCompatibility: () => void;
}

export const RequestFeed: React.FC<RequestFeedProps> = ({
  requests,
  userBloodGroup,
  onSelectRequest,
  onOpenChat,
  onPledgeDonation,
  onShare,
  onOpenCreateRequest,
  onOpenCompatibility,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<number>(50); // km
  const [onlyCompatible, setOnlyCompatible] = useState<boolean>(false);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Search text
      const matchesSearch =
        req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Blood group
      if (selectedGroup !== 'All' && req.bloodGroup !== selectedGroup) {
        return false;
      }

      // Urgency
      if (selectedUrgency !== 'All' && req.urgency !== selectedUrgency) {
        return false;
      }

      // Distance
      if (req.distanceKm > maxDistance) {
        return false;
      }

      return true;
    });
  }, [requests, searchQuery, selectedGroup, selectedUrgency, maxDistance]);

  const criticalCount = requests.filter((r) => r.urgency === 'Critical' && r.status === 'Open').length;

  return (
    <div className="space-y-6">
      {/* Hero Impact Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Active Emergency Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Syne'] leading-tight">
            Every drop connects a pulse to tomorrow.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time blood network matching urgent clinical trauma requests with nearby verified donors. Your blood type is <span className="font-bold text-white bg-rose-600/60 px-2 py-0.5 rounded text-sm">{userBloodGroup}</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCreateRequest}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-rose-900/40"
            >
              Post Urgent Request
            </button>
            <button
              onClick={onOpenCompatibility}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-xs sm:text-sm rounded-xl border border-white/20 transition-all"
            >
              Check Compatibility
            </button>
          </div>
        </div>

        {/* Quick telemetry indicators */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center sm:text-left">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-['JetBrains_Mono'] tabular-nums text-rose-400">
              {criticalCount}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400">Critical Surgeries</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-['JetBrains_Mono'] tabular-nums text-emerald-400">
              ~14 min
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400">Avg Response Time</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-['JetBrains_Mono'] tabular-nums text-white">
              2,840+
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400">Lives Saved Locally</div>
          </div>
        </div>
      </section>

      {/* Search & Filter Header */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospital, trauma ward, patient condition, or city..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Rows */}
        <div className="space-y-3 pt-2">
          {/* Blood Group Segmented Control */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">Blood:</span>
            <button
              onClick={() => setSelectedGroup('All')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedGroup === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              All Groups
            </button>
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedGroup === group
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Urgency & Distance Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Urgency:</span>
              {(['All', 'Critical', 'Urgent', 'Standard'] as const).map((urgency) => (
                <button
                  key={urgency}
                  onClick={() => setSelectedUrgency(urgency)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedUrgency === urgency
                      ? urgency === 'Critical'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-slate-800 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {urgency}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Radius:</span>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={25}>Within 25 km</option>
                <option value={50}>Within 50 km</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span>
          Showing <span className="font-bold text-slate-900 font-['JetBrains_Mono']">{filteredRequests.length}</span> active requests
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Clinical Data</span>
        </span>
      </div>

      {/* Request Cards Feed */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No matching blood requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, widening the radius, or clearing the blood group filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGroup('All');
              setSelectedUrgency('All');
              setMaxDistance(50);
            }}
            className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const isCritical = request.urgency === 'Critical';
            const isFulfilled = request.unitsPledged >= request.unitsNeeded;
            const progressPercent = Math.min(100, Math.round((request.unitsPledged / request.unitsNeeded) * 100));

            return (
              <div
                key={request.id}
                className={`bg-white rounded-2xl border transition-all hover:shadow-md ${
                  isCritical
                    ? 'border-rose-300/80 shadow-xs ring-1 ring-rose-500/10'
                    : 'border-slate-200/90 shadow-xs'
                } p-5 sm:p-6 space-y-4`}
              >
                {/* Top Row: Blood Group Hero + Urgency and Timeframe */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Characterful Blood Type Emblem */}
                    <div
                      className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xs ${
                        isCritical
                          ? 'bg-rose-600 text-white ring-2 ring-rose-600/30'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      <span className="text-lg font-bold font-['Syne'] leading-none">
                        {request.bloodGroup}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90 mt-0.5">
                        {request.unitsNeeded} {request.unitsNeeded === 1 ? 'Unit' : 'Units'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {request.patientName}
                        </h2>
                        <span className="text-xs text-slate-500">({request.patientAge}y)</span>
                        {request.isVerified && (
                          <span
                            className="text-emerald-600 flex items-center"
                            title="Verified by hospital blood bank registry"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      {/* Zero-Pill Static Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{request.hospitalName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {request.distanceKm} km away
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{request.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Urgency and Time remaining */}
                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-bold inline-flex items-center gap-1 ${
                        isCritical ? 'text-rose-600' : request.urgency === 'Urgent' ? 'text-amber-600' : 'text-slate-600'
                      }`}
                    >
                      {isCritical && <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />}
                      <span>{request.urgency} Case</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{request.requiredBy}</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Context / Reason */}
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  <span className="font-semibold text-slate-900">Medical Condition: </span>
                  {request.reason}
                </p>

                {/* Pledge Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Pledged: <span className="font-bold text-slate-900">{request.unitsPledged}</span> of{' '}
                      <span className="font-bold text-slate-900">{request.unitsNeeded}</span> units needed
                    </span>
                    <span className="text-xs font-medium text-slate-600 tabular-nums">
                      {progressPercent}% Met
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFulfilled ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{request.donorsResponding} donors responding</span>
                    <span aria-hidden="true">·</span>
                    <span>Posted {request.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onShare(request)}
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Share request"
                      aria-label="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenChat(request)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Coordinate</span>
                    </button>

                    <button
                      onClick={() => onPledgeDonation(request)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl transition-all shadow-xs shadow-rose-600/30 flex items-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>I Can Donate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
