import React, { useState, useEffect } from 'react';
import { 
  X, 
  Tag, 
  AlertCircle, 
  Calendar, 
  Percent, 
  IndianRupee, 
  Sparkles, 
  Check, 
  HelpCircle,
  Save
} from 'lucide-react';
import { couponService } from '../../services/couponService';

const CAMPAIGN_PRESETS = [
  {
    name: 'WELCOME100',
    type: 'flat',
    value: 100,
    minOrder: 499,
    maxDiscount: null,
    desc: 'Flat ₹100 off on first play order'
  },
  {
    name: 'DIWALI20',
    type: 'percentage',
    value: 20,
    minOrder: 1999,
    maxDiscount: 1000,
    desc: 'Diwali Festive 20% off up to ₹1,000'
  },
  {
    name: 'MEGA500',
    type: 'flat',
    value: 500,
    minOrder: 2499,
    maxDiscount: null,
    desc: 'Mega Bonanza: Flat ₹500 off on cart above ₹2,499'
  },
  {
    name: 'FREESHIP',
    type: 'flat',
    value: 149,
    minOrder: 999,
    maxDiscount: null,
    desc: 'Free express shipping waiver (₹149)'
  }
];

export default function CreateCouponModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null
}) {
  const isEdit = Boolean(initialData?._id);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'flat', // 'flat' | 'percentage'
    discountValueRupees: '', // displayed in ₹ or %
    minOrderValueRupees: '',
    maxDiscountValueRupees: '',
    startDate: '',
    expiryDate: '',
    globalUsageLimit: '',
    perCustomerLimit: 1,
    isActive: true
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      const isFlat = initialData.discountType === 'flat';
      setFormData({
        code: initialData.code || '',
        description: initialData.description || '',
        discountType: initialData.discountType || 'flat',
        discountValueRupees: isFlat 
          ? (initialData.discountValue ? Math.round(initialData.discountValue / 100) : '')
          : (initialData.discountValue || ''),
        minOrderValueRupees: initialData.minOrderValue ? Math.round(initialData.minOrderValue / 100) : '',
        maxDiscountValueRupees: initialData.maxDiscountValue ? Math.round(initialData.maxDiscountValue / 100) : '',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
        expiryDate: initialData.expiryDate ? initialData.expiryDate.slice(0, 10) : '',
        globalUsageLimit: initialData.globalUsageLimit || '',
        perCustomerLimit: initialData.perCustomerLimit || 1,
        isActive: initialData.isActive !== false
      });
    } else {
      // Default dates: today and 30 days ahead
      const today = new Date().toISOString().slice(0, 10);
      const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      setFormData({
        code: '',
        description: '',
        discountType: 'flat',
        discountValueRupees: '',
        minOrderValueRupees: '',
        maxDiscountValueRupees: '',
        startDate: today,
        expiryDate: future,
        globalUsageLimit: '',
        perCustomerLimit: 1,
        isActive: true
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      code: preset.name,
      description: preset.desc,
      discountType: preset.type,
      discountValueRupees: preset.value,
      minOrderValueRupees: preset.minOrder || '',
      maxDiscountValueRupees: preset.maxDiscount || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanCode = formData.code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Promo code is required.');
      return;
    }

    const val = Number(formData.discountValueRupees);
    if (isNaN(val) || val <= 0) {
      setError('Please provide a valid discount value greater than 0.');
      return;
    }

    if (formData.discountType === 'percentage' && val > 100) {
      setError('Percentage discount cannot exceed 100%.');
      return;
    }

    try {
      setSubmitting(true);

      // Backend expects paise for flat currency amounts (1 Rupee = 100 paise)
      const payload = {
        code: cleanCode,
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: formData.discountType === 'flat' ? Math.round(val * 100) : val,
        minOrderValue: formData.minOrderValueRupees ? Math.round(Number(formData.minOrderValueRupees) * 100) : 0,
        maxDiscountValue: (formData.discountType === 'percentage' && formData.maxDiscountValueRupees)
          ? Math.round(Number(formData.maxDiscountValueRupees) * 100)
          : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        globalUsageLimit: formData.globalUsageLimit ? Number(formData.globalUsageLimit) : null,
        perCustomerLimit: Number(formData.perCustomerLimit) || 1,
        isActive: formData.isActive
      };

      if (isEdit) {
        await couponService.updateCoupon(initialData._id, payload);
      } else {
        await couponService.createCoupon(payload);
      }

      onSuccess(isEdit ? 'Coupon updated successfully!' : 'Promotional campaign launched successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to save coupon:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save coupon campaign.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] w-full max-w-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#171717] text-white p-4 border-b-4 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-[#FF7626]" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">
                {isEdit ? 'EDIT PROMOTIONAL CAMPAIGN' : 'CREATE PROMOTIONAL VOUCHER / COUPON'}
              </h3>
              <p className="text-[10px] text-neutral-400 font-sans">
                Indian e-commerce checkout rule engine • Rupee to paise conversion handled automatically
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

        {/* Quick Presets (Only on Create) */}
        {!isEdit && (
          <div className="bg-[#FFF3DF] border-b-2 border-neutral-900 px-5 py-2.5 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-black uppercase text-neutral-700 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7626]" /> PRESET RECIPES:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CAMPAIGN_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2 py-0.5 text-[10px] font-bold border border-neutral-900 bg-white hover:bg-[#315FE8] hover:text-white transition-colors shadow-[1px_1px_0px_#000]"
                >
                  +{p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-600 text-red-900 text-xs font-sans flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Code & Discount Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black text-neutral-900">
                PROMO CODE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DIWALI500"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                className="w-full p-2.5 bg-white border-2 border-neutral-900 text-xs font-mono uppercase tracking-wider font-bold focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
              />
              <span className="text-[10px] text-neutral-500 font-sans">
                Displayed to parents at storefront checkout.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-neutral-900">
                DISCOUNT CALCULATION *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountType: 'flat' })}
                  className={`p-2 border-2 border-neutral-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] ${
                    formData.discountType === 'flat'
                      ? 'bg-[#315FE8] text-white'
                      : 'bg-white text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <IndianRupee className="w-3.5 h-3.5" /> FLAT ₹ OFF
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
                  className={`p-2 border-2 border-neutral-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] ${
                    formData.discountType === 'percentage'
                      ? 'bg-[#315FE8] text-white'
                      : 'bg-white text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" /> PERCENT % OFF
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-neutral-900">
              CAMPAIGN BANNER / DESCRIPTION *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Festive Bonanza: Flat ₹500 off on educational toys and kits"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
            />
          </div>

          {/* Value, Min Order & Max Cap */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-black text-neutral-900">
                {formData.discountType === 'flat' ? 'DISCOUNT AMOUNT (₹) *' : 'DISCOUNT RATE (%) *'}
              </label>
              <input
                type="number"
                required
                min="1"
                max={formData.discountType === 'percentage' ? 100 : 999999}
                placeholder={formData.discountType === 'flat' ? '500' : '20'}
                value={formData.discountValueRupees}
                onChange={(e) => setFormData({ ...formData, discountValueRupees: e.target.value })}
                className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono font-bold focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 font-sans">
                {formData.discountType === 'flat' ? 'Value in Indian Rupees' : 'Percentage (1-100)'}
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-neutral-900">
                MIN ORDER CART (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 1499"
                value={formData.minOrderValueRupees}
                onChange={(e) => setFormData({ ...formData, minOrderValueRupees: e.target.value })}
                className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 font-sans">
                Leave empty for no minimum.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-neutral-900">
                MAX CAP (₹) {formData.discountType === 'flat' && '(N/A)'}
              </label>
              <input
                type="number"
                disabled={formData.discountType === 'flat'}
                placeholder={formData.discountType === 'flat' ? 'Flat rate' : 'e.g. 1000'}
                value={formData.maxDiscountValueRupees}
                onChange={(e) => setFormData({ ...formData, maxDiscountValueRupees: e.target.value })}
                className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
              />
              <span className="text-[10px] text-neutral-500 font-sans">
                Max ceiling for % off discounts.
              </span>
            </div>
          </div>

          {/* Validity Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black text-neutral-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                START / ACTIVATION DATE
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-neutral-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                EXPIRY / CUTOFF DATE
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono"
              />
            </div>
          </div>

          {/* Usage Limits & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-900">
                GLOBAL REDEMPTION CAP
              </label>
              <input
                type="number"
                min="1"
                placeholder="Unlimited"
                value={formData.globalUsageLimit}
                onChange={(e) => setFormData({ ...formData, globalUsageLimit: e.target.value })}
                className="w-full p-2 bg-white border border-neutral-900 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-900">
                LIMIT PER PARENT
              </label>
              <input
                type="number"
                min="1"
                value={formData.perCustomerLimit}
                onChange={(e) => setFormData({ ...formData, perCustomerLimit: e.target.value })}
                className="w-full p-2 bg-white border border-neutral-900 text-xs font-mono"
              />
            </div>

            <div className="space-y-1 flex flex-col justify-end">
              <label className="inline-flex items-center gap-2 p-2 bg-white border border-neutral-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#315FE8]"
                />
                <span className="text-xs font-black text-neutral-900 uppercase">
                  ACTIVE ON LIVE STORE
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t-2 border-neutral-900 flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 font-sans">
              * Stored securely in MongoDB with atomic cart redemption locks
            </span>
            <div className="flex items-center gap-2">
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
                  <Save className="w-4 h-4" />
                )}
                <span>{isEdit ? 'UPDATE CAMPAIGN' : 'LAUNCH CAMPAIGN'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
