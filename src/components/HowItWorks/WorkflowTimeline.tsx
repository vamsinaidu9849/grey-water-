import React from 'react';
import { Droplet, TestTube, Edit3, Cpu, Layers, Sparkles, CheckCircle2, ArrowDown } from 'lucide-react';

export const WorkflowTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Step 1 — Collect Water Sample',
      desc: 'Greywater is collected from an appropriate source such as bathroom wash basins, shower runoffs, or laundry rinse cycles.',
      icon: Droplet,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      num: '02',
      title: 'Step 2 — Measure Water Quality',
      desc: 'The 14 parameters (DO, BOD₅, COD, TDS, EC, pH, Temp, Salinity, Turbidity, DS, NH₄-N, NO₃-N, K, E. coli) are measured using calibrated sensors or laboratory test kits.',
      icon: TestTube,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10'
    },
    {
      num: '03',
      title: 'Step 3 — Enter Data',
      desc: 'Measurements are entered into the application form with numeric validation and range tooltips.',
      icon: Edit3,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      num: '04',
      title: 'Step 4 — Data Processing',
      desc: 'The system validates parameters, handles boundary checks, and normalizes physical, chemical, and biological features onto a unit-independent scale.',
      icon: Cpu,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      num: '05',
      title: 'Step 5 — AI Analysis',
      desc: 'The AI / ML evaluation engine calculates the Overall Water Quality Index (0-100) and classifies quality into Excellent, Good, Moderate, Poor, or Critical.',
      icon: Cpu,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      num: '06',
      title: 'Step 6 — Reuse Assessment',
      desc: 'Potential non-potable applications (irrigation, toilet flushing, floor washing, car wash, construction) are evaluated against sensitivity criteria.',
      icon: Layers,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      num: '07',
      title: 'Step 7 — Recommendation & XAI',
      desc: 'The system provides ranked suitability scores, confidence metrics, explainable AI factor attributions, and suggested treatment steps.',
      icon: Sparkles,
      color: 'text-cyan-300',
      bg: 'bg-cyan-400/10'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
          Step-by-Step Methodology
        </span>
        <h2 className="text-3xl font-extrabold text-white">How the System Works</h2>
        <p className="text-xs text-slate-400">From raw greywater sampling to intelligent AI recommendation delivery.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {steps.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="relative">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-start gap-5 hover:border-cyan-500/30 transition-all">
                <div className={`w-12 h-12 rounded-xl ${s.bg} border border-slate-800 flex items-center justify-center font-mono font-bold text-lg ${s.color} shrink-0`}>
                  {s.num}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <IconComp className={`w-4 h-4 ${s.color}`} />
                    <h3 className="text-base font-bold text-white">{s.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{s.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-4 h-4 text-cyan-500/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
