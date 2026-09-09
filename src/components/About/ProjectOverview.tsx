import React from 'react';
import { Target, AlertCircle, Cpu, Wifi, Smartphone, Cloud, LineChart, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProjectOverview: React.FC = () => {
  const objectives = [
    'Analyze greywater quality using 14 key physical, chemical, and biological parameters.',
    'Use multiple water-quality parameters to construct a unit-independent evaluation index.',
    'Develop an AI-driven analysis framework for automated feature extraction.',
    'Classify water quality into Excellent, Good, Moderate, Poor, or Critical tiers.',
    'Recommend suitable non-potable reuse applications (irrigation, flushing, cleaning, construction).',
    'Provide explainable AI (XAI) feature attribution breakdown.',
    'Support sustainable urban water management and municipal freshwater conservation.'
  ];

  const futureScope = [
    { title: 'IoT Water-Quality Sensors', desc: 'Direct wireless hardware integration with physical probes for automated sampling.', icon: Wifi },
    { title: 'Real-Time Monitoring', desc: 'Continuous telemetry streams and automated threshold alerts for storage tanks.', icon: LineChart },
    { title: 'Cloud Database', desc: 'Centralized cloud data warehouse storing multi-region greywater quality analytics.', icon: Cloud },
    { title: 'Mobile Application', desc: 'Cross-platform iOS / Android mobile application for field engineers and facility managers.', icon: Smartphone },
    { title: 'Trained Machine-Learning Models', desc: 'Deep learning & ensemble models trained on extensive empirical greywater datasets.', icon: Cpu },
    { title: 'Predictive Water Analysis', desc: 'Time-series forecasting to predict quality degradation during long-term storage.', icon: Sparkles }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Target className="w-3.5 h-3.5" />
          <span>Academic Project Scope</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About the Project
        </h1>
        <p className="text-sm text-slate-300">
          AI-Driven Intelligent Greywater Reuse Recommendation System Based on Water Quality Analysis
        </p>
      </div>

      {/* Problem Statement & Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Problem Statement Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Problem Statement</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Traditional greywater reuse decisions can be difficult because water quality varies depending on its source and composition. Without systematic evaluation, reusing untreated or improperly treated greywater poses risks of equipment corrosion, soil damage, microbial hazards, and severe plumbing scaling.
          </p>

          <p className="text-xs text-slate-300 leading-relaxed font-light">
            A data-driven intelligent system can help analyze multiple water-quality parameters simultaneously, classify overall water health, and provide understandable, safe non-potable reuse recommendations.
          </p>
        </div>

        {/* Objectives Card */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Project Objectives</h2>
          </div>

          <div className="space-y-2.5">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{obj}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Future Scope Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            Roadmap & Expansion
          </span>
          <h2 className="text-3xl font-extrabold text-white">Future Scope & Deployment</h2>
          <p className="text-xs text-slate-400">Emerging capabilities planned for future commercial and municipal expansion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureScope.map((fs, i) => {
            const IconComp = fs.icon;
            return (
              <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{fs.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{fs.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
