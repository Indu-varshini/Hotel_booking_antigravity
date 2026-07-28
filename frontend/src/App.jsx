import React, { useState } from 'react';
import { FilterProvider } from './context/FilterContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlobalFilterBar from './components/GlobalFilterBar';

import ExecutiveDashboard from './dashboards/ExecutiveDashboard';
import BookingDashboard from './dashboards/BookingDashboard';
import RevenueDashboard from './dashboards/RevenueDashboard';
import CustomerDashboard from './dashboards/CustomerDashboard';
import RoomDashboard from './dashboards/RoomDashboard';
import OccupancyDashboard from './dashboards/OccupancyDashboard';
import CancellationDashboard from './dashboards/CancellationDashboard';
import SeasonalDashboard from './dashboards/SeasonalDashboard';
import DynamicPricingDashboard from './dashboards/DynamicPricingDashboard';
import RecommendationDashboard from './dashboards/RecommendationDashboard';

const tabTitles = {
  executive: 'Executive Analytics Overview',
  revenue: 'Revenue Intelligence & RevPAR',
  booking: 'Booking Analytics & Distribution',
  customer: 'Customer Demographics & RFM',
  room: 'Room Category Performance & ADR',
  occupancy: 'Occupancy & Vacancy Analytics',
  cancellation: 'Cancellation Risk & Root Cause Analysis',
  seasonal: 'Seasonal & Holiday Trends',
  pricing: 'Dynamic Pricing Analytics',
  recommendation: 'Data-Driven Business Recommendations'
};

function AppContent() {
  const [activeTab, setActiveTab] = useState('executive');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderActiveDashboard = () => {
    switch (activeTab) {
      case 'executive': return <ExecutiveDashboard />;
      case 'revenue': return <RevenueDashboard />;
      case 'booking': return <BookingDashboard />;
      case 'customer': return <CustomerDashboard />;
      case 'room': return <RoomDashboard />;
      case 'occupancy': return <OccupancyDashboard />;
      case 'cancellation': return <CancellationDashboard />;
      case 'seasonal': return <SeasonalDashboard />;
      case 'pricing': return <DynamicPricingDashboard />;
      case 'recommendation': return <RecommendationDashboard />;
      default: return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex overflow-x-hidden">
      {/* Fixed Left Sidebar (260px or 68px) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Main Content Area with Explicit margin-left to prevent ANY sidebar overlap */}
      <div 
        className="flex-1 min-w-0 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '72px' : '280px' }}
      >
        <Header title={tabTitles[activeTab] || 'Executive Dashboard'} />
        
        <main className="p-6 lg:p-8 max-w-[1720px] w-full mx-auto flex-1 space-y-6">
          {/* Global Filter Toolbar */}
          <GlobalFilterBar />

          {/* Render Active View */}
          {renderActiveDashboard()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  );
}

export default App;
