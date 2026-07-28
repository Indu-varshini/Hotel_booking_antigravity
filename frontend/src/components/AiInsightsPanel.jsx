import React from 'react';
import { Lightbulb, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

/**
 * Dedicated AI Insights & Prescriptive Recommendations Panel.
 * Broad full-width list layout for maximum readability.
 */
const AiInsightsPanel = ({
  title = "AI Business Insights & Actionable Recommendations",
  insights = [],
  recommendations = []
}) => {
  const defaultInsights = [
    "Revenue increased by 18.4% month-over-month driven by high-demand weekend bookings.",
    "Hyderabad and Goa emerged as top-performing destinations with 88%+ occupancy rates.",
    "Deluxe & Suite room categories yielded highest ADR profit margins."
  ];

  const defaultRecommendations = [
    "Increase Suite room dynamic pricing multiplier by 8-12% during upcoming holiday weekends.",
    "Launch targeted re-engagement offers for corporate repeat travelers.",
    "Optimize room inventory allocation to minimize cancellation vulnerability in budget tiers."
  ];

  const activeInsights = insights.length > 0 ? insights : defaultInsights;
  const activeRecs = recommendations.length > 0 ? recommendations : defaultRecommendations;

  return (
    <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 sm:p-7 shadow-lg space-y-6 w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#1F2937] pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] flex-shrink-0">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              {title} <Sparkles size={16} className="text-cyan-400" />
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Automated Prescriptive Analysis & Operational Action Plan</p>
          </div>
        </div>

        <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          AI Insights Active
        </span>
      </div>

      {/* Broad Full-Width Stacked Layout */}
      <div className="space-y-6">
        {/* Section 1: Key Business Insights (Full Width) */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6366F1] flex items-center gap-2 pb-1 border-b border-[#1F2937]/50">
            <TrendingUp size={16} /> Key Business Insights
          </div>
          <div className="space-y-2.5">
            {activeInsights.map((insight, idx) => (
              <div 
                key={idx} 
                className="w-full p-4 sm:p-5 bg-[#070A12] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-4 hover:border-[#6366F1]/40 transition-all duration-150 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#818CF8] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {typeof insight === 'object' && insight !== null ? (
                    <div>
                      <div className="font-bold text-white mb-1 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm">{insight.title || insight.category}</span>
                        {insight.impact && (
                          <span className="text-xs bg-[#6366F1]/20 text-[#818CF8] px-2.5 py-0.5 rounded-md border border-[#6366F1]/30 font-semibold">
                            {insight.impact}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 leading-normal">{insight.description}</div>
                    </div>
                  ) : (
                    <span className="text-slate-200 font-medium">{insight}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Recommended Action Plan (Full Width) */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-2 pb-1 border-b border-[#1F2937]/50">
            <CheckCircle2 size={16} /> Recommended Action Plan
          </div>
          <div className="space-y-2.5">
            {activeRecs.map((rec, idx) => (
              <div 
                key={idx} 
                className="w-full p-4 sm:p-5 bg-[#070A12] border border-[#10B981]/20 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-4 hover:border-[#10B981]/40 transition-all duration-150 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  {typeof rec === 'object' && rec !== null ? (
                    <div>
                      <div className="font-bold text-white mb-1 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm">{rec.title || rec.category}</span>
                        {rec.badge && (
                          <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2.5 py-0.5 rounded-md border border-[#10B981]/30 font-semibold">
                            {rec.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 leading-normal">{rec.description}</div>
                    </div>
                  ) : (
                    <span className="text-slate-200 font-medium">{rec}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsightsPanel;
