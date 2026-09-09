import React, { useState } from 'react';
import { PARAMETER_CONFIGS, DEMO_SAMPLE_DATA } from '../../config/waterQualityThresholds';
import { ParameterKey, WaterQualityParameters } from '../../types/waterQuality';
import { Activity, HelpCircle, RefreshCw, Sparkles, Thermometer, TestTube, Bug, Info } from 'lucide-react';

interface ParameterInputFormProps {
  onAnalyze: (params: WaterQualityParameters) => void;
  onAnalyzeDataset?: (rows: WaterQualityParameters[]) => void;
}

const DATASET_KEY_ALIASES: Record<string, string[]> = {
  DO: ['DO', 'DISSOLVED_OXYGEN'],
  BOD5: ['BOD5', 'BOD_5', 'BIOCHEMICAL_OXYGEN_DEMAND'],
  COD: ['COD', 'CHEMICAL_OXYGEN_DEMAND'],
  TDS: ['TDS', 'TOTAL_DISSOLVED_SOLIDS'],
  EC: ['EC', 'ECOND', 'COND', 'CONDUCTIVITY'],
  pH: ['PH', 'PH_VALUE', 'PH_LEVEL'],
  TEMP: ['TEMP', 'TEMPERATURE'],
  SAL: ['SAL', 'SALINITY'],
  TUR: ['TUR', 'TURBIDITY'],
  DS: ['DS', 'DISSOLVED_SOLIDS'],
  NH4_N: ['NH4_N', 'NH4', 'AMMONIUM', 'AMMONIUM_AMMONIA'],
  NO3_N: ['NO3_N', 'NO3', 'NITRATE'],
  K: ['K', 'POTASSIUM'],
  E_COLI: ['E_COLI', 'ECOLI', 'E_COLI_CFU_100_ML', 'ECOLI_CFU_100_ML']
};

const REQUIRED_DATASET_KEYS: ParameterKey[] = [
  'DO', 'BOD5', 'COD', 'TDS', 'EC', 'pH', 'TEMP', 'SAL', 'TUR', 'DS', 'NH4_N', 'NO3_N', 'K', 'E_COLI'
];

const normalizeHeader = (value: string): string =>
  value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const normalizeDatasetValue = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseCsvRows = (text: string): WaterQualityParameters[] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentValue += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') {
        i += 1;
      }
      currentRow.push(currentValue);
      if (currentRow.some((cell) => cell.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += ch;
  }

  if (currentValue || currentRow.length) {
    currentRow.push(currentValue);
    if (currentRow.some((cell) => cell.trim() !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) {
    throw new Error('CSV file must include a header row and at least one data row.');
  }

  const [headerRow, ...dataRows] = rows;
  const headerMap = new Map<string, number>();

  headerRow.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    let matchedKey: string | null = null;

    Object.entries(DATASET_KEY_ALIASES).forEach(([key, aliases]) => {
      if (matchedKey) return;
      if (aliases.some((alias) => alias === normalized || alias === normalized.replace(/_+/g, ''))) {
        matchedKey = key;
      }
    });

    if (!matchedKey) {
      const fallback = normalized.replace(/_VALUE|_LEVEL|_MG_L|_CFU_100_ML|_PPT|_NTU|_C|_US_CM|_MS_CM|_PPM|_G_L$/g, '');
      if (fallback) {
        Object.keys(DATASET_KEY_ALIASES).forEach((key) => {
          if (matchedKey) return;
          const aliases = DATASET_KEY_ALIASES[key];
          if (aliases.some((alias) => alias === fallback || alias === normalized)) {
            matchedKey = key;
          }
        });
      }
    }

    if (matchedKey) {
      headerMap.set(matchedKey, index);
    }
  });

  const missingKeys = REQUIRED_DATASET_KEYS.filter((key) => !headerMap.has(key));
  const requiredPresent = REQUIRED_DATASET_KEYS.some((key) => headerMap.has(key));
  if (!requiredPresent) {
    throw new Error(`CSV is missing these required columns: ${REQUIRED_DATASET_KEYS.join(', ')}`);
  }

  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ''))
    .map((row) => {
      const record = {} as Record<string, number>;
      REQUIRED_DATASET_KEYS.forEach((key) => {
        const index = headerMap.get(key);
        const rawValue = typeof index === 'number' ? row[index] ?? '' : '';
        const parsedValue = normalizeDatasetValue(rawValue);
        record[key] = index !== undefined && row[index] !== undefined && String(row[index]).trim() !== ''
          ? parsedValue
          : PARAMETER_CONFIGS[key].defaultValue;
      });

      if (missingKeys.length) {
        missingKeys.forEach((key) => {
          record[key] = PARAMETER_CONFIGS[key].defaultValue;
        });
      }

      return {
        DO: record.DO,
        BOD5: record.BOD5,
        COD: record.COD,
        TDS: record.TDS,
        EC: record.EC,
        pH: record.pH,
        TEMP: record.TEMP,
        SAL: record.SAL,
        TUR: record.TUR,
        DS: record.DS,
        NH4_N: record.NH4_N,
        NO3_N: record.NO3_N,
        K: record.K,
        E_COLI: record.E_COLI
      } as WaterQualityParameters;
    });
};

export const ParameterInputForm: React.FC<ParameterInputFormProps> = ({ onAnalyze, onAnalyzeDataset }) => {
  const [formData, setFormData] = useState<WaterQualityParameters>({ ...DEMO_SAMPLE_DATA });
  const [errors, setErrors] = useState<Partial<Record<ParameterKey, string>>>({});
  const [activeTooltip, setActiveTooltip] = useState<ParameterKey | null>(null);
  const [datasetError, setDatasetError] = useState<string>('');

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

  const handleDatasetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const rows = parseCsvRows(text);
        if (!rows.length) {
          throw new Error('No valid data rows were found in the CSV file.');
        }
        if (onAnalyzeDataset) {
          onAnalyzeDataset(rows);
        }
        setDatasetError('');
      } catch (error) {
        setDatasetError(error instanceof Error ? error.message : 'The uploaded dataset could not be processed.');
      }
    };

    reader.onerror = () => {
      setDatasetError('The CSV file could not be read. Please try a different file.');
    };

    reader.readAsText(file);
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

      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 mb-8 bg-cyan-500/5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Dataset upload</p>
            <h2 className="mt-1 text-xl font-bold text-white">Analyze a CSV dataset automatically</h2>
          </div>

          <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Upload CSV Dataset</span>
            <input type="file" accept=".csv" onChange={handleDatasetUpload} className="hidden" />
          </label>
        </div>

        <p className="mt-3 text-xs text-slate-300">
          Required CSV columns: DO, BOD5, COD, TDS, EC, pH, TEMP, SAL, TUR, DS, NH4_N, NO3_N, K, E_COLI.
        </p>

        {datasetError && (
          <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{datasetError}</p>
        )}
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
