import React from 'react';
import { Droplet, ShieldAlert, Cpu, Award } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand & Academic Project info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">GreyWater AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-Driven Intelligent Greywater Reuse Recommendation System based on multi-parameter water quality analysis.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 font-mono">
            <Award className="w-3.5 h-3.5 text-cyan-400" /> Academic Viva Prototype
          </div>
        </div>

        {/* Col 2: Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">System Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition-colors">Home Page</button></li>
            <li><button onClick={() => setActiveTab('analyze')} className="hover:text-cyan-400 transition-colors">14-Parameter Analysis</button></li>
            <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition-colors">Project Dashboard</button></li>
            <li><button onClick={() => setActiveTab('history')} className="hover:text-cyan-400 transition-colors">Analysis History</button></li>
            <li><button onClick={() => setActiveTab('how-it-works')} className="hover:text-cyan-400 transition-colors">System Architecture & ML</button></li>
            <li><button onClick={() => setActiveTab('about')} className="hover:text-cyan-400 transition-colors">About Project Scope</button></li>
          </ul>
        </div>

        {/* Col 3: Parameters Evaluated */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Evaluated Parameters (14)</h4>
          <p className="text-xs text-slate-400">
            DO, BOD₅, COD, TDS, EC, pH, Temp, Salinity, Turbidity, DS, NH₄-N, NO₃-N, K, E. coli.
          </p>
          <div className="pt-1 flex flex-wrap gap-1 text-[10px] text-slate-400 font-mono">
            <span className="bg-slate-900 px-2 py-0.5 rounded">Physical</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded">Chemical</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded">Microbiological</span>
          </div>
        </div>

        {/* Col 4: Important Safety Notice */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Non-Potable Safety Notice</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This system evaluates suitability exclusively for <strong>non-potable applications</strong> (e.g. toilet flushing, irrigation, floor washing). Reused greywater is not safe for drinking, cooking, or personal hygiene.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 GreyWater AI Project. Designed for Final Year Engineering / Academic Viva Demonstration.</p>
        <div className="flex items-center gap-4 text-slate-400 text-xs">
          <span>React 18</span>
          <span>•</span>
          <span>TypeScript</span>
          <span>•</span>
          <span>Recharts</span>
          <span>•</span>
          <span className="text-cyan-400 flex items-center gap-1"><Cpu className="w-3 h-3" /> ML Mock API Ready</span>
        </div>
      </div>
    </footer>
  );
};
