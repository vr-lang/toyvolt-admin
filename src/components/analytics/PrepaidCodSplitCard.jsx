import React from 'react';
import { CreditCard, Banknote, ShieldAlert, Check } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

export const PrepaidCodSplitCard = ({ paymentSplit = {}, isLoading = false }) => {
  const {
    totalOrders = 0,
    prepaidOrdersCount = 0,
    codOrdersCount = 0,
    prepaidAmountRupees = 0,
    codAmountRupees = 0,
    prepaidPercent = 0.0,
    codPercent = 0.0,
    codRealizationRate = null
  } = paymentSplit;

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <CreditCard className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-tight text-ink">
                PREPAID VS. COD SPLIT
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Payment risk and cash flow mix
              </span>
            </div>
          </div>
          <StatusBadge variant={codPercent > 70 ? 'warning' : 'info'} size="sm">
            {totalOrders} ORDER{totalOrders === 1 ? '' : 'S'}
          </StatusBadge>
        </div>

        {/* Dual Split Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="w-full bg-[#F0EEEE] h-6 border-2 border-ink flex overflow-hidden shadow-[2px_2px_0px_#171717]">
            {totalOrders > 0 ? (
              <>
                <div
                  className="bg-[#315FE8] text-white flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300"
                  style={{ width: `${Math.max(prepaidPercent > 0 ? 10 : 0, prepaidPercent)}%` }}
                  title={`Prepaid: ${prepaidPercent}%`}
                >
                  {prepaidPercent > 15 ? `${prepaidPercent}%` : ''}
                </div>
                <div
                  className="bg-[#FF9900] text-ink flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300"
                  style={{ width: `${Math.max(codPercent > 0 ? 10 : 0, codPercent)}%` }}
                  title={`COD: ${codPercent}%`}
                >
                  {codPercent > 15 ? `${codPercent}%` : ''}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-[#F0EEEE] flex items-center justify-center font-mono text-[10px] text-[#6E6E6E]">
                NO ORDERS RECORDED
              </div>
            )}
          </div>

          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1.5 font-bold text-[#315FE8]">
              <span className="inline-block w-2 h-2 bg-[#315FE8] border border-ink" />
              Prepaid (Razorpay): {prepaidPercent}%
            </span>
            <span className="flex items-center gap-1.5 font-bold text-amber-700">
              <span className="inline-block w-2 h-2 bg-[#FF9900] border border-ink" />
              COD: {codPercent}%
            </span>
          </div>
        </div>

        {/* Breakdown Details */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs mb-3">
          <div className="p-2.5 bg-white border border-ink">
            <span className="text-[10px] text-[#6E6E6E] uppercase block mb-0.5">
              PREPAID VOLUME
            </span>
            <span className="font-display font-bold text-base text-ink block leading-none">
              {formatCurrencyINR(prepaidAmountRupees)}
            </span>
            <span className="text-[10px] text-[#6E6E6E] mt-1 block">
              {prepaidOrdersCount} order{prepaidOrdersCount === 1 ? '' : 's'} (Instant Settle)
            </span>
          </div>

          <div className="p-2.5 bg-white border border-ink">
            <span className="text-[10px] text-[#6E6E6E] uppercase block mb-0.5">
              COD EXPOSURE
            </span>
            <span className="font-display font-bold text-base text-ink block leading-none">
              {formatCurrencyINR(codAmountRupees)}
            </span>
            <span className="text-[10px] text-[#6E6E6E] mt-1 block">
              {codOrdersCount} order{codOrdersCount === 1 ? '' : 's'} (At Doorstep)
            </span>
          </div>
        </div>
      </div>

      {/* Footer: COD Realization Rate */}
      <div className="pt-2.5 border-t border-ink/15 flex items-center justify-between font-mono text-[10px] text-[#6E6E6E]">
        <span>COD Realization:</span>
        <span className="font-bold text-ink">
          {codRealizationRate !== null ? (
            `${codRealizationRate}% Cash Remitted`
          ) : (
            <span className="text-amber-700">Pending Delivery Confirmation</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default PrepaidCodSplitCard;
