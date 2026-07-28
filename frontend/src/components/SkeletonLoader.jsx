import React from 'react';

/**
 * Reusable Glassmorphic Skeleton Loader for loading states.
 */
export const KpiSkeleton = () => (
  <div className="glass-panel p-5 h-[160px] flex flex-col justify-between animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10"></div>
      <div className="w-24 h-4 rounded-lg bg-white/10"></div>
    </div>
    <div className="space-y-2">
      <div className="w-36 h-8 rounded-lg bg-white/10"></div>
      <div className="w-20 h-4 rounded-full bg-white/10"></div>
    </div>
  </div>
);

export const ChartSkeleton = ({ height = "h-[400px]" }) => (
  <div className={`glass-panel p-6 ${height} flex flex-col justify-between animate-pulse`}>
    <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/10"></div>
        <div className="w-48 h-5 rounded-lg bg-white/10"></div>
      </div>
      <div className="w-24 h-6 rounded-full bg-white/10"></div>
    </div>
    <div className="flex-1 w-full bg-white/5 rounded-xl flex items-end p-4 gap-3">
      <div className="w-full bg-white/10 rounded-t-lg h-[40%]"></div>
      <div className="w-full bg-white/10 rounded-t-lg h-[70%]"></div>
      <div className="w-full bg-white/10 rounded-t-lg h-[55%]"></div>
      <div className="w-full bg-white/10 rounded-t-lg h-[85%]"></div>
      <div className="w-full bg-white/10 rounded-t-lg h-[60%]"></div>
      <div className="w-full bg-white/10 rounded-t-lg h-[90%]"></div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-panel p-6 h-[400px] flex flex-col justify-between animate-pulse">
    <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
      <div className="w-48 h-5 rounded-lg bg-white/10"></div>
      <div className="w-24 h-6 rounded-full bg-white/10"></div>
    </div>
    <div className="space-y-3 flex-1">
      <div className="w-full h-10 rounded-xl bg-white/10"></div>
      <div className="w-full h-8 rounded-lg bg-white/5"></div>
      <div className="w-full h-8 rounded-lg bg-white/5"></div>
      <div className="w-full h-8 rounded-lg bg-white/5"></div>
      <div className="w-full h-8 rounded-lg bg-white/5"></div>
    </div>
  </div>
);

const SkeletonLoader = ({ type = "full" }) => {
  if (type === "kpis") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
};

export default SkeletonLoader;
