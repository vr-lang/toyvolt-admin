import React from 'react';
import { 
  Star, 
  CheckCircle2, 
  Camera, 
  MessageSquare, 
  Check, 
  Flag, 
  Archive, 
  MapPin, 
  Calendar,
  AlertTriangle,
  User,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export default function ReviewCard({
  review,
  onUpdateStatus,
  onOpenReply,
  onOpenLightbox
}) {
  const photos = review.photos || [];
  const status = review.status || 'PENDING';
  const rating = review.rating || 5;

  return (
    <div className={`bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 sm:p-5 font-mono transition-all hover:bg-[#FFFDF7] ${
      status === 'PENDING' ? 'border-amber-500 shadow-[5px_5px_0px_#f59e0b]' : ''
    }`}>
      
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b-2 border-neutral-200">
        
        {/* Parent & Location */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-sm text-neutral-900 uppercase">
              {review.parentName || review.user?.name || 'Verified Parent'}
            </span>

            {review.isVerified !== false && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold border border-emerald-600 bg-emerald-100 text-emerald-900">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                VERIFIED BUYER
              </span>
            )}

            {review.childAge && (
              <span className="px-1.5 py-0.2 text-[9px] font-bold border border-neutral-900 bg-[#FFD983] text-neutral-900">
                {review.childAge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-sans">
            {(review.city || review.state) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>{[review.city, review.state].filter(Boolean).join(', ')}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN') : 'Recently'}</span>
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {status === 'PUBLISHED' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black border-2 border-emerald-600 bg-emerald-100 text-emerald-900 shadow-[1px_1px_0px_#059669]">
              <Check className="w-3.5 h-3.5" /> PUBLISHED ON STORE
            </span>
          )}
          {status === 'PENDING' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black border-2 border-amber-600 bg-amber-100 text-amber-900 shadow-[1px_1px_0px_#d97706] animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> PENDING MODERATION
            </span>
          )}
          {status === 'FLAGGED' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black border-2 border-red-600 bg-red-100 text-red-900 shadow-[1px_1px_0px_#dc2626]">
              <Flag className="w-3.5 h-3.5" /> FLAGGED / REPORTED
            </span>
          )}
          {status === 'ARCHIVED' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black border-2 border-neutral-400 bg-neutral-100 text-neutral-700">
              <Archive className="w-3.5 h-3.5" /> ARCHIVED
            </span>
          )}
        </div>

      </div>

      {/* Product Strip */}
      <div className="py-2.5 flex items-center justify-between text-xs border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-[#315FE8] shrink-0" />
          <span className="font-bold text-neutral-800">
            {review.productName || review.product?.name || 'Toy Item'}
          </span>
          {review.productSku && (
            <span className="text-[10px] text-neutral-500 font-mono">
              [SKU: {review.productSku}]
            </span>
          )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 text-[#FFD983]">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${
                s <= rating ? 'fill-[#FFD983] text-neutral-900' : 'text-neutral-200'
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-black text-neutral-900 font-mono">
            {rating}.0
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="py-3 space-y-1.5">
        {review.title && (
          <h4 className="font-black text-sm text-neutral-900 uppercase tracking-tight">
            "{review.title}"
          </h4>
        )}
        <p className="text-xs text-neutral-700 font-sans leading-relaxed whitespace-pre-wrap">
          {review.comment || review.body || 'No textual feedback provided.'}
        </p>
      </div>

      {/* Unboxing Photos Gallery */}
      {photos.length > 0 && (
        <div className="py-3 border-t border-neutral-200">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600 mb-2 uppercase">
            <Camera className="w-3.5 h-3.5 text-[#315FE8]" />
            <span>CUSTOMER UNBOXING PROOF ({photos.length} PHOTOS)</span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {photos.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onOpenLightbox(photos, idx, review.parentName)}
                className="group relative w-16 h-16 sm:w-20 sm:h-20 border-2 border-neutral-900 shadow-[2px_2px_0px_#000] overflow-hidden shrink-0 hover:scale-105 transition-transform"
                title="Click to inspect photo in high resolution"
              >
                <img
                  src={imgUrl}
                  alt={`Proof ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">VIEW</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Store Official Reply */}
      {review.storeReply && (
        <div className="mt-3 p-3 bg-[#FFF3DF] border-2 border-neutral-900 shadow-[2px_2px_0px_#000] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-800">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#315FE8]" />
              <span className="uppercase">TOYVOLT OFFICIAL STORE RESPONSE</span>
            </div>
            <button
              onClick={() => onOpenReply(review)}
              className="text-[#315FE8] hover:underline uppercase text-[9px]"
            >
              EDIT REPLY
            </button>
          </div>
          <p className="text-xs text-neutral-800 font-sans whitespace-pre-wrap leading-relaxed">
            {review.storeReply.text || review.storeReply}
          </p>
        </div>
      )}

      {/* Moderation Actions Strip */}
      <div className="mt-4 pt-3 border-t-2 border-neutral-900 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[10px] text-neutral-500 font-sans">
          Review ID: <code className="font-mono text-neutral-800">{review._id?.slice(-8) || 'REV-LOCAL'}</code>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Reply Button */}
          <button
            onClick={() => onOpenReply(review)}
            className="px-2.5 py-1.5 border border-neutral-900 bg-white hover:bg-neutral-100 text-[11px] font-bold text-neutral-900 shadow-[1px_1px_0px_#000] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#315FE8]" />
            <span>{review.storeReply ? 'EDIT REPLY' : 'REPLY TO PARENT'}</span>
          </button>

          {/* Status Actions */}
          {status !== 'PUBLISHED' ? (
            <button
              onClick={() => onUpdateStatus(review._id, 'PUBLISHED')}
              className="px-3 py-1.5 border-2 border-neutral-900 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black shadow-[2px_2px_0px_#000] flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>APPROVE & PUBLISH</span>
            </button>
          ) : (
            <button
              onClick={() => onUpdateStatus(review._id, 'ARCHIVED')}
              className="px-2.5 py-1.5 border border-neutral-900 bg-neutral-100 hover:bg-neutral-200 text-[11px] font-bold text-neutral-800 shadow-[1px_1px_0px_#000] flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>UNPUBLISH / ARCHIVE</span>
            </button>
          )}

          {status !== 'FLAGGED' && (
            <button
              onClick={() => onUpdateStatus(review._id, 'FLAGGED')}
              className="px-2 py-1.5 border border-neutral-900 bg-amber-100 hover:bg-amber-200 text-[11px] font-bold text-amber-900 shadow-[1px_1px_0px_#000] flex items-center gap-1"
              title="Flag for suspicious or abusive content"
            >
              <Flag className="w-3.5 h-3.5 text-amber-700" />
              <span>FLAG</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
