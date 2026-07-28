import React, { useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { Bell, Sun, Moon } from 'lucide-react';

const Header = ({ title = 'Executive Dashboard' }) => {
  const { theme, toggleTheme } = useFilters();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-[#0B0F19]/90 backdrop-blur-md h-16 w-full flex items-center justify-between px-6 sticky top-0 z-30 border-b border-slate-800/80 shadow-md transition-colors">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-500 via-cyan-400 to-emerald-400 flex-shrink-0"></div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white tracking-wide truncate">
            Hotel Intelligence Analytics Platform
          </h2>
          <p className="text-[11px] text-indigo-400 font-semibold mt-0.5 truncate">
            {title}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all relative"
            title="Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-72 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-2xl z-50 animate-fade-in space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Bell size={13} className="text-indigo-400" /> System Alerts
                </span>
                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  <div className="font-semibold text-white mb-0.5 flex justify-between">
                    <span>High Demand Alert: Goa</span>
                    <span className="text-[9px] text-indigo-400">10m ago</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Dec 2026 occupancy predicted to reach 94%. AI pricing recommendation active.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
                  <div className="font-semibold text-white mb-0.5 flex justify-between">
                    <span>Report Export Complete</span>
                    <span className="text-[9px] text-emerald-400">1h ago</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Monthly Revenue Executive Summary generated.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center justify-center cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-400" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
