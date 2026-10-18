import React from 'react';
import { Tag, Sparkles, AlertCircle, Link2, Hash, FileText, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Remote Control Cars',
  'RC Drones & Copters',
  'Diecast Collectibles',
  'STEM Robotics',
  'Track Sets & Slot Cars',
  'Monster Trucks & Crawlers',
  'RC Boats & Marine',
  'Action Figures & Playsets',
  'Educational Toys'
];

const SUGGESTED_TAGS = [
  '4WD',
  'Brushless Motor',
  'Off-Road',
  'High-Speed 45km/h',
  'Waterproof ESC',
  '2.4GHz Radio',
  'Rechargeable Li-Po',
  'All-Terrain',
  'Hobby Grade'
];

export const BasicIdentitySection = ({
  formData,
  errors,
  onChange,
  onAutoGenerateSku,
  onAutoGenerateSlug,
  slugSynced,
  setSlugSynced
}) => {
  const [tagInput, setTagInput] = React.useState('');

  const handleTitleChange = (e) => {
    const title = e.target.value;
    onChange('name', title);
    if (slugSynced) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      onChange('slug', generatedSlug);
    }
  };

  const handleSlugChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlugSynced(false);
    onChange('slug', val);
  };

  const handleAddTag = (tagToAdd) => {
    const trimmed = (tagToAdd || tagInput).trim();
    if (!trimmed) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(trimmed)) {
      onChange('tags', [...currentTags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = formData.tags || [];
    onChange('tags', currentTags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('product-description-field');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'Sample text';
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange('description', newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const insertSpecTable = () => {
    const tableTemplate = `\n\n### TECHNICAL SPECIFICATIONS\n- Scale: 1:12 Full Proportion\n- Motor: RC390 High-Torque Carbon Brush\n- Speed: 35-40 km/h\n- Drive System: 4-Wheel Shaft Drive\n- Battery: 7.4V 1500mAh Li-ion\n- Run Time: 20-25 mins per charge\n- Remote Distance: 80+ meters\n`;
    onChange('description', (formData.description || '') + tableTemplate);
  };

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#171717] text-white flex items-center justify-center font-mono font-bold text-xs">
            01
          </div>
          <h2 className="font-mono font-bold text-sm tracking-wider uppercase text-[#171717]">
            Basic Product Identity // Core Classification
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#DCE5FF] text-[#315FE8] border border-[#315FE8]">
          REQUIRED MODULE
        </span>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1.5">
              <span>Product Title / Commercial Name</span>
              <span className="text-[#FF5638]">*</span>
            </label>
            <span
              className={`text-[10px] font-mono font-bold ${
                (formData.name?.length || 0) > 180
                  ? 'text-[#FF5638]'
                  : (formData.name?.length || 0) > 0
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              {formData.name?.length || 0} / 200 CHARS
            </span>
          </div>
          <input
            type="text"
            value={formData.name || ''}
            onChange={handleTitleChange}
            maxLength={200}
            placeholder="e.g. Turbo 4WD Desert Buggy 1:12 High Speed Brushless RC"
            className={`w-full bg-[#FAF8F5] border-2 ${
              errors.name ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
            } px-3 py-2 text-sm font-sans font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white transition-all`}
          />
          {errors.name && (
            <p className="mt-1 text-xs font-mono text-[#FF5638] flex items-center gap-1">
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        {/* Slug and SKU Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* URL Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1.5">
                <Link2 size={13} />
                <span>URL Slug Identifier</span>
                <span className="text-[#FF5638]">*</span>
              </label>
              <button
                type="button"
                onClick={onAutoGenerateSlug}
                className="text-[10px] font-mono font-bold text-[#315FE8] hover:underline uppercase flex items-center gap-1"
              >
                <Sparkles size={10} /> Auto-Sync
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-mono text-gray-400">
                /products/
              </div>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={handleSlugChange}
                placeholder="turbo-4wd-desert-buggy"
                className={`w-full bg-[#FAF8F5] border-2 ${
                  errors.slug ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
                } pl-24 pr-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
              />
            </div>
            {errors.slug ? (
              <p className="mt-1 text-xs font-mono text-[#FF5638] flex items-center gap-1">
                <AlertCircle size={12} /> {errors.slug}
              </p>
            ) : (
              <p className="mt-1 text-[10px] font-mono text-gray-500 truncate">
                Preview: https://toyvolt.com/products/{formData.slug || 'product-slug'}
              </p>
            )}
          </div>

          {/* SKU / Model Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1.5">
                <Hash size={13} />
                <span>Model Code / SKU</span>
                <span className="text-[#FF5638]">*</span>
              </label>
              <button
                type="button"
                onClick={onAutoGenerateSku}
                className="text-[10px] font-mono font-bold text-[#315FE8] hover:underline uppercase flex items-center gap-1"
              >
                <Sparkles size={10} /> Generate SKU
              </button>
            </div>
            <input
              type="text"
              value={formData.sku || ''}
              onChange={(e) => onChange('sku', e.target.value.toUpperCase().replace(/\s+/g, '-'))}
              placeholder="TV-RC-TURBO-4WD"
              className={`w-full bg-[#FAF8F5] border-2 ${
                errors.sku ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
              } px-3 py-2 text-xs font-mono font-bold uppercase text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
            />
            {errors.sku && (
              <p className="mt-1 text-xs font-mono text-[#FF5638] flex items-center gap-1">
                <AlertCircle size={12} /> {errors.sku}
              </p>
            )}
          </div>
        </div>

        {/* Category & HSN Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary Category */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#171717] mb-1.5">
              Primary Catalog Category <span className="text-[#FF5638]">*</span>
            </label>
            <select
              value={formData.category || 'Remote Control Cars'}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* HSN Code (GST Compliance) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1.5">
                <span>HSN Code (GST Class)</span>
              </label>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 border border-emerald-300 font-bold">
                18% GST STANDARD
              </span>
            </div>
            <input
              type="text"
              value={formData.hsnCode || '950300'}
              onChange={(e) => onChange('hsnCode', e.target.value)}
              placeholder="950300"
              className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
            />
            <p className="mt-1 text-[10px] font-mono text-gray-500">
              HSN 9503: Wheeled toys, reduced-scale models & puzzles
            </p>
          </div>
        </div>

        {/* Tags & Subcategories */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-[#171717] mb-1.5 flex items-center gap-1.5">
            <Tag size={13} />
            <span>Search Tags & Attributes (Press Enter or Comma to add)</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#FAF8F5] border-2 border-[#171717] min-h-[46px]">
            {(formData.tags || []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#171717] text-white font-mono text-xs font-bold"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-[#FF5638] ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDownTag}
              onBlur={() => handleAddTag()}
              placeholder="Type tag + Enter..."
              className="flex-1 min-w-[120px] bg-transparent text-xs font-mono text-[#171717] focus:outline-none px-1"
            />
          </div>

          {/* Quick Tag Suggestions */}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-mono text-gray-500 mr-1 uppercase">Quick Add:</span>
            {SUGGESTED_TAGS.filter((t) => !(formData.tags || []).includes(t))
              .slice(0, 6)
              .map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => handleAddTag(suggested)}
                  className="text-[10px] font-mono bg-white hover:bg-[#DCE5FF] hover:border-[#315FE8] text-gray-700 px-1.5 py-0.5 border border-gray-300 transition-colors"
                >
                  + {suggested}
                </button>
              ))}
          </div>
        </div>

        {/* Short Summary */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-[#171717] mb-1.5">
            Short Summary / Key Hook (Shown on Product Card & Mobile Previews)
          </label>
          <input
            type="text"
            value={formData.summary || ''}
            onChange={(e) => onChange('summary', e.target.value)}
            placeholder="High-performance 1:12 4WD monster buggy with independent oil dampers and waterproof ESC."
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-2 text-xs font-sans text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
        </div>

        {/* Detailed Product Story & Specs (Description) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1.5">
              <FileText size={13} />
              <span>Detailed Product Story & Play Specs</span>
              <span className="text-[#FF5638]">*</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold border border-[#171717] bg-white hover:bg-gray-100"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold border border-[#171717] bg-white hover:bg-gray-100 italic"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- ')}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold border border-[#171717] bg-white hover:bg-gray-100"
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                onClick={insertSpecTable}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold border border-[#315FE8] bg-[#DCE5FF] text-[#315FE8] hover:bg-blue-200"
                title="Insert Specifications Table Template"
              >
                + Spec Table
              </button>
            </div>
          </div>
          <textarea
            id="product-description-field"
            rows={7}
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Unleash high-speed off-road thrills with the Toyvolt Turbo Buggy! Engineered with an aggressive aerodynamic chassis..."
            className={`w-full bg-[#FAF8F5] border-2 ${
              errors.description ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
            } p-3 text-xs font-mono leading-relaxed text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.description ? (
              <p className="text-xs font-mono text-[#FF5638] flex items-center gap-1">
                <AlertCircle size={12} /> {errors.description}
              </p>
            ) : (
              <p className="text-[10px] font-mono text-gray-500">
                Minimum 10 characters required. Markdown formatting supported.
              </p>
            )}
            <span className="text-[10px] font-mono text-gray-400">
              {formData.description?.length || 0} CHARS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicIdentitySection;
