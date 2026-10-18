import React from 'react';

export const OrdersStatusTabs = ({
  activeStatus = 'all',
  onSelectStatus,
  statusCounts = {}
}) => {
  const tabs = [
    { id: 'all', label: 'All Orders', count: statusCounts.all ?? 0 },
    { id: 'placed', label: 'Pending', count: statusCounts.placed ?? 0 },
    { id: 'processing', label: 'Confirmed / Processing', count: (statusCounts.confirmed ?? 0) + (statusCounts.processing ?? 0) },
    { id: 'shipped', label: 'Dispatched', count: statusCounts.shipped ?? 0 },
    { id: 'delivered', label: 'Delivered', count: statusCounts.delivered ?? 0 },
    { id: 'cancelled', label: 'Cancelled / RTO', count: statusCounts.cancelled ?? 0 }
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectStatus(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs uppercase font-bold tracking-wider shrink-0 border-2 transition-all duration-100 ${
              isActive
                ? 'bg-[#315FE8] text-white border-[#171717] shadow-[3px_3px_0px_#171717]'
                : 'bg-white hover:bg-[#FFF9F0] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] font-mono font-bold border ${
                isActive
                  ? 'bg-white text-[#315FE8] border-white'
                  : 'bg-[#FAF8F5] text-[#171717] border-[#171717]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OrdersStatusTabs;
