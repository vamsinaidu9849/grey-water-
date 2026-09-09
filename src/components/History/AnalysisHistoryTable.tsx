import React, { useState } from 'react';
import { AnalysisResult } from '../../types/waterQuality';
import { deleteAnalysisFromHistory, clearHistory } from '../../services/historyStorage';
import { Search, Filter, Trash2, Eye, Download, Calendar, Activity, ChevronLeft, ChevronRight, Award, ShieldAlert } from 'lucide-react';

interface AnalysisHistoryTableProps {
  history: AnalysisResult[];
  onUpdateHistory: (updated: AnalysisResult[]) => void;
  onSelectSample: (sample: AnalysisResult) => void;
  onViewPrintableReport: (sample: AnalysisResult) => void;
}

export const AnalysisHistoryTable: React.FC<AnalysisHistoryTableProps> = ({
  history,
  onUpdateHistory,
  onSelectSample,
  onViewPrintableReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis record?')) {
      const updated = deleteAnalysisFromHistory(id);
      onUpdateHistory(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all saved analysis history?')) {
      clearHistory();
      onUpdateHistory([]);
    }
  };

  // Filter & Search
  const filtered = history.filter((item) => {
    const matchesSearch =
      item.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.classification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.recommendations[0]?.application || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = classFilter === 'All' || item.classification === classFilter;

    return matchesSearch && matchesFilter;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') {
      return b.overallScore - a.overallScore;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Persisted Evaluations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Analysis History</h1>
          <p className="text-xs text-slate-400">Review, filter, view details, and export saved greywater quality evaluation reports.</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Sample ID, classification..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Classification:</span>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-white px-3 py-1.5 focus:outline-none"
            >
              <option value="All">All Quality Classes</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Moderate">Moderate</option>
              <option value="Poor">Poor</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-white px-3 py-1.5 focus:outline-none"
            >
              <option value="date">Most Recent Date</option>
              <option value="score">Highest WQ Score</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main History Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        {paginated.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Activity className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No analysis records found.</p>
            <p className="text-xs text-slate-500">Run a new water quality analysis to save items to your history log.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Sample ID</th>
                  <th className="py-3 px-4">Quality Score</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Best Non-Potable Reuse</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginated.map((item) => {
                  const best = item.recommendations[0];
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-300">{item.sampleId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                        {item.overallScore} / 100
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {item.classification}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {best?.application || 'Garden Irrigation'}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                        {best?.confidence || 92}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-emerald-400 font-semibold">Evaluated</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectSample(item)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition-all"
                            title="View Sample Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewPrintableReport(item)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-800 hover:border-teal-500/40 transition-all"
                            title="Download PDF Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 transition-all"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span>Showing Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
