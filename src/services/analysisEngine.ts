import { PARAMETER_CONFIGS } from '../config/waterQualityThresholds';
import {
  AnalysisResult,
  NonPotableApplication,
  ParameterAnalysis,
  ParameterKey,
  ParameterStatus,
  QualityClassification,
  ReuseRecommendationResult,
  TreatmentConsideration,
  WaterQualityParameters,
  XAIFactor
} from '../types/waterQuality';

// Parameter weights for overall WQ Score
const PARAM_WEIGHTS: Record<ParameterKey, number> = {
  E_COLI: 0.16,
  BOD5: 0.13,
  COD: 0.10,
  DO: 0.10,
  pH: 0.10,
  TUR: 0.10,
  TDS: 0.07,
  EC: 0.06,
  NH4_N: 0.05,
  NO3_N: 0.04,
  SAL: 0.03,
  DS: 0.02,
  TEMP: 0.02,
  K: 0.02
};

/**
 * Calculates normalized parameter score (0-100)
 */
function normalizeParamScore(key: ParameterKey, val: number): number {
  const cfg = PARAMETER_CONFIGS[key];
  if (!cfg) return 50;

  const [optMin, optMax] = cfg.optimalRange;
  const [warnMin, warnMax] = cfg.warningRange;

  if (cfg.direction === 'lower_better') {
    if (val <= optMax) return 100;
    if (val <= warnMax) {
      // Linear interpolation from 100 to 60
      return Math.max(60, 100 - ((val - optMax) / (warnMax - optMax)) * 40);
    }
    // Decay from 60 down to 0
    return Math.max(0, 60 - ((val - warnMax) / (cfg.max - warnMax)) * 60);
  }

  if (cfg.direction === 'higher_better') {
    if (val >= optMin) return 100;
    if (val >= warnMin) {
      return Math.max(60, 100 - ((optMin - val) / (optMin - warnMin)) * 40);
    }
    return Math.max(0, 60 - ((warnMin - val) / warnMin) * 60);
  }

  // Direction: range (e.g. pH, Temp)
  if (val >= optMin && val <= optMax) return 100;
  if (val >= warnMin && val <= warnMax) {
    if (val < optMin) {
      return Math.max(60, 100 - ((optMin - val) / (optMin - warnMin)) * 40);
    }
    return Math.max(0, 100 - ((val - optMax) / (warnMax - optMax)) * 40);
  }
  return 20; // Out of warning bounds
}

/**
 * Determines parameter status badge
 */
function getParameterStatus(score: number, key: ParameterKey): ParameterStatus {
  if (key === 'TEMP' || key === 'K') {
    if (score >= 70) return 'Good';
    return 'Informational';
  }
  if (score >= 80) return 'Good';
  if (score >= 50) return 'Warning';
  return 'Critical';
}

/**
 * Main analysis function
 */
