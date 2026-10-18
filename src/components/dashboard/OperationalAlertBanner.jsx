import React from 'react';
import { AlertTriangle, Server, Database, Mail, CreditCard, Truck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const OperationalAlertBanner = ({ healthData, isOnline, isChecking }) => {
  // Determine actual backend status message from real health check
  let statusMessage = 'Admin dashboard ready. Connect store services to load live operational data.';
  let isAlert = false;

  if (isOnline === false) {
    statusMessage = 'STOREFRONT API DISCONNECTED: Unable to establish live socket/REST link to backend server.';
    isAlert = true;
  } else if (isOnline === true && healthData?.services) {
    const s = healthData.services;
    const dbOk = s.database === 'connected';
    const paymentsOk = s.payments === 'configured';
    const shippingOk = s.shipping === 'configured';

    if (dbOk && (!paymentsOk || !shippingOk)) {
      statusMessage = `PRIMARY DATABASE CONNECTED (${healthData.environment?.toUpperCase() || 'DEVELOPMENT'}). Notice: Razorpay (${s.payments}) and Shiprocket (${s.shipping}) are currently pending production keys.`;
    } else if (dbOk) {
      statusMessage = `ALL SYSTEMS OPERATIONAL: Database connected, email dispatch configured, running in ${healthData.environment || 'development'} mode.`;
    }
  }

  return (
    <div className="w-full bg-[#FFD983] border-2 border-ink shadow-[3px_3px_0px_#171717] p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 bg-ink text-[#FFD983] border border-ink flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#171717]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-ink">
                STORE OPERATIONS // SYSTEM STATUS
              </span>
              <StatusBadge
                variant={isOnline === true ? 'success' : isOnline === false ? 'danger' : 'neutral'}
                dot
                size="sm"
              >
                {isOnline === true ? 'BACKEND LIVE' : isOnline === false ? 'OFFLINE' : 'CONNECTING...'}
              </StatusBadge>
            </div>
            <p className="font-mono text-xs text-ink/90 mt-0.5 leading-snug">
              {statusMessage}
            </p>
          </div>
        </div>

        {/* Real Secondary status badges from verified backend health */}
        {healthData?.services && (
          <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-ink/20 lg:border-t-0">
            <StatusBadge
              variant={healthData.services.database === 'connected' ? 'success' : 'danger'}
              size="sm"
            >
              <Database className="w-2.5 h-2.5" />
              DB: {healthData.services.database?.toUpperCase()}
            </StatusBadge>

            <StatusBadge
              variant={healthData.services.email === 'configured' ? 'info' : 'neutral'}
              size="sm"
            >
              <Mail className="w-2.5 h-2.5" />
              EMAIL: {healthData.services.email?.toUpperCase()}
            </StatusBadge>

            <StatusBadge
              variant={healthData.services.payments === 'configured' ? 'success' : 'warning'}
              size="sm"
            >
              <CreditCard className="w-2.5 h-2.5" />
              PG: {healthData.services.payments?.toUpperCase()}
            </StatusBadge>

            <StatusBadge
              variant={healthData.services.shipping === 'configured' ? 'success' : 'warning'}
              size="sm"
            >
              <Truck className="w-2.5 h-2.5" />
              LOGISTICS: {healthData.services.shipping?.toUpperCase()}
            </StatusBadge>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationalAlertBanner;
