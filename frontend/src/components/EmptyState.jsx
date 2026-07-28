import React from 'react';
import { FilterX, RefreshCcw, Search } from 'lucide-react';
import { useFilters } from '../context/FilterContext';

/**
 * Reusable Empty State component for when filters return 0 matching results.
 * Meets Master Prompt specification.
 */
const EmptyState = ({
  message = "No matching hotel records found for the selected filter combination.",
  city,
  month
}) => {
  const { resetFilters } = useFilters();

  return (
    <div className="glass-panel p-12 text-center flex flex-col items-center justify-center space-y-4 my-6 border-indigo-500/20">
      <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-xl">
        <FilterX size={44} />
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-base font-extrabold text-white">No Data Available</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {city && month ? `No bookings found for ${city} during ${month}.` : message}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-left max-w-md w-full space-y-2">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Search size={14} className="text-cyan-400" /> Suggested Action Tips:
        </div>
        <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
          <li>Try changing active city or room type slicers.</li>
          <li>Select a broader date range or choose "All Months".</li>
          <li>Clear active booking status filters to include cancelled/pending reservations.</li>
        </ul>
      </div>

      <button
        onClick={resetFilters}
        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
      >
        <RefreshCcw size={14} /> Reset Global Filters
      </button>
    </div>
  );
};

export default EmptyState;
