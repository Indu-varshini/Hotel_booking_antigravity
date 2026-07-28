import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { fetchBookingMetrics } from '../services/api';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Calendar, CheckCircle, Clock, XCircle, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#06B6D4'];

const STATUS_COLORS = {
  'Confirmed': '#10B981',   // Green (Positive)
  'Checked-Out': '#F59E0B', // Orange/Amber
  'Cancelled': '#EF4444',   // Red (Risk/Negative)
  'Pending': '#818CF8'      // Indigo/Purple
};

const BookingDashboard = () => {
  const { filters } = useFilters();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchBookingMetrics(filters);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load booking metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  if (loading) return <SkeletonLoader type="full" />;
  if (!data || !data.statusBreakdown) return <EmptyState city={filters.city} month={filters.month} />;

  const { statusBreakdown, channelBreakdown } = data;

  const totalB = statusBreakdown.reduce((acc, curr) => acc + curr.count, 0);
  const confirmedB = statusBreakdown.find(s => s.booking_status === 'Confirmed' || s.booking_status === 'Checked-Out')?.count || 0;
  const pendingB = statusBreakdown.find(s => s.booking_status === 'Pending')?.count || 0;
  const cancelledB = statusBreakdown.find(s => s.booking_status === 'Cancelled')?.count || 0;

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Total Bookings" value={totalB} change={12.1} icon={Calendar} />
        <KpiCard title="Confirmed / Checked-Out" value={confirmedB} suffix={` (${Math.round((confirmedB/totalB)*100)}%)`} icon={CheckCircle} />
        <KpiCard title="Pending Reservations" value={pendingB} icon={Clock} />
        <KpiCard title="Cancelled Bookings" value={cancelledB} isPositive={false} change={-2.1} icon={XCircle} />
      </div>

      {/* 2. Full-Width Stacked Chart 1: Booking Status Distribution */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Booking Status Distribution" 
          subtitle="Confirmed, pending, and cancelled status breakdown"
          unitBadge="Ratio"
          statusBadge="Status Mix"
          icon={PieIcon}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={statusBreakdown} 
                dataKey="count" 
                nameKey="booking_status" 
                cx="50%" 
                cy="45%" 
                innerRadius={65} 
                outerRadius={95} 
                paddingAngle={5}
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.booking_status] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Full-Width Stacked Chart 2: Booking Volume by Channel */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 h-[380px] flex flex-col justify-between shadow-md w-full">
        <ChartHeader 
          title="Booking Volume by Distribution Channel" 
          subtitle="Direct Website vs OTA vs Agent attribution"
          unitBadge="Reservations"
          statusBadge="Attribution"
          icon={BarChart2}
        />
        <div className="flex-1 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelBreakdown} barCategoryGap="30%" margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="booking_channel" stroke="#6B7280" fontSize={12} tickLine={false} tickMargin={10} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} width={70} />
              <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {channelBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Booking Insights & Easy Tips"
        insights={[
          "Most guests (64%) book their rooms through travel websites like MakeMyTrip and Booking.com.",
          "Guests who book directly on our website stay 24% longer than guests from other travel sites.",
          "86% of pending bookings get paid and confirmed within 2 days."
        ]}
        recommendations={[
          "Offer free breakfast and early check-in to guests who book directly on our hotel website.",
          "Send quick SMS payment reminders to guests with pending bookings so they don't cancel.",
          "Build stronger tie-ups with companies for regular corporate room bookings."
        ]}
      />
    </div>
  );
};

export default BookingDashboard;
