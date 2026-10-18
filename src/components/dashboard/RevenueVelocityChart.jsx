import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

export const RevenueVelocityChart = ({ dailySales = [], isLoading = false }) => {
  const [filterPeriod, setFilterPeriod] = useState('7d');

  const hasData = Array.isArray(dailySales) && dailySales.length > 0;

  // Custom Neo-Brutalist Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-panel border-2 border-ink p-2.5 shadow-[3px_3px_0px_#171717] font-mono text-xs">
          <div className="font-bold text-ink mb-1 pb-1 border-b border-ink/20">
            DATE: {label}
          </div>
          <div className="text-[#315FE8] font-bold">
            Revenue: {formatCurrencyINR(data.revenueInRupees || 0)}
          </div>
          <div className="text-ink text-[11px]">
            Orders: {data.orders || 0}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b-2 border-ink gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
            <TrendingUp className="w-3.5 h-3.5 text-[#315FE8]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
              REVENUE VELOCITY &amp; HOURLY SALES
            </h2>
            <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
              Actual sales cadence recorded via confirmed Razorpay &amp; COD orders
            </span>
          </div>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1 self-start sm:self-auto">
          {['today', '7d', '30d'].map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setFilterPeriod(period)}
              className={`font-mono text-[10px] uppercase font-bold px-2 py-1 border border-ink transition-all ${
                filterPeriod === period
                  ? 'bg-[#315FE8] text-white shadow-[1.5px_1.5px_0px_#171717]'
                  : 'bg-[#F0EEEE] text-ink hover:bg-[#E2E0DF]'
              }`}
            >
              {period === 'today' ? 'TODAY' : period === '7d' ? '7 DAYS' : '30 DAYS'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-[#FFF9F0] border border-dashed border-ink p-6">
          <div className="w-8 h-8 border-3 border-ink border-t-[#315FE8] animate-spin mb-3" />
          <span className="font-mono text-xs uppercase text-[#6E6E6E]">
            AGGREGATING SALES METRICS...
          </span>
        </div>
      ) : hasData ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySales} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#E0DFDC" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#171717"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#171717' }}
                tickLine={{ stroke: '#171717' }}
              />
              <YAxis
                stroke="#171717"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#171717' }}
                tickLine={{ stroke: '#171717' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenueInRupees" fill="#315FE8" stroke="#171717" strokeWidth={1.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          icon={BarChart3}
          title="NO SALES AGGREGATIONS RECORDED"
          description="Sales velocity visualization requires completed order transactions. Once customers place and pay for orders, hourly and daily revenue metrics will plot here dynamically."
          compact
        />
      )}
    </div>
  );
};

export default RevenueVelocityChart;
