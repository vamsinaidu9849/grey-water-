import React from 'react';
import { Droplet, Recycle, BrainCircuit, BarChart3 } from 'lucide-react';

export const WhyReuse: React.FC = () => {
  const features = [
    {
      title: 'Water Conservation',
      desc: 'Reduce demand for freshwater by reusing suitable greywater in non-potable domestic and industrial tasks.',
      icon: Droplet,
      gradient: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400'
    },
    {
      title: 'Sustainable Water Management',
      desc: 'Promote efficient water usage, lower municipal treatment energy, and mitigate urban water scarcity.',
      icon: Recycle,
      gradient: 'from-teal-500/20 to-emerald-500/10',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400'
    },
    {
      title: 'Intelligent Decision Making',
      desc: 'Use multi-parameter water-quality data to scientifically determine matched reuse applications.',
      icon: BarChart3,
      gradient: 'from-emerald-500/20 to-cyan-500/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    {
      title: 'AI-Based Recommendations',
      desc: 'Transform 14 complex measured parameters into transparent, ranked, and explainable recommendations.',
      icon: BrainCircuit,
      gradient: 'from-blue-500/20 to-teal-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    }
  ];

  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
            Core Project Value
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Why Intelligent Greywater Reuse?
          </h2>
          <p className="text-slate-400 text-sm">
            Merging environmental engineering with artificial intelligence to maximize non-potable water recycling safety and efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const IconComp = f.icon;
            return (
              <div
                key={i}
                className={`glass-panel p-6 rounded-2xl border ${f.borderColor} bg-gradient-to-b ${f.gradient} hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${f.iconColor}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
