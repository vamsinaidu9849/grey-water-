import React from 'react';
import { Droplet, AlertTriangle, ShieldCheck, ShowerHead, WashingMachine, RefreshCcw } from 'lucide-react';

export const AboutGreywater: React.FC = () => {
  return (
    <section className="py-12 bg-slate-900/40 border-y border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Droplet className="w-3.5 h-3.5" />
              <span>Greywater Fundamentals</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              What is Greywater?
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-light">
              <strong className="text-cyan-300 font-semibold">Greywater</strong> is wastewater generated from sources such as bathrooms, wash basins, showers, and laundry, excluding toilet wastewater and other highly contaminated sources.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Unlike blackwater (toilet sewage containing high pathogen loads), greywater contains lower nitrogen and organic levels. However, because its composition varies significantly depending on soaps, detergents, body oils, and biological residues, <strong className="text-slate-200">intelligent water quality analysis is essential</strong> prior to any non-potable reuse.
            </p>

            {/* Source Badges */}
            <div className="pt-2 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <ShowerHead className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Showers & Baths</div>
                  <div className="text-[10px] text-slate-500">Soaps & Oils</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <Droplet className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Wash Basins</div>
                  <div className="text-[10px] text-slate-500">Handwashing</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <WashingMachine className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Laundry Wash</div>
                  <div className="text-[10px] text-slate-500">Surfactants & Lint</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Safety Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3 text-cyan-300 font-bold text-lg border-b border-slate-800 pb-3">
                <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
                <span>Why Analysis is Critical Before Reuse</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span><strong>Prevents Equipment Damage:</strong> High TDS, Salinity, or Turbidity cause pipe scaling, clogging, and pump erosion.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span><strong>Protects Soil & Plants:</strong> Excess salinity or alkaline pH degrades soil structure and harms sensitive vegetation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span><strong>Ensures Public Health Safety:</strong> Microbiological monitoring (E. coli) prevents biohazard exposure in toilet flushing or surface cleaning.</span>
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Strict Safety Boundary:</strong> Never reuse untreated greywater for drinking, food preparation, or personal bathing.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
