// components/BacktestAnalysisLoader.tsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import BacktestExplanationCard from './BacktestExplanationCard';
import BacktestSummaryCard from './BacktestSummaryCard';
import BacktestHorizonSection from './BacktestHorizonSection';
import EvolutionCycleCard from './EvolutionCycleCard';
// FIX: Corrected import path for RobustnessAudit
import RobustnessAudit from './RobustnessAudit';
import BacktestAnalysisLoaderSkeleton from './skeletons/BacktestAnalysisLoaderSkeleton';

const BacktestAnalysisLoader: React.FC = () => {
    const { backtestData, isBacktestLoading, loadBacktestData } = useData();

    useEffect(() => {
        // Load data only if it hasn't been loaded yet
        if (!backtestData && !isBacktestLoading) {
            loadBacktestData();
        }
    }, [backtestData, isBacktestLoading, loadBacktestData]);

    if (isBacktestLoading || !backtestData) {
        return <BacktestAnalysisLoaderSkeleton />;
    }

    // FIX: Destructure from the 'Geral' property to match the BacktestAnalysisResult type.
    const { summary, buySignals, sellSignals, failedSignal, selfAnalysis, evolutionPrompt, correctionSuggestion, backtestStrengths, backtestWeaknesses } = backtestData.Geral;

    return (
        <div className="space-y-12">
            <BacktestExplanationCard />
            <BacktestSummaryCard summary={summary} isLoading={isBacktestLoading} />
            
            <div className="space-y-10">
                <BacktestHorizonSection title="Sinais de Compra (Exemplos de Backtest)" signals={buySignals} />
                <BacktestHorizonSection title="Sinais de Venda (Exemplos de Backtest)" signals={sellSignals} />
            </div>

            <EvolutionCycleCard 
                failedSignal={failedSignal}
                selfAnalysis={selfAnalysis}
                evolutionPrompt={evolutionPrompt}
                correctionSuggestion={correctionSuggestion}
                backtestStrengths={backtestStrengths}
                backtestWeaknesses={backtestWeaknesses}
            />

            <RobustnessAudit />
        </div>
    );
};

export default BacktestAnalysisLoader;
