import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Activity } from 'lucide-react';

interface AIProcessingModalProps {
  onComplete: () => void;
}

export const AIProcessingModal: React.FC<AIProcessingModalProps> = ({ onComplete }) => {
  const steps = [
    'Collecting water-quality parameters...',
    'Validating measurements...',
    'Processing water-quality features...',
    'Evaluating parameter conditions...',
    'Assessing reuse suitability...',
    'Generating AI recommendation...'
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 text-center space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Central Spinning Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg">
            <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-cyan-400/30 animate-spin border-t-transparent pointer-events-none" />
        </div>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Neural Inference Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Processing Water Quality Model</h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Stage {currentStepIndex + 1} of {steps.length}</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2 text-left bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 max-h-48 overflow-y-auto">
          {steps.map((stepText, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs p-1.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'text-cyan-300 font-medium bg-cyan-950/60 border border-cyan-500/30'
                    : isDone
                    ? 'text-slate-400 line-through opacity-75'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 font-mono">Evaluating 14 parameters against non-potable reuse matrix...</p>
      </div>
    </div>
  );
};
