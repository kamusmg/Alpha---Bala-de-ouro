
// components/TradingDesk.tsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import LivePositionsPanel from './LivePositionsPanel';
import PerformancePanel from './PerformancePanel';
import Watchlist from './Watchlist';
import Glossary from './Glossary';
// ExecutionLogPanel removed as per user request
// import ExecutionLogPanel from './ExecutionLogPanel';
import ClusterPnlPanel from './ClusterPnlPanel';
import StrategicSimulationCenter from './StrategicSimulationCenter';
import RiskAdvisorPanel from './RiskAdvisorPanel';
import TradingDeskSkeleton from './skeletons/TradingDeskSkeleton';

const TradingDesk: React.FC = () => {
    const { 
        tradingDeskData, 
        isTradingDeskLoading, 
        loadTradingDeskData, 
        livePositions, 
        presentDayData,
        isRiskAnalyzing,
        isSimulating,
        runForwardSimulation
    } = useData();

    useEffect(() => {
        if (!tradingDeskData && !isTradingDeskLoading) {
            loadTradingDeskData();
        }
    }, [tradingDeskData, isTradingDeskLoading, loadTradingDeskData]);

    if (isTradingDeskLoading || !presentDayData) {
        return <TradingDeskSkeleton />;
    }

    return (
        <div className="space-y-8">
            <LivePositionsPanel />
            <PerformancePanel />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Watchlist />
                <Glossary />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RiskAdvisorPanel 
                    isLoading={isRiskAnalyzing} 
                    recommendation={tradingDeskData?.riskSizing ?? null} 
                />
                <ClusterPnlPanel 
                    livePositions={livePositions} 
                    allAssets={presentDayData.allAssets} 
                />
            </div>

            <StrategicSimulationCenter 
                isLoading={isSimulating}
                runSimulation={runForwardSimulation}
                simulation={tradingDeskData?.forwardSimulation ?? null} 
                highConvictionSignals={tradingDeskData?.highConvictionSignals ?? []}
            />
        </div>
    );
};

export default TradingDesk;
