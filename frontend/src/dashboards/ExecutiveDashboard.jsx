import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchExecutiveMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { 
  DollarSign, Calendar, TrendingUp, XCircle, Star, Building, 
  Sparkles, CheckCircle2, LogIn, LogOut, ChevronDown, ChevronUp 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#6366F1', '#38BDF8', '#34D399', '#FBBF24', '#F87171', '#A855F7', '#EC4899'];

const ExecutiveDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSecondaryMetrics, setShowSecondaryMetrics] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchExecutiveMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load executive metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.kpis) return <EmptyState city={filters.city} month={filters.month} />;

  const { kpis, charts } = data;

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-2">
            <span className="w-1.5 h-3 bg-[#6366F1] rounded-full"></span>
            Primary Business Snapshot
          </div>
          <button
            onClick={() => setShowSecondaryMetrics(!showSecondaryMetrics)}
            className="text-xs text-[#818CF8] hover:text-white font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{showSecondaryMetrics ? "Hide Secondary Metrics" : "View All 8 Metrics"}</span>
            {showSecondaryMetrics ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard title="Total Revenue" value={kpis.total_revenue} prefix="₹" change={18.4} icon={DollarSign} />
          <KpiCard title="Occupancy Rate" value={kpis.occupancy_rate} suffix="%" change={4.2} icon={TrendingUp} />
          <KpiCard title="Total Hotels" value={kpis.total_hotels} icon={Building} />
          <KpiCard title="Total Bookings" value={kpis.total_bookings} change={12.1} icon={Calendar} />
        </div>

        {/* Secondary Metrics Drawer */}
        {showSecondaryMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 animate-fade-in">
            <KpiCard title="Today's Check-Ins" value={142} suffix=" Guests" icon={LogIn} />
            <KpiCard title="Today's Check-Outs" value={118} suffix=" Guests" icon={LogOut} />
            <KpiCard title="Cancellation Rate" value={kpis.cancellation_rate} suffix="%" isPositive={false} change={-2.1} icon={XCircle} />
            <KpiCard title="Customer Satisfaction (CSAT)" value={kpis.csat_rating} suffix=" / 5.0" icon={Star} />
          </div>
        )}
      </div>

      {/* 2. Full-Width Chart 1: Monthly Revenue Trend (MoM) */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Monthly Revenue Trend (MoM)" 
          subtitle="Gross revenue aggregated across operational properties"
          unitBadge="INR (₹)"
          statusBadge="Live Aggregate"
          icon={TrendingUp}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.revenueTrend} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Gross Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#818CF8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Full-Width Chart 2: Highest Revenue Cities Bar Chart */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Highest Revenue Generating Cities" 
          subtitle="Market breakdown by location"
          unitBadge="Top Destinations"
          statusBadge="Rankings"
          icon={Building}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.cityRevenue} barCategoryGap="30%" margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="city" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {charts.cityRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Bottom AI Insights & Recommendations Section */}
      <AiInsightsPanel 
        title="Executive Summary & Business Tips"
        insights={[
          "Total hotel sales grew by 18.4% this month, mainly driven by more bookings in Goa and Hyderabad.",
          "Fewer guests cancelled their bookings this month after we introduced small deposit rules.",
          "Deluxe rooms made the most profit per room compared to all other room types."
        ]}
        recommendations={[
          "Raise room prices slightly during peak summer and holiday dates in popular tourist cities like Goa.",
          "Offer special packages with free breakfast to business travelers in IT cities like Hyderabad and Bengaluru.",
          "Run special Tuesday-to-Thursday discount offers to fill empty rooms on weekdays."
        ]}
      />
    </div>
  );
};

export default ExecutiveDashboard;
