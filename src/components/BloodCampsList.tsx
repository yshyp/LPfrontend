import React, { useState, useMemo } from 'react';
import { BloodCamp } from '../types/blood';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Plus,
  Phone,
  Search,
  Navigation,
  X
} from 'lucide-react';

interface BloodCampsListProps {
  camps: BloodCamp[];
  onToggleRegister: (campId: string) => void;
  onAddCamp: (camp: Omit<BloodCamp, 'id' | 'registeredDonors' | 'isRegistered'>) => void;
}

export const BloodCampsList: React.FC<BloodCampsListProps> = ({
  camps,
  onToggleRegister,
  onAddCamp,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for hosting a camp
  const [newTitle, setNewTitle] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newDate, setNewDate] = useState('Saturday, Nov 7, 2026');
  const [newTime, setNewTime] = useState('09:00 AM - 03:00 PM');
  const [newLocation, setNewLocation] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTargetUnits, setNewTargetUnits] = useState(100);
  const [newPhone, setNewPhone] = useState('+1 (555) 019-2834');
  const [newDescription, setNewDescription] = useState('');

  const filteredCamps = useMemo(() => {
    if (!search.trim()) return camps;
    const q = search.toLowerCase();
    return camps.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.organizer.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [camps, search]);

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    onAddCamp({
      title: newTitle.trim(),
      organizer: newOrganizer.trim() || 'Community Blood Foundation',
      date: newDate.trim(),
      time: newTime.trim(),
      location: newLocation.trim(),
      address: newAddress.trim() || newLocation.trim(),
      city: 'Metro City',
      targetUnits: Number(newTargetUnits) || 100,
      contactNumber: newPhone.trim(),
      description: newDescription.trim() || 'Voluntary blood drive supporting regional trauma hospitals.',
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewLocation('');
    setNewAddress('');
  };

  return (
    <div className="space-y-3.5 text-xs text-slate-800">
      {/* Search Input matching LPfrontend BloodCampsScreen */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blood camps by name, organizer, or venue..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Top Action Row */}
      <div className="flex items-center justify-between px-1">
        <span className="font-bold text-slate-900 text-xs">
          Upcoming Blood Drives ({filteredCamps.length})
        </span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-rose-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Host a Camp</span>
        </button>
      </div>

      {/* Camp Cards Feed */}
      <div className="space-y-3">
        {filteredCamps.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
            <p className="font-semibold text-slate-700">No matching blood camps</p>
            <p className="text-slate-400 text-[11px]">
              Try searching with another keyword or clear the search field.
            </p>
          </div>
        ) : (
          filteredCamps.map((camp) => {
            const percent = Math.min(100, Math.round((camp.registeredDonors / camp.targetUnits) * 100));

            return (
              <div
                key={camp.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{camp.date}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{camp.time}</span>
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5 font-['Syne']">
                      {camp.title}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      Organized by {camp.organizer}
                    </div>
                  </div>

                  <a
                    href={`tel:${camp.contactNumber}`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors shrink-0"
                    title="Call Organizer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-700">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="text-slate-500 text-[10px] pl-4.5">{camp.address}</div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {camp.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Registered Donors: <strong className="text-slate-900">{camp.registeredDonors}</strong>
                    </span>
                    <span className="text-slate-600 font-bold">Goal: {camp.targetUnits}u ({percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(camp.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1 text-[11px] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>

                  <button
                    onClick={() => onToggleRegister(camp.id)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                      camp.isRegistered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                    }`}
                  >
                    {camp.isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Slot Reserved</span>
                      </>
                    ) : (
                      <span>Reserve Free Slot</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Host Camp Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-sm font-bold text-slate-900 font-['Syne']">
                Register Blood Drive
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCamp} className="p-5 space-y-3 text-xs text-slate-800">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Camp Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Mall Community Blood Drive"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Organizing Body *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Cross / Rotary Club / University"
                  value={newOrganizer}
                  onChange={(e) => setNewOrganizer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Date *</label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Time *</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Location Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community Auditorium / Plaza"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
