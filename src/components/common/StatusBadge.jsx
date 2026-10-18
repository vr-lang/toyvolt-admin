import React from 'react';

export const StatusBadge = ({
  variant = 'neutral',
  children,
  className = '',
  dot = false,
  size = 'md'
}) => {
  const variantStyles = {
    success: 'bg-[#E6F4EA] text-[#15803D] border-[#171717]',
    warning: 'bg-[#FFD983] text-[#171717] border-[#171717]',
    danger: 'bg-[#FF5638] text-white border-[#171717]',
    info: 'bg-[#DCE5FF] text-[#171717] border-[#171717]',
    neutral: 'bg-[#F0EEEE] text-[#171717] border-[#171717]'
  };

  const dotColors = {
    success: 'bg-[#15803D]',
    warning: 'bg-[#B48300]',
    danger: 'bg-white',
    info: 'bg-[#315FE8]',
    neutral: 'bg-[#6E6E6E]'
  };

  const sizeStyles = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`border font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#171717] ${
        variantStyles[variant] || variantStyles.neutral
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-none shrink-0 ${dotColors[variant] || 'bg-current'}`} />}
      {children}
    </span>
  );
};

export default StatusBadge;
