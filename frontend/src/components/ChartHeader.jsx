import React from 'react';

/**
 * Standardized Unified Chart Header Component.
 */
const ChartHeader = ({
  title,
  subtitle,
  unitBadge,
  statusBadge,
  icon: Icon,
  actionButton
}) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        {Icon && (
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
            <Icon size={15} />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2 truncate">
            <span>{title}</span>
            {unitBadge && (
              <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.2 rounded-md border border-cyan-500/20 flex-shrink-0">
                {unitBadge}
              </span>
            )}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {statusBadge && (
          <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            {statusBadge}
          </span>
        )}
        {actionButton}
      </div>
    </div>
  );
};

export default ChartHeader;
