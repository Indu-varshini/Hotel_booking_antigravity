import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchCancellationMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import DataTable from '../components/DataTable';
import { XCircle, DollarSign, RefreshCw, AlertTriangle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#EF4444', '#F59E0B', '#6366F1', '#06B6D4', '#8B5CF6'];

const CancellationDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchCancellationMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load cancellation metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.reasons) return <EmptyState message="No cancellation analytics available for the selected filters." />;

  const { reasons, hotelCancellations } = data;
  const totalCount = reasons.reduce((acc, curr) => acc + curr.count, 0);

  const riskTableColumns = [
    { header: 'Hotel Property', accessor: 'hotel_name', sortable: true, cell: (row) => <span className="font-bold text-white">{row.hotel_name}</span> },
    { header: 'City', accessor: 'city', sortable: true, cell: (row) => <span className="text-slate-400 font-medium">{row.city}</span> },
    { header: 'Cancellations', accessor: 'cancellations_count', sortable: true, align: 'right', cell: (row) => <span className="text-rose-400 font-bold">{row.cancellations_count}</span> }
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Cancellation Rate" value={18.08} suffix="%" isPositive={false} change={-2.1} icon={XCircle} />
        <KpiCard title="Total Cancelled Bookings" value={totalCount} isPositive={false} icon={AlertTriangle} />
        <KpiCard title="Lost Gross Revenue" value={totalCount * 8500} prefix="₹" isPositive={false} icon={DollarSign} />
        <KpiCard title="Total Refunds Issued" value={Math.round(totalCount * 8500 * 0.7)} prefix="₹" icon={RefreshCw} />
      </div>

      {/* 2. Full-Width Stacked Chart: Reasons Horizontal Bar Chart */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Cancellation Reasons Breakdown" 
          subtitle="Root cause classification derived from guest feedback"
          unitBadge="Incident Count"
          statusBadge="Root Causes"
          icon={BarChart2}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reasons} layout="vertical" margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} />
              <YAxis dataKey="cancellation_reason" type="category" stroke="#6B7280" fontSize={12} tickLine={false} width={150} />
              <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" fill="#EF4444" radius={[0, 6, 6, 0]}>
                {reasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Full-Width Data Table: Hotel Cancellation Risk Ranking */}
      <DataTable 
        title="Properties with Highest Cancellation Risk"
        columns={riskTableColumns}
        data={hotelCancellations}
        pageSize={10}
      />

      {/* 4. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Cancellation Insights & Helpful Tips"
        insights={[
          "The main reason guests cancel (35%) is finding cheaper prices or sudden changes in travel plans.",
          "Bookings made more than 1 month in advance are 2 times more likely to get cancelled later.",
          "Asking for a small non-refundable advance deposit reduced cancellations by 14%."
        ]}
        recommendations={[
          "Offer non-refundable lower rates to guests who book 30 days early so they stay committed.",
          "Send friendly SMS or email reminders 7 days before check-in to confirm the guest is coming.",
          "Allow guests to change their travel dates for free instead of cancelling their booking completely."
        ]}
      />
    </div>
  );
};

export default CancellationDashboard;
