import React from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, Users, Bed, TrendingUp, 
  XCircle, Sun, Tag, Lightbulb, FileText, Building2, 
  ChevronLeft, ChevronRight, Award
} from 'lucide-react';

const groupedNav = [
  {
    title: 'EXECUTIVE ANALYTICS',
    items: [
      { id: 'executive', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
      { id: 'booking', label: 'Booking Analytics', icon: Calendar }
    ]
  },
  {
    title: 'BUSINESS ANALYTICS',
    items: [
      { id: 'customer', label: 'Customer Analytics', icon: Users },
      { id: 'room', label: 'Room Analytics', icon: Bed },
      { id: 'occupancy', label: 'Occupancy Analytics', icon: TrendingUp },
      { id: 'cancellation', label: 'Cancellation Analytics', icon: XCircle }
    ]
  },
  {
    title: 'ADVANCED ANALYTICS',
    items: [
      { id: 'seasonal', label: 'Seasonal Analytics', icon: Sun },
      { id: 'pricing', label: 'Dynamic Pricing Analytics', icon: Tag }
    ]
  },
  {
    title: 'AI INSIGHTS',
    items: [
      { id: 'recommendation', label: 'AI Recommendations', icon: Lightbulb, isHighlight: true }
    ]
  },

];

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  return (
    <aside className={`bg-[#0B0F19] border-r border-[#1F2937] flex flex-col h-screen fixed left-0 top-0 z-40 shadow-xl transition-all duration-300 ${
      isCollapsed ? 'w-[72px]' : 'w-[280px]'
    }`}>
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-[#1F2937] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <div className="p-2.5 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md flex-shrink-0">
            <Building2 size={22} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm tracking-wide text-white truncate">
                Hotel Intelligence
              </h1>
              <p className="text-[11px] text-[#6366F1] font-extrabold tracking-wider uppercase truncate mt-0.5">Enterprise BI Platform</p>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-[#141C2E] hover:bg-[#1E293B] text-slate-400 hover:text-white border border-[#1F2937] transition-colors flex-shrink-0 ml-1"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Grouped Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6 scrollbar-thin">
        {groupedNav.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            {!isCollapsed && (
              <div className="px-3 text-xs font-extrabold tracking-[0.06em] uppercase text-slate-400 pb-1.5 border-b border-[#1F2937]/60 flex items-center justify-between">
                <span>{group.title}</span>
              </div>
            )}
            <div className="space-y-1 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full h-[44px] flex items-center gap-3 px-3.5 rounded-[8px] text-sm transition-all duration-150 relative ${
                      isActive
                        ? 'bg-[#6366F1]/20 text-[#818CF8] font-bold border-l-3 border-[#6366F1] shadow-sm'
                        : item.isHighlight
                        ? 'text-cyan-300 hover:bg-cyan-500/10 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-[#141C2E] font-semibold'
                    }`}
                  >
                    <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-[#818CF8]' : item.isHighlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left flex items-center justify-between">
                        <span className="truncate text-sm">{item.label}</span>
                        {item.isHighlight && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-extrabold px-2 py-0.5 rounded-md uppercase ml-1 flex-shrink-0">
                            AI
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[#1F2937] text-center bg-[#070A12] flex-shrink-0">
          <div className="text-xs font-bold text-slate-200">Enterprise BI Edition v2.4</div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live DB Connected
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
