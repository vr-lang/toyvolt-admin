import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { productService, rupeesToPaise } from '../../services/productService';
import { getErrorMessage } from '../../services/api';

// Subcomponents
import BasicIdentitySection from '../../components/products/new/BasicIdentitySection';
import MediaGallerySection from '../../components/products/new/MediaGallerySection';
import VariantMatrixSection from '../../components/products/new/VariantMatrixSection';
import BisComplianceSection from '../../components/products/new/BisComplianceSection';
import PricingMarginSection from '../../components/products/new/PricingMarginSection';
import InventoryHubsSection from '../../components/products/new/InventoryHubsSection';
import ShippingDimensionsSection from '../../components/products/new/ShippingDimensionsSection';
import VisibilitySeoSection from '../../components/products/new/VisibilitySeoSection';
import ProductPreviewModal from '../../components/products/new/ProductPreviewModal';

const DEFAULT_IMAGE = {
  url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
  publicId: 'default_hero_rc',
  isPrimary: true
};

export const NewProductPage = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'Remote Control Cars',
    hsnCode: '950300',
    tags: ['4WD', 'Brushless', 'High-Speed'],
    summary: '',
    description: '',
    sellingPrice: '',
    compareAtPrice: '',
    costPrice: '',
    availableStock: '50',
    lowStockThreshold: '10',
    barcode: '',
    allowBackorders: false,
    weightGrams: '1850',
    dimensions: {
      lengthCm: '38',
      breadthCm: '24',
      heightCm: '18'
    },
    images: [DEFAULT_IMAGE],
    hasVariants: false,
    variants: [],
    bis: {
      standard: 'IS 9873 (Part 1, 2, 3) & IS 15644 (Safety of Toys & Electric Toys)',
      cmlNumber: 'CM/L-8400192834',
      ageGroup: '8+ Years (Speed Grade RC)',
      warnings:
        'WARNING: CHOKING HAZARD - Small parts. Not suitable for children under 3 years. Use under direct adult supervision. Charge battery with included balanced charger only.',
      status: 'VERIFIED'
    },
    visibility: {
      isActive: true,
      metaTitle: '',
      metaDescription: ''
    }
  });

  const [slugSynced, setSlugSynced] = useState(true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);

  // Field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Nested BIS change
  const handleBisChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      bis: {
        ...prev.bis,
        [field]: value
      }
    }));
  };

  // Nested Visibility change
  const handleVisibilityChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [field]: value
      }
    }));
  };

  // SKU Generator
  const handleAutoGenerateSku = () => {
    const prefix = 'TV-RC-';
    const categoryCode = formData.category.slice(0, 3).toUpperCase();
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const generated = `${prefix}${categoryCode}-${randomHex}`;
    handleFieldChange('sku', generated);
  };

  // Slug Generator
  const handleAutoGenerateSlug = () => {
    if (!formData.name) return;
    const generated = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlugSynced(true);
    handleFieldChange('slug', generated);
  };

  // Validation
  const validateForm = () => {
    const errs = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errs.name = 'Product name is required (min 2 characters).';
    } else if (formData.name.length > 200) {
      errs.name = 'Product name cannot exceed 200 characters.';
    }

    if (!formData.slug || formData.slug.trim().length < 2) {
      errs.slug = 'Valid URL slug is required (min 2 characters).';
    }

    if (!formData.sku || formData.sku.trim().length < 2) {
      errs.sku = 'Product SKU / Model Code is required (min 2 characters).';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errs.description = 'Product description must be at least 10 characters long.';
    }

    const sellingNum = Number(formData.sellingPrice);
    if (!formData.sellingPrice || isNaN(sellingNum) || sellingNum <= 0) {
      errs.sellingPrice = 'Please enter a valid positive selling price.';
    }

    if (formData.compareAtPrice) {
      const compareNum = Number(formData.compareAtPrice);
      if (isNaN(compareNum) || compareNum < sellingNum) {
        errs.compareAtPrice = 'MRP / Compare-at price must be greater than or equal to selling price.';
      }
    }

    const stockNum = Number(formData.availableStock);
    if (formData.availableStock === '' || isNaN(stockNum) || stockNum < 0) {
      errs.availableStock = 'Available stock cannot be negative.';
    }

    const weightNum = Number(formData.weightGrams);
    if (!formData.weightGrams || isNaN(weightNum) || weightNum <= 0) {
      errs.weightGrams = 'Dead weight must be a positive number of grams.';
    }

    const l = Number(formData.dimensions?.lengthCm);
    const b = Number(formData.dimensions?.breadthCm);
    const h = Number(formData.dimensions?.heightCm);
    if (!l || !b || !h || l <= 0 || b <= 0 || h <= 0) {
      errs.dimensions = 'All box dimensions (Length, Breadth, Height) must be greater than 0.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save product handler (Draft vs Publish)
  const handleSubmit = async (publishNow = true) => {
    setServerError(null);

    const isValid = validateForm();
    if (!isValid) {
      setServerError('Please fix the highlighted validation errors before saving.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    try {
      // Build specifications map for backend schema
      const specifications = {
        'HSN Code': formData.hsnCode || '950300',
        'BIS Standard': formData.bis.standard || 'IS 9873',
        'BIS License': formData.bis.cmlNumber || 'CM/L-8400192834',
        'Age Group': formData.bis.ageGroup || '8+ Years',
        'Safety Warnings': formData.bis.warnings || '',
        'BIS Status': formData.bis.status || 'VERIFIED',
        'Tags': (formData.tags || []).join(', '),
        'Summary': formData.summary || '',
        'Barcode': formData.barcode || '',
        'Allow Backorders': formData.allowBackorders ? 'Yes' : 'No',
        'Low Stock Threshold': String(formData.lowStockThreshold || 10)
      };

      if (formData.hasVariants && formData.variants.length > 0) {
        specifications['Variant Configuration'] = JSON.stringify(formData.variants);
      }

      // Convert Rupee prices to integer paise for backend model
      const sellingPricePaise = rupeesToPaise(Number(formData.sellingPrice));
      const compareAtPricePaise = formData.compareAtPrice
        ? rupeesToPaise(Number(formData.compareAtPrice))
        : null;
      const costPricePaise = formData.costPrice
        ? rupeesToPaise(Number(formData.costPrice))
        : null;

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        sku: formData.sku.trim().toUpperCase(),
        description: formData.description.trim(),
        category: formData.category || 'Remote Control Cars',
        sellingPrice: sellingPricePaise,
        compareAtPrice: compareAtPricePaise,
        costPrice: costPricePaise,
        availableStock: Math.max(0, parseInt(formData.availableStock, 10) || 0),
        weightGrams: Number(formData.weightGrams) || 1000,
        dimensions: {
          lengthCm: Number(formData.dimensions.lengthCm) || 20,
          breadthCm: Number(formData.dimensions.breadthCm) || 20,
          heightCm: Number(formData.dimensions.heightCm) || 20
        },
        specifications,
        images: (formData.images || []).map((img, idx) => ({
          url: img.url,
          publicId: img.publicId || '',
          isPrimary: img.isPrimary ?? idx === 0
        })),
        isActive: publishNow ? !!formData.visibility.isActive : false
      };

      const result = await productService.createProduct(payload);

      setSuccessMessage(
        publishNow
          ? `Product "${result.name || formData.name}" published successfully!`
          : `Draft product "${result.name || formData.name}" saved as unpublished.`
      );

      // Redirect back to catalog after brief confirmation
      setTimeout(() => {
        navigate('/products');
      }, 1200);
    } catch (err) {
      console.error('Failed to create product:', err);
      const msg = getErrorMessage(err, 'Failed to create product. Please verify inputs or backend connection.');
      setServerError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  // Discard handler
  const handleDiscard = () => {
    const isDirty =
      Boolean(formData.name) ||
      Boolean(formData.description) ||
      Boolean(formData.sellingPrice);

    if (isDirty) {
      setIsDiscardConfirmOpen(true);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ========================================================= */}
      {/* TOP HEADER & ACTION CONTROL BAR                          */}
      {/* ========================================================= */}
      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="hover:text-[#315FE8] flex items-center gap-1 font-bold"
            >
              <ArrowLeft size={12} /> CONSOLE
            </button>
            <span>/</span>
            <span>CATALOG</span>
            <span>/</span>
            <span className="text-[#171717] font-bold">ADD NEW PRODUCT</span>
          </div>

          {/* Page Title & Status Indicator */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-mono font-bold uppercase tracking-tight text-[#171717]">
              ADD NEW PRODUCT // PRODUCT CONFIGURATION
            </h1>
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold border ${
                formData.visibility.isActive
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : 'bg-amber-100 text-amber-800 border-amber-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.visibility.isActive ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              />
              {formData.visibility.isActive ? 'TARGET: LIVE ON PUBLISH' : 'TARGET: DRAFT ONLY'}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* DISCARD */}
          <button
            type="button"
            onClick={handleDiscard}
            disabled={saving}
            className="px-3 py-2 bg-white hover:bg-red-50 text-[#171717] hover:text-[#FF5638] text-xs font-mono font-bold uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717] transition-all flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Trash2 size={13} />
            <span>Discard</span>
          </button>

          {/* PREVIEW LIVE */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-[#DCE5FF] text-[#315FE8] text-xs font-mono font-bold uppercase border-2 border-[#315FE8] shadow-[2px_2px_0px_#315FE8] transition-all flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Eye size={13} />
            <span>Preview Live</span>
          </button>

          {/* SAVE DRAFT */}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-gray-200 text-[#171717] text-xs font-mono font-bold uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717] transition-all flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save Draft</span>
          </button>

          {/* SAVE & PUBLISH */}
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-4 py-2 bg-[#315FE8] hover:bg-[#254bc0] text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#171717] shadow-[3px_3px_0px_#171717] transition-all flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SERVER ERROR / SUCCESS BANNERS                            */}
      {/* ========================================================= */}
      {serverError && (
        <div className="p-4 bg-red-50 border-2 border-[#FF5638] shadow-[3px_3px_0px_#FF5638] flex items-start gap-3">
          <AlertCircle size={18} className="text-[#FF5638] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xs font-mono font-bold uppercase text-[#FF5638]">
              Product Submission Blocked
            </h3>
            <p className="text-xs font-mono text-red-900 mt-0.5">{serverError}</p>
          </div>
          <button
            type="button"
            onClick={() => setServerError(null)}
            className="text-xs font-mono font-bold text-red-700 hover:underline"
          >
            DISMISS
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-600 shadow-[3px_3px_0px_#059669] flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <div className="flex-1">
            <h3 className="text-xs font-mono font-bold uppercase text-emerald-800">
              {successMessage}
            </h3>
            <p className="text-xs font-mono text-emerald-700 mt-0.5">
              Redirecting to catalog overview...
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN TWO-COLUMN FORM LAYOUT                               */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: ~65-70% (col-span-12 lg:col-span-8)          */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 01: Basic Product Identity */}
          <BasicIdentitySection
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
            onAutoGenerateSku={handleAutoGenerateSku}
            onAutoGenerateSlug={handleAutoGenerateSlug}
            slugSynced={slugSynced}
            setSlugSynced={setSlugSynced}
          />

          {/* Section 02: Media & Packaging Gallery */}
          <MediaGallerySection
            images={formData.images}
            onChangeImages={(imgs) => handleFieldChange('images', imgs)}
            error={errors.images}
          />

          {/* Section 03: Variant Matrix */}
          <VariantMatrixSection
            hasVariants={formData.hasVariants}
            onToggleVariants={(val) => handleFieldChange('hasVariants', val)}
            variants={formData.variants}
            onChangeVariants={(vars) => handleFieldChange('variants', vars)}
            baseSku={formData.sku || 'TV-RC-PRODUCT'}
            basePrice={Number(formData.sellingPrice) || 2999}
            baseStock={Number(formData.availableStock) || 50}
          />

          {/* Section 04: Indian Toy Safety & BIS Compliance */}
          <BisComplianceSection
            bisData={formData.bis}
            onChange={handleBisChange}
          />
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: ~30-35% (col-span-12 lg:col-span-4)         */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section B: Pricing & Margin Intelligence */}
          <PricingMarginSection
            pricing={{
              sellingPrice: formData.sellingPrice,
              compareAtPrice: formData.compareAtPrice,
              costPrice: formData.costPrice
            }}
            errors={errors}
            onChange={handleFieldChange}
          />

          {/* Section C: Inventory & Warehousing Hubs */}
          <InventoryHubsSection
            inventory={{
              availableStock: formData.availableStock,
              lowStockThreshold: formData.lowStockThreshold,
              barcode: formData.barcode,
              allowBackorders: formData.allowBackorders
            }}
            errors={errors}
            onChange={handleFieldChange}
          />

          {/* Section D: Shipping & Volumetric Box Dimensions */}
          <ShippingDimensionsSection
            shipping={{
              weightGrams: formData.weightGrams,
              dimensions: formData.dimensions
            }}
            errors={errors}
            onChange={handleFieldChange}
          />

          {/* Section H: Search & Storefront Visibility (SEO) */}
          <VisibilitySeoSection
            visibility={formData.visibility}
            productTitle={formData.name}
            productSlug={formData.slug}
            productSummary={formData.summary}
            onChange={handleVisibilityChange}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM FIXED / FLOATING QUICK ACTION BAR                  */}
      {/* ========================================================= */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-sm border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase text-[#171717]">
            CATALOG COMPLIANCE ENGINE ACTIVE
          </span>
          <span className="hidden md:inline text-xs font-mono text-gray-500">
            • 18% GST • QCO 2020 BIS STANDARD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={saving}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-xs font-mono font-bold uppercase border-2 border-[#171717]"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-gray-200 text-xs font-mono font-bold uppercase border-2 border-[#171717]"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-4 py-1.5 bg-[#315FE8] hover:bg-[#254bc0] text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1.5"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRODUCT LIVE PREVIEW MODAL                                */}
      {/* ========================================================= */}
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        productData={{
          ...formData,
          sellingPrice: formData.sellingPrice || 2999,
          compareAtPrice: formData.compareAtPrice || 4999
        }}
      />

      {/* ========================================================= */}
      {/* DISCARD CONFIRMATION MODAL                                */}
      {/* ========================================================= */}
      {isDiscardConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-4 border-[#171717] shadow-[6px_6px_0px_#171717] p-5 max-w-md w-full">
            <div className="flex items-center gap-2 text-[#FF5638] mb-3">
              <AlertCircle size={20} />
              <h3 className="font-mono font-bold text-sm uppercase">
                Discard Unsaved Product?
              </h3>
            </div>
            <p className="text-xs font-mono text-gray-700 leading-relaxed mb-5">
              You have entered product information that will be permanently lost if you navigate away without saving. Are you sure you want to discard?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDiscardConfirmOpen(false)}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-xs font-mono font-bold uppercase border-2 border-[#171717]"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDiscardConfirmOpen(false);
                  navigate('/products');
                }}
                className="px-3 py-1.5 bg-[#FF5638] hover:bg-red-600 text-white text-xs font-mono font-bold uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
              >
                Yes, Discard All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProductPage;
