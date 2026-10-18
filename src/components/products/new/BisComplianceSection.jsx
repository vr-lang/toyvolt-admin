import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileCheck, Building2 } from 'lucide-react';

const BIS_STANDARDS = [
  'IS 9873 (Part 1, 2, 3) & IS 15644 (Safety of Toys & Electric Toys)',
  'IS 9873 (Part 1): Safety of Toys - Mechanical and Physical Properties',
  'IS 9873 (Part 2): Safety of Toys - Flammability Requirements',
  'IS 9873 (Part 3): Migration of Certain Certain Heavy Elements',
  'IS 15644: Safety of Electric Toys'
];

const AGE_GROUPS = [
  '8+ Years (Speed Grade RC)',
  '14+ Years (Hobby Grade Pro)',
  '6-8 Years (Intermediate RC)',
  '3-6 Years (Beginner Toys)',
  'All Ages (Family Play)'
];

const CERT_STATUSES = [
  { value: 'VERIFIED', label: 'COMPLIANT & LAB VERIFIED', color: 'bg-emerald-100 text-emerald-800 border-emerald-400' },
  { value: 'PENDING', label: 'UNDER LAB TESTING // PENDING', color: 'bg-amber-100 text-amber-800 border-amber-400' },
  { value: 'EXEMPT', label: 'EXEMPTION APPLIED // HOBBY GRADE', color: 'bg-blue-100 text-blue-800 border-blue-400' }
];

export const BisComplianceSection = ({
  bisData = {},
  onChange
}) => {
  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#171717] text-white flex items-center justify-center font-mono font-bold text-xs">
            04
          </div>
          <h2 className="font-mono font-bold text-sm tracking-wider uppercase text-[#171717]">
            Indian Toy Safety & BIS Compliance // Mandatory QCO 2020
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400 text-[10px] font-mono font-bold">
          <ShieldCheck size={12} />
          <span>BUREAU OF INDIAN STANDARDS</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Compliance Alert Box */}
        <div className="p-3 bg-[#FAF8F5] border-2 border-[#171717] flex items-start gap-3">
          <div className="w-8 h-8 bg-[#171717] text-[#FFD983] flex items-center justify-center shrink-0 border border-[#171717]">
            <ShieldCheck size={18} />
          </div>
          <div className="text-xs font-mono text-gray-700">
            <p className="font-bold text-[#171717] uppercase">
              Toys (Quality Control) Order, 2020 Statutory Requirement
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              All electronic toys sold in the Republic of India must carry a valid BIS CM/L license number and bear the Standard ISI mark.
            </p>
          </div>
        </div>

        {/* BIS Standard & License Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BIS Standard */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#171717] mb-1.5">
              Testing Standard Applied
            </label>
            <select
              value={bisData.standard || BIS_STANDARDS[0]}
              onChange={(e) => onChange('standard', e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
            >
              {BIS_STANDARDS.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>

          {/* CM/L License Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase text-[#171717]">
                CM/L License Number (BIS Mark)
              </label>
              <span className="text-[10px] font-mono font-bold text-[#315FE8]">
                VERIFIED FORMAT
              </span>
            </div>
            <input
              type="text"
              value={bisData.cmlNumber || 'CM/L-8400192834'}
              onChange={(e) => onChange('cmlNumber', e.target.value.toUpperCase())}
              placeholder="CM/L-8400192834"
              className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-2 text-xs font-mono font-bold uppercase text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
            />
          </div>
        </div>

        {/* Age Group & Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recommended Age Group */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#171717] mb-1.5">
              Mandatory Age Grading
            </label>
            <select
              value={bisData.ageGroup || AGE_GROUPS[0]}
              onChange={(e) => onChange('ageGroup', e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
            >
              {AGE_GROUPS.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          {/* Certification Status */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#171717] mb-1.5">
              BIS Laboratory Verification Status
            </label>
            <div className="flex gap-2">
              {CERT_STATUSES.map((stat) => (
                <button
                  key={stat.value}
                  type="button"
                  onClick={() => onChange('status', stat.value)}
                  className={`flex-1 text-[10px] font-mono font-bold py-2 px-1 text-center border transition-all ${
                    (bisData.status || 'VERIFIED') === stat.value
                      ? `${stat.color} border-2 border-[#171717] shadow-[2px_2px_0px_#171717]`
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {stat.value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Warning Statement */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-[#171717] mb-1.5 flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-amber-600" />
            <span>Statutory Packaging Warnings & Caution Notes</span>
          </label>
          <textarea
            rows={2}
            value={
              bisData.warnings ||
              'WARNING: CHOKING HAZARD - Small parts. Not suitable for children under 3 years. Operate under direct adult supervision. Use only provided balanced USB charging cable.'
            }
            onChange={(e) => onChange('warnings', e.target.value)}
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] p-2.5 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
        </div>

        {/* Manufacturer / Importer Registry (Fixed Statutory Notice) */}
        <div className="p-3 bg-[#FAF8F5] border border-gray-300 flex items-start gap-3">
          <Building2 size={16} className="text-gray-500 shrink-0 mt-0.5" />
          <div className="text-[11px] font-mono text-gray-600">
            <span className="font-bold text-[#171717] uppercase">Packaged & Marketed By:</span>{' '}
            Toyvolt India Private Limited, Plot No. 42, Sector 80, Phase-II Noida NCR, Gautam Buddha Nagar, Uttar Pradesh - 201305.
            E-waste Reg: EW-UP-NOI-8812.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BisComplianceSection;