export function analyzeWaterQuality(params: WaterQualityParameters): AnalysisResult {
  const keys = Object.keys(PARAMETER_CONFIGS) as ParameterKey[];
  const parameterAnalyses: ParameterAnalysis[] = [];
  let weightedScoreSum = 0;

  keys.forEach((key) => {
    const cfg = PARAMETER_CONFIGS[key];
    const rawVal = params[key] ?? cfg.defaultValue;
    const score = normalizeParamScore(key, rawVal);
    const weight = PARAM_WEIGHTS[key] || 0.05;
    
    weightedScoreSum += score * weight;

    const status = getParameterStatus(score, key);
    let impact: ParameterAnalysis['impact'] = 'Positive';
    if (status === 'Critical') impact = 'Critical Impact';
    else if (status === 'Warning') impact = 'Warning';
    else if (key === 'TEMP' || key === 'K') impact = 'Neutral';

    let rec = `${cfg.label} is within standard operational range for non-potable reuse.`;
    if (status === 'Critical') {
      rec = `${cfg.label} (${rawVal} ${cfg.unit}) breaches acceptable non-potable thresholds and requires targeted treatment.`;
    } else if (status === 'Warning') {
      rec = `${cfg.label} (${rawVal} ${cfg.unit}) is elevated; monitoring and light filtration recommended.`;
    }

    parameterAnalyses.push({
      key,
      label: cfg.label,
      abbreviation: cfg.abbreviation,
      value: rawVal,
      unit: cfg.unit,
      status,
      normalizedScore: Math.round(score),
      impact,
      recommendation: rec
    });
  });

  const overallScore = Math.min(100, Math.max(0, Math.round(weightedScoreSum)));

  // Dynamic Classification
  let classification: QualityClassification = 'Good';
  if (overallScore >= 88) classification = 'Excellent';
  else if (overallScore >= 75) classification = 'Good';
  else if (overallScore >= 60) classification = 'Moderate';
  else if (overallScore >= 40) classification = 'Poor';
  else classification = 'Critical';

  // Evaluate 6 Non-Potable Applications
  const rawRecommendations = evaluateReuseApplications(params, parameterAnalyses, overallScore);
  
  // Ranked options
  const rankedOptions = [...rawRecommendations].sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  rankedOptions.forEach((item, index) => {
    item.rank = index + 1;
  });

  // Explainable AI (XAI)
  const xaiFactors = deriveXAIFactors(parameterAnalyses);

  // Suggested Treatment Considerations
  const treatmentConsiderations = deriveTreatmentConsiderations(params, parameterAnalyses);

  const sampleId = `GW-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();

  return {
    id: `ANALYSIS-${Date.now()}`,
    sampleId,
    timestamp,
    parameters: { ...params },
    overallScore,
    classification,
    parameterAnalyses,
    recommendations: rawRecommendations,
    rankedOptions,
    xaiFactors,
    treatmentConsiderations,
    summary: `Analysis completed with an overall water quality score of ${overallScore}/100 (${classification}). Recommended primary non-potable application: ${rankedOptions[0]?.application || 'Garden Irrigation'}.`
  };
}

/**
 * Domain logic for 6 Non-Potable Reuse Categories
 */
function evaluateReuseApplications(
  params: WaterQualityParameters,
  analyses: ParameterAnalysis[],
  overallScore: number
): ReuseRecommendationResult[] {
  const getScore = (key: ParameterKey) => analyses.find(a => a.key === key)?.normalizedScore || 70;

  // 1. Garden / Landscape Irrigation
  // Sensitive to: Salinity (SAL), TDS, E. coli, pH, K
  const eColiScore = getScore('E_COLI');
  const salScore = getScore('SAL');
  const tdsScore = getScore('TDS');
  const phScore = getScore('pH');
  const gardenBase = (salScore * 0.25) + (tdsScore * 0.2) + (eColiScore * 0.25) + (phScore * 0.2) + (overallScore * 0.1);
  const gardenSuitability = Math.min(98, Math.max(10, Math.round(gardenBase)));

  // 2. Toilet Flushing
  // Sensitive to: Turbidity (TUR), E. coli, BOD5, COD
  const turScore = getScore('TUR');
  const bodScore = getScore('BOD5');
  const codScore = getScore('COD');
  const toiletBase = (turScore * 0.3) + (eColiScore * 0.3) + (bodScore * 0.2) + (codScore * 0.1) + (overallScore * 0.1);
  const toiletSuitability = Math.min(98, Math.max(10, Math.round(toiletBase)));

  // 3. Floor Cleaning
  // Sensitive to: Turbidity, E. coli, BOD5, pH
  const floorBase = (turScore * 0.35) + (eColiScore * 0.3) + (bodScore * 0.15) + (phScore * 0.1) + (overallScore * 0.1);
  const floorSuitability = Math.min(95, Math.max(10, Math.round(floorBase)));

  // 4. Car Washing
  // Sensitive to: TDS & TUR (water spots), Salinity (corrosion)
  const carBase = (tdsScore * 0.35) + (turScore * 0.3) + (salScore * 0.25) + (overallScore * 0.1);
  const carSuitability = Math.min(95, Math.max(10, Math.round(carBase)));

  // 5. Construction / Concrete Mixing
  // Sensitive to: TDS, Salinity, pH, Organics
  const constrBase = (tdsScore * 0.3) + (salScore * 0.3) + (phScore * 0.2) + (codScore * 0.1) + (overallScore * 0.1);
  const constrSuitability = Math.min(92, Math.max(10, Math.round(constrBase)));

  // 6. Other Non-Potable Applications (Dust suppression, fire protection)
  const otherBase = overallScore * 0.9 + (eColiScore * 0.1);
  const otherSuitability = Math.min(90, Math.max(10, Math.round(otherBase)));

  const buildStatus = (score: number): ReuseRecommendationResult['status'] => {
    if (score >= 85) return 'Highly Suitable';
    if (score >= 70) return 'Suitable with Treatment';
    if (score >= 50) return 'Conditionally Suitable';
    return 'Not Recommended';
  };

  const applications: { app: NonPotableApplication; score: number; icon: string; reason: string; treatment: string }[] = [
    {
      app: 'Garden Irrigation',
      score: gardenSuitability,
      icon: 'Sprout',
      reason: 'Analyzed greywater exhibits favorable salinity and pH profiles supporting landscape plants, provided pathogen levels remain controlled.',
      treatment: 'Screening for suspended matter & basic disinfection before application.'
    },
    {
      app: 'Toilet Flushing',
      score: toiletSuitability,
      icon: 'Droplet',
      reason: 'Low turbidity and organic load reduce risk of fixture staining and biological odor formation in dual-plumbing systems.',
      treatment: 'Coarse filtration and chlorination/UV disinfection.'
    },
    {
      app: 'Floor Cleaning',
      score: floorSuitability,
      icon: 'Sparkles',
      reason: 'Acceptable clarity and microbial count render this greywater suitable for outdoor non-food surface washdowns.',
      treatment: 'Disinfection and particle separation to prevent residue.'
    },
    {
      app: 'Car Washing',
      score: carSuitability,
      icon: 'Car',
      reason: 'Moderate TDS and salinity levels minimize risk of spot formation on glass and bodywork corrosion.',
      treatment: 'Fine filtration and carbon adsorption to eliminate lingering soaps.'
    },
    {
      app: 'Construction Applications',
      score: constrSuitability,
      icon: 'Building2',
      reason: 'Water chemistry shows compatible TDS and neutral pH for concrete batching and dust suppression.',
      treatment: 'Sedimentation to clear coarse particulate debris.'
    },
    {
      app: 'Other Non-Potable Uses',
      score: otherSuitability,
      icon: 'Layers',
      reason: 'General baseline parameters meet criteria for industrial dust control and secondary non-contact uses.',
      treatment: 'Standard primary filtration and safety disinfection.'
    }
  ];

  return applications.map((item, i) => ({
    id: `REC-${i + 1}`,
    application: item.app,
    suitabilityScore: item.score,
    confidence: Math.min(98, Math.max(82, Math.round(85 + (item.score % 12)))),
    status: buildStatus(item.score),
    reason: item.reason,
    recommendedTreatment: item.treatment,
    rank: 0,
    iconName: item.icon
  }));
}

/**
 * XAI Feature Importance Analysis
 */
function deriveXAIFactors(analyses: ParameterAnalysis[]): XAIFactor[] {
  // Sort parameters by deviation from 100 (most impactful first)
  const sorted = [...analyses].sort((a, b) => {
    const devA = Math.abs(100 - a.normalizedScore);
    const devB = Math.abs(100 - b.normalizedScore);
    return devB - devA;
  });

  return sorted.slice(0, 5).map((item) => {
    const isPositive = item.normalizedScore >= 75;
    let influenceLevel: XAIFactor['influenceLevel'] = 'Medium';
    if (item.normalizedScore < 50 || item.normalizedScore > 90) influenceLevel = 'High';
    else if (item.normalizedScore >= 70 && item.normalizedScore <= 85) influenceLevel = 'Low';

    let exp = `Parameter score of ${item.normalizedScore}/100 strongly supports overall reuse safety.`;
    if (!isPositive) {
      exp = `Measured value (${item.value} ${item.unit}) acts as a limiting factor, reducing suitability for high-contact applications.`;
    }

    return {
      parameterKey: item.key,
      parameterName: item.label,
      abbreviation: item.abbreviation,
      value: item.value,
      unit: item.unit,
      influenceLevel,
      influenceScore: Math.min(98, Math.max(40, 100 - Math.abs(85 - item.normalizedScore))),
      direction: isPositive ? 'Positive' : 'Negative',
      explanation: exp
    };
  });
}

/**
 * Derives treatment considerations
 */
function deriveTreatmentConsiderations(
  params: WaterQualityParameters,
  analyses: ParameterAnalysis[]
): TreatmentConsideration[] {
  const treatments: TreatmentConsideration[] = [];

  const turScore = analyses.find(a => a.key === 'TUR')?.normalizedScore || 100;
  const eColiScore = analyses.find(a => a.key === 'E_COLI')?.normalizedScore || 100;
  const bodScore = analyses.find(a => a.key === 'BOD5')?.normalizedScore || 100;
  const codScore = analyses.find(a => a.key === 'COD')?.normalizedScore || 100;

  // Physical Filtration
  treatments.push({
    title: 'Multi-Stage Media / Disk Filtration',
    category: 'Physical',
    description: 'Removes lint, hair, suspended particles, and reduces turbidity prior to downstream disinfection.',
    targetParameters: ['Turbidity', 'TDS', 'Dissolved Solids'],
    priority: turScore < 75 ? 'High' : 'Medium'
  });

  // Disinfection
  treatments.push({
    title: 'UV Irradiation & Chlorination Disinfection',
    category: 'Disinfection',
    description: 'Inactivates pathogenic bacteria (E. coli), viruses, and microbial agents to satisfy health standards.',
    targetParameters: ['E. coli', 'Biochemical Oxygen Demand (BOD₅)'],
    priority: eColiScore < 80 ? 'High' : 'Medium'
  });

  // Biological Treatment
  if (bodScore < 80 || codScore < 80) {
    treatments.push({
      title: 'Aerated Biological Reactor / Constructed Wetland',
      category: 'Biological',
      description: 'Stabilizes biodegradable organic compounds, lowers BOD₅/COD, and prevents septic odors during storage.',
      targetParameters: ['BOD₅', 'COD', 'Ammonium (NH₄-N)'],
      priority: bodScore < 60 ? 'High' : 'Medium'
    });
  }

  // Advanced Carbon / Membrane Filtration
  treatments.push({
    title: 'Activated Carbon Adsorption',
    category: 'Advanced',
    description: 'Adsorbs trace surfactants, detergents, residual synthetic chemicals, and color compounds.',
    targetParameters: ['COD', 'Conductivity', 'Potassium'],
    priority: codScore < 70 ? 'High' : 'Low'
  });

  return treatments;
}
