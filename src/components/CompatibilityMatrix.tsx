import React, { useState } from 'react';
import { BloodGroup } from '../types/blood';
import { BLOOD_GROUPS, COMPATIBILITY_MATRIX } from '../data/mockData';
import { GitMerge, Info, Check, X as Cross, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface CompatibilityMatrixProps {
  initialGroup?: BloodGroup;
  onSelectGroupForFilter?: (group: BloodGroup) => void;
}

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({
  initialGroup = 'O+',
  onSelectGroupForFilter,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(initialGroup);
  const [mode, setMode] = useState<'red_cells' | 'plasma'>('red_cells');

  const currentInfo = COMPATIBILITY_MATRIX[selectedGroup];

  return (
    <div className="space-y-6">
      {/* Title & Introduction Header */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
              <GitMerge className="w-4 h-4" />
              <span>Transfusion Science</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Syne']">
              Interactive Blood Compatibility Matrix
            </h2>
          </div>

          {/* Mode Switcher: Red Blood Cells vs Plasma */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMode('red_cells')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'red_cells' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Red Blood Cells
            </button>
            <button
              onClick={() => setMode('plasma')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'plasma' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plasma Transfusion
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Select any blood group below to instantly check which patients can safely receive your donation and who you can safely receive blood from during emergencies.
        </p>

        {/* Blood Group Selector Chips */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-500 mb-2">Select Blood Type:</div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`py-3 rounded-xl font-bold font-['Syne'] text-base transition-all border ${
                  selectedGroup === group
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-600/30 scale-102'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Group In-Depth Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Summary Badge */}
        <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-rose-300">
              Selected Profile
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-rose-600 flex items-center justify-center text-3xl font-black font-['Syne'] shadow-md">
                {selectedGroup}
              </div>
              <div>
                <div className="text-sm font-semibold text-rose-100">Frequency</div>
                <div className="text-lg font-bold font-['JetBrains_Mono']">{currentInfo.rarity}</div>
              </div>
            </div>
            <p className="text-xs text-rose-200 leading-relaxed pt-2">
              {currentInfo.note}
            </p>
          </div>

          {onSelectGroupForFilter && (
            <button
              onClick={() => onSelectGroupForFilter(selectedGroup)}
              className="w-full py-2.5 bg-white text-rose-900 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>View Open {selectedGroup} Requests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Middle Column: You Can Donate To */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                You Can Donate To
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {currentInfo.canDonateTo.length} Compatible
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Patients with these blood groups can safely accept your red blood cell donation without immunological rejection:
          </p>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {BLOOD_GROUPS.map((g) => {
              const isCompatible = currentInfo.canDonateTo.includes(g);
              return (
                <div
                  key={g}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCompatible
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-bold'
                      : 'bg-slate-50/50 border-slate-100 text-slate-300 font-normal line-through'
                  }`}
                >
                  <div className="text-sm font-['Syne']">{g}</div>
                  <div className="text-[10px] mt-0.5">
                    {isCompatible ? 'Safe' : 'No'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: You Can Receive From */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                You Can Receive From
              </h3>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {currentInfo.canReceiveFrom.length} Compatible
            </span>
          </div>

          <p className="text-xs text-slate-500">
            If you ever require a blood transfusion, blood from these donor types can be safely administered to you:
          </p>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {BLOOD_GROUPS.map((g) => {
              const isCompatible = currentInfo.canReceiveFrom.includes(g);
              return (
                <div
                  key={g}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCompatible
                      ? 'bg-blue-50/80 border-blue-200 text-blue-800 font-bold'
                      : 'bg-slate-50/50 border-slate-100 text-slate-300 font-normal line-through'
                  }`}
                >
                  <div className="text-sm font-['Syne']">{g}</div>
                  <div className="text-[10px] mt-0.5">
                    {isCompatible ? 'Match' : 'No'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Complete Cross-Matching Reference Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Complete Red Blood Cell Compatibility Reference
          </h3>
          <span className="text-xs text-slate-500">Donor (Row) → Recipient (Column)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-3 text-left font-bold text-slate-900">Donor Type</th>
                {BLOOD_GROUPS.map((recipient) => (
                  <th key={recipient} className="p-3 font-bold">
                    {recipient}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BLOOD_GROUPS.map((donor) => {
                const isSelectedRow = donor === selectedGroup;
                return (
                  <tr
                    key={donor}
                    onClick={() => setSelectedGroup(donor)}
                    className={`cursor-pointer transition-colors ${
                      isSelectedRow ? 'bg-rose-50/50 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3 text-left font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11px] font-['Syne']">
                        {donor}
                      </span>
                    </td>
                    {BLOOD_GROUPS.map((recipient) => {
                      const compatible = COMPATIBILITY_MATRIX[donor].canDonateTo.includes(recipient);
                      return (
                        <td key={recipient} className="p-3">
                          {compatible ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 text-slate-300">
                              ·
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
