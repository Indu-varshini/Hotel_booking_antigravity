import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchOccupancyMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { TrendingUp, Clock, Calendar, AlertCircle, LineChart as LineIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

const OccupancyDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchOccupancyMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load occupancy metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.monthlyOccupancy || !data.monthlyOccupancy.length) return <EmptyState city={filters.city} month={filters.month} />;

  const { monthlyOccupancy } = data;
  const avgOccupancy = Math.round(monthlyOccupancy.reduce((acc, curr) => acc + curr.occupancy, 0) / monthlyOccupancy.length);
  const peakMonth = monthlyOccupancy.reduce((prev, current) => (prev.occupancy > current.occupancy) ? prev : current, monthlyOccupancy[0]);

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Overall Occupancy Rate" value={avgOccupancy} suffix="%" change={4.2} icon={TrendingUp} />
        <KpiCard title="Vacancy Rate" value={100 - avgOccupancy} suffix="%" isPositive={false} icon={AlertCircle} />
        <KpiCard title="Peak Occupancy Month" value={peakMonth.month} suffix={` (${peakMonth.occupancy}%)`} subtitle="Peak Seasonal Surge" icon={Calendar} />
        <KpiCard title="Avg Length of Stay" value={2.49} suffix=" Nights" icon={Clock} />
      </div>

      {/* 2. Full-Width Stacked Chart: Monthly Occupancy Trend */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Monthly Occupancy Rate Trend (%)" 
          subtitle="Seasonality tracking against the 75% target benchmark line"
          unitBadge="Occupancy Rate (%)"
          statusBadge="Seasonality"
          icon={LineIcon}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyOccupancy} margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} domain={[40, 100]} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B101D', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} 
                formatter={(val) => [`${val}%`, 'Occupancy Rate']}
              />
              <ReferenceLine y={75} label={{ value: 'Target 75%', fill: '#10B981', fontSize: 11, position: 'insideTopRight' }} stroke="#10B981" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="occupancy" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5, fill: '#06B6D4' }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Occupancy Insights & Helpful Tips"
        insights={[
          `${peakMonth.month} recorded the highest hotel occupancy at ${peakMonth.occupancy}%, driven by summer holiday travel.`,
          "July, August, and September saw lower occupancy (51-53%) due to the rainy monsoon season.",
          "Fridays and Saturdays consistently achieve high weekend occupancy (88%+)."
        ]}
        recommendations={[
          `Raise room rates slightly and set a 2-night minimum stay rule during busy ${peakMonth.month} holiday dates.`,
          "Offer discounted staycation and wellness packages to fill empty rooms during rainy monsoon months.",
          `Give special early-bird discounts for guests who book their ${peakMonth.month} trips 60 days in advance.`
        ]}
      />
    </div>
  );
};

export default OccupancyDashboard;
