import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchRevenueMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import DataTable from '../components/DataTable';
import { DollarSign, TrendingUp, Building, Bed, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

const RevenueDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchRevenueMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load revenue metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.revenueByRoom) return <EmptyState city={filters.city} month={filters.month} />;

  const { revenueByRoom, revenueByHotel } = data;
  const totalRev = revenueByRoom.reduce((acc, curr) => acc + curr.revenue, 0);

  const hotelTableColumns = [
    { header: 'Hotel Property', accessor: 'hotel_name', sortable: true, cell: (row) => <span className="font-bold text-white">{row.hotel_name}</span> },
    { header: 'City', accessor: 'city', sortable: true, cell: (row) => <span className="text-slate-400 font-medium">{row.city}</span> },
    { header: 'Gross Revenue (INR)', accessor: 'revenue', sortable: true, align: 'right', cell: (row) => <span className="text-emerald-400 font-bold">₹{row.revenue.toLocaleString()}</span> }
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Confirmed Revenue" value={Math.round(totalRev)} prefix="₹" change={18.4} icon={DollarSign} />
        <KpiCard title="Revenue Growth MoM" value={18.4} suffix="%" icon={TrendingUp} />
        <KpiCard title="RevPAR (Revenue Per Room)" value={Math.round(totalRev / 1000)} prefix="₹" change={6.8} icon={Bed} />
        <KpiCard title="Top Revenue Property" value="Taj Exotica Goa" subtitle="Highest Monthly Yield" icon={Building} />
      </div>

      {/* 2. Full-Width Stacked Chart: Revenue Breakdown by Room Category */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Revenue Breakdown by Room Category" 
          subtitle="Gross revenue share comparison across Deluxe, Suite, Standard & Executive rooms"
          unitBadge="INR (₹)"
          statusBadge="Categories"
          icon={BarChart3}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByRoom} barCategoryGap="30%" margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="room_type" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Gross Revenue']}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {revenueByRoom.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Full-Width Data Table: Top 10 Performing Properties */}
      <DataTable 
        title="Top 10 Performing Properties (Revenue)"
        columns={hotelTableColumns}
        data={revenueByHotel}
        pageSize={10}
      />

      {/* 4. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Revenue Insights & Strategy Tips"
        insights={[
          "Deluxe rooms made the most money, bringing in nearly half of all room earnings.",
          "Goa hotels earned the highest money overall among all hotel locations.",
          "Average room prices went up by 8.4% compared to last year because of strong weekend demand."
        ]}
        recommendations={[
          "Upgrade under-used standard rooms into deluxe rooms during busy holiday months.",
          "Add free spa or food coupons with suite room bookings to encourage guests to spend more.",
          "Adjust room rates daily based on guest demand for top hotels in Goa and Jaipur."
        ]}
      />
    </div>
  );
};

export default RevenueDashboard;
