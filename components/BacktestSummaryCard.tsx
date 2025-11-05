import React from 'react';
import { BacktestSummary } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import BacktestSummaryCardSkeleton from './skeletons/BacktestSummaryCardSkeleton';
import TrophyIcon from './icons/TrophyIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';

interface BacktestSummaryCardProps {
  summary: BacktestSummary | null;
  isLoading: boolean;
}

const SummaryBlock: React.FC<{
  title: string;
  icon: React.ReactNode;
  total: number;
  profit: number;
  roi: number;
  isPositive: boolean;
}> = ({ title, icon, total, profit, roi, isPositive }) => {
  const colorClass = isPositive ? 'text-success' : 'text-danger';

  return (
    <div className="p-6 rounded-lg bg-surface/50 border border-border/50">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-full bg-background/50 ${colorClass}`}>{icon}</div>
        <h3 className="text-lg font-bold text-text ml-3">{title}</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Operações:</span>
          <span className="font-semibold text-white">{total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Lucro Líquido:</span>
          <span className={`font-semibold ${colorClass}`}>{formatCurrency(profit)}</span>
        </div>
        <hr className="border-border/50 my-2" />
        <div className="text-center pt-2">
          <p className="text-xs text-text-secondary uppercase">ROI Médio</p>
          <p className={`text-3xl font-bold ${colorClass}`}>{formatPercentage(roi)}</p>
        </div>
      </div>
    </div>
  );
};

const BacktestSummaryCard: React.FC<BacktestSummaryCardProps> = ({ summary, isLoading }) => {
  if (isLoading || !summary) {
    return <BacktestSummaryCardSkeleton />;
  }

  const { totalTrades, winningTrades, losingTrades, successRate, totalNetProfit, totalNetProfitPercentage, maxDrawdown, sharpeRatio } = summary;

  return (
    <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-text text-center mb-6">Resumo do Desempenho (Backtest)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <SummaryBlock
            title="Resultados Gerais"
            icon={<TrophyIcon className="h-6 w-6" />}
            total={totalTrades}
            profit={totalNetProfit}
            roi={totalNetProfitPercentage}
            isPositive={totalNetProfit > 0}
        />
        <div className="p-6 rounded-lg bg-surface/50 border border-border/50 space-y-3">
             <h3 className="text-lg font-bold text-text mb-3">Métricas de Risco e Eficiência</h3>
             <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Taxa de Acerto:</span>
                <span className="font-bold text-primary">{formatPercentage(successRate)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Trades Vencedores:</span>
                <span className="font-bold text-success">{winningTrades}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Trades Perdedores:</span>
                <span className="font-bold text-danger">{losingTrades}</span>
             </div>
             <hr className="border-border/50"/>
             <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Max Drawdown:</span>
                <span className="font-bold text-danger">{formatPercentage(maxDrawdown)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Índice Sharpe:</span>
                <span className="font-bold text-white">{sharpeRatio.toFixed(2)}</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestSummaryCard;
