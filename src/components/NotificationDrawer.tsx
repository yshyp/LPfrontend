import React from 'react';
import { AppNotification } from '../types/blood';
import { X, Bell, AlertTriangle, Calendar, Clock, CheckCircle } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 font-['Syne']">
              Notifications & Alerts
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No new alerts at this time.
            </div>
          ) : (
            notifications.map((notif) => {
              const isEmergency = notif.type === 'emergency';
              const isReminder = notif.type === 'reminder';

              return (
                <div
                  key={notif.id}
                  onClick={() => onNotificationClick(notif)}
                  className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                    !notif.read ? 'bg-rose-50/40 font-medium' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      {isEmergency && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      {isReminder && <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      {notif.type === 'camp' && <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      <span>{notif.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center text-[11px] text-slate-500">
          Emergency notifications are powered by LifePulse instant dispatch.
        </div>
      </div>
    </div>
  );
};
