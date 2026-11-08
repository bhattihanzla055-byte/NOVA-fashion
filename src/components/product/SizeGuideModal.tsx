import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const dataIn = [
    { size: 'XS', chest: '34 - 36', waist: '28 - 30', hips: '35 - 37', length: '27.5' },
    { size: 'S', chest: '36 - 38', waist: '30 - 32', hips: '37 - 39', length: '28.0' },
    { size: 'M', chest: '38 - 40', waist: '32 - 34', hips: '39 - 41', length: '28.5' },
    { size: 'L', chest: '40 - 42', waist: '34 - 36', hips: '41 - 43', length: '29.0' },
    { size: 'XL', chest: '42 - 44', waist: '36 - 38', hips: '43 - 45', length: '29.5' },
    { size: 'XXL', chest: '44 - 46', waist: '38 - 40', hips: '45 - 47', length: '30.0' },
  ];

  const dataCm = [
    { size: 'XS', chest: '86 - 91', waist: '71 - 76', hips: '89 - 94', length: '70' },
    { size: 'S', chest: '91 - 96', waist: '76 - 81', hips: '94 - 99', length: '71' },
    { size: 'M', chest: '96 - 101', waist: '81 - 86', hips: '99 - 104', length: '72' },
    { size: 'L', chest: '101 - 106', waist: '86 - 91', hips: '104 - 109', length: '74' },
    { size: 'XL', chest: '106 - 112', waist: '91 - 96', hips: '109 - 114', length: '75' },
    { size: 'XXL', chest: '112 - 117', waist: '96 - 101', hips: '114 - 119', length: '76' },
  ];

  const rows = unit === 'in' ? dataIn : dataCm;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white max-w-2xl w-full p-6 sm:p-8 rounded-xs shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div>
            <h3 className="text-lg font-serif font-bold text-zinc-950">Atelier Sizing Guide</h3>
            <p className="text-xs text-zinc-500">Tailored international dimensions for precise fit</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-end my-4 gap-2 text-xs">
          <span className="text-zinc-500 font-medium">Measurement Unit:</span>
          <div className="inline-flex border border-zinc-300 p-0.5">
            <button
              onClick={() => setUnit('in')}
              className={`px-2.5 py-1 font-semibold uppercase ${
                unit === 'in' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 font-semibold uppercase ${
                unit === 'cm' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-zinc-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">Size</th>
                <th className="py-2.5 px-4">Chest / Bust ({unit})</th>
                <th className="py-2.5 px-4">Waist ({unit})</th>
                <th className="py-2.5 px-4">Hips ({unit})</th>
                <th className="py-2.5 px-4">Garment Length ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono text-[11px] tabular-nums text-zinc-800">
              {rows.map((r) => (
                <tr key={r.size} className="hover:bg-zinc-50">
                  <td className="py-2.5 px-4 font-sans font-bold text-zinc-950">{r.size}</td>
                  <td className="py-2.5 px-4">{r.chest}</td>
                  <td className="py-2.5 px-4">{r.waist}</td>
                  <td className="py-2.5 px-4">{r.hips}</td>
                  <td className="py-2.5 px-4">{r.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 leading-relaxed">
          <strong className="text-zinc-900 font-semibold">Bespoke Fit Advisory:</strong> Our structured overcoats and leather garments are cut with classic European tailoring proportions. If you prefer an oversized aesthetic or wish to layer heavy knitwear, we recommend sizing up.
        </div>
      </div>
    </div>
  );
};
