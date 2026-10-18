import React from 'react';
import { Package, Warehouse, AlertCircle, Barcode, CheckCircle2, Shield } from 'lucide-react';

export const InventoryHubsSection = ({
  inventory = {},
  errors = {},
  onChange
}) => {
  const stock = Number(inventory.availableStock) || 0;
  const threshold = Number(inventory.lowStockThreshold) || 10;

  const generateBarcode = () => {
    // Generate dummy EAN-13 starting with 890 (India country code)
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const ean13 = `890${randomDigits.slice(0, 10)}`;
    onChange('barcode', ean13);
  };

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#171717] text-white flex items-center justify-center font-mono font-bold text-[10px]">
            <Warehouse size={12} />
          </div>
          <h2 className="font-mono font-bold text-xs tracking-wider uppercase text-[#171717]">
            Inventory & Warehousing
          </h2>
        </div>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400">
          CENTRAL NCR
        </span>
      </div>

      <div className="space-y-3">
        {/* Hub Badge */}
        <div className="p-2.5 bg-[#FAF8F5] border border-[#171717] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[11px] font-mono font-bold uppercase text-[#171717]">
                Noida NCR Central Fulfillment Hub
              </p>
              <p className="text-[9px] font-mono text-gray-500">
                Primary dispatch facility • Same-day dispatch ready
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white border border-[#171717]">
            DEFAULT
          </span>
        </div>

        {/* Stock Quantity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1">
              <span>Available Stock (Units)</span>
              <span className="text-[#FF5638]">*</span>
            </label>
            <span
              className={`text-[10px] font-mono font-bold ${
                stock <= 0
                  ? 'text-[#FF5638]'
                  : stock <= threshold
                  ? 'text-amber-600'
                  : 'text-emerald-700'
              }`}
            >
              {stock <= 0 ? 'OUT OF STOCK' : stock <= threshold ? 'LOW STOCK' : 'IN STOCK'}
            </span>
          </div>
          <input
            type="number"
            min="0"
            step="1"
            value={inventory.availableStock ?? ''}
            onChange={(e) => onChange('availableStock', e.target.value)}
            placeholder="50"
            className={`w-full bg-[#FAF8F5] border-2 ${
              errors.availableStock ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
            } px-3 py-1.5 text-sm font-mono font-bold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
          />
          {errors.availableStock && (
            <p className="mt-1 text-xs font-mono text-[#FF5638] flex items-center gap-1">
              <AlertCircle size={11} /> {errors.availableStock}
            </p>
          )}
        </div>

        {/* Low Stock Threshold */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono font-bold uppercase text-gray-700">
              Low Stock Alert Threshold
            </label>
            <span className="text-[10px] font-mono text-gray-500">UNITS</span>
          </div>
          <input
            type="number"
            min="1"
            step="1"
            value={inventory.lowStockThreshold ?? 10}
            onChange={(e) => onChange('lowStockThreshold', e.target.value)}
            placeholder="10"
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-1 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
          <p className="mt-0.5 text-[9px] font-mono text-gray-500">
            Triggers dashboard inventory warning alert when remaining stock falls below this level.
          </p>
        </div>

        {/* Barcode / EAN-13 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono font-bold uppercase text-gray-700 flex items-center gap-1">
              <Barcode size={12} />
              <span>Barcode / EAN-13 (India 890 Prefix)</span>
            </label>
            <button
              type="button"
              onClick={generateBarcode}
              className="text-[9px] font-mono font-bold text-[#315FE8] hover:underline uppercase"
            >
              Generate
            </button>
          </div>
          <input
            type="text"
            value={inventory.barcode || ''}
            onChange={(e) => onChange('barcode', e.target.value)}
            placeholder="8901234567890"
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-3 py-1 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
        </div>

        {/* Allow Backorders Toggle */}
        <div className="pt-2 border-t border-gray-200">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-mono font-bold uppercase text-[#171717]">
                Allow Customer Backorders
              </p>
              <p className="text-[9px] font-mono text-gray-500">
                Continue accepting orders when stock hits 0
              </p>
            </div>
            <input
              type="checkbox"
              checked={!!inventory.allowBackorders}
              onChange={(e) => onChange('allowBackorders', e.target.checked)}
              className="w-4 h-4 accent-[#315FE8] border-2 border-[#171717] rounded-none cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default InventoryHubsSection;
