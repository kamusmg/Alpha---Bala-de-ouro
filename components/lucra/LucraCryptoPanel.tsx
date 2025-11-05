// components/lucra/LucraCryptoPanel.tsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLucraPipeline } from '../../hooks/useLucraPipeline';
import LucraActivationScreen from './LucraActivationScreen';
import LucraStatusHeader from './LucraStatusHeader';
import LucraTelemetryPanel from './LucraTelemetryPanel';
import LucraIndicatorsPanel from './LucraIndicatorsPanel';
import SignalsList from '../SignalsList';
import LucraOnChainContext from './LucraOnChainContext';
import LucraControlDashboard from './LucraControlDashboard';
import LucraRolloutPlan from './LucraRolloutPlan';
import LucraTradeHistory from './LucraTradeHistory';
import LucraBacktestPanel from './LucraBacktestPanel';

const LucraCryptoPanel: React.FC = () => {
    const { presentDayData } = useData();
    const { status, tick, indicators, signals, activate, deactivate } = useLucraPipeline(presentDayData?.deepOnChainAnalysis ?? null);

    if (status === 'INACTIVE') {
        return <LucraActivationScreen onActivate={activate} />;
    }

    return (
        <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                 <h2 className="text-3xl font-bold text-text mb-2 md:mb-0">Módulo LUCRA: Agente Reativo</h2>
                 <LucraStatusHeader status={status} onDeactivate={deactivate} />
            </div>
            <p className="text-text-secondary mb-6">Low-latency Unfiltered Crypto Reactive Agent</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <LucraTelemetryPanel tick={tick} />
                    <SignalsList signals={signals} title="Sinais Gerados" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <LucraIndicatorsPanel indicators={indicators} />
                    <LucraOnChainContext lucraIndicators={indicators} onChainAnalysis={presentDayData?.deepOnChainAnalysis ?? null} />
                    <LucraControlDashboard />
                </div>
            </div>
            
            <LucraRolloutPlan />

             <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LucraTradeHistory />
                <LucraBacktestPanel />
            </div>
        </div>
    );
};

export default LucraCryptoPanel;
