import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download, Table as TableIcon } from 'lucide-react';

/**
 * Reusable Enterprise Data Table Component.
 * Clean, compact, non-clumsy layout with search, sorting, pagination, and export.
 */
const DataTable = ({
  columns = [],
  data = [],
  title = "Property Performance Table",
  pageSize = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = data.map(r => columns.map(c => JSON.stringify(r[c.accessor] ?? '')).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0E1422] border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md w-full">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <TableIcon size={15} />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search table..."
              className="bg-[#141C2E] border border-slate-700/60 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 w-36 sm:w-48 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Export Action */}
          <button
            onClick={handleExportCSV}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all flex items-center gap-1"
            title="Export CSV"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1 scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="text-slate-400 uppercase text-[10px] tracking-wider sticky top-0 bg-[#141C2E] border-b border-slate-800 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={`py-2 px-3 font-semibold ${col.sortable !== false ? 'cursor-pointer hover:text-white transition-colors' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.header}</span>
                    {col.sortable !== false && <ArrowUpDown size={10} className="opacity-60" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-slate-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.accessor}
                      className={`py-2 px-3 ${col.className || ''} ${col.align === 'right' ? 'text-right font-semibold' : ''}`}
                    >
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-slate-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 mt-2">
        <div>
          Showing <span className="font-semibold text-slate-200">{sortedData.length ? (currentPage - 1) * pageSize + 1 : 0}</span>-
          <span className="font-semibold text-slate-200">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
          <span className="font-semibold text-slate-200">{sortedData.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2 font-semibold text-slate-300 text-[11px]">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
