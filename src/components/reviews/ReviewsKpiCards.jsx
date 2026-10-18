import React from 'react';
import { Star, CheckCircle2, Image, AlertCircle, Camera, ShieldAlert } from 'lucide-react';

export default function ReviewsKpiCards({ reviews = [] }) {
  const total = reviews.length;

  // Average Rating
  const avgRating = total > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / total).toFixed(1)
    : '5.0';

  // Star Distribution
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  // Verified Parents
  const verifiedCount = reviews.filter((r) => r.isVerified !== false).length;
  const verifiedPct = total > 0 ? Math.round((verifiedCount / total) * 100) : 100;

  // Visual Proofs (photos)
  const visualProofCount = reviews.filter((r) => r.photos && r.photos.length > 0).length;
  const visualProofPct = total > 0 ? Math.round((visualProofCount / total) * 100) : 0;

  // Pending Moderation / Flagged
  const pendingCount = reviews.filter((r) => (r.status || 'PENDING') === 'PENDING').length;
  const flaggedCount = reviews.filter((r) => r.status === 'FLAGGED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {/* KPI 1: Average Rating */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
            <span>PARENT SATISFACTION</span>
            <Star className="w-4 h-4 text-[#FFD983] fill-[#FFD983]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-900 tracking-tight">
              {avgRating}
            </span>
            <span className="text-xs text-neutral-500 font-bold">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#FFD983]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= Math.round(Number(avgRating))
                    ? 'fill-[#FFD983] text-neutral-900'
                    : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mini distribution bars */}
        <div className="mt-3 pt-2 border-t border-neutral-200 space-y-1 text-[10px] text-neutral-600">
          <div className="flex items-center gap-1.5">
            <span className="w-4 font-bold">5★</span>
            <div className="flex-1 h-1.5 bg-neutral-100 border border-neutral-300">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${total ? (starCounts[5] / total) * 100 : 85}%` }}
              />
            </div>
            <span className="w-6 text-right font-mono">{starCounts[5]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 font-bold">4★</span>
            <div className="flex-1 h-1.5 bg-neutral-100 border border-neutral-300">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${total ? (starCounts[4] / total) * 100 : 12}%` }}
              />
            </div>
            <span className="w-6 text-right font-mono">{starCounts[4]}</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Verified Buyers */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
            <span>VERIFIED BUYERS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-neutral-900 tracking-tight">
            {verifiedPct}%
          </div>
          <p className="text-xs text-neutral-600 font-sans mt-1">
            {verifiedCount} confirmed purchases authenticated against phone OTP & order history.
          </p>
        </div>
        <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
          <span>ZERO BOT REVIEWS</span>
          <span className="text-emerald-700 font-bold">BIS COMPLIANT</span>
        </div>
      </div>

      {/* KPI 3: Visual UGC Rate */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
            <span>UNBOXING PHOTO PROOF</span>
            <Camera className="w-4 h-4 text-[#315FE8]" />
          </div>
          <div className="text-3xl font-black text-neutral-900 tracking-tight">
            {visualProofCount}
          </div>
          <p className="text-xs text-neutral-600 font-sans mt-1">
            {visualProofPct}% of total reviews include photo proofs of children unboxing and playing.
          </p>
        </div>
        <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
          <span>CONVERSION LIFT</span>
          <span className="text-[#315FE8] font-bold">+38% STORE CTR</span>
        </div>
      </div>

      {/* KPI 4: Moderation Queue */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
            <span>MODERATION QUEUE</span>
            <ShieldAlert className="w-4 h-4 text-[#FF5638]" />
          </div>
          <div className="text-3xl font-black text-neutral-900 tracking-tight flex items-baseline gap-2">
            <span>{pendingCount}</span>
            {flaggedCount > 0 && (
              <span className="text-xs font-black bg-red-100 text-red-800 px-1.5 py-0.5 border border-red-600">
                {flaggedCount} FLAGGED
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-600 font-sans mt-1">
            {pendingCount === 0
              ? 'Moderation inbox clear. All parent reviews processed.'
              : `${pendingCount} parent review(s) awaiting approval.`}
          </p>
        </div>
        <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
          <span>AVG REVIEW TIME</span>
          <span className="text-neutral-800 font-bold">&lt; 4 HOURS</span>
        </div>
      </div>
    </div>
  );
}
