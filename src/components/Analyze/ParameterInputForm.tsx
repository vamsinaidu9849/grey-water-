import React, { useState } from 'react';
import { PARAMETER_CONFIGS, DEMO_SAMPLE_DATA } from '../../config/waterQualityThresholds';
import { ParameterKey, WaterQualityParameters } from '../../types/waterQuality';
import { Activity, HelpCircle, RefreshCw, Sparkles, Thermometer, TestTube, Bug, Info } from 'lucide-react';

interface ParameterInputFormProps {
  onAnalyze: (params: WaterQualityParameters) => void;
}

export const ParameterInputForm: React.FC<ParameterInputFormProps> = ({ onAnalyze }) => {
  const [formData, setFormData] = useState<WaterQualityParameters>({ ...DEMO_SAMPLE_DATA });
  const [errors, setErrors] = useState<Partial<Record<ParameterKey, string>>>({});
  const [activeTooltip, setActiveTooltip] = useState<ParameterKey | null>(null);

  const handleChange = (key: ParameterKey, rawVal: string) => {
    const val = parseFloat(rawVal);
    setFormData(prev => ({
      ...prev,
      [key]: isNaN(val) ? 0 : val
    }));

    // Validation
    const cfg = PARAMETER_CONFIGS[key];
    if (isNaN(val)) {
      setErrors(prev => ({ ...prev, [key]: 'Required numeric value' }));
    } else if (val < cfg.min || val > cfg.max) {
      setErrors(prev => ({ ...prev, [key]: `Recommended bounds: ${cfg.min} - ${cfg.max} ${cfg.unit}` }));
    } else {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleLoadSample = () => {
    setFormData({ ...DEMO_SAMPLE_DATA });
    setErrors({});
  };

  const handleReset = () => {
    const resetObj: WaterQualityParameters = {
      DO: 0, BOD5: 0, COD: 0, TDS: 0, EC: 0, pH: 7.0, TEMP: 25,
      SAL: 0, TUR: 0, DS: 0, NH4_N: 0, NO3_N: 0, K: 0, E_COLI: 0
    };
    setFormData(resetObj);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  // Group parameters by section
  const physicalKeys: ParameterKey[] = ['TEMP', 'TUR', 'TDS', 'DS', 'EC', 'SAL'];
  const chemicalKeys: ParameterKey[] = ['pH', 'DO', 'BOD5', 'COD', 'NH4_N', 'NO3_N', 'K'];
  const microKeys: ParameterKey[] = ['E_COLI'];

  const renderInputField = (key: ParameterKey) => {
    const cfg = PARAMETER_CONFIGS[key];
    const val = formData[key];
    const errorMsg = errors[key];

    return (
      <div key={key} className="space-y-1.5 relative">
        <div className="flex items-center justify-between">
          <label htmlFor={`input-${key}`} className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span>{cfg.label}</span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/20">
              {cfg.abbreviation}
            </span>
          </label>
          
          <button
            type="button"
            onMouseEnter={() => setActiveTooltip(key)}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
            className="text-slate-500 hover:text-cyan-400 focus:outline-none"
            aria-label={`Tooltip for ${cfg.label}`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tooltip Popup */}
        {activeTooltip === key && (
          <div className="absolute z-30 left-0 top-7 w-64 p-3 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-2xl text-xs text-slate-300 space-y-1 backdrop-blur-md">
            <p className="font-semibold text-cyan-300">{cfg.label} ({cfg.unit})</p>
            <p className="text-[11px] text-slate-300">{cfg.description}</p>
            <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">{cfg.helperText}</p>
          </div>
        )}

        <div className="relative rounded-xl overflow-hidden">
          <input
            id={`input-${key}`}
            type="number"
            step={cfg.step}
            min={cfg.min}
            max={cfg.max}
            value={val}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-slate-900/90 border ${
              errorMsg ? 'border-amber-500/80 focus:ring-amber-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
            } rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-1 transition-all`}
            placeholder={`Enter ${cfg.abbreviation}`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
            {cfg.unit}
          </div>
        </div>

        {/* Special visual slider scale for pH */}
        {key === 'pH' && (
          <div className="pt-1 space-y-1">
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-teal-400 to-purple-600 relative overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 w-1.5 bg-white border border-slate-900 shadow-md transform -translate-x-1/2"
                style={{ left: `${Math.min(100, Math.max(0, (val / 14) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>0 (Acidic)</span>
              <span className="text-cyan-300 font-bold">7.0 (Neutral)</span>
              <span>14 (Alkaline)</span>
            </div>
          </div>
        )}

        {errorMsg ? (
          <p className="text-[10px] text-amber-400 font-medium">{errorMsg}</p>
        ) : (
          <p className="text-[10px] text-slate-400 line-clamp-1">{cfg.helperText}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>14-Parameter Evaluation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Greywater Water Quality Analysis
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Enter the measured water-quality parameters to evaluate non-potable greywater reuse suitability.
        </p>
      </div>

      {/* Top Quick Actions Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Need sample values to test the system? Click <strong>Load Sample Data</strong> to populate realistic measurements.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-semibold text-xs transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Data</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Physical Parameters */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Section 1 — Physical Parameters</h3>
                <p className="text-xs text-slate-400">Temperature, Turbidity, TDS, Dissolved Solids, Conductivity, Salinity</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">
              6 Parameters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {physicalKeys.map(renderInputField)}
          </div>
        </div>

        {/* Section 2: Chemical Parameters */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <TestTube className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Section 2 — Chemical Parameters</h3>
                <p className="text-xs text-slate-400">pH, DO, BOD₅, COD, NH₄-N, NO₃-N, Potassium</p>
              </div>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-950 px-2.5 py-1 rounded-full border border-teal-500/30">
              7 Parameters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {chemicalKeys.map(renderInputField)}
          </div>
        </div>

        {/* Section 3: Microbiological Parameter */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Section 3 — Microbiological Parameter</h3>
                <p className="text-xs text-slate-400">Biological pathogen load indicator</p>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-500/30">
              1 Parameter
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {microKeys.map(renderInputField)}
          </div>
        </div>

        {/* Form Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-lg shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <Activity className="w-6 h-6" />
            <span>Analyze Water Quality</span>
          </button>
        </div>

      </form>

    </div>
  );
};
