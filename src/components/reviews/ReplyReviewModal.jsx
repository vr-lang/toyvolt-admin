import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const RESPONSE_TEMPLATES = [
  {
    name: 'Joyful Play Gratitude',
    text: 'Thank you so much for sharing your feedback! We are thrilled to hear that your little one is having an absolute blast with this toy. Wishing your family many more happy hours of creative play!'
  },
  {
    name: 'Durability & BIS Safety Note',
    text: 'Thank you for your review! At Toyvolt, every single product is BIS-certified and built to withstand enthusiastic playtime. Please let us know if you ever need any spare accessories or assistance.'
  },
  {
    name: 'Customer Concierge Support',
    text: 'We are truly sorry to hear this experience did not meet your expectations. Our Toyvolt Support Concierge would love to resolve this for you immediately. Please reach out to support@toyvolt.in with your order ID so we can send a replacement or assist.'
  }
];

export default function ReplyReviewModal({
  isOpen,
  onClose,
  review,
  onSaveReply
}) {
  const [replyText, setReplyText] = useState('');
  const [signOff, setSignOff] = useState('Toyvolt Customer Care');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (review?.storeReply) {
      setReplyText(review.storeReply.text || review.storeReply || '');
    } else {
      setReplyText('');
    }
    setError(null);
  }, [review, isOpen]);

  if (!isOpen || !review) return null;

  const handleApplyTemplate = (tpl) => {
    setReplyText(tpl.text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      setError('Please provide a response message before saving.');
      return;
    }

    try {
      setSubmitting(true);
      const fullReply = `${replyText.trim()}\n\n— ${signOff}`;
      await onSaveReply(review._id, fullReply);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit store reply.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] w-full max-w-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#171717] text-white p-4 border-b-4 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#315FE8]" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">
                RESPOND TO PARENT REVIEW
              </h3>
              <p className="text-[10px] text-neutral-400 font-sans">
                Official store response visible publicly on product listing
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

        {/* Parent Review Context Box */}
        <div className="p-4 bg-[#F7F3EB] border-b-2 border-neutral-900 text-xs">
          <div className="flex items-center justify-between font-bold text-neutral-800 mb-1">
            <span>{review.parentName || review.user?.name || 'Verified Parent'}</span>
            <span className="font-mono text-[10px] text-neutral-500">
              {review.productName || review.product?.name || 'Toy Item'}
            </span>
          </div>
          <p className="text-neutral-700 font-sans italic text-xs line-clamp-3">
            "{review.comment || review.body || 'No comment text'}"
          </p>
        </div>

        {/* Quick Templates */}
        <div className="bg-[#FFF3DF] border-b-2 border-neutral-900 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[10px]">
          <span className="font-black uppercase text-neutral-700 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7626]" /> PRESETS:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {RESPONSE_TEMPLATES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => handleApplyTemplate(t)}
                className="px-2 py-0.5 border border-neutral-900 bg-white hover:bg-[#315FE8] hover:text-white transition-colors shadow-[1px_1px_0px_#000] font-bold"
              >
                +{t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-600 text-red-900 text-xs font-sans flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-black text-neutral-900 uppercase">
              OFFICIAL STORE REPLY MESSAGE *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write a polite, warm, and helpful response to the parent..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2.5 bg-white border-2 border-neutral-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-900 uppercase">
              OFFICIAL SIGN-OFF SIGNATURE
            </label>
            <select
              value={signOff}
              onChange={(e) => setSignOff(e.target.value)}
              className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono font-bold"
            >
              <option value="Toyvolt Customer Care">Toyvolt Customer Care</option>
              <option value="Toyvolt Play Experience Team">Toyvolt Play Experience Team</option>
              <option value="Toyvolt Quality & Safety Assurance">Toyvolt Quality & Safety Assurance</option>
            </select>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t-2 border-neutral-900 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-neutral-900 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-800"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 border-2 border-neutral-900 bg-[#315FE8] hover:bg-[#254bc4] text-white text-xs font-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>POST REPLY</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
