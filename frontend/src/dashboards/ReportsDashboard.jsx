import React, { useState } from 'react';
import KpiCard from '../components/KpiCard';
import ChartHeader from '../components/ChartHeader';
import AiInsightsPanel from '../components/AiInsightsPanel';
import { FileText, Download, FileSpreadsheet, FileCode, CheckCircle2, History, Sparkles, FileDown, Layers, HardDrive } from 'lucide-react';

const reportTypes = [
  { id: 1, name: 'Revenue Analytics Executive Summary', format: 'Excel, PDF & CSV', desc: 'Comprehensive breakdown of MoM revenue, city share, ADR, and RevPAR.' },
  { id: 2, name: 'Hotel Property Performance Audit', format: 'Excel, PDF & CSV', desc: 'Hotel-wise revenue rankings, occupancy percentages, and cancellation risk.' },
  { id: 3, name: 'Booking & Channel Distribution Report', format: 'Excel, PDF & CSV', desc: 'Channel attribution (OTA vs Direct), lead time analysis, and room type split.' },
  { id: 4, name: 'Customer RFM Segmentation & CSAT Report', format: 'Excel, PDF & CSV', desc: 'High-value customer lists, repeat guest percentage, and sentiment scores.' },
  { id: 5, name: 'Cancellation & Refund Analytics Audit', format: 'Excel, PDF & CSV', desc: 'Cancellation root causes, lost revenue figures, and hotel risk audit.' },
  { id: 6, name: 'Dynamic Pricing & Elasticity Report', format: 'Excel, PDF & CSV', desc: 'Surge multiplier contribution, weekend vs weekday yield analysis, and AI rates.' }
];

const exportHistory = [
  { name: 'Monthly_Revenue_Summary_Q3.xlsx', type: 'Excel (.xlsx)', date: 'Today 10:42 AM', size: '2.4 MB', status: 'Completed' },
  { name: 'Goa_Occupancy_Audit.pdf', type: 'PDF Document', date: 'Yesterday 04:15 PM', size: '1.8 MB', status: 'Completed' },
  { name: 'Raw_Booking_Logs_2026.csv', type: 'CSV Data', date: '22 Jul 2026', size: '4.1 MB', status: 'Completed' }
];

const ReportsDashboard = () => {
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleDownloadCSV = () => {
    window.open('http://localhost:5000/api/export/csv', '_blank');
    setDownloadMsg('CSV Export triggered successfully.');
    setTimeout(() => setDownloadMsg(''), 3000);
  };

  const handleDownloadExcel = () => {
    window.open('http://localhost:5000/api/export/excel', '_blank');
    setDownloadMsg('Excel Export (.xlsx) generated successfully.');
    setTimeout(() => setDownloadMsg(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* 1. Primary Reports KPI Summary Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Available Audit Reports" value={6} suffix=" Files" icon={FileText} />
        <KpiCard title="Total Excel Exports" value={142} change={14.8} icon={FileSpreadsheet} />
        <KpiCard title="Total CSV Exports" value={89} change={8.2} icon={FileCode} />
        <KpiCard title="Avg Export Size" value="2.8" suffix=" MB" icon={HardDrive} />
      </div>

      {/* 2. Full-Width Top Export Action Bar */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 shadow-md w-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <FileText size={20} className="text-[#6366F1]" /> Quick Export Action Center
            </h2>
            <p className="text-xs text-slate-400">
              Instantly generate enterprise raw datasets in Excel (.xlsx) and CSV formats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadExcel}
              className="h-[44px] px-5 rounded-[8px] bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Export Full Excel (.xlsx)
            </button>
            <button
              onClick={handleDownloadCSV}
              className="h-[44px] px-5 rounded-[8px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <FileCode size={16} />
              Export Raw CSV
            </button>
          </div>
        </div>

        {downloadMsg && (
          <div className="mt-4 p-3.5 rounded-[8px] bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} /> {downloadMsg}
          </div>
        )}
      </div>

      {/* 3. Grid of Available Executive Reports */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 shadow-md w-full">
        <ChartHeader 
          title="Available Executive Reports & Audit Files"
          subtitle="Click export to download live generated executive analytics documents"
          unitBadge="6 Reports Ready"
          statusBadge="Export Center"
          icon={FileDown}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {reportTypes.map((rep) => (
            <div key={rep.id} className="min-h-[84px] p-5 bg-[#070A12] border border-[#1E293B] rounded-[12px] flex items-center justify-between hover:border-[#6366F1]/40 transition-colors group">
              <div className="flex items-center gap-4 min-w-0 pr-4">
                <div className="p-3 rounded-[8px] bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/20 group-hover:scale-105 transition-transform flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate mb-1">{rep.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{rep.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="hidden sm:inline-block text-[10px] text-[#818CF8] font-semibold bg-[#6366F1]/10 px-2.5 py-1 rounded-full border border-[#6366F1]/20">
                  {rep.format}
                </span>
                <button
                  onClick={handleDownloadExcel}
                  className="p-2 rounded-[8px] bg-[#141C2E] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] transition-colors"
                  title="Download Report"
                >
                  <Download size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Export History Table */}
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-[12px] p-6 shadow-md w-full">
        <ChartHeader 
          title="Recent Report Export History Log"
          subtitle="Audit log of recently generated files and automated schedule exports"
          unitBadge="Log History"
          statusBadge="Audit Trail"
          icon={History}
        />

        <div className="overflow-x-auto mt-4 scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="text-[#9CA3AF] uppercase text-[10px] tracking-wider bg-[#141C2E] border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-5 font-bold">File Name</th>
                <th className="py-3 px-5 font-bold">Format</th>
                <th className="py-3 px-5 font-bold">Generated Date</th>
                <th className="py-3 px-5 font-bold">File Size</th>
                <th className="py-3 px-5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]/50 text-slate-200">
              {exportHistory.map((item, idx) => (
                <tr key={idx} className="h-[48px] hover:bg-[#141C2E]/40 transition-colors">
                  <td className="px-5 py-3 font-bold text-white">{item.name}</td>
                  <td className="px-5 py-3 text-slate-400">{item.type}</td>
                  <td className="px-5 py-3 text-slate-400">{item.date}</td>
                  <td className="px-5 py-3 text-slate-400">{item.size}</td>
                  <td className="px-5 py-3 text-right font-bold text-[#10B981]">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom AI Insights Panel */}
      <AiInsightsPanel 
        title="Report Center & Helpful Tips"
        insights={[
          "Weekly summary reports downloaded on Monday mornings are read most frequently by hotel managers.",
          "Excel (.xlsx) files are the most popular download format for checking hotel finances.",
          "Automatic CSV data downloads help accounting teams quickly update monthly financial records."
        ]}
        recommendations={[
          "Set up automatic weekly email delivery for executive revenue reports.",
          "Attach price comparison charts to monthly hotel board meeting reports.",
          "Check report download records regularly to keep data safe and organized."
        ]}
      />
    </div>
  );
};

export default ReportsDashboard;
