import React from 'react';
import { Users, IndianRupee, Sparkles, Cake, TrendingUp, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function CustomersKpiCards({
  totalCustomers = 0,
  activeCustomers = 0,
  totalSpendRupees = 0,
  totalPoints = 0,
  loading = false
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      
      {/* Card 1: Total Active Parents */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>TOTAL ACTIVE PARENTS</span>
          <div className="p-1.5 bg-[#315FE8]/10 border border-neutral-900 text-[#315FE8]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {loading ? '...' : totalCustomers}
          </div>
          <div className="text-[11px] text-neutral-600 font-sans mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <strong className="font-mono text-neutral-900">{activeCustomers}</strong> active / {totalCustomers - activeCustomers} suspended
          </div>
        </div>
      </div>

      {/* Card 2: Lifetime GMV */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>LIFETIME PARENT GMV</span>
          <div className="p-1.5 bg-[#FFD983] border border-neutral-900 text-neutral-900">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {loading ? '...' : (totalSpendRupees > 0 ? formatINR(totalSpendRupees) : '₹0')}
          </div>
          <div className="text-[11px] text-neutral-600 font-sans mt-1">
            Realized e-commerce orders & cart spend
          </div>
        </div>
      </div>

      {/* Card 3: Play Club Loyalty Points */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>PLAY CLUB POINTS ISSUED</span>
          <div className="p-1.5 bg-[#FF5638]/10 border border-neutral-900 text-[#FF5638]">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {loading ? '...' : totalPoints.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-neutral-600 font-sans mt-1">
            1 pt per ₹10 spend &bull; 100% enrolled
          </div>
        </div>
      </div>

      {/* Card 4: Kids' Birthdays Next 30 Days */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>KIDS' BIRTHDAYS (30 DAYS)</span>
          <div className="p-1.5 bg-neutral-100 border border-neutral-900 text-neutral-600">
            <Cake className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-500">
            0
          </div>
          <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-300 px-1.5 py-0.5 mt-1 font-sans flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>Birthday collection unconfigured in schema</span>
          </div>
        </div>
      </div>

    </div>
  );
}
