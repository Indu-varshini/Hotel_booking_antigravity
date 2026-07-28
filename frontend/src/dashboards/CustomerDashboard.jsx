import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchCustomerMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Users, UserCheck, DollarSign, Award, Users2, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

const COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#F87171'];

const CustomerDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchCustomerMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load customer metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.ageGroups) return <EmptyState city={filters.city} month={filters.month} />;

  const { ageGroups, segments } = data;

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Total Customers" value={1500} change={8.5} icon={Users} />
        <KpiCard title="Repeat Customers" value={624} suffix=" (41.6%)" change={14.2} icon={UserCheck} />
        <KpiCard title="Avg Customer Spend" value={112160} prefix="₹" change={5.1} icon={DollarSign} />
        <KpiCard title="Top Customer Segment" value="Corporate" subtitle="Highest LTV Contribution" icon={Award} />
      </div>

      {/* 2. Full-Width Stacked Chart 1: Customer Demographics - Age Groups Bar Chart */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Revenue Share by Age Demographics" 
          subtitle="Revenue contribution across 18-25, 26-35, 36-50, and 50+ age brackets"
          unitBadge="Demographics"
          statusBadge="Age Brackets"
          icon={Users2}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageGroups} barCategoryGap="30%" margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="age_group" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue Contribution']}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {ageGroups.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Full-Width Stacked Chart 2: Customer Segments Pie Chart */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Customer Behavioral Segments (RFM)" 
          subtitle="Segmentation breakdown across Leisure, Corporate, Solo, and Family travelers"
          unitBadge="RFM Breakdown"
          statusBadge="Segments"
          icon={PieIcon}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={segments} 
                dataKey="revenue" 
                nameKey="customer_type" 
                cx="50%" 
                cy="45%" 
                innerRadius={65} 
                outerRadius={95} 
                paddingAngle={5}
              >
                {segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Segment Revenue']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Guest Insights & Helpful Tips"
        insights={[
          "Young guests aged 26 to 35 generate over half (52%) of all hotel income.",
          "Business travelers return frequently, with nearly half (48%) making repeat bookings.",
          "Vacation travelers spend more money on food, drinks, and hotel services during their stay."
        ]}
        recommendations={[
          "Create a simple loyalty reward program for regular business travelers to keep them coming back.",
          "Design attractive weekend getaway offers targeted at young working professionals.",
          "Offer flexible corporate room rates to sign long-term deals with local business clients."
        ]}
      />
    </div>
  );
};

export default CustomerDashboard;
