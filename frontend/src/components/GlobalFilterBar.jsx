import React from 'react';
import { useFilters } from '../context/FilterContext';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * Problem 5 Fix: Global Filter Bar.
 * Dropdowns height 40px, 12-16px gap, padded container (p-4 px-5), cohesive toolbar.
 */
const GlobalFilterBar = () => {
  const { filters, updateFilter, resetFilters, filterOptions } = useFilters();

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v !== 'all').length;

  return (
    <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-4 px-5 mb-6 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title & Active Filter Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[8px] bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#818CF8]">
            <Filter size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              Global Filter Control Center
              {activeFilterCount > 0 ? (
                <span className="text-[10px] bg-[#6366F1] text-white font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount} Active
                </span>
              ) : (
                <span className="text-[10px] bg-[#1F2937] text-slate-400 font-medium px-2 py-0.5 rounded-full">
                  All Data
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">Dynamic Power BI / Tableau Slicers</div>
          </div>
        </div>

        {/* Filters Dropdown Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* City Slicer */}
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="h-[42px] px-3.5 text-sm font-medium bg-[#141C2E] border border-[#1E293B] text-slate-200 rounded-[8px] focus:border-[#6366F1] focus:outline-none transition-colors"
          >
            <option value="all">🏢 All Cities</option>
            {filterOptions.cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Hotel Property Slicer */}
          <select
            value={filters.hotel}
            onChange={(e) => updateFilter('hotel', e.target.value)}
            className="h-[42px] px-3.5 text-sm font-medium bg-[#141C2E] border border-[#1E293B] text-slate-200 rounded-[8px] focus:border-[#6366F1] focus:outline-none transition-colors max-w-[190px] truncate"
          >
            <option value="all">🏨 All Properties</option>
            {filterOptions.hotels.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          {/* Room Type Slicer */}
          <select
            value={filters.room_type}
            onChange={(e) => updateFilter('room_type', e.target.value)}
            className="h-[42px] px-3.5 text-sm font-medium bg-[#141C2E] border border-[#1E293B] text-slate-200 rounded-[8px] focus:border-[#6366F1] focus:outline-none transition-colors"
          >
            <option value="all">🛏️ All Categories</option>
            {filterOptions.roomTypes.map(rt => (
              <option key={rt} value={rt}>{rt}</option>
            ))}
          </select>

          {/* Season Slicer */}
          <select
            value={filters.season}
            onChange={(e) => updateFilter('season', e.target.value)}
            className="h-[42px] px-3.5 text-sm font-medium bg-[#141C2E] border border-[#1E293B] text-slate-200 rounded-[8px] focus:border-[#6366F1] focus:outline-none transition-colors"
          >
            <option value="all">☀️ All Seasons</option>
            {filterOptions.seasons.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Month Slicer */}
          <select
            value={filters.month}
            onChange={(e) => updateFilter('month', e.target.value)}
            className="h-[42px] px-3.5 text-sm font-medium bg-[#141C2E] border border-[#1E293B] text-slate-200 rounded-[8px] focus:border-[#6366F1] focus:outline-none transition-colors"
          >
            <option value="all">📅 All Months</option>
            {filterOptions.months.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>

          {/* Year Slicer */}
          <select
            value={filters.year}
            onChange={(e) => updateFilter('year', e.target.value)}
            className="h-[42px] px-3.5 text-sm font-medium bg-[#141C2E] border border-[#1E293B] text-slate-200 rounded-[8px] focus:border-[#6366F1] focus:outline-none transition-colors"
          >
            <option value="all">🗓️ All Years</option>
            {filterOptions.years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Status Slicer */}
          <select
            value={filters.booking_status}
            onChange={(e) => updateFilter('booking_status', e.target.value)}
            className="h-[42px] px-3.5 text-sm font-medium bg-[#141C2E] border border-[#1E293B] text-slate-200 rounded-[8px] focus:border-[#6366F1] focus:outline-none transition-colors"
          >
            <option value="all">⚡ All Statuses</option>
            {filterOptions.bookingStatuses.map(bs => (
              <option key={bs} value={bs}>{bs}</option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="h-[42px] px-3.5 rounded-[8px] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Reset All Slicers"
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalFilterBar;
