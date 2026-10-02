import React, { useState } from 'react';
import { BloodGroup, BloodRequest, UrgencyLevel } from '../types/blood';
import { BLOOD_GROUPS } from '../data/mockData';
import { X, Droplet, MapPin, AlertCircle, Building2, User, Phone, Check } from 'lucide-react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newReq: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'donorsResponding' | 'unitsPledged' | 'isVerified'>) => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(30);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('Urgent');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reason, setReason] = useState('');
  const [requiredBy, setRequiredBy] = useState('Today within 4 hours');
  const [error, setError] = useState('');

  // Quick preset hospitals
  const hospitalPresets = [
    { name: 'Metropolitan Trauma Center', address: '742 Healthcare Parkway, Tower B', city: 'Metro City' },
    { name: 'St. Jude Regional Hospital', address: '1100 Pine Crest Boulevard', city: 'Metro City' },
    { name: 'Childrens Health & Research Center', address: '320 University Ave', city: 'Metro City' },
    { name: 'City Memorial Heart Institute', address: '880 Cardiac Pavilion Way', city: 'Metro City' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please provide the patient name.');
      return;
    }
    if (!hospitalName.trim() || !hospitalAddress.trim()) {
      setError('Please provide the hospital name and address.');
      return;
    }
    if (!contactPhone.trim()) {
      setError('Please provide a contact phone number for coordination.');
      return;
    }
    if (!reason.trim()) {
      setError('Please specify the medical condition or reason for transfusion.');
      return;
    }

    setError('');
    onSubmit({
      patientName: patientName.trim(),
      patientAge: Number(patientAge) || 25,
      bloodGroup,
      unitsNeeded: Number(unitsNeeded) || 1,
      urgency,
      hospitalName: hospitalName.trim(),
      hospitalAddress: hospitalAddress.trim(),
      city: city.trim() || 'Metro City',
      distanceKm: +(Math.random() * 8 + 1).toFixed(1),
      contactName: contactName.trim() || 'Attending Coordinator',
      contactPhone: contactPhone.trim(),
      reason: reason.trim(),
      requiredBy: requiredBy.trim() || 'As soon as possible',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Syne']">
                Post Blood Request
              </h3>
              <p className="text-[11px] text-slate-500">
                Broadcast an urgent request to compatible verified donors nearby
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Blood Group & Units */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">
              Required Blood Group & Units Needed *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {BLOOD_GROUPS.map((group) => (
                <button
                  type="button"
                  key={group}
                  onClick={() => setBloodGroup(group)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    bloodGroup === group
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-slate-600 font-medium">Units needed:</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setUnitsNeeded(num)}
                    className={`px-3 py-1 text-xs rounded-lg border font-semibold ${
                      unitsNeeded === num
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Urgency Level */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Urgency Priority *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Critical', 'Urgent', 'Standard'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setUrgency(lvl)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    urgency === lvl
                      ? lvl === 'Critical'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500'
                        : 'bg-slate-100 border-slate-700 text-slate-900 ring-1 ring-slate-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div>{lvl}</div>
                  <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                    {lvl === 'Critical' ? 'Within 2 hours' : lvl === 'Urgent' ? 'Within 12 hours' : 'Scheduled / Elective'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 block">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Davis"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Patient Age *</label>
              <input
                type="number"
                min="0"
                max="110"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Hospital Presets & Location */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 block">Hospital & Ward Location *</label>
              <span className="text-[10px] text-slate-400">Quick select preset or type below:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {hospitalPresets.map((h) => (
                <button
                  type="button"
                  key={h.name}
                  onClick={() => {
                    setHospitalName(h.name);
                    setHospitalAddress(h.address);
                    setCity(h.city);
                  }}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {h.name}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="Hospital Name (e.g. Metropolitan Trauma Center)"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <input
                type="text"
                required
                placeholder="Detailed Address & Ward / Bed (e.g. 742 Healthcare Pkwy, ICU Ward 3)"
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Contact Name / Relationship</label>
              <input
                type="text"
                placeholder="e.g. Sarah Davis (Daughter)"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Emergency Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Required By Time & Clinical Reason */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Needed By Time Window *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tonight before 11:00 PM / Immediate for Surgery"
              value={requiredBy}
              onChange={(e) => setRequiredBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Medical Reason / Transfusion Summary *</label>
            <textarea
              required
              rows={2}
              placeholder="Brief explanation of condition (e.g. Emergency surgery, road trauma, cancer therapy platelet support)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all"
            >
              <Droplet className="w-3.5 h-3.5 fill-current" />
              <span>Broadcast Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
