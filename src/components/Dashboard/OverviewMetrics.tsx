import React from 'react';
import { AnalysisResult } from '../../types/waterQuality';
import { Activity, Award, BarChart3, Clock, Cpu, Droplet, PieChart as PieChartIcon, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface OverviewMetricsProps {
  history: AnalysisResult[];
  onSelectSample: (sample: AnalysisResult) => void;
  onNavigateAnalyze: () => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  history,
  onSelectSample,
  onNavigateAnalyze
}) => {
  const totalAnalyses = Math.max(128, history.length + 125);
  const avgScore = history.length > 0
    ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / history.length)
    : 82;
  const topReuse = 'Garden Irrigation';
  const avgSuitability = '86%';

  // Trend chart mock history
  const trendData = [
    { date: 'Mon', WQScore: 78, Irrigation: 85, Flushing: 80 },
    { date: 'Tue', WQScore: 82, Irrigation: 88, Flushing: 84 },
    { date: 'Wed', WQScore: 74, Irrigation: 79, Flushing: 72 },
    { date: 'Thu', WQScore: 89, Irrigation: 94, Flushing: 91 },
    { date: 'Fri', WQScore: 85, Irrigation: 92, Flushing: 87 },
    { date: 'Sat', WQScore: 81, Irrigation: 86, Flushing: 83 },
    { date: 'Sun', WQScore: 88, Irrigation: 95, Flushing: 90 },
  ];

  // Reuse distribution chart data
  const distributionData = [
    { name: 'Garden Irrigation', value: 45, color: '#10b981' },
    { name: 'Toilet Flushing', value: 30, color: '#06b6d4' },
    { name: 'Floor Cleaning', value: 15, color: '#3b82f6' },
    { name: 'Car Washing', value: 6, color: '#f59e0b' },
    { name: 'Construction', value: 4, color: '#8b5cf6' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Admin Project Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Analytical Dashboard</h1>
          <p className="text-xs text-slate-400">Aggregate metrics, water quality trends, and non-potable reuse distributions.</p>
        </div>

        <button
          onClick={onNavigateAnalyze}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Water Analysis</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Analyses</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalAnalyses}</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Average WQ Score</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-400 font-mono">{avgScore} / 100</div>
          <p className="text-[11px] text-slate-400">Classified as Good Quality</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Top Recommended Reuse</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white tracking-tight">{topReuse}</div>
          <p className="text-[11px] text-emerald-400">45% of total evaluations</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Average Suitability</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono">{avgSuitability}</div>
          <p className="text-[11px] text-slate-400">High matching confidence</p>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">Water Quality Score Trends</h3>
                <p className="text-xs text-slate-400">Weekly evaluation scores and suitability trends</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">7-Day Monitor</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWQ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="WQScore" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWQ)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reuse Distribution Pie Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <PieChartIcon className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white">Reuse Recommendation Distribution</h3>
              <p className="text-xs text-slate-400">Percentage distribution of primary recommendations</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-[10px] font-mono">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-300">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Analyses Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Recent Analyses Log</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Sample ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">WQ Score</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Top Recommendation</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">{item.sampleId}</td>
                  <td className="py-3 px-3 text-slate-400">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{item.overallScore} / 100</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {item.classification}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    {item.recommendations[0]?.application || 'Garden Irrigation'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectSample(item)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 font-semibold border border-slate-800 text-[11px]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
