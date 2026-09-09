import { AnalysisResult } from '../types/waterQuality';

const STORAGE_KEY = 'greywater_ai_history_v1';

export function getSavedHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialMockHistory();
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse history from localStorage', e);
    return getInitialMockHistory();
  }
}

export function saveAnalysisToHistory(result: AnalysisResult): void {
  try {
    const current = getSavedHistory();
    // Prepend new item
    const updated = [result, ...current.filter(item => item.id !== result.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50))); // Keep last 50
  } catch (e) {
    console.error('Failed to save analysis to localStorage', e);
  }
}

export function deleteAnalysisFromHistory(id: string): AnalysisResult[] {
  try {
    const current = getSavedHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete analysis from localStorage', e);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history from localStorage', e);
  }
}

/**
 * Initial mock runs for demonstration when localStorage is empty
 */
function getInitialMockHistory(): AnalysisResult[] {
  const dates = [
    new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    new Date(Date.now() - 96 * 3600 * 1000).toISOString()
  ];

  return [
    {
      id: 'ANALYSIS-1001',
      sampleId: 'GW-849201',
      timestamp: dates[0],
      parameters: {
        DO: 5.2, BOD5: 18, COD: 65, TDS: 420, EC: 650, pH: 7.2, TEMP: 27,
        SAL: 0.4, TUR: 8, DS: 400, NH4_N: 2.0, NO3_N: 8.0, K: 15.0, E_COLI: 100
      },
      overallScore: 85,
      classification: 'Good',
      summary: 'Analysis completed with overall score of 85/100 (Good). Primary recommendation: Garden Irrigation (92%).',
      parameterAnalyses: [],
      recommendations: [
        {
          id: 'R1', application: 'Garden Irrigation', suitabilityScore: 92, confidence: 92,
          status: 'Highly Suitable', reason: 'Favorable salinity and pH profiles.', recommendedTreatment: 'Basic disinfection.', rank: 1, iconName: 'Sprout'
        },
        {
          id: 'R2', application: 'Toilet Flushing', suitabilityScore: 87, confidence: 89,
          status: 'Highly Suitable', reason: 'Low turbidity and organic load.', recommendedTreatment: 'Chlorination.', rank: 2, iconName: 'Droplet'
        }
      ],
      rankedOptions: [],
      xaiFactors: [],
      treatmentConsiderations: []
    },
    {
      id: 'ANALYSIS-1002',
      sampleId: 'GW-739102',
      timestamp: dates[1],
      parameters: {
        DO: 6.1, BOD5: 12, COD: 45, TDS: 380, EC: 590, pH: 7.4, TEMP: 24,
        SAL: 0.3, TUR: 4, DS: 350, NH4_N: 1.2, NO3_N: 6.0, K: 12.0, E_COLI: 40
      },
      overallScore: 92,
      classification: 'Excellent',
      summary: 'Analysis completed with overall score of 92/100 (Excellent). Primary recommendation: Toilet Flushing (95%).',
      parameterAnalyses: [],
      recommendations: [
        {
          id: 'R1', application: 'Toilet Flushing', suitabilityScore: 95, confidence: 94,
          status: 'Highly Suitable', reason: 'Excellent clarity and low microbial count.', recommendedTreatment: 'Coarse filtration.', rank: 1, iconName: 'Droplet'
        }
      ],
      rankedOptions: [],
      xaiFactors: [],
      treatmentConsiderations: []
    },
    {
      id: 'ANALYSIS-1003',
      sampleId: 'GW-610492',
      timestamp: dates[2],
      parameters: {
        DO: 3.5, BOD5: 42, COD: 130, TDS: 780, EC: 1200, pH: 6.1, TEMP: 31,
        SAL: 1.1, TUR: 28, DS: 710, NH4_N: 5.4, NO3_N: 18.0, K: 28.0, E_COLI: 650
      },
      overallScore: 58,
      classification: 'Poor',
      summary: 'Analysis completed with overall score of 58/100 (Poor). Requires biological treatment before reuse.',
      parameterAnalyses: [],
      recommendations: [
        {
          id: 'R1', application: 'Construction Applications', suitabilityScore: 68, confidence: 86,
          status: 'Conditionally Suitable', reason: 'Higher organic and microbial content limits direct contact applications.', recommendedTreatment: 'Sedimentation & biological oxidation.', rank: 1, iconName: 'Building2'
        }
      ],
      rankedOptions: [],
      xaiFactors: [],
      treatmentConsiderations: []
    }
  ];
}
