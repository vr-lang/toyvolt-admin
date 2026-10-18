import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Globe, ShoppingBag, Info } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

export const WeeklyRevenueVelocityChart = ({
  weeklyData = [],
  timeframe = '30d',
  isLoading = false
}) => {
  const [metricView, setMetricView] = useState('gmv'); // 'gmv' or 'paid'

  const hasData = Array.isArray(weeklyData) && weeklyData.length > 0;

  // Custom Neo-Brutalist Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-panel border-2 border-ink p-2.5 shadow-[3px_3px_0px_#171717] font-mono text-xs">
          <div className="font-bold text-ink mb-1 pb-1 border-b border-ink/20 flex items-center justify-between gap-4">
            <span>PERIOD: {label}</span>
            <span className="text-[#315FE8] uppercase text-[10px] px-1 py-0.2 border border-[#315FE8]">
              {data.channel || 'Website Direct'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-ink font-semibold flex justify-between gap-3">
              <span>Gross GMV:</span>
              <span className="font-bold text-[#315FE8]">
                {formatCurrencyINR(data.revenueRupees || 0)}
              </span>
            </div>
            <div className="text-ink font-semibold flex justify-between gap-3">
              <span>Realized (Paid):</span>
              <span className="font-bold text-emerald-700">
                {formatCurrencyINR(data.paidRupees || 0)}
              </span>
            </div>
            <div className="text-[#6E6E6E] text-[11px] flex justify-between gap-3 pt-0.5 border-t border-ink/10">
              <span>Orders Placed:</span>
              <span className="font-bold text-ink">{data.orders || 0}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b-2 border-ink gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <TrendingUp className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
                WEEKLY REVENUE &amp; CHANNEL VELOCITY
              </h2>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                {timeframe.toUpperCase()} aggregation window • Verified order transactions
              </span>
            </div>
          </div>

          {/* Toggle metric */}
          <div className="flex items-center gap-1 self-start sm:self-auto border border-ink bg-white p-0.5">
            <button
              type="button"
              onClick={() => setMetricView('gmv')}
              className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 transition-all ${
                metricView === 'gmv'
                  ? 'bg-[#315FE8] text-white'
                  : 'text-ink hover:bg-[#F0EEEE]'
              }`}
            >
              GMV (Placed)
            </button>
            <button
              type="button"
              onClick={() => setMetricView('paid')}
              className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 transition-all ${
                metricView === 'paid'
                  ? 'bg-emerald-700 text-white'
                  : 'text-ink hover:bg-[#F0EEEE]'
              }`}
            >
              Realized (Paid)
            </button>
          </div>
        </div>

        {/* Channel Verification Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#FFF9F0] border border-ink font-mono text-[11px] mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#315FE8] border border-ink" />
            <span className="font-bold text-ink">Website Direct (toyvolt.com)</span>
            <span className="text-[10px] text-[#6E6E6E]">• 100% Volume</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#6E6E6E]">
            <Globe className="w-3 h-3 text-[#315FE8]" />
            <span>Marketplace Integrations: Standby (Direct Only)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas or Designed Empty State */}
      <div className="w-full h-64 sm:h-72 my-2">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-[#6E6E6E] bg-[#F7F3EB] border border-ink border-dashed">
            <div className="w-6 h-6 border-2 border-ink border-t-[#315FE8] animate-spin mb-2" />
            LOADING SALES CADENCE...
          </div>
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#171717"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                tickLine={{ stroke: '#171717' }}
              />
              <YAxis
                stroke="#171717"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                tickLine={{ stroke: '#171717' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={metricView === 'gmv' ? 'revenueRupees' : 'paidRupees'}
                fill={metricView === 'gmv' ? '#315FE8' : '#047857'}
                stroke="#171717"
                strokeWidth={1.5}
                radius={[0, 0, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#F7F3EB] border border-ink border-dashed text-center">
            <div className="w-8 h-8 bg-white border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717] mb-2">
              <ShoppingBag className="w-4 h-4 text-[#6E6E6E]" />
            </div>
            <span className="font-display font-bold text-xs uppercase text-ink">
              NO SETTLED TRANSACTIONS IN WINDOW
            </span>
            <p className="font-mono text-[11px] text-[#6E6E6E] mt-1 max-w-sm">
              No orders settled in the selected {timeframe} window. Expand timeframe to view all-time baseline activity.
            </p>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="pt-2 border-t border-ink/15 flex flex-wrap items-center justify-between font-mono text-[10px] text-[#6E6E6E]">
        <span>Currency: Indian Rupee (INR ₹)</span>
        <span>Data verified against backend order ledger</span>
      </div>
    </div>
  );
};

export default WeeklyRevenueVelocityChart;
