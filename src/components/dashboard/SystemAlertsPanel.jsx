import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, Settings } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const SystemAlertsPanel = ({
  lowStockProducts = [],
  pendingOrdersCount = 0,
  healthData = null
}) => {
  const alerts = [];

  // 1. Low stock alert
  if (lowStockProducts.length > 0) {
    alerts.push({
      id: 'low-stock',
      severity: 'high',
      icon: AlertTriangle,
      badge: 'INVENTORY CRITICAL',
      variant: 'danger',
      title: `${lowStockProducts.length} product(s) below safety stock threshold`,
      description: `Items: ${lowStockProducts.map((p) => `${p.name} (${p.availableStock} left)`).join(', ')}. Restock required.`
    });
  }

  // 2. Pending orders alert
  if (pendingOrdersCount > 0) {
    alerts.push({
      id: 'pending-orders',
      severity: 'medium',
      icon: Clock,
      badge: 'FULFILLMENT QUEUE',
      variant: 'warning',
      title: `${pendingOrdersCount} customer order(s) awaiting processing or payment confirmation`,
      description: 'Review orders feed to initiate invoice generation or courier dispatch.'
    });
  }

  // 3. Unconfigured integrations alert
  if (healthData?.services) {
    const s = healthData.services;
    const unconfigured = [];
    if (s.payments === 'unconfigured') unconfigured.push('Razorpay Payment Gateway');
    if (s.shipping === 'unconfigured') unconfigured.push('Shiprocket Logistics API');

    if (unconfigured.length > 0) {
      alerts.push({
        id: 'integrations-pending',
        severity: 'low',
        icon: Settings,
        badge: 'INTEGRATIONS NOTICE',
        variant: 'info',
        title: `${unconfigured.join(' and ')} are unconfigured on backend server`,
        description: 'Provide API credentials in backend environment variables to enable automatic order tracking and online card/UPI checkouts.'
      });
    }
  }

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF5638] text-white border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
                URGENT SYSTEM ALERTS
              </h2>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                AUTOMATED STORE EXCEPTION RADAR
              </span>
            </div>
          </div>

          <StatusBadge variant={alerts.length > 0 ? 'warning' : 'success'} size="sm">
            {alerts.length > 0 ? `${alerts.length} ALERTS` : 'ALL CLEAR'}
          </StatusBadge>
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-2.5">
            {alerts.map((al) => {
              const Icon = al.icon;
              return (
                <div
                  key={al.id}
                  className="border-2 border-ink p-3 bg-[#FFF9F0] shadow-[2px_2px_0px_#171717]"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-6 h-6 border border-ink shrink-0 flex items-center justify-center mt-0.5 ${
                        al.variant === 'danger'
                          ? 'bg-[#FF5638] text-white'
                          : al.variant === 'warning'
                          ? 'bg-[#FFD983] text-ink'
                          : 'bg-[#DCE5FF] text-ink'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <StatusBadge variant={al.variant} size="sm">
                          {al.badge}
                        </StatusBadge>
                      </div>
                      <h4 className="font-display font-bold text-xs uppercase text-ink leading-snug">
                        {al.title}
                      </h4>
                      <p className="font-mono text-[11px] text-[#6E6E6E] mt-0.5 leading-relaxed">
                        {al.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-[#E6F4EA] border-2 border-ink shadow-[2px_2px_0px_#171717] text-center">
            <CheckCircle2 className="w-8 h-8 text-[#15803D] mx-auto mb-2" />
            <h4 className="font-display font-bold text-xs uppercase text-[#15803D]">
              NO CRITICAL ANOMALIES DETECTED
            </h4>
            <p className="font-mono text-[11px] text-[#15803D]/80 mt-1">
              Store operations healthy. Stock levels, payment flows, and order queue within standard operational tolerances.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/20 flex items-center justify-between font-mono text-[10px] text-[#6E6E6E]">
        <span>Exception engine active</span>
        <span>Polling rate: 45s</span>
      </div>
    </div>
  );
};

export default SystemAlertsPanel;
