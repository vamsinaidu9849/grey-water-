import { analyzeWaterQuality } from './analysisEngine';
import { AnalysisResult, WaterQualityParameters } from '../types/waterQuality';

/**
 * Mock REST API caller simulating POST /api/analyze
 */
export async function postAnalyzeWaterQuality(params: WaterQualityParameters): Promise<AnalysisResult> {
  // Simulate network latency (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // Delegate to standard decision engine
  return analyzeWaterQuality(params);
}
