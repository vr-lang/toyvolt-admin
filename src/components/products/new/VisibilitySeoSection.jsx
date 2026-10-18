import React from 'react';
import { Globe, Search, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

export const VisibilitySeoSection = ({
  visibility = {},
  productTitle = '',
  productSlug = '',
  productSummary = '',
  onChange
}) => {
  const metaTitle = visibility.metaTitle || (productTitle ? `${productTitle} | Toyvolt Official Store` : '');
  const metaDesc =
    visibility.metaDescription ||
    (productSummary ||
      'Shop high-performance RC cars and hobby toys at Toyvolt India. Fast shipping across India with BIS certified quality.');

  const handleSyncTitle = () => {
    if (productTitle) {
      onChange('metaTitle', `${productTitle} | Toyvolt Official Store`);
    }
  };

  const handleSyncDesc = () => {
    if (productSummary) {
      onChange('metaDescription', productSummary);
    }
  };

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#171717] text-white flex items-center justify-center font-mono font-bold text-[10px]">
            <Globe size={12} />
          </div>
          <h2 className="font-mono font-bold text-xs tracking-wider uppercase text-[#171717]">
            Search & Storefront Visibility
          </h2>
        </div>
        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${
            visibility.isActive
              ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
              : 'bg-amber-100 text-amber-800 border-amber-400'
          }`}
        >
          {visibility.isActive ? 'PUBLISHED' : 'DRAFT'}
        </span>
      </div>

      <div className="space-y-3">
        {/* Publication Status Card */}
        <div className="p-2.5 bg-[#FAF8F5] border-2 border-[#171717]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {visibility.isActive ? (
                <div className="w-6 h-6 bg-emerald-500 text-white flex items-center justify-center">
                  <Eye size={14} />
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-400 text-white flex items-center justify-center">
                  <EyeOff size={14} />
                </div>
              )}
              <div>
                <p className="text-xs font-mono font-bold uppercase text-[#171717]">
                  {visibility.isActive ? 'Live on Storefront' : 'Unpublished Draft'}
                </p>
                <p className="text-[9px] font-mono text-gray-500">
                  {visibility.isActive
                    ? 'Active and purchasable by storefront customers.'
                    : 'Hidden from storefront search and catalog.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChange('isActive', !visibility.isActive)}
              className={`w-11 h-6 flex items-center p-0.5 border-2 border-[#171717] transition-colors ${
                visibility.isActive ? 'bg-[#315FE8]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white border border-[#171717] shadow-sm transform transition-transform ${
                  visibility.isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono font-bold uppercase text-gray-700 flex items-center gap-1">
              <span>SEO Meta Title</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncTitle}
                className="text-[9px] font-mono text-[#315FE8] hover:underline uppercase flex items-center gap-0.5"
              >
                <Sparkles size={9} /> Sync
              </button>
              <span
                className={`text-[9px] font-mono ${
                  metaTitle.length > 60 ? 'text-[#FF5638] font-bold' : 'text-gray-400'
                }`}
              >
                {metaTitle.length}/60
              </span>
            </div>
          </div>
          <input
            type="text"
            value={visibility.metaTitle || ''}
            onChange={(e) => onChange('metaTitle', e.target.value)}
            placeholder={productTitle ? `${productTitle} | Toyvolt` : 'Product Meta Title | Toyvolt'}
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-2.5 py-1 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono font-bold uppercase text-gray-700">
              SEO Meta Description
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncDesc}
                className="text-[9px] font-mono text-[#315FE8] hover:underline uppercase flex items-center gap-0.5"
              >
                <Sparkles size={9} /> Sync
              </button>
              <span
                className={`text-[9px] font-mono ${
                  metaDesc.length > 155 ? 'text-[#FF5638] font-bold' : 'text-gray-400'
                }`}
              >
                {metaDesc.length}/155
              </span>
            </div>
          </div>
          <textarea
            rows={2}
            value={visibility.metaDescription || ''}
            onChange={(e) => onChange('metaDescription', e.target.value)}
            placeholder="High-performance RC toys with fast shipping..."
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-2.5 py-1 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
        </div>

        {/* Google SERP Snippet Preview */}
        <div className="pt-2 border-t border-gray-200">
          <span className="block text-[9px] font-mono font-bold uppercase text-gray-500 mb-1.5 flex items-center gap-1">
            <Search size={10} /> Google SERP Snippet Preview
          </span>
          <div className="p-2.5 bg-white border border-gray-300 font-sans text-left space-y-0.5">
            <div className="text-[10px] text-[#202124] flex items-center gap-1 truncate">
              <span>https://toyvolt.com</span>
              <span>›</span>
              <span>products</span>
              <span>›</span>
              <span className="font-medium">{productSlug || 'product-slug'}</span>
            </div>
            <p className="text-xs font-medium text-[#1a0dab] hover:underline truncate cursor-pointer leading-snug">
              {metaTitle || productTitle || 'New Toyvolt Product - Buy Online in India'}
            </p>
            <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
              {metaDesc || 'Official Toyvolt Store. Guaranteed authentic BIS quality toys, superfast Pan-India dispatch, and dedicated customer support.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySeoSection;
