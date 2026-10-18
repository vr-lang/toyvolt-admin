import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AddCustomerModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    postalCode: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please provide parent full name and valid email address.');
      return;
    }

    // Since backend does not provide POST /admin/customers, we give an honest, transparent notice
    setError('Backend capability notice: Manual customer creation endpoint (POST /api/v1/admin/customers) is not currently implemented in the backend. Parents register directly on the storefront via OTP or checkout.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#315FE8] text-white p-4 border-b-2 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-white" />
            <h3 className="font-black text-sm uppercase tracking-tight">
              REGISTER OFFLINE PARENT PROFILE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-amber-50 border-2 border-amber-600 text-amber-900 text-xs font-sans leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-900">
              PARENT FULL NAME *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-900">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                placeholder="parent@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-900">
                MOBILE / WHATSAPP PHONE
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-900 uppercase">
                CITY
              </label>
              <input
                type="text"
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 bg-white border border-neutral-900 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-900 uppercase">
                STATE
              </label>
              <input
                type="text"
                placeholder="Maharashtra"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2 bg-white border border-neutral-900 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-900 uppercase">
                PIN CODE
              </label>
              <input
                type="text"
                placeholder="400001"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full p-2 bg-white border border-neutral-900 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-900 uppercase">
              STORE / OFFLINE NOTES
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Registered in-person at DLF Mall pop-up kiosk."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t-2 border-neutral-900 flex items-center justify-end gap-3">
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
              className="px-5 py-2 border-2 border-neutral-900 bg-[#315FE8] hover:bg-[#254bc4] text-white text-xs font-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>SAVE PROFILE</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
