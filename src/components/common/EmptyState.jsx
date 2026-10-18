import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'NO RECORDS FOUND',
  description = 'No operational records or events have been logged yet.',
  action = null,
  compact = false
}) => {
  return (
    <div
      className={`border-2 border-dashed border-[#171717] bg-[#FFF9F0] flex flex-col items-center justify-center text-center ${
        compact ? 'p-6' : 'p-10'
      }`}
    >
      <div className="w-12 h-12 bg-[#F0EEEE] border-2 border-ink shadow-[2px_2px_0px_#171717] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-ink" />
      </div>
      <h3 className="font-display font-bold text-base uppercase text-ink tracking-tight mb-1">
        {title}
      </h3>
      <p className="font-mono text-xs text-[#6E6E6E] max-w-md leading-relaxed mb-4">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
