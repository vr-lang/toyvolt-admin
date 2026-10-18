import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Download } from 'lucide-react';

export default function PhotoLightboxModal({
  isOpen,
  onClose,
  photos = [],
  initialIndex = 0,
  reviewerName = 'Parent Review'
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] max-w-3xl w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#171717] text-white p-3 border-b-2 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#FFD983]" />
            <span className="font-bold text-xs uppercase">
              PHOTO PROOF {currentIndex + 1} OF {photos.length} // {reviewerName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 shadow-[1px_1px_0px_#000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative bg-neutral-950 flex items-center justify-center p-4 min-h-[380px] max-h-[70vh]">
          <img
            src={currentPhoto}
            alt="Customer Unboxing Proof"
            className="max-h-[65vh] max-w-full object-contain border-2 border-neutral-800"
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 border-2 border-neutral-900 bg-white hover:bg-[#FFD983] text-neutral-900 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                title="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 border-2 border-neutral-900 bg-white hover:bg-[#FFD983] text-neutral-900 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                title="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Footer Thumbnails & Info */}
        <div className="p-3 bg-[#FFF3DF] border-t-2 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            {photos.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-12 h-12 border-2 overflow-hidden shrink-0 ${
                  currentIndex === idx ? 'border-[#315FE8] shadow-[2px_2px_0px_#000]' : 'border-neutral-900 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <a
            href={currentPhoto}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 border border-neutral-900 bg-white text-xs font-bold text-neutral-900 hover:bg-neutral-100 shadow-[1px_1px_0px_#000] flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>OPEN RAW</span>
          </a>
        </div>

      </div>
    </div>
  );
}
