import React from 'react';
// FIX: Correct import path for types
import { GlobalPerformanceMetrics } from '../types';
import { formatPercentage } from '../utils/formatters';
import ShieldZapIcon from './icons/ShieldZapIcon';
import GitMergeIcon from './icons/GitMergeIcon';
import TrophyIcon from './icons/TrophyIcon';
// FIX: Correct import path for icons
import TrendingUpIcon from './icons/TrendingUpIcon';
import ScaleIcon from './icons/ScaleIcon';


interface GlobalPerformancePanelProps {
    performanceData: GlobalPerformanceMetrics[];
}

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-background/50 p-6 rounded-lg border border-border/50 text-center">
        <div className="mx-auto w-fit p-3 rounded-full bg-primary/20 text-primary mb-3">
            {icon}
        </div>
        <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-4xl font-bold text-white">{value}</p>
    </div>
);

const GlobalPerformancePanel: React.FC<GlobalPerformancePanelProps> = ({ performanceData }) => {
    const latestPerf = performanceData[performanceData.length - 1];

    if (!latestPerf) return null;

    return (
        <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <ShieldZapIcon className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-bold text-text">Performance Global do Modelo</h2>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0 font-semibold text-text-secondary bg-background/50 px-3 py-1 rounded-full">
                    <GitMergeIcon className="h-5 w-5" />
                    Desempenho de Hoje
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Taxa de Acerto" 
                    value={formatPercentage(latestPerf.successRate)} 
                    icon={<TrophyIcon className="h-8 w-8" />}
                />
                <StatCard 
                    label="ROI Líquido" 
                    value={formatPercentage(latestPerf.netRoi)} 
                    icon={<TrendingUpIcon className="h-8 w-8" />}
                />
                <StatCard 
                    label="Índice Sharpe" 
                    value={latestPerf.sharpeRatio.toFixed(2)} 
                    icon={<ScaleIcon className="h-8 w-8" />}
                />
            </div>
        </div>
    );
};

export default GlobalPerformancePanel;
