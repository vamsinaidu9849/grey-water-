import React, { useState } from 'react';
import { Cpu, Database, Droplet, Layers, Server, ShieldCheck, Sparkles, Activity, Code2, ArrowRight } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('ml-engine');

  const nodes = [
    {
      id: 'source',
      label: 'Greywater Source',
      subtitle: 'Bathroom / Shower / Laundry',
      icon: Droplet,
      desc: 'Origin of non-toilet domestic wastewater prior to treatment or disposal.'
    },
    {
      id: 'sensors',
      label: 'Water Quality Sensors & Lab',
      subtitle: '14 Parameter Measurements',
      icon: Database,
      desc: 'Physical probe sensors & lab titrations measuring DO, BOD, COD, TDS, EC, pH, Temp, Salinity, Turbidity, DS, NH4-N, NO3-N, K, E. coli.'
    },
    {
      id: 'data-coll',
      label: 'Data Collection Layer',
      subtitle: 'IoT Edge / Manual Input',
      icon: Activity,
      desc: 'Collects calibrated numerical metrics into structured JSON payload.'
    },
    {
      id: 'web-app',
      label: 'Web Application (React / Next.js)',
      subtitle: 'Interactive UI & State',
      icon: Server,
      desc: 'User interface providing 14-parameter input forms, client validation, dynamic chart rendering, and printable PDF report exports.'
    },
    {
      id: 'ml-engine',
      label: 'AI / ML Inference Engine',
      subtitle: 'Rule Engine / Python FastAPI',
      icon: Cpu,
      desc: 'Core machine-learning scoring algorithm evaluating normalized parameter features against non-potable reuse sensitivity matrices.'
    },
    {
      id: 'classification',
      label: 'Quality Classification Engine',
      subtitle: '0 - 100 Indexing',
      icon: Layers,
      desc: 'Computes overall WQ Index and assigns quality tier (Excellent, Good, Moderate, Poor, Critical).'
    },
    {
      id: 'recommendation',
      label: 'Reuse Recommendation Engine',
      subtitle: 'Non-Potable Application Rank',
      icon: Sparkles,
      desc: 'Evaluates suitability scores for 6 non-potable categories (Garden Irrigation, Toilet Flushing, Floor Cleaning, Car Wash, Construction).'
    },
    {
      id: 'xai',
      label: 'Explainable AI (XAI)',
      subtitle: 'Feature Importance & Attribution',
      icon: ShieldCheck,
      desc: 'Attributes positive & negative feature impacts to explain why specific recommendations were generated.'
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedLayer) || nodes[4];

  return (
    <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
          Academic Viva Diagram
        </span>
        <h2 className="text-3xl font-extrabold text-white">System Architecture & ML Model Design</h2>
        <p className="text-xs text-slate-400">Click on any layer node to inspect detailed technical specifications.</p>
      </div>

      {/* Interactive Diagram Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nodes.map((node, idx) => {
          const IconComp = node.icon;
          const isSelected = node.id === selectedLayer;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedLayer(node.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 transform scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">Layer #{idx + 1}</span>
              </div>
              <div className="text-xs font-bold text-white line-clamp-1">{node.label}</div>
              <div className="text-[10px] text-slate-400 font-mono line-clamp-1">{node.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{activeNode.label}</h3>
            <p className="text-xs text-cyan-400 font-mono">{activeNode.subtitle}</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-light">{activeNode.desc}</p>
      </div>

      {/* Future FastAPI ML Backend Integration Spec */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Code2 className="w-4 h-4" />
          <span>Python / FastAPI ML Backend Endpoint Specification (`POST /api/analyze`)</span>
        </div>
        <p className="text-xs text-slate-400">
          The frontend is structured to seamlessly replace the mock decision engine with a trained Scikit-Learn or XGBoost model hosted on a Python FastAPI server.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">Example Request Payload:</span>
            <pre className="text-cyan-300 text-[11px] overflow-x-auto">
{`{
  "DO": 5.2, "BOD5": 18, "COD": 65,
  "TDS": 420, "EC": 650, "pH": 7.2,
  "TEMP": 27, "SAL": 0.4, "TUR": 8,
  "DS": 400, "NH4_N": 2.0, "NO3_N": 8.0,
  "K": 15.0, "E_COLI": 100
}`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">Expected Response Format:</span>
            <pre className="text-emerald-400 text-[11px] overflow-x-auto">
{`{
  "water_quality_score": 85,
  "classification": "Good",
  "recommendations": [
    {
      "application": "Garden Irrigation",
      "suitability_score": 92,
      "confidence": 0.92
    }
  ],
  "key_factors": ["pH", "BOD5", "TUR", "E_COLI"]
}`}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
};
