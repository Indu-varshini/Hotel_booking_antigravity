import React, { useEffect, useState } from 'react';
import { fetchInsights } from '../services/api';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const BusinessInsightsSection = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInsights = async () => {
      try {
        const res = await fetchInsights();
        setInsights(res.data.insights || []);
      } catch (err) {
        console.error('Failed to load insights:', err);
      } finally {
        setLoading(false);
      }
    };
    getInsights();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={18} className="text-amber-400" />;
      case 'success': return <CheckCircle size={18} className="text-emerald-400" />;
      case 'trend': return <TrendingUp size={18} className="text-cyan-400" />;
      default: return <Info size={18} className="text-indigo-400" />;
    }
  };

  if (loading) return null;

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={20} className="text-amber-400 animate-pulse" />
        <h3 className="text-base font-bold text-white tracking-wide">Automated Business Insights Engine</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{item.category}</span>
                {getIcon(item.type)}
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessInsightsSection;
