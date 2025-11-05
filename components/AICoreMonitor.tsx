import React from 'react';
// FIX: Corrected import path for types
import { PresentDayAnalysisResult, BacktestAnalysisResult } from '../types';
import { formatPercentage } from '../utils/formatters';
import AnalysisEngineIcon from './AnalysisEngineIcon';
import AICoreMonitorSkeleton from './skeletons/AICoreMonitorSkeleton';

interface AICoreMonitorProps {
  presentDayData: PresentDayAnalysisResult | null;
  backtestData: BacktestAnalysisResult | null;
}

const Metric: React.FC<{ label: string; value: string; colorClass?: string }> = ({ label, value, colorClass = 'text-primary' }) => (
  <div className="bg-background/50 p-4 rounded-lg border border-border/50">
    <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">{label}</p>
    <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

const AICoreMonitor: React.FC<AICoreMonitorProps> = ({ presentDayData, backtestData }) => {
  if (!presentDayData) {
    return <AICoreMonitorSkeleton />;
  }
  
  const { macroContext } = presentDayData;
  const veredict = macroContext.find(ind => ind.name.toLowerCase().includes('veredito'));

  // FIX: Access successRate from the 'Geral' property to match the BacktestAnalysisResult type.
  const backtestSuccessRate = backtestData?.Geral.summary.successRate;
  const isVeredictGood = veredict?.status === 'good';

  return (
    <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-8">
      <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
        <div className="absolute inset-0">
          <AnalysisEngineIcon className="w-full h-full" />
        </div>
        <div className="relative text-center">
          <h3 className={`text-5xl font-bold transition-colors ${isVeredictGood ? 'text-success' : 'text-danger'}`}>
            {veredict?.value.split(' ')[0] ?? '...'}
          </h3>
          <p className="font-semibold text-text-secondary">{veredict?.value.split(' ')[1] ?? '...'}</p>
        </div>
      </div>
      <div className="flex-grow w-full text-center md:text-left">
        <h2 className="text-3xl font-bold text-text">Veredito Final do Motor Alpha</h2>
        <p className="text-text-secondary mt-1 mb-4">
          Conclusão agregada de todos os módulos de análise para o contexto de mercado atual.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Metric 
            label="Regime de Mercado"
            value={macroContext[0]?.value ?? 'N/A'}
            colorClass={macroContext[0]?.status === 'good' ? 'text-success' : 'text-text'}
          />
           <Metric 
            label="Taxa de Acerto (Backtest)"
            value={backtestSuccessRate ? formatPercentage(backtestSuccessRate) : 'Carregando...'}
            colorClass="text-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default AICoreMonitor;
