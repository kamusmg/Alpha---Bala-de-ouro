
// components/DeepOnChainMonitor.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import DeepOnChainMonitorSkeleton from './skeletons/DeepOnChainMonitorSkeleton';
import { OnChainMetric } from '../types';
import NetworkIcon from './NetworkIcon';
import InfoTooltip from './InfoTooltip';
import WhaleIcon from './icons/WhaleIcon';
import ExchangeIcon from './icons/ExchangeIcon';
import { formatLargeNumber } from '../utils/formatters';

const SentimentDisplay: React.FC<{ sentiment: 'bullish' | 'bearish' | 'neutral', score: number }> = ({ sentiment, score }) => {
    const config = {
        bullish: { text: 'Otimista', color: 'text-success', bg: 'bg-success/10', border: 'border-success' },
        bearish: { text: 'Pessimista', color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger' },
        neutral: { text: 'Neutro', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400' },
    };
    const currentConfig = config[sentiment];

    return (
        <div className={`p-6 rounded-lg border-2 ${currentConfig.border} ${currentConfig.bg} text-center h-full flex flex-col justify-center`}>
            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Sentimento Geral On-Chain</p>
            <p className={`text-5xl font-bold my-1 ${currentConfig.color}`}>{currentConfig.text}</p>
            <div className="w-full bg-border h-2 rounded-full mt-2">
                <div className={`h-2 rounded-full ${currentConfig.color.replace('text-', 'bg-')}`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4 h-full">
        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2 mb-2">
            {icon}
            {title}
        </h4>
        {children}
    </div>
);

const KeyMetricRow: React.FC<{ metric: OnChainMetric }> = ({ metric }) => {
    const statusColor = {
        bullish: 'text-success',
        bearish: 'text-danger',
        neutral: 'text-yellow-400',
    }[metric.status];
    return (
        <div className="flex justify-between items-center text-sm py-1 border-b border-border/30 last:border-0">
            <span className="text-text-secondary">{metric.name}</span>
            <div className="text-right">
                <p className="font-bold text-white">{metric.value}</p>
                <p className={`text-xs ${statusColor}`}>{metric.interpretation}</p>
            </div>
        </div>
    );
};

const DeepOnChainMonitor: React.FC = () => {
    const { presentDayData, isInitialLoading } = useData();

    if (isInitialLoading || !presentDayData?.deepOnChainAnalysis) {
        return <DeepOnChainMonitorSkeleton />;
    }

    const { overallSentiment, sentimentScore, keyMetrics, whaleWatch, exchangeFlows } = presentDayData.deepOnChainAnalysis;

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
                <NetworkIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Monitoramento Profundo On-Chain</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <SentimentDisplay sentiment={overallSentiment} score={sentimentScore} />
                </div>
                <div className="lg:col-span-2">
                    <MetricCard title="Métricas Chave" icon={<div />}>
                        {keyMetrics.map(metric => <KeyMetricRow key={metric.name} metric={metric} />)}
                    </MetricCard>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <MetricCard title="Radar de Baleias" icon={<WhaleIcon className="h-5 w-5" />}>
                     <p className={`text-3xl font-bold ${whaleWatch.last24hNetFlow >= 0 ? 'text-success' : 'text-danger'}`}>{formatLargeNumber(whaleWatch.last24hNetFlow)}</p>
                     <p className="text-xs text-text-secondary">Fluxo líquido das maiores carteiras nas últimas 24h.</p>
                 </MetricCard>
                 <MetricCard title="Fluxo de Exchanges" icon={<ExchangeIcon className="h-5 w-5" />}>
                    <p className={`text-3xl font-bold ${exchangeFlows.last24hNetFlow >= 0 ? 'text-danger' : 'text-success'}`}>{formatLargeNumber(exchangeFlows.last24hNetFlow)}</p>
                    <p className="text-xs text-text-secondary">Fluxo líquido de ativos para/de todas as exchanges nas últimas 24h.</p>
                 </MetricCard>
            </div>
        </div>
    );
};

export default DeepOnChainMonitor;
