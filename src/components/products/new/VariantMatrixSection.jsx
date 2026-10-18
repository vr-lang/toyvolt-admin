import React, { useState } from 'react';
import { Layers, Plus, Trash2, Check, RefreshCw } from 'lucide-react';

export const VariantMatrixSection = ({
  hasVariants,
  onToggleVariants,
  variants = [],
  onChangeVariants,
  baseSku = 'TV-RC-PRODUCT',
  basePrice = 2999,
  baseStock = 50
}) => {
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantSkuSuffix, setNewVariantSkuSuffix] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState(basePrice || 2999);
  const [newVariantStock, setNewVariantStock] = useState(25);

  const handleAddVariant = () => {
    const name = newVariantName.trim();
    if (!name) return;

    const suffix = (newVariantSkuSuffix || name.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, ''))
      .trim()
      .toUpperCase();

    const newRow = {
      id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name,
      sku: `${baseSku}-${suffix}`,
      price: Number(newVariantPrice) || basePrice || 0,
      stock: Number(newVariantStock) || 0,
      isActive: true
    };

    onChangeVariants([...variants, newRow]);
    setNewVariantName('');
    setNewVariantSkuSuffix('');
  };

  const handleUpdateVariantField = (id, field, value) => {
    const updated = variants.map((v) => {
      if (v.id === id) {
        return { ...v, [field]: value };
      }
      return v;
    });
    onChangeVariants(updated);
  };

  const handleRemoveVariant = (id) => {
    onChangeVariants(variants.filter((v) => v.id !== id));
  };

  const handlePopulatePreset = (presetType) => {
    if (presetType === 'colors') {
      const presets = [
        { name: 'Nitro Orange', suffix: 'ORG' },
        { name: 'Stealth Black', suffix: 'BLK' },
        { name: 'Cyber Blue', suffix: 'BLU' }
      ];
      const generated = presets.map((p, idx) => ({
        id: `var_color_${Date.now()}_${idx}`,
        name: p.name,
        sku: `${baseSku}-${p.suffix}`,
        price: basePrice,
        stock: Math.floor(baseStock / 3) || 15,
        isActive: true
      }));
      onChangeVariants(generated);
    } else if (presetType === 'batteries') {
      const presets = [
        { name: 'Standard 1500mAh (25 Min Play)', suffix: 'STD', priceDelta: 0 },
        { name: 'Extended 3000mAh Dual-Pack (50 Min Play)', suffix: 'EXT', priceDelta: 600 }
      ];
      const generated = presets.map((p, idx) => ({
        id: `var_bat_${Date.now()}_${idx}`,
        name: p.name,
        sku: `${baseSku}-${p.suffix}`,
        price: (Number(basePrice) || 2999) + p.priceDelta,
        stock: Math.floor(baseStock / 2) || 20,
        isActive: true
      }));
      onChangeVariants(generated);
    }
  };

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#171717] text-white flex items-center justify-center font-mono font-bold text-xs">
            03
          </div>
          <h2 className="font-mono font-bold text-sm tracking-wider uppercase text-[#171717]">
            Variant Matrix // Colorways, Scales & Frequencies
          </h2>
        </div>

        {/* Enable Variants Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase text-gray-600">
            {hasVariants ? 'MULTI-VARIANT ACTIVE' : 'SINGLE SKU'}
          </span>
          <button
            type="button"
            onClick={() => onToggleVariants(!hasVariants)}
            className={`w-11 h-6 flex items-center p-0.5 border-2 border-[#171717] transition-colors ${
              hasVariants ? 'bg-[#315FE8]' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white border border-[#171717] shadow-sm transform transition-transform ${
                hasVariants ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {!hasVariants ? (
        <div className="p-4 bg-[#FAF8F5] border-2 border-dashed border-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white border border-[#171717] flex items-center justify-center text-gray-500">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase text-[#171717]">
                Single SKU Mode Active
              </p>
              <p className="text-[11px] font-mono text-gray-500">
                This item has no size, color, or battery variations. Inventory and pricing are managed as a single unit.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleVariants(true)}
            className="px-3 py-1.5 bg-white hover:bg-[#DCE5FF] text-[#315FE8] text-xs font-mono font-bold uppercase border-2 border-[#315FE8] shadow-[2px_2px_0px_#315FE8] transition-all"
          >
            + Enable Variants
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#FAF8F5] border border-[#171717]">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-700">
              Quick Generators:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePopulatePreset('colors')}
                className="px-2 py-1 bg-white hover:bg-gray-100 text-[10px] font-mono font-bold uppercase border border-[#171717]"
              >
                + 3 Colorways (Orange/Black/Blue)
              </button>
              <button
                type="button"
                onClick={() => handlePopulatePreset('batteries')}
                className="px-2 py-1 bg-white hover:bg-gray-100 text-[10px] font-mono font-bold uppercase border border-[#171717]"
              >
                + Battery Options (Std/Extended)
              </button>
            </div>
          </div>

          {/* Variants Table */}
          <div className="overflow-x-auto border-2 border-[#171717]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#171717] text-white text-[10px] font-mono uppercase tracking-wider">
                  <th className="p-2 border-r border-gray-700">Variant Name / Spec</th>
                  <th className="p-2 border-r border-gray-700">SKU Code</th>
                  <th className="p-2 border-r border-gray-700 w-28">Price (₹)</th>
                  <th className="p-2 border-r border-gray-700 w-24">Stock</th>
                  <th className="p-2 border-r border-gray-700 w-20 text-center">Active</th>
                  <th className="p-2 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171717] bg-[#FAF8F5] text-xs font-mono">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-white">
                    {/* Name */}
                    <td className="p-2 border-r border-[#171717]">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariantField(v.id, 'name', e.target.value)}
                        className="w-full bg-transparent font-bold text-[#171717] focus:outline-none focus:bg-white px-1 border border-transparent focus:border-[#315FE8]"
                      />
                    </td>

                    {/* SKU */}
                    <td className="p-2 border-r border-[#171717]">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) =>
                          handleUpdateVariantField(v.id, 'sku', e.target.value.toUpperCase())
                        }
                        className="w-full bg-transparent font-mono text-gray-700 focus:outline-none focus:bg-white px-1 border border-transparent focus:border-[#315FE8]"
                      />
                    </td>

                    {/* Price */}
                    <td className="p-2 border-r border-[#171717]">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">₹</span>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) =>
                            handleUpdateVariantField(v.id, 'price', Number(e.target.value))
                          }
                          className="w-full bg-transparent font-bold text-[#171717] focus:outline-none focus:bg-white px-1 border border-transparent focus:border-[#315FE8]"
                        />
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="p-2 border-r border-[#171717]">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) =>
                          handleUpdateVariantField(v.id, 'stock', Number(e.target.value))
                        }
                        className="w-full bg-transparent font-bold text-[#171717] focus:outline-none focus:bg-white px-1 border border-transparent focus:border-[#315FE8]"
                      />
                    </td>

                    {/* Status */}
                    <td className="p-2 border-r border-[#171717] text-center">
                      <button
                        type="button"
                        onClick={() => handleUpdateVariantField(v.id, 'isActive', !v.isActive)}
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${
                          v.isActive
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                            : 'bg-gray-200 text-gray-600 border-gray-400'
                        }`}
                      >
                        {v.isActive ? 'ACTIVE' : 'OFF'}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="p-1 text-gray-500 hover:text-[#FF5638] hover:bg-red-50 border border-transparent hover:border-red-200"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}

                {variants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 text-xs font-mono">
                      No variants generated yet. Add custom variant rows or use the presets above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add New Variant Row Form */}
          <div className="p-3 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
            <span className="block text-[10px] font-mono font-bold uppercase text-gray-600 mb-2">
              + Add Custom Variant Entry
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Variant Name (e.g. Desert Sand)"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                className="bg-[#FAF8F5] border border-[#171717] px-2 py-1.5 text-xs font-mono text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#315FE8]"
              />
              <input
                type="text"
                placeholder="SKU Suffix (e.g. SND)"
                value={newVariantSkuSuffix}
                onChange={(e) => setNewVariantSkuSuffix(e.target.value.toUpperCase())}
                className="bg-[#FAF8F5] border border-[#171717] px-2 py-1.5 text-xs font-mono uppercase text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#315FE8]"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Price ₹"
                  value={newVariantPrice}
                  onChange={(e) => setNewVariantPrice(e.target.value)}
                  className="w-1/2 bg-[#FAF8F5] border border-[#171717] px-2 py-1.5 text-xs font-mono text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#315FE8]"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newVariantStock}
                  onChange={(e) => setNewVariantStock(e.target.value)}
                  className="w-1/2 bg-[#FAF8F5] border border-[#171717] px-2 py-1.5 text-xs font-mono text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#315FE8]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                disabled={!newVariantName.trim()}
                className="bg-[#171717] hover:bg-[#315FE8] disabled:bg-gray-300 text-white text-xs font-mono font-bold uppercase py-1.5 px-3 border border-[#171717] flex items-center justify-center gap-1 transition-colors"
              >
                <Plus size={13} /> Add Row
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantMatrixSection;
