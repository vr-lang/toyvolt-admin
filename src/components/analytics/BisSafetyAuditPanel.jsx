import React from 'react';
import { ShieldCheck, AlertTriangle, FileCheck, FileArchive, ExternalLink } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const BisSafetyAuditPanel = ({ bisCompliance = {} }) => {
  const {
    isConfigured = false,
    status = 'COMPLIANCE DATA NOT CONFIGURED',
    standard = 'IS 9873 (Indian Toy Safety Standard)',
    parts = []
  } = bisCompliance;

  return (
    <div className="bg-panel border-2 border-ink shadow-[4px_4px_0px_#171717] p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b-2 border-ink gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFD983] border-2 border-ink flex items-center justify-center shadow-[2px_2px_0px_#171717]">
            <ShieldCheck className="w-5 h-5 text-ink" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-ink">
                BIS IS-9873 INDIAN SAFETY &amp; QUALITY AUDIT HEALTH
              </h2>
            </div>
            <span className="font-mono text-xs text-[#6E6E6E]">
              Bureau of Indian Standards compliance audit under Toys (Quality Control) Order
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <StatusBadge variant="warning" size="sm">
            <AlertTriangle className="w-3 h-3 text-ink mr-1" />
            {status}
          </StatusBadge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Card 1: Regulatory Standard Description */}
        <div className="p-4 bg-[#FFF9F0] border-2 border-ink shadow-[2.5px_2.5px_0px_#171717] flex flex-col justify-between">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase text-[#315FE8] mb-1">
              REGULATORY MANDATE
            </div>
            <h3 className="font-display font-bold text-sm text-ink mb-1">
              IS 9873 (PARTS 1 TO 3) CERTIFICATION
            </h3>
            <p className="font-mono text-[11px] text-[#6E6E6E] leading-relaxed">
              Mandatory under DPIIT Toy Quality Control Order (QCO). All electric and mechanical toys manufactured or imported into India must possess BIS Standard Mark (ISI mark) and valid test certificates from accredited labs.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-ink/20 font-mono text-[10px] text-ink font-bold flex items-center justify-between">
            <span>BIS Accreditation: NABL Lab Required</span>
            <span className="text-[#FF5638]">0 Documents Attached</span>
          </div>
        </div>

        {/* Card 2: 3-Part Health Checklist */}
        <div className="p-4 bg-white border-2 border-ink shadow-[2.5px_2.5px_0px_#171717] lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold uppercase text-[#6E6E6E]">
                APPLICABLE IS-9873 TEST REQUIREMENTS
              </span>
              <span className="font-mono text-[10px] text-[#FF5638] font-bold">
                AUDIT INCOMPLETE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              {/* Part 1 */}
              <div className="p-2.5 bg-[#F7F3EB] border border-ink space-y-1">
                <span className="font-bold text-ink block text-[11px]">
                  IS 9873 (Part 1)
                </span>
                <span className="text-[10px] text-[#6E6E6E] block">
                  Mechanical &amp; Physical
                </span>
                <span className="inline-block text-[9px] uppercase px-1 py-0.2 bg-[#FFD983] border border-ink font-bold">
                  Pending Lab Test
                </span>
              </div>

              {/* Part 2 */}
              <div className="p-2.5 bg-[#F7F3EB] border border-ink space-y-1">
                <span className="font-bold text-ink block text-[11px]">
                  IS 9873 (Part 2)
                </span>
                <span className="text-[10px] text-[#6E6E6E] block">
                  Flammability Limits
                </span>
                <span className="inline-block text-[9px] uppercase px-1 py-0.2 bg-[#FFD983] border border-ink font-bold">
                  Pending Lab Test
                </span>
              </div>

              {/* Part 3 */}
              <div className="p-2.5 bg-[#F7F3EB] border border-ink space-y-1">
                <span className="font-bold text-ink block text-[11px]">
                  IS 9873 (Part 3)
                </span>
                <span className="text-[10px] text-[#6E6E6E] block">
                  Heavy Metals &amp; Toxicity
                </span>
                <span className="inline-block text-[9px] uppercase px-1 py-0.2 bg-[#FFD983] border border-ink font-bold">
                  Pending Lab Test
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 mt-2 border-t border-ink/15 font-mono text-[10px] text-[#6E6E6E]">
            Notice: Toyvolt does not claim unverified 100% compliance. Lab reports must be uploaded via Catalog Management before audit certification seals can be issued.
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-ink bg-[#FFF9F0] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4">
        <div className="font-mono text-xs text-[#6E6E6E]">
          <strong className="text-ink">Audit Pipeline Status:</strong> Awaiting laboratory test document uploads.
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Batch Lab Reports Button (Disabled / Coming Soon) */}
          <button
            type="button"
            disabled
            className="flex-1 sm:flex-none brutal-btn bg-white opacity-50 cursor-not-allowed text-xs px-3 py-1.5 flex items-center justify-center gap-1.5"
            title="Batch lab report repository will be available in catalog v1.1"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#6E6E6E]" />
            <span className="font-mono text-[11px] font-bold">BATCH-LAB REPORTS (v1.1)</span>
          </button>

          {/* Generate Audit Bundle Button (Disabled / Coming Soon) */}
          <button
            type="button"
            disabled
            className="flex-1 sm:flex-none brutal-btn bg-white opacity-50 cursor-not-allowed text-xs px-3 py-1.5 flex items-center justify-center gap-1.5"
            title="Audit bundle generation requires uploaded laboratory PDF certifications"
          >
            <FileArchive className="w-3.5 h-3.5 text-[#6E6E6E]" />
            <span className="font-mono text-[11px] font-bold">GENERATE AUDIT BUNDLE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BisSafetyAuditPanel;
