import React from 'react';
import { Activity, Calendar, Plus, GitMerge, Award } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateRequest: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateRequest,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 pb-safe">
      <div className="max-w-md mx-auto h-16 grid grid-cols-5 items-center">
        {/* Tab 1: Requests Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'feed' ? 'text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-1">Requests</span>
          {activeTab === 'feed' && <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />}
        </button>

        {/* Tab 2: Blood Camps */}
        <button
          onClick={() => setActiveTab('camps')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'camps' ? 'text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-1">Camps</span>
          {activeTab === 'camps' && <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />}
        </button>

        {/* Center Primary Action: Quick Blood Request / Post */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenCreateRequest}
            className="w-12 h-12 -mt-4 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/35 border-3 border-white transition-transform"
            aria-label="Create Blood Request"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Compatibility & Eligibility */}
        <button
          onClick={() => setActiveTab('compatibility')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'compatibility' ? 'text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitMerge className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-1">Matrix</span>
          {activeTab === 'compatibility' && <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />}
        </button>

        {/* Tab 4: Impact / Leaderboard */}
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'leaderboard' ? 'text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-1">Impact</span>
          {activeTab === 'leaderboard' && <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />}
        </button>
      </div>
    </nav>
  );
};
