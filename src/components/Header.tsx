import React from 'react';
import { Droplet, Bell, AlertTriangle, ShieldCheck, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'donor' | 'requester';
  setUserRole: (role: 'donor' | 'requester') => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenCreateRequest: () => void;
  onOpenEmergencySOS: () => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  unreadCount,
  onOpenNotifications,
  onOpenCreateRequest,
  onOpenEmergencySOS,
  isDeviceFrame,
  setIsDeviceFrame,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark / Brand */}
        <button
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:bg-rose-700 transition-colors">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-['Syne'] flex items-center gap-1.5">
              LifePulse
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Emergency Network Active" />
            </span>
          </div>
        </button>

        {/* Zone 2: Primary Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('feed')}
            className={`transition-colors py-1 relative ${
              activeTab === 'feed'
                ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                : 'hover:text-slate-900'
            }`}
          >
            Urgent Requests
          </button>
          <button
            onClick={() => setActiveTab('camps')}
            className={`transition-colors py-1 relative ${
              activeTab === 'camps'
                ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                : 'hover:text-slate-900'
            }`}
          >
            Blood Camps
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`transition-colors py-1 relative ${
              activeTab === 'compatibility'
                ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                : 'hover:text-slate-900'
            }`}
          >
            Compatibility Matrix
          </button>
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`transition-colors py-1 relative ${
              activeTab === 'eligibility'
                ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                : 'hover:text-slate-900'
            }`}
          >
            Eligibility Check
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`transition-colors py-1 relative ${
              activeTab === 'leaderboard'
                ? 'text-rose-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-600'
                : 'hover:text-slate-900'
            }`}
          >
            Donors & Hall of Fame
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Device Frame Toggle (Hidden on narrow mobile screens) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setIsDeviceFrame(false)}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                !isDeviceFrame ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Full Responsive View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Responsive</span>
            </button>
            <button
              onClick={() => setIsDeviceFrame(true)}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isDeviceFrame ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mobile Device Mockup View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mobile Frame</span>
            </button>
          </div>

          {/* Role Toggle: Donor vs Requester */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setUserRole('donor')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                userRole === 'donor'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donor
            </button>
            <button
              onClick={() => setUserRole('requester')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                userRole === 'requester'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Requester
            </button>
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Emergency SOS Broadcast Button */}
          <button
            onClick={onOpenEmergencySOS}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 active:scale-95 transition-all whitespace-nowrap"
            title="Emergency SOS Broadcast"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>SOS</span>
          </button>

          {/* Create Request CTA */}
          <button
            onClick={onOpenCreateRequest}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 active:scale-95 transition-all shadow-xs shadow-rose-600/30 whitespace-nowrap"
          >
            <Droplet className="w-3.5 h-3.5 fill-current" />
            <span>Need Blood</span>
          </button>
        </div>
      </div>
    </header>
  );
};
