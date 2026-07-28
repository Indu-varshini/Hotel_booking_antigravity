import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchSeasonalMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Sun, Calendar, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#F59E0B', '#10B981', '#6366F1', '#06B6D4'];

const SeasonalDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchSeasonalMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load seasonal metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.seasonalData || !data.seasonalData.length) return <EmptyState city={filters.city} month={filters.month} />;

  const { seasonalData } = data;
  const peakSeason = seasonalData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current, seasonalData[0]);
  const offSeason = seasonalData.reduce((prev, current) => (prev.revenue < current.revenue) ? prev : current, seasonalData[0]);

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Peak Season Revenue" value={Math.round(peakSeason.revenue)} prefix="₹" change={22.4} icon={DollarSign} />
        <KpiCard title="Off-Season Revenue" value={Math.round(offSeason.revenue)} prefix="₹" icon={Sun} />
        <KpiCard title="Peak Occupancy Rate" value={peakSeason.occupancy} suffix="%" change={6.5} icon={TrendingUp} />
        <KpiCard title="Top Festival Spike" value="New Year / Goa" subtitle="98% Peak Occupancy" icon={Calendar} />
      </div>

      {/* 2. Full-Width Stacked Chart 1: Revenue by Seasonal Period */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Gross Revenue by Seasonal Period (INR)" 
          subtitle="Seasonal revenue distribution across winter, summer, festive, and monsoon"
          unitBadge="INR (₹)"
          statusBadge="Seasonality"
          icon={BarChart2}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalData} barCategoryGap="30%" margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="season" stroke="#6B7280" fontSize={11} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B101D', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} 
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Gross Revenue']}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {seasonalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Full-Width Stacked Chart 2: Occupancy Rate by Seasonal Period */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Occupancy Rate (%) by Seasonal Period" 
          subtitle="Demand occupancy variance throughout the annual seasonal cycle"
          unitBadge="Demand Occupancy (%)"
          statusBadge="Demand Mix"
          icon={TrendingUp}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalData} barCategoryGap="30%" margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="season" stroke="#6B7280" fontSize={11} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} unit="%" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B101D', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} 
                formatter={(val) => [`${val}%`, 'Occupancy Rate']}
              />
              <Bar dataKey="occupancy" radius={[6, 6, 0, 0]}>
                {seasonalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Seasonal Trends & Helpful Tips"
        insights={[
          "Winter months (November to January) bring in over one-third (36%) of the whole year's earnings.",
          "Beach areas like Goa see a 26% drop in holiday bookings during the rainy monsoon months.",
          "Guests are willing to pay up to 80% higher room rates during Diwali and New Year holidays."
        ]}
        recommendations={[
          "Increase room prices 45 days before the busy winter holiday season starts to maximize profits.",
          "Promote business meetings and corporate events during rainy monsoon months to fill empty rooms.",
          "Create special Diwali and New Year holiday offers early to lock in guest bookings in advance."
        ]}
      />
    </div>
  );
};

export default SeasonalDashboard;
