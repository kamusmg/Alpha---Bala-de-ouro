import React from 'react';
import BacktestSummaryCardSkeleton from './BacktestSummaryCardSkeleton';
import BacktestHorizonSectionSkeleton from './BacktestHorizonSectionSkeleton';
import EvolutionCycleCardSkeleton from './EvolutionCycleCardSkeleton';

const BacktestAnalysisLoaderSkeleton: React.FC = () => {
  return (
    <div className="space-y-12">
        {/* Skeleton for BacktestExplanationCard */}
        <div className="bg-surface/50 border border-border/50 rounded-xl p-6 mb-12 flex flex-col sm:flex-row gap-6 items-center animate-pulse">
            <div className="flex-shrink-0 h-20 w-20 bg-border rounded-full"></div>
            <div className="flex-1 space-y-3">
                <div className="h-6 w-1/2 bg-border rounded-md"></div>
                <div className="h-4 w-full bg-border rounded-md"></div>
                <div className="h-4 w-5/6 bg-border rounded-md"></div>
            </div>
        </div>

        <BacktestSummaryCardSkeleton />
      
        <div className="space-y-10">
            <BacktestHorizonSectionSkeleton title="Sinais de Compra (Exemplos)" />
            <BacktestHorizonSectionSkeleton title="Sinais de Venda (Exemplos)" />
        </div>
        
        <EvolutionCycleCardSkeleton />
    </div>
  );
};

export default BacktestAnalysisLoaderSkeleton;
