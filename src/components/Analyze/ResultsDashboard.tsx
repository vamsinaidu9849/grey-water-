import React, { useState } from 'react';
import { AnalysisResult, ParameterAnalysis } from '../../types/waterQuality';
import {
  Activity, Award, CheckCircle2, AlertTriangle, AlertCircle, Info, Download,
  Save, ArrowLeft, Cpu, ShieldAlert, Sparkles, Sprout, Droplet, Car, Building2,
  Layers, Filter, ChevronRight, BarChart3, PieChart as PieChartIcon, Check
} from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie
} from 'recharts';
import { saveAnalysisToHistory } from '../../services/historyStorage';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onViewPrintableReport: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onReset,
  onViewPrintableReport
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveAnalysisToHistory(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Color mappings
  const getClassificationColor = (cls: string) => {
    switch (cls) {
      case 'Excellent': return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', fill: '#10b981' };
      case 'Good': return { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/40', fill: '#06b6d4' };
      case 'Moderate': return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', fill: '#f59e0b' };
      case 'Poor': return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/40', fill: '#f97316' };
      default: return { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/40', fill: '#ef4444' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Good': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><CheckCircle2 className="w-3 h-3" /> Good</span>;
      case 'Warning': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30"><AlertTriangle className="w-3 h-3" /> Warning</span>;
      case 'Critical': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30"><AlertCircle className="w-3 h-3" /> Critical</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30"><Info className="w-3 h-3" /> Info</span>;
    }
  };

  const classStyle = getClassificationColor(result.classification);

  // Data for Radar Chart (Normalized scores across 14 parameters)
  const radarData = result.parameterAnalyses.map(p => ({
    subject: p.abbreviation,
    score: p.normalizedScore,
    fullMark: 100
  }));

  // Data for Bar Chart
  const barData = result.parameterAnalyses.map(p => ({
    name: p.abbreviation,
    Score: p.normalizedScore,
    fullName: p.label
  }));

  // Status Distribution Pie Data
  const statusCounts = {
    Good: result.parameterAnalyses.filter(p => p.status === 'Good').length,
    Warning: result.parameterAnalyses.filter(p => p.status === 'Warning').length,
    Critical: result.parameterAnalyses.filter(p => p.status === 'Critical').length,
    Informational: result.parameterAnalyses.filter(p => p.status === 'Informational').length
  };

  const pieData = [
    { name: 'Good', value: statusCounts.Good, color: '#10b981' },
    { name: 'Warning', value: statusCounts.Warning, color: '#f59e0b' },
    { name: 'Critical', value: statusCounts.Critical, color: '#ef4444' },
    { name: 'Informational', value: statusCounts.Informational, color: '#3b82f6' }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Action Bar & Back Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>New Analysis</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>Sample ID: <strong className="text-cyan-300">{result.sampleId}</strong></span>
          <span>•</span>
          <span>Date: {new Date(result.timestamp).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSave}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs border transition-all ${
              saved
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-cyan-400" />}
            <span>{saved ? 'Saved to History' : 'Save Result'}</span>
          </button>

          <button
            onClick={onViewPrintableReport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Large Circular Score Gauge */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-cyan-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden space-y-4">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
            Overall Water Quality Score
          </span>

          {/* Circular Gauge Visualization */}
          <div className="relative w-48 h-48 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-slate-900"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth="10"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * result.overallScore) / 100}
                strokeLinecap="round"
                stroke={classStyle.fill}
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-white font-mono">{result.overallScore}</span>
              <span className="text-xs font-mono text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${classStyle.bg} ${classStyle.text} ${classStyle.border}`}>
              {result.classification} Quality
            </div>
            <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">
              Dynamic multi-parameter index calculated from 14 physical, chemical, and biological features.
            </p>
          </div>
        </div>

        {/* Right: Quick Highlights & Summary */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Executive Analysis Summary</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {result.summary}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-bold text-emerald-400 font-mono">{statusCounts.Good}</div>
              <div className="text-[10px] text-slate-400">Parameters Good</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-bold text-amber-400 font-mono">{statusCounts.Warning}</div>
              <div className="text-[10px] text-slate-400">Warnings</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-bold text-red-400 font-mono">{statusCounts.Critical}</div>
              <div className="text-[10px] text-slate-400">Critical Parameters</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-bold text-cyan-400 font-mono">{result.recommendations.length}</div>
              <div className="text-[10px] text-slate-400">Reuse Categories</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2.5">
            <Award className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Top Matched Non-Potable Category: <strong>{result.rankedOptions[0]?.application} ({result.rankedOptions[0]?.suitabilityScore}%)</strong></span>
          </div>
        </div>

      </div>

      {/* SECTION: 14 PARAMETER STATUS TABLE */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>14 Parameter Status Assessment</span>
            </h3>
            <p className="text-xs text-slate-400">Measured values compared against standard non-potable operational limits</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Abbr.</th>
                <th className="py-3 px-4">Measured Value</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4">Impact Rating</th>
                <th className="py-3 px-4">Normalized Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {result.parameterAnalyses.map((p) => (
                <tr key={p.key} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">{p.label}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{p.abbreviation}</td>
                  <td className="py-3 px-4 font-mono text-white font-bold">{p.value}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{p.unit}</td>
                  <td className="py-3 px-4">{getStatusBadge(p.status)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-medium ${
                      p.impact === 'Critical Impact' ? 'text-red-400' :
                      p.impact === 'Warning' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {p.impact}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.normalizedScore >= 80 ? 'bg-emerald-400' :
                            p.normalizedScore >= 50 ? 'bg-amber-400' : 'bg-red-500'
                          }`}
                          style={{ width: `${p.normalizedScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-slate-300">{p.normalizedScore}/100</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: RECHARTS INTERACTIVE VISUALIZATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Profile Chart */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <PieChartIcon className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white">Water Quality Radar Profile</h3>
              <p className="text-xs text-slate-400">Relative performance across all 14 parameters (0-100 normalized scale)</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Water Quality" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Overview */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Normalized Parameter Scores</h3>
              <p className="text-xs text-slate-400">0–100 normalized values for unit-independent comparison</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} angle={-35} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                />
                <Bar dataKey="Score" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Score >= 80 ? '#10b981' : entry.Score >= 50 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SECTION: AI REUSE RECOMMENDATION & SUITABILITY MATRIX */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            Intelligent Matching
          </span>
          <h2 className="text-3xl font-extrabold text-white">AI-Driven Reuse Recommendations</h2>
          <p className="text-xs text-slate-400">
            Evaluated suitability across 6 standard <strong>non-potable greywater categories</strong> based on water quality features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`glass-panel p-6 rounded-3xl border ${
                rec.suitabilityScore >= 85 ? 'border-emerald-500/40 bg-emerald-950/10' :
                rec.suitabilityScore >= 70 ? 'border-cyan-500/30 bg-cyan-950/10' :
                'border-amber-500/30 bg-amber-950/10'
              } space-y-4 flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    Rank #{rec.rank}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    rec.status === 'Highly Suitable' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    rec.status === 'Suitable with Treatment' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {rec.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{rec.application}</h3>

                {/* Score & Confidence */}
                <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <div>
                    <div className="text-2xl font-extrabold text-white font-mono">{rec.suitabilityScore}%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Suitability Score</div>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div>
                    <div className="text-lg font-bold text-cyan-400 font-mono">{rec.confidence}%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">AI Confidence</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rec.reason}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200">Recommended Treatment:</span>
                <p className="text-[11px] text-cyan-300 font-mono">{rec.recommendedTreatment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: RANKED LEADERBOARD */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Best Non-Potable Reuse Options Leaderboard</span>
        </h3>

        <div className="space-y-3">
          {result.rankedOptions.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-xl bg-slate-800 font-mono font-extrabold text-cyan-400 flex items-center justify-center shrink-0">
                  #{idx + 1}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{item.application}</span>
                    <span className="font-mono text-cyan-400">{item.suitabilityScore}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                      style={{ width: `${item.suitabilityScore}%` }}
                    />
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: EXPLAINABLE AI (XAI) */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Why Did the AI Make This Recommendation?</h3>
            <p className="text-xs text-slate-400">Explainable AI (XAI) feature attribution breakdown</p>
          </div>
        </div>

        {/* Pipeline graphic */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-[10px] font-mono text-slate-300">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">Water Inputs</div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">Data Validation</div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">Feature Scaling</div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">Param Analysis</div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">Classification</div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">Suitability Matrix</div>
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">AI Result</div>
        </div>

        {/* Top Influencing Parameters */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Top Influencing Parameters</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.xaiFactors.map((xai, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{xai.parameterName} ({xai.abbreviation})</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    xai.influenceLevel === 'High' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {xai.influenceLevel} Influence
                  </span>
                </div>
                <div className="text-xs font-mono text-cyan-400">{xai.value} {xai.unit}</div>
                <p className="text-[11px] text-slate-300 leading-snug">{xai.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION: TREATMENT CONSIDERATIONS */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Filter className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Suggested Treatment Considerations</h3>
            <p className="text-xs text-slate-400 font-light">Potential physical, chemical, and biological unit operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.treatmentConsiderations.map((tc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-cyan-300">{tc.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{tc.category}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{tc.description}</p>
              <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-mono text-slate-400">
                <span>Targets:</span>
                {tc.targetParameters.map((tp, i) => (
                  <span key={i} className="bg-slate-950 px-2 py-0.5 rounded text-cyan-400">{tp}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 text-xs text-slate-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Regulatory Disclaimer:</strong> Suggested treatment considerations are provided for academic research and design evaluation purposes only. Final treatment specifications and safety validation must be conducted in compliance with applicable environmental laws and certified water quality lab testing.
          </p>
        </div>
      </div>

    </div>
  );
};
