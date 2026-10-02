import React from 'react';
import { ArrowLeft, Bell, AlertTriangle, ShieldCheck, Droplet } from 'lucide-react';

interface MobileTopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenSOS?: () => void;
  userRole?: 'donor' | 'requester';
  onToggleRole?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  showBack = false,
  onBack,
  unreadCount = 0,
  onOpenNotifications,
  onOpenSOS,
  userRole = 'donor',
  onToggleRole,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
      {/* Left Slot: Back Button or Brand Logo */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-700 active:bg-slate-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-base font-['Syne'] text-slate-900 tracking-tight">
              LifePulse
            </span>
          </div>
        )}
      </div>

      {/* Center Slot: Title */}
      {title && (
        <div className="text-sm font-bold text-slate-900 truncate max-w-[170px] text-center">
          {title}
        </div>
      )}

      {/* Right Slot: SOS trigger, Role Pill & Notifications */}
      <div className="flex items-center gap-1.5">
        {onToggleRole && (
          <button
            onClick={onToggleRole}
            className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-tight transition-colors ${
              userRole === 'donor'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-900 text-white'
            }`}
          >
            {userRole === 'donor' ? 'Donor' : 'Seeker'}
          </button>
        )}

        {onOpenSOS && (
          <button
            onClick={onOpenSOS}
            className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center active:scale-95 shadow-xs shadow-rose-600/30"
            title="Emergency SOS"
            aria-label="Emergency SOS"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        )}

        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-700 active:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
