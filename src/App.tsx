import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/Home/HeroSection';
import { AboutGreywater } from './components/Home/AboutGreywater';
import { WhyReuse } from './components/Home/WhyReuse';
import { ParameterInputForm } from './components/Analyze/ParameterInputForm';
import { AIProcessingModal } from './components/Analyze/AIProcessingModal';
import { ResultsDashboard } from './components/Analyze/ResultsDashboard';
import { OverviewMetrics } from './components/Dashboard/OverviewMetrics';
import { AnalysisHistoryTable } from './components/History/AnalysisHistoryTable';
import { WorkflowTimeline } from './components/HowItWorks/WorkflowTimeline';
import { ArchitectureDiagram } from './components/HowItWorks/ArchitectureDiagram';
import { ProjectOverview } from './components/About/ProjectOverview';
import { PrintableReport } from './components/Report/PrintableReport';
import { analyzeDataset, analyzeWaterQuality } from './services/analysisEngine';
import { getSavedHistory, saveAnalysisToHistory } from './services/historyStorage';
import type { AnalysisResult, WaterQualityParameters } from './types/waterQuality';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [showPrintable, setShowPrintable] = useState<boolean>(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(getSavedHistory());
  }, []);

  const handleStartAnalysis = (params: WaterQualityParameters) => {
    setIsProcessing(true);
    const result = analyzeWaterQuality(params);
    setCurrentAnalysis(result);
  };

  const handleDatasetAnalysis = (rows: WaterQualityParameters[]) => {
    setIsProcessing(true);
    const result = analyzeDataset(rows);
    setCurrentAnalysis(result);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    if (currentAnalysis) {
      saveAnalysisToHistory(currentAnalysis);
      setHistory(getSavedHistory());
    }
  };

  const handleResetAnalysis = () => {
    setCurrentAnalysis(null);
    setShowPrintable(false);
  };

  const handleSelectSampleFromHistory = (sample: AnalysisResult) => {
    setCurrentAnalysis(sample);
    setActiveTab('analyze');
    setShowPrintable(false);
  };

  const handleViewReportFromHistory = (sample: AnalysisResult) => {
    setCurrentAnalysis(sample);
    setActiveTab('analyze');
    setShowPrintable(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setShowPrintable(false);
      }} />

      {/* Main Page Body Routing */}
      <main className="flex-1">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            <HeroSection setActiveTab={setActiveTab} />
            <AboutGreywater />
            <WhyReuse />
          </div>
        )}

        {/* TAB 2: ANALYZE */}
        {activeTab === 'analyze' && (
          <div>
            {isProcessing && (
              <AIProcessingModal onComplete={handleProcessingComplete} />
            )}

            {!isProcessing && showPrintable && currentAnalysis && (
              <PrintableReport
                result={currentAnalysis}
                onBack={() => setShowPrintable(false)}
              />
            )}

            {!isProcessing && !showPrintable && currentAnalysis && (
              <ResultsDashboard
                result={currentAnalysis}
                onReset={handleResetAnalysis}
                onViewPrintableReport={() => setShowPrintable(true)}
              />
            )}

            {!isProcessing && !showPrintable && !currentAnalysis && (
              <ParameterInputForm
                onAnalyze={handleStartAnalysis}
                onAnalyzeDataset={handleDatasetAnalysis}
              />
            )}
          </div>
        )}

        {/* TAB 3: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <OverviewMetrics
            history={history}
            onSelectSample={handleSelectSampleFromHistory}
            onNavigateAnalyze={() => {
              setActiveTab('analyze');
              handleResetAnalysis();
            }}
          />
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <AnalysisHistoryTable
            history={history}
            onUpdateHistory={setHistory}
            onSelectSample={handleSelectSampleFromHistory}
            onViewPrintableReport={handleViewReportFromHistory}
          />
        )}

        {/* TAB 5: HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
            <WorkflowTimeline />
            <ArchitectureDiagram />
          </div>
        )}

        {/* TAB 6: ABOUT */}
        {activeTab === 'about' && (
          <ProjectOverview />
        )}

      </main>

      {/* Academic Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}

export default App;
