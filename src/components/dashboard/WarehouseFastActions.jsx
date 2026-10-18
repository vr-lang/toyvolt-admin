import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Truck, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const WarehouseFastActions = ({ lowStockCount = 0 }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'invoices',
      title: 'GENERATE BATCH INVOICES',
      description: 'Compile tax invoices for all pending and confirmed dispatch batches.',
      icon: FileText,
      enabled: false,
      reason: 'Requires payment gateway invoice integration',
      statusText: 'UNAVAILABLE'
    },
    {
      id: 'shiprocket',
      title: 'DOWNLOAD SHIPROCKET MANIFEST',
      description: 'Fetch courier pickup manifest and consolidated AWB stickers.',
      icon: Truck,
      enabled: false,
      reason: 'Shiprocket API unconfigured on backend server',
      statusText: 'PENDING CREDENTIALS'
    },
    {
      id: 'lowstock',
      title: 'REVIEW LOW-STOCK PRODUCTS',
      description: `Inspect ${lowStockCount} items currently running below minimum safety threshold.`,
      icon: AlertTriangle,
      enabled: true,
      onClick: () => navigate('/inventory'),
      statusText: lowStockCount > 0 ? `${lowStockCount} ITEMS` : 'ALL STOCKED',
      variant: lowStockCount > 0 ? 'danger' : 'success'
    }
  ];

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-ink">
        <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
          WAREHOUSE FAST ACTIONS
        </h2>
        <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
          OPERATOR DISPATCH SHORTCUTS
        </span>
      </div>

      <div className="space-y-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className={`border-2 border-ink p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                act.enabled
                  ? 'bg-[#FFF9F0] hover:bg-white shadow-[2px_2px_0px_#171717] cursor-pointer'
                  : 'bg-[#F0EEEE] opacity-75 cursor-not-allowed'
              }`}
              onClick={act.enabled ? act.onClick : undefined}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-8 h-8 border border-ink flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#171717] ${
                    act.enabled ? 'bg-[#FFD983] text-ink' : 'bg-[#E0DFDC] text-[#6E6E6E]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs uppercase text-ink">
                      {act.title}
                    </span>
                    {!act.enabled && (
                      <span className="font-mono text-[9px] bg-ink text-white px-1 py-0.2 inline-flex items-center gap-1 font-bold">
                        <Lock className="w-2.5 h-2.5" /> DISABLED
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-[#6E6E6E] mt-0.5 leading-tight">
                    {act.enabled ? act.description : `${act.description} (${act.reason})`}
                  </p>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                {act.enabled ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      act.onClick();
                    }}
                    className="brutal-btn brutal-btn-primary text-xs px-3 py-1 flex items-center gap-1.5"
                  >
                    RUN ACTION <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <StatusBadge variant="neutral" size="sm">
                    {act.statusText}
                  </StatusBadge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WarehouseFastActions;
