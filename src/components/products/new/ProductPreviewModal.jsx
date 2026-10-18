import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ExternalLink,
  Layers,
  Heart,
  ShoppingCart,
  Maximize2
} from 'lucide-react';

export const ProductPreviewModal = ({
  isOpen,
  onClose,
  productData = {}
}) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card' or 'pdp'
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen) return null;

  const {
    name = 'Turbo 4WD Desert Buggy 1:12 High Speed Brushless RC',
    slug = 'turbo-4wd-desert-buggy',
    sku = 'TV-RC-TURBO-4WD',
    category = 'Remote Control Cars',
    description = '',
    summary = 'High-performance 1:12 4WD monster buggy with independent oil dampers and waterproof ESC.',
    sellingPrice = 2999,
    compareAtPrice = 4999,
    availableStock = 50,
    images = [],
    tags = ['4WD', 'Brushless', 'Off-Road'],
    variants = [],
    hasVariants = false,
    bis = {
      standard: 'IS 9873 (Part 1, 2, 3) & IS 15644',
      cmlNumber: 'CM/L-8400192834',
      ageGroup: '8+ Years (Speed Grade RC)',
      warnings: 'WARNING: CHOKING HAZARD - Small parts. Not suitable for children under 3 years.'
    }
  } = productData;

  const primaryImage =
    images.find((img) => img.isPrimary)?.url ||
    images[0]?.url ||
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80';

  const discountPercent =
    compareAtPrice > sellingPrice
      ? Math.round(((compareAtPrice - sellingPrice) / compareAtPrice) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#F7F3EB] border-4 border-[#171717] shadow-[8px_8px_0px_#171717] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-[#171717] text-white px-4 py-3 flex items-center justify-between border-b-2 border-[#171717]">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#315FE8] border border-white" />
            <h3 className="font-mono font-bold text-sm tracking-wider uppercase">
              LIVE STOREFRONT SIMULATOR // TOYVOLT.COM
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex bg-[#262626] border border-gray-600 p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors ${
                  activeTab === 'card'
                    ? 'bg-[#315FE8] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Catalog Card View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pdp')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors ${
                  activeTab === 'pdp'
                    ? 'bg-[#315FE8] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Full Product Detail (PDP)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'card' ? (
            /* ========================================= */
            /* 1. STOREFRONT CATALOG CARD SIMULATION     */
            /* ========================================= */
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-xs font-mono uppercase text-gray-500 mb-4 tracking-wider">
                Storefront Grid Card Representation
              </p>

              {/* Toyvolt Customer Card */}
              <div className="w-80 bg-white border-2 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col group transition-transform hover:-translate-y-1">
                {/* Image Frame */}
                <div className="relative aspect-square w-full bg-[#FAF8F5] border-b-2 border-[#171717] overflow-hidden flex items-center justify-center">
                  <img
                    src={primaryImage}
                    alt={name}
                    className="w-full h-full object-cover p-2"
                  />

                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-2 left-2 bg-[#FF5638] text-white text-xs font-mono font-bold px-2 py-0.5 border border-[#171717] shadow-[2px_2px_0px_#171717]">
                      {discountPercent}% OFF
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm border border-[#171717] text-[10px] font-mono font-bold px-1.5 py-0.5">
                    {availableStock > 0 ? 'READY TO SHIP' : 'PRE-ORDER'}
                  </div>

                  {/* BIS Verified Stamp */}
                  <div className="absolute bottom-2 left-2 bg-emerald-100 text-emerald-800 border border-emerald-400 text-[9px] font-mono font-bold px-1.5 py-0.5 flex items-center gap-1">
                    <ShieldCheck size={11} /> BIS IS 9873
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Category */}
                    <div className="text-[10px] font-mono font-bold uppercase text-[#315FE8] tracking-wider mb-1">
                      {category}
                    </div>

                    {/* Title */}
                    <h4 className="font-mono font-bold text-sm text-[#171717] line-clamp-2 leading-snug mb-2">
                      {name}
                    </h4>

                    {/* Star Rating Mockup */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 font-bold ml-1">
                        4.9 (128)
                      </span>
                    </div>
                  </div>

                  <div>
                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-mono font-bold text-[#171717]">
                        ₹{Number(sellingPrice).toLocaleString('en-IN')}
                      </span>
                      {compareAtPrice > sellingPrice && (
                        <span className="text-xs font-mono text-gray-400 line-through">
                          ₹{Number(compareAtPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      className="w-full py-2 bg-[#FFD983] hover:bg-[#ffcf66] text-[#171717] font-mono font-bold text-xs uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================= */
            /* 2. FULL PRODUCT DETAIL PAGE (PDP) PREVIEW */
            /* ========================================= */
            <div className="space-y-6">
              {/* Storefront Header Breadcrumbs */}
              <div className="text-xs font-mono text-gray-600 flex items-center gap-1.5 border-b border-gray-300 pb-2">
                <span>HOME</span>
                <span>/</span>
                <span>{category.toUpperCase()}</span>
                <span>/</span>
                <span className="text-[#171717] font-bold truncate">{name}</span>
              </div>

              {/* PDP Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Gallery */}
                <div>
                  <div className="aspect-square bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-2 flex items-center justify-center relative">
                    <img
                      src={
                        images[selectedImageIndex]?.url ||
                        primaryImage
                      }
                      alt={name}
                      className="w-full h-full object-contain"
                    />
                    {discountPercent > 0 && (
                      <span className="absolute top-2 left-2 bg-[#FF5638] text-white text-xs font-mono font-bold px-2 py-0.5 border border-[#171717]">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedImageIndex(i)}
                          className={`w-14 h-14 bg-white border-2 shrink-0 p-0.5 transition-all ${
                            selectedImageIndex === i
                              ? 'border-[#315FE8] ring-2 ring-[#315FE8]/30 shadow-[2px_2px_0px_#315FE8]'
                              : 'border-[#171717] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Buy Box */}
                <div className="space-y-4">
                  {/* Category and SKU */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#315FE8] font-bold uppercase">{category}</span>
                    <span className="text-gray-500 font-bold">SKU: {sku}</span>
                  </div>

                  {/* Title */}
                  <h1 className="font-mono font-bold text-xl text-[#171717] leading-tight">
                    {name}
                  </h1>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={11} /> {availableStock} UNITS IN STOCK
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white border border-[#171717] flex items-center gap-1">
                      <ShieldCheck size={11} /> {bis.standard?.slice(0, 16)}...
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#DCE5FF] text-[#315FE8] border border-[#315FE8] flex items-center gap-1">
                      <Truck size={11} /> PAN-INDIA 48H DISPATCH
                    </span>
                  </div>

                  {/* Price Box */}
                  <div className="p-3 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-mono font-bold text-[#171717]">
                        ₹{Number(sellingPrice).toLocaleString('en-IN')}
                      </span>
                      {compareAtPrice > sellingPrice && (
                        <>
                          <span className="text-sm font-mono text-gray-400 line-through">
                            ₹{Number(compareAtPrice).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            Save ₹{(compareAtPrice - sellingPrice).toLocaleString('en-IN')}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 mt-1">
                      Inclusive of all applicable Indian taxes (18% GST). Free shipping on prepaid orders.
                    </p>
                  </div>

                  {/* Summary */}
                  {summary && (
                    <p className="text-xs font-sans text-gray-700 leading-relaxed bg-[#FAF8F5] p-2.5 border border-gray-300">
                      {summary}
                    </p>
                  )}

                  {/* Variants display if enabled */}
                  {hasVariants && variants.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-mono font-bold uppercase text-gray-700 mb-1.5">
                        Select Variant / Spec:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            className="px-2.5 py-1 text-xs font-mono font-bold border-2 border-[#171717] bg-white hover:bg-[#DCE5FF] hover:border-[#315FE8] transition-colors"
                          >
                            {v.name} • ₹{v.price}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buy Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      className="w-full py-3 bg-[#315FE8] hover:bg-[#254bc0] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#171717] shadow-[3px_3px_0px_#171717] transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={15} /> Buy Now // Instant Checkout
                    </button>
                    <button
                      type="button"
                      className="w-full py-2 bg-white hover:bg-gray-100 text-[#171717] font-mono font-bold text-xs uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717] transition-all"
                    >
                      Add To Bag
                    </button>
                  </div>

                  {/* Statutory BIS info strip */}
                  <div className="p-2.5 bg-[#FAF8F5] border border-gray-300 text-[10px] font-mono text-gray-600 space-y-0.5">
                    <p>
                      <span className="font-bold text-[#171717]">BIS CM/L License:</span> {bis.cmlNumber}
                    </p>
                    <p>
                      <span className="font-bold text-[#171717]">Age Grade:</span> {bis.ageGroup}
                    </p>
                    <p className="text-[#FF5638] font-bold">
                      {bis.warnings}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Description / Specs */}
              {description && (
                <div className="mt-6 pt-4 border-t-2 border-[#171717]">
                  <h3 className="text-xs font-mono font-bold uppercase text-[#171717] mb-2 tracking-wider">
                    Product Description & Technical Specifications
                  </h3>
                  <div className="p-4 bg-white border-2 border-[#171717] font-mono text-xs leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {description}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF8F5] px-4 py-3 border-t-2 border-[#171717] flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-500">
            Interactive preview rendered from active form state. Changes update immediately.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171717] text-white hover:bg-gray-800 font-mono font-bold text-xs uppercase border border-[#171717]"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;
