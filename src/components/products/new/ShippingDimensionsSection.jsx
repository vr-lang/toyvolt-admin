import React from 'react';
import { Truck, Scale, Box, AlertCircle, Info, Check } from 'lucide-react';

export const ShippingDimensionsSection = ({
  shipping = {},
  errors = {},
  onChange
}) => {
  const weightGrams = Number(shipping.weightGrams) || 0;
  const lengthCm = Number(shipping.dimensions?.lengthCm) || 0;
  const breadthCm = Number(shipping.dimensions?.breadthCm) || 0;
  const heightCm = Number(shipping.dimensions?.heightCm) || 0;

  // Courier Volumetric Weight Calculation (Standard Indian E-Commerce: L*B*H / 5000)
  const physicalKg = weightGrams > 0 ? weightGrams / 1000 : 0;
  const volumetricKg =
    lengthCm > 0 && breadthCm > 0 && heightCm > 0
      ? (lengthCm * breadthCm * heightCm) / 5000
      : 0;

  const chargeableKg = Math.max(physicalKg, volumetricKg);
  const isVolumetricHigher = volumetricKg > physicalKg;

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#171717] text-white flex items-center justify-center font-mono font-bold text-[10px]">
            <Truck size={12} />
          </div>
          <h2 className="font-mono font-bold text-xs tracking-wider uppercase text-[#171717]">
            Shipping & Volumetric Metrics
          </h2>
        </div>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-[#DCE5FF] text-[#315FE8] border border-[#315FE8]">
          5000 DIVISOR
        </span>
      </div>

      <div className="space-y-3">
        {/* Physical Weight */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1">
              <Scale size={12} />
              <span>Dead Weight (Grams)</span>
              <span className="text-[#FF5638]">*</span>
            </label>
            <span className="text-[10px] font-mono text-gray-500 font-bold">
              {physicalKg > 0 ? `${physicalKg.toFixed(2)} KG` : '0 KG'}
            </span>
          </div>
          <input
            type="number"
            min="1"
            step="10"
            value={shipping.weightGrams ?? ''}
            onChange={(e) => onChange('weightGrams', e.target.value)}
            placeholder="1850"
            className={`w-full bg-[#FAF8F5] border-2 ${
              errors.weightGrams ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
            } px-3 py-1.5 text-xs font-mono font-bold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
          />
          {errors.weightGrams && (
            <p className="mt-1 text-xs font-mono text-[#FF5638] flex items-center gap-1">
              <AlertCircle size={11} /> {errors.weightGrams}
            </p>
          )}
        </div>

        {/* Outer Box Dimensions */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1">
              <Box size={12} />
              <span>Package Box Dimensions (CM)</span>
              <span className="text-[#FF5638]">*</span>
            </label>
            <span className="text-[10px] font-mono text-gray-500">L × B × H</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                min="0.1"
                step="0.5"
                placeholder="L"
                value={shipping.dimensions?.lengthCm ?? ''}
                onChange={(e) =>
                  onChange('dimensions', {
                    ...shipping.dimensions,
                    lengthCm: e.target.value
                  })
                }
                className={`w-full bg-[#FAF8F5] border-2 ${
                  errors.dimensions ? 'border-[#FF5638]' : 'border-[#171717]'
                } px-2 py-1.5 text-xs font-mono text-center text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
              />
              <span className="block text-[8px] font-mono text-center text-gray-400 mt-0.5">LENGTH</span>
            </div>

            <div>
              <input
                type="number"
                min="0.1"
                step="0.5"
                placeholder="B"
                value={shipping.dimensions?.breadthCm ?? ''}
                onChange={(e) =>
                  onChange('dimensions', {
                    ...shipping.dimensions,
                    breadthCm: e.target.value
                  })
                }
                className={`w-full bg-[#FAF8F5] border-2 ${
                  errors.dimensions ? 'border-[#FF5638]' : 'border-[#171717]'
                } px-2 py-1.5 text-xs font-mono text-center text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
              />
              <span className="block text-[8px] font-mono text-center text-gray-400 mt-0.5">BREADTH</span>
            </div>

            <div>
              <input
                type="number"
                min="0.1"
                step="0.5"
                placeholder="H"
                value={shipping.dimensions?.heightCm ?? ''}
                onChange={(e) =>
                  onChange('dimensions', {
                    ...shipping.dimensions,
                    heightCm: e.target.value
                  })
                }
                className={`w-full bg-[#FAF8F5] border-2 ${
                  errors.dimensions ? 'border-[#FF5638]' : 'border-[#171717]'
                } px-2 py-1.5 text-xs font-mono text-center text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
              />
              <span className="block text-[8px] font-mono text-center text-gray-400 mt-0.5">HEIGHT</span>
            </div>
          </div>

          {errors.dimensions && (
            <p className="mt-1 text-xs font-mono text-[#FF5638] flex items-center gap-1">
              <AlertCircle size={11} /> {errors.dimensions}
            </p>
          )}
        </div>

        {/* Volumetric vs Chargeable Metrics Box */}
        <div className="p-2.5 bg-[#FAF8F5] border-2 border-[#171717] space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-gray-600">Volumetric Weight (5000):</span>
            <span className="font-bold text-[#171717]">{volumetricKg.toFixed(2)} KG</span>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-gray-600">Actual Package Weight:</span>
            <span className="font-bold text-[#171717]">{physicalKg.toFixed(2)} KG</span>
          </div>

          <div className="pt-1.5 border-t border-gray-300 flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase text-[#171717]">
              Billable Courier Weight:
            </span>
            <span className="text-xs font-mono font-bold text-[#315FE8] bg-[#DCE5FF] px-1.5 py-0.5 border border-[#315FE8]">
              {chargeableKg > 0 ? `${chargeableKg.toFixed(2)} KG` : '—'}
            </span>
          </div>

          {chargeableKg > 0 && (
            <p className="text-[9px] font-mono text-gray-500 pt-0.5">
              {isVolumetricHigher
                ? '⚠ Volumetric weight is higher and will be billed by Shiprocket / Bluedart.'
                : '✓ Physical dead weight applies for courier billing.'}
            </p>
          )}
        </div>

        {/* Courier Compatibility Badge */}
        <div className="pt-1">
          <span className="block text-[9px] font-mono font-bold uppercase text-gray-500 mb-1">
            Integrated Carrier Routing:
          </span>
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] font-mono bg-white border border-[#171717] px-1.5 py-0.5 text-[#171717] font-bold">
              SHIPROCKET AIR
            </span>
            <span className="text-[9px] font-mono bg-white border border-[#171717] px-1.5 py-0.5 text-[#171717] font-bold">
              DELHIVERY SURFACE
            </span>
            <span className="text-[9px] font-mono bg-white border border-[#171717] px-1.5 py-0.5 text-[#171717] font-bold">
              BLUEDART HEAVY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDimensionsSection;
