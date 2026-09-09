import React from 'react';
import { Activity, ArrowRight, CheckCircle2, Cpu, Database, Droplet, Layers, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  const steps = [
    { label: 'Greywater Source', icon: Droplet, desc: 'Bathroom / Laundry' },
    { label: '14 Parameters', icon: Database, desc: 'Physical, Chemical, Bio' },
    { label: 'AI Engine', icon: Cpu, desc: 'Feature Evaluation' },
    { label: 'WQ Score', icon: Activity, desc: '0 - 100 Index' },
    { label: 'Reuse Suitability', icon: Layers, desc: 'Non-Potable Matching' },
    { label: 'Recommendation', icon: Sparkles, desc: 'Ranked Categories' },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Academic Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Final Year Engineering / Academic AI Project Prototype</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            AI-Powered Greywater <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Reuse Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Analyze greywater quality using 14 key parameters and receive intelligent recommendations for suitable non-potable reuse applications.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('analyze')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <Activity className="w-5 h-5" />
              <span>Analyze Water Quality</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 backdrop-blur-md transition-all"
            >
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Explore How It Works</span>
            </button>
          </div>
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              Visual Process Architecture
            </span>
            <h3 className="text-xl font-bold text-slate-100 mt-1">End-to-End Intelligence Pipeline</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
            {steps.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <div key={idx} className="relative group">
                  <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all text-center h-full flex flex-col items-center justify-center group-hover:bg-slate-800/70">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center mb-2.5 text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400/60 transition-all shadow-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 leading-snug">{s.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{s.desc}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-20 pointer-events-none">
                      <ArrowRight className="w-4 h-4 text-cyan-500/60 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Project Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">14</div>
            <p className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-wider">Water Quality Parameters</p>
            <p className="text-[11px] text-slate-500 mt-1">Physical, Chemical & Microbial</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">AI</div>
            <p className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-wider">Driven Analysis</p>
            <p className="text-[11px] text-slate-500 mt-1">Rule Engine & ML Architecture</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">6+</div>
            <p className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-wider">Reuse Applications</p>
            <p className="text-[11px] text-slate-500 mt-1">Irrigation, Flushing, Cleaning...</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">Smart</div>
            <p className="text-xs font-medium text-slate-300 mt-1 uppercase tracking-wider">Sustainability Decisions</p>
            <p className="text-[11px] text-slate-500 mt-1">Explainable Safety Metrics</p>
          </div>
        </div>

      </div>
    </div>
  );
};
