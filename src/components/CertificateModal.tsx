import React, { useRef } from 'react';
import { DonorProfile } from '../types/blood';
import { X, Award, Download, Share2, Droplet, ShieldCheck, Heart } from 'lucide-react';

interface CertificateModalProps {
  donor: DonorProfile | null;
  onClose: () => void;
  onShare: (text: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  donor,
  onClose,
  onShare,
}) => {
  if (!donor) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareCert = () => {
    onShare(`I just verified my blood donor impact with LifePulse: ${donor.totalDonations} donations and ~${donor.livesSaved} lives saved! Join me in donating blood.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[95vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 font-['Syne']">
              Official Donor Certificate of Appreciation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Display Area */}
        <div className="p-6 overflow-y-auto">
          <div className="relative p-8 rounded-2xl border-4 border-double border-rose-900/30 bg-gradient-to-br from-rose-50/40 via-white to-amber-50/40 text-center space-y-5 shadow-inner">
            {/* Header Crest */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                <Droplet className="w-6 h-6 fill-current" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                LIFEPULSE NATIONAL BLOOD ALLIANCE
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Syne'] text-slate-900 tracking-tight">
                CERTIFICATE OF APPRECIATION
              </h2>
              <div className="text-xs text-rose-700 font-medium italic">
                In Recognition of Selfless Service and Lifesaving Dedication
              </div>
            </div>

            <div className="py-2 space-y-2">
              <p className="text-xs text-slate-600">This honor is proudly awarded to</p>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Syne'] border-b-2 border-slate-300 pb-2 max-w-sm mx-auto">
                {donor.name}
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-1 leading-relaxed">
                For commendable generosity in voluntarily donating blood type <strong className="text-rose-600">{donor.bloodGroup}</strong> across <strong className="text-slate-900">{donor.totalDonations} registered donations</strong>, directly preserving an estimated <strong className="text-slate-900">{donor.livesSaved} precious human lives</strong>.
              </p>
            </div>

            {/* Badges and Signatures */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-2 items-center text-xs">
              <div className="text-left">
                <div className="text-[10px] text-slate-400">Date Issued</div>
                <div className="font-semibold text-slate-800">October 2026</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full border-2 border-amber-500/80 bg-amber-50 flex items-center justify-center text-amber-700 shadow-xs">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider mt-1">Verified Hero</span>
              </div>

              <div className="text-right">
                <div className="font-['Syne'] font-bold text-slate-900 text-xs italic">
                  LifePulse Registry
                </div>
                <div className="text-[9px] text-slate-400">Medical Directorate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handleShareCert}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Certificate</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
