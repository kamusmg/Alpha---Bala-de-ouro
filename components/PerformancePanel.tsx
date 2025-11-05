import React from 'react';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import TrophyIcon from './icons/TrophyIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';
import DollarSignIcon from './icons/DollarSignIcon';
import PercentIcon from './icons/PercentIcon';
import JournalIcon from './icons/JournalIcon';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass?: string }> = ({ icon, label, value, colorClass }) => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4 flex items-center gap-4">
        <div className={`flex-shrink-0 p-2 rounded-full bg-border/50 ${colorClass}`}>{icon}</div>
        <div>
            <p className="text-sm text-text-secondary font-bold uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const PerformancePanel: React.FC = () => {
    const { livePositions, tradeHistory } = useData();

    // Stats for OPEN positions
    const totalPnl = livePositions.reduce((acc, pos) => acc + pos.pnl, 0);
    const totalInvestment = livePositions.reduce((acc, pos) => acc + (pos.entryPrice * pos.size), 0);
    const totalPnlPercentage = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

    // Stats for CLOSED trades (from history)
    const totalTrades = tradeHistory.length;
    const winningTrades = tradeHistory.filter(p => p.pnl > 0).length;
    const losingTrades = tradeHistory.filter(p => p.pnl < 0).length;
    const decidedTrades = winningTrades + losingTrades;
    const winRate = decidedTrades > 0 ? (winningTrades / decidedTrades) * 100 : 0;


    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Painel de Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard 
                    icon={<DollarSignIcon className="h-6 w-6" />}
                    label="P&L Total (Aberto)" 
                    value={formatCurrency(totalPnl)}
                    colorClass={totalPnl >= 0 ? 'text-success' : 'text-danger'}
                />
                <StatCard 
                    icon={<PercentIcon className="h-6 w-6" />}
                    label="ROI (Aberto)" 
                    value={formatPercentage(totalPnlPercentage)}
                    colorClass={totalPnlPercentage >= 0 ? 'text-success' : 'text-danger'}
                />
                 <StatCard 
                    icon={<TrophyIcon className="h-6 w-6" />}
                    label="Taxa de Acerto" 
                    value={formatPercentage(winRate)}
                    colorClass="text-primary"
                />
                <StatCard 
                    icon={<JournalIcon className="h-6 w-6" />}
                    label="Total de Trades" 
                    value={String(totalTrades)}
                    colorClass="text-text-secondary"
                />
                <StatCard 
                    icon={<TrendingUpIcon className="h-6 w-6" />}
                    label="Trades Vencedores" 
                    value={String(winningTrades)}
                    colorClass="text-success"
                />
                 <StatCard 
                    icon={<TrendingDownIcon className="h-6 w-6" />}
                    label="Trades Perdedores" 
                    value={String(losingTrades)}
                    colorClass="text-danger"
                />
            </div>
        </div>
    );
};

export default PerformancePanel;