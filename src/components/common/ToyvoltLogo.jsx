import React from 'react';
import { Zap } from 'lucide-react';

export const ToyvoltLogo = ({ collapsed = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Neo-brutalist Lightning Emblem */}
      <div className="w-9 h-9 bg-[#315FE8] border-2 border-ink shadow-[2.5px_2.5px_0px_#171717] flex items-center justify-center shrink-0">
        <Zap className="w-5 h-5 text-[#FFD983] fill-[#FFD983]" />
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-xl tracking-tighter text-ink">
              TOYVOLT
            </span>
            <span className="bg-[#FF5638] text-white text-[9px] font-mono font-bold px-1 py-0.5 border border-ink shadow-[1px_1px_0px_#171717]">
              V1.0
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#6E6E6E] font-bold mt-0.5">
            ADMIN CONSOLE
          </span>
        </div>
      )}
    </div>
  );
};

export default ToyvoltLogo;
