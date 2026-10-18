import React from 'react';
import { MapPin } from 'lucide-react';

export const ShipmentHubTabs = ({
  hubs = [],
  activeHub = 'all',
  totalCount = 0,
  onSelectHub
}) => {
  const isAll = !activeHub || activeHub.toLowerCase() === 'all';

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4 font-mono text-xs">
      {/* All Hubs Tab */}
      <button
        type="button"
        onClick={() => onSelectHub('all')}
        className={`flex items-center gap-2 px-3.5 py-2 uppercase font-bold tracking-wider shrink-0 border-2 transition-all duration-100 ${
          isAll
            ? 'bg-[#315FE8] text-white border-[#171717] shadow-[3px_3px_0px_#171717]'
            : 'bg-white hover:bg-[#FFF9F0] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717]'
        }`}
      >
        <MapPin size={12} className={isAll ? 'text-white' : 'text-[#315FE8]'} />
        <span>All Hubs / All Shipments</span>
        <span
          className={`px-1.5 py-0.2 text-[10px] font-bold border ${
            isAll
              ? 'bg-white text-[#315FE8] border-white'
              : 'bg-[#FAF8F5] text-[#171717] border-[#171717]'
          }`}
        >
          {totalCount}
        </span>
      </button>

      {/* Dynamically Loaded Hub Tabs */}
      {hubs.map((hub) => {
        const isActive = !isAll && activeHub.toLowerCase() === hub.name.toLowerCase();

        return (
          <button
            key={hub.name}
            type="button"
            onClick={() => onSelectHub(hub.name)}
            className={`flex items-center gap-2 px-3.5 py-2 uppercase font-bold tracking-wider shrink-0 border-2 transition-all duration-100 ${
              isActive
                ? 'bg-[#315FE8] text-white border-[#171717] shadow-[3px_3px_0px_#171717]'
                : 'bg-white hover:bg-[#FFF9F0] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717]'
            }`}
          >
            <span>{hub.name}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] font-bold border ${
                isActive
                  ? 'bg-white text-[#315FE8] border-white'
                  : 'bg-[#FAF8F5] text-[#171717] border-[#171717]'
              }`}
            >
              {hub.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ShipmentHubTabs;
