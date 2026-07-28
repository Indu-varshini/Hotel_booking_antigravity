import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchRoomMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Bed, Percent, Award, DollarSign, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899'];

const RoomDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchRoomMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load room metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.roomData || !data.roomData.length) return <EmptyState city={filters.city} month={filters.month} />;

  const { roomData } = data;
  const topRevenueRoom = roomData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current, roomData[0]);
  const topUtilRoom = roomData.reduce((prev, current) => (prev.utilization > current.utilization) ? prev : current, roomData[0]);
  const avgUtil = Math.round(roomData.reduce((acc, curr) => acc + curr.utilization, 0) / roomData.length);

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Total Available Inventory" value={1000} suffix=" Rooms" icon={Bed} />
        <KpiCard title="Room Utilization Rate" value={avgUtil} suffix="%" change={3.8} icon={Percent} />
        <KpiCard title="Most Booked Category" value={`${topUtilRoom.type} Room`} subtitle={`${topUtilRoom.utilization}% Utilization`} icon={Award} />
        <KpiCard title="Highest Revenue Category" value={`${topRevenueRoom.type} Room`} prefix="₹" subtitle={`₹${(topRevenueRoom.revenue / 10000000).toFixed(2)} Cr Yield`} icon={DollarSign} />
      </div>

      {/* 2. Full-Width Stacked Chart 1: Room Utilization Rate Bar Chart */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Room Utilization Rate (%) by Category" 
          subtitle="Occupancy efficiency comparison across inventory tiers"
          unitBadge="Capacity Utilization (%)"
          statusBadge="Efficiency"
          icon={SlidersHorizontal}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roomData} barCategoryGap="30%" margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="type" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} unit="%" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B101D', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} 
                formatter={(val) => [`${val}%`, 'Utilization Rate']}
              />
              <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                {roomData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Full-Width Stacked Chart 2: Average Daily Rate (ADR) Bar Chart */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Average Daily Rate (ADR) per Night (INR)" 
          subtitle="Nightly price yield per category"
          unitBadge="Price Yield (₹)"
          statusBadge="ADR Pricing"
          icon={BarChart2}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roomData} barCategoryGap="30%" margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="type" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} tickFormatter={(v) => `₹${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B101D', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} 
                formatter={(val) => [`₹${val.toLocaleString()}`, 'ADR / Night']}
              />
              <Bar dataKey="adr" fill="#10B981" radius={[6, 6, 0, 0]}>
                {roomData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Room Performance Insights & Easy Tips"
        insights={[
          "Standard rooms sell the fastest, but Deluxe rooms earn 45% more profit per room.",
          "Suite rooms earn the highest price per night, especially on busy weekends.",
          "Executive rooms have extra empty slots during mid-week Tuesdays and Wednesdays."
        ]}
        recommendations={[
          "Offer guests a cheap room upgrade to Deluxe when they check in at the front desk.",
          "Include free meeting room access with Suite room bookings for business guests.",
          "Reduce Executive room prices slightly on Tuesdays to attract more business travelers."
        ]}
      />
    </div>
  );
};

export default RoomDashboard;
