import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Lock } from 'lucide-react';

export default function ReviewPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] w-full max-w-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#171717] text-white p-4 border-b-4 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">
                INDIAN E-COMMERCE REVIEW POLICY & BIS COMPLIANCE
              </h3>
              <p className="text-[10px] text-neutral-400 font-sans">
                Bureau of Indian Standards IS 19000:2022 & Consumer Protection Act 2019
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-neutral-800 font-sans leading-relaxed">
          
          <div className="bg-[#FFD983] border-2 border-neutral-900 p-3 font-mono">
            <div className="font-black text-neutral-900 text-xs mb-1">
              OFFICIAL COMPLIANCE DIRECTIVE
            </div>
            <p className="text-[11px] text-neutral-800">
              Toyvolt adheres strictly to <strong>BIS IS 19000:2022</strong> standards for Online Consumer Reviews. All reviews published on the storefront must represent authentic, unedited experiences from genuine customers.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono font-bold text-neutral-900 uppercase text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. VERIFIED PURCHASER BADGE CRITERIA
            </h4>
            <p className="text-neutral-700 pl-5">
              A review only qualifies for the "Verified Parent Buyer" badge when the reviewer's phone number or email matches an order delivered via our integrated Indian logistics carrier network (Delhivery/BlueDart). Unverified reviews are subjected to manual identity verification before publishing.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono font-bold text-neutral-900 uppercase text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. CHILD PRIVACY & PHOTO PROOFS (POCSO COMPLIANCE)
            </h4>
            <p className="text-neutral-700 pl-5">
              Photographs featuring minor children playing must never reveal school uniforms, identification tags, residential addresses, or sensitive personal data. If a photo contains such details, moderators must crop or flag the image while preserving the parent's written testimonial.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono font-bold text-neutral-900 uppercase text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              3. ZERO TOLERANCE FOR FAKE OR INCENTIVIZED REVIEWS
            </h4>
            <p className="text-neutral-700 pl-5">
              Employees, suppliers, and paid agencies are legally forbidden from posting storefront ratings. Paid influencer collaborations must carry explicit disclosure badges as required by ASCI (Advertising Standards Council of India) guidelines.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono font-bold text-neutral-900 uppercase text-xs flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#315FE8]" />
              4. AUDIT TRAILS & RECORD RETENTION
            </h4>
            <p className="text-neutral-700 pl-5">
              In accordance with Ministry of Consumer Affairs notifications, timestamps of review submission, moderator approval actions, and store replies are archived for a minimum duration of 3 years.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F0EEEE] border-t-2 border-neutral-900 flex items-center justify-between font-mono text-xs">
          <span className="text-[10px] text-neutral-500 uppercase">
            REGULATORY COMPLIANCE OFFICER // TOYVOLT IND
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border-2 border-neutral-900 bg-white hover:bg-neutral-100 font-bold"
          >
            I UNDERSTAND
          </button>
        </div>

      </div>
    </div>
  );
}
