export interface WaterQualityParameters {
  DO: number;      // Dissolved Oxygen (mg/L)
  BOD5: number;    // Biochemical Oxygen Demand (mg/L)
  COD: number;     // Chemical Oxygen Demand (mg/L)
  TDS: number;     // Total Dissolved Solids (mg/L)
  EC: number;      // Conductivity (µS/cm)
  pH: number;      // pH (-)
  TEMP: number;    // Temperature (°C)
  SAL: number;     // Salinity (ppt)
  TUR: number;     // Turbidity (NTU)
  DS: number;      // Dissolved Solids (mg/L)
  NH4_N: number;   // Ammonium / Ammonia (mg/L)
  NO3_N: number;   // Nitrate (mg/L)
  K: number;       // Potassium (mg/L)
  E_COLI: number;  // E. coli (CFU/100 mL)
}

export type ParameterKey = keyof WaterQualityParameters;

export type ParameterSection = 'physical' | 'chemical' | 'microbiological';

export interface ParameterConfig {
  key: ParameterKey;
  label: string;
  abbreviation: string;
  unit: string;
  section: ParameterSection;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description: string;
  helperText: string;
  optimalRange: [number, number]; // [min_ideal, max_ideal]
  warningRange: [number, number]; // [min_warn, max_warn]
  direction: 'higher_better' | 'lower_better' | 'range';
}

export type ParameterStatus = 'Good' | 'Warning' | 'Critical' | 'Informational';
export type QualityClassification = 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';

export interface ParameterAnalysis {
  key: ParameterKey;
  label: string;
  abbreviation: string;
  value: number;
  unit: string;
  status: ParameterStatus;
  normalizedScore: number; // 0 - 100
  impact: 'Positive' | 'Neutral' | 'Warning' | 'High Impact' | 'Critical Impact';
  recommendation: string;
}

export type NonPotableApplication = 
  | 'Toilet Flushing'
  | 'Garden Irrigation'
  | 'Floor Cleaning'
  | 'Car Washing'
  | 'Construction Applications'
  | 'Other Non-Potable Uses';

export interface ReuseRecommendationResult {
  id: string;
  application: NonPotableApplication;
  suitabilityScore: number; // 0 - 100%
  confidence: number; // 0 - 100%
  status: 'Highly Suitable' | 'Suitable with Treatment' | 'Conditionally Suitable' | 'Not Recommended';
  reason: string;
  recommendedTreatment: string;
  rank: number;
  iconName: string;
}

export interface XAIFactor {
  parameterKey: ParameterKey;
  parameterName: string;
  abbreviation: string;
  value: number;
  unit: string;
  influenceLevel: 'High' | 'Medium' | 'Low';
  influenceScore: number; // 0 - 100
  direction: 'Positive' | 'Negative';
  explanation: string;
}

export interface TreatmentConsideration {
  title: string;
  category: 'Physical' | 'Biological' | 'Disinfection' | 'Advanced';
  description: string;
  targetParameters: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface DatasetAnalysisSummary {
  rowCount: number;
  averageScore: number;
  classification: QualityClassification;
  parameterAverages: Partial<Record<ParameterKey, number>>;
  bestApplication: string;
}

export interface AnalysisResult {
  id: string;
  sampleId: string;
  timestamp: string;
  parameters: WaterQualityParameters;
  overallScore: number; // 0 - 100
  classification: QualityClassification;
  parameterAnalyses: ParameterAnalysis[];
  recommendations: ReuseRecommendationResult[];
  rankedOptions: ReuseRecommendationResult[];
  xaiFactors: XAIFactor[];
  treatmentConsiderations: TreatmentConsideration[];
  summary: string;
  datasetSummary?: DatasetAnalysisSummary;
  analysisMode?: 'single' | 'dataset';
}
