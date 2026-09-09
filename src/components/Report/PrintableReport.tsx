import React from 'react';
import { AnalysisResult } from '../../types/waterQuality';
import { PARAMETER_CONFIGS } from '../../config/waterQualityThresholds';
import { Printer, ArrowLeft, ShieldAlert, Award } from 'lucide-react';

interface PrintableReportProps {
  result: AnalysisResult;
  onBack: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ result, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Toolbar (Hidden on print) */}
      <div className="no-print flex items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Analysis</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div id="printable-area" className="bg-slate-900 text-slate-100 p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              Academic Water Evaluation Report
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              AI-Driven Greywater Quality Analysis
            </h1>
            <p className="text-xs text-slate-400">Intelligent Non-Potable Reuse Recommendation System</p>
          </div>

          <div className="text-right space-y-1 font-mono text-xs text-slate-400 border-l sm:border-l-0 border-slate-800 pl-4 sm:pl-0">
            <div>Sample ID: <strong className="text-cyan-300">{result.sampleId}</strong></div>
            <div>Date: {new Date(result.timestamp).toLocaleString()}</div>
            <div>Status: <span className="text-emerald-400 font-bold">Evaluated</span></div>
          </div>
        </div>

        {/* Score & Classification Header Card */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono text-cyan-400 uppercase">Overall Water Quality Index</span>
            <div className="text-4xl font-extrabold text-white font-mono">{result.overallScore} / 100</div>
            <p className="text-xs text-slate-400">Multi-parameter aggregated index score</p>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Classification</span>
            <div className="text-xl font-bold text-cyan-300 px-4 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 inline-block">
              {result.classification} Quality
            </div>
            <p className="text-xs text-slate-400 mt-1">Recommended for Non-Potable Applications</p>
          </div>
        </div>

        {/* 14 Parameters Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Measured Water Quality Parameters (14)</h3>
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">No.</th>
                <th className="py-2.5 px-3">Parameter</th>
                <th className="py-2.5 px-3">Abbreviation</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {result.parameterAnalyses.map((p, i) => (
                <tr key={p.key} className="hover:bg-slate-950/40">
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{i + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{p.label}</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400 font-bold">{p.abbreviation}</td>
                  <td className="py-2.5 px-3 font-mono text-white font-bold">{p.value}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{p.unit}</td>
                  <td className="py-2.5 px-3 font-semibold text-xs">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ranked Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Ranked Non-Potable Reuse Recommendations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.rankedOptions.slice(0, 4).map((rec, i) => (
              <div key={rec.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold">#{i + 1} {rec.application}</span>
                  <span className="font-mono text-white font-bold">{rec.suitabilityScore}%</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{rec.reason}</p>
                <div className="text-[10px] text-slate-400 font-mono">Treatment: {rec.recommendedTreatment}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable AI Summary */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <h4 className="font-bold text-cyan-300 font-mono uppercase">AI Attribution Insights</h4>
          <p className="text-slate-300 leading-relaxed">
            Key factors driving this recommendation include <strong>{result.xaiFactors.map(f => f.parameterName).join(', ')}</strong>.
          </p>
        </div>

        {/* Safety Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Academic Project Disclaimer</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            This document is generated by an academic prototype recommendation engine. Reused greywater is strictly intended for <strong>non-potable categories</strong>. Final reuse decisions must strictly comply with local environmental authority standards and certified laboratory testing.
          </p>
        </div>

      </div>
    </div>
  );
};
