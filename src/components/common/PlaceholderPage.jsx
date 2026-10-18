import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Construction } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const PlaceholderPage = ({
  title,
  category = 'OPERATIONAL MODULE',
  description = 'This module will be implemented in the next development phase.',
  icon: Icon = Construction
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-3 border-b-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#315FE8] tracking-widest">
              {category}
            </span>
            <StatusBadge variant="neutral" size="sm">
              PHASE 2 ROADMAP
            </StatusBadge>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tighter text-ink leading-tight">
            {title}
          </h1>
        </div>

        <Link
          to="/dashboard"
          className="brutal-btn bg-white hover:bg-[#FFF9F0] text-xs px-3 py-2 flex items-center gap-1.5 self-start sm:self-auto font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO DASHBOARD</span>
        </Link>
      </div>

      {/* Industrial Placeholder Canvas */}
      <div className="border-2 border-ink bg-panel shadow-[4px_4px_0px_#171717] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 bg-[#FFF9F0] border-2 border-ink shadow-[2.5px_2.5px_0px_#171717] flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-[#315FE8]" />
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="w-4 h-4 text-[#FF5638]" />
          <span className="font-mono text-xs uppercase font-bold text-ink tracking-wider">
            MODULE SCHEDULED FOR UPCOMING SPRINT
          </span>
        </div>

        <h3 className="font-display font-bold text-lg uppercase text-ink max-w-md">
          {title} CONTROL PANEL
        </h3>

        <p className="font-mono text-xs text-[#6E6E6E] max-w-md mt-2 leading-relaxed">
          {description}
        </p>

        <div className="mt-8 pt-6 border-t-2 border-dashed border-ink/20 w-full max-w-sm flex items-center justify-between font-mono text-[11px] text-[#6E6E6E]">
          <span>Status: <strong>QUEUED</strong></span>
          <span>Target: <strong>PHASE 2</strong></span>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
