import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

/**
 * Enterprise KPI Card Component.
 * Problem 3 Specs: 20px 24px padding, 12px border-radius, min-height 140px,
 * 28-32px metric font, 12px uppercase title, icon top-right, trend below with 8px margin.
 */
const KpiCard = ({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  change, 
  isPositive = true, 
  icon: Icon, 
  subtitle,
  tooltipText = 'Calculated from verified operational data.',
  sparklinePoints = [12, 18, 15, 24, 22, 28, 35, 32, 42, 48]
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Micro SVG Sparkline Path Generator
  const maxVal = Math.max(...sparklinePoints);
  const minVal = Math.min(...sparklinePoints);
  const range = maxVal - minVal || 1;
  const width = 72;
  const height = 22;

  const pointsString = sparklinePoints.map((val, idx) => {
    const x = (idx / (sparklinePoints.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-[20px_24px] min-h-[140px] flex flex-col justify-between hover:border-[#6366F1]/40 transition-all duration-150 relative group shadow-md">
      {/* Top Row: Muted Title Left & Icon Top-Right */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#9CA3AF] truncate pr-2">
          {title}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Tooltip Icon */}
          <div 
            onMouseEnter={() => setShowTooltip(true)} 
            onMouseLeave={() => setShowTooltip(false)}
            className="text-[#6B7280] hover:text-[#818CF8] cursor-pointer transition-colors"
          >
            <Info size={13} />
            {showTooltip && (
              <div className="absolute right-3 top-8 w-52 p-2.5 rounded-[8px] bg-[#0B0F19] border border-[#1E293B] text-[11px] text-[#9CA3AF] shadow-2xl z-50 pointer-events-none animate-fade-in">
                {tooltipText}
              </div>
            )}
          </div>

          {/* Main Card Icon Top-Right */}
          {Icon && (
            <div className="p-1.5 rounded-[8px] bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#818CF8] group-hover:text-white transition-colors">
              <Icon size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Center Main Metric Value (28-32px bold font) */}
      <div className="my-1.5">
        <div className="text-[28px] lg:text-[30px] font-bold text-white font-sans tracking-tight leading-tight truncate">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
      </div>

      {/* Bottom Subtext / Trend Row (12px text, 8px top margin) */}
      <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-[#1F2937]/40">
        <div className="flex items-center gap-1.5">
          {change !== undefined ? (
            <div className={`inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-[6px] border ${
              isPositive 
                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
            }`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{change > 0 ? `+${change}` : change}% MoM</span>
            </div>
          ) : subtitle ? (
            <span className="text-[12px] text-[#9CA3AF] font-medium truncate">{subtitle}</span>
          ) : (
            <span className="text-[12px] text-[#6B7280] font-medium">Real-time Verified</span>
          )}
        </div>

        {/* Micro SVG Sparkline Chart */}
        <div className="w-[72px] h-[22px] flex items-center justify-end opacity-70 group-hover:opacity-100 transition-opacity">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={isPositive ? '#10B981' : '#EF4444'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
