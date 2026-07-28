import React, { useEffect, useState } from 'react';
import { fetchRecommendations } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Lightbulb, CheckCircle2, AlertTriangle, TrendingUp, Award, Zap, ArrowRight, Target } from 'lucide-react';

const RecommendationDashboard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRecommendations();
        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <SkeletonLoader type="full" />;
  if (!recommendations.length) return <EmptyState message="No AI recommendations generated." />;

  const criticalCount = recommendations.filter(r => r.priority === 'Critical').length;
  const highCount = recommendations.filter(r => r.priority === 'High').length;

  return (
    <div className="space-y-6 animate-fade-in w-full pb-8">
      {/* 1. Primary AI Summary KPI Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Active Recommendations" value={recommendations.length} suffix=" Action Plans" icon={Lightbulb} />
        <KpiCard title="Critical Priority Actions" value={criticalCount} isPositive={false} subtitle={`${highCount} High Priority`} icon={AlertTriangle} />
        <KpiCard title="Projected Revenue Lift" value={15.4} suffix="%" change={3.2} icon={TrendingUp} />
        <KpiCard title="Execution ROI Factor" value="3.4x" subtitle="High Yield Return" icon={Award} />
      </div>

      {/* 2. Full-Width Prescriptive Recommendations List */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 sm:p-7 shadow-md w-full space-y-5">
        <ChartHeader 
          title="Data-Driven Prescriptive Action Items" 
          subtitle="Priority ranked operational strategies derived from dynamic hotel analytics"
          unitBadge={`${recommendations.length} Action Plans`}
          statusBadge="Action Engine Active"
          icon={Zap}
        />

        {/* Spacious Full-Width Recommendation Cards */}
        <div className="space-y-4 mt-4 w-full">
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="bg-[#070A12] border border-[#1E293B] rounded-xl p-5 sm:p-6 hover:border-[#6366F1]/40 transition-all duration-150 shadow-sm space-y-4 w-full"
            >
              {/* Header Row: Category, Priority & Impact */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1F2937]/70 pb-3.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <Target size={14} /> {rec.category}
                  </span>

                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${
                    rec.priority === 'Critical' 
                      ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                      : rec.priority === 'High'
                      ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                      : 'bg-[#6366F1]/10 text-[#818CF8] border-[#6366F1]/30'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1.5 rounded-lg">
                  {rec.impact}
                </span>
              </div>

              {/* Title & Description with Increased Font Size */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-wide">
                  {rec.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {rec.description}
                </p>
              </div>

              {/* Action Item Bar with Slightly Larger Font */}
              <div className="pt-3 border-t border-[#1F2937]/70 flex items-center justify-between bg-[#0E1422]/60 p-3.5 rounded-lg border border-[#1E293B]/50">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#10B981]">
                  <CheckCircle2 size={18} className="text-[#10B981] flex-shrink-0" />
                  <span><strong>Recommended Action:</strong> {rec.action}</span>
                </div>
                <ArrowRight size={18} className="text-slate-500 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationDashboard;
