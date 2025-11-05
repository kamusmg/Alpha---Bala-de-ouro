// components/GlobalPerformanceLoader.tsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import GlobalPerformanceLoaderSkeleton from './skeletons/GlobalPerformanceLoaderSkeleton';
import GlobalPerformancePanel from './GlobalPerformancePanel';
import ModelEvolutionChart from './ModelEvolutionChart';
import CognitiveDiagnosisReport from './CognitiveDiagnosisReport';
import AdaptiveBacktestPanel from './AdaptiveBacktestPanel';

const GlobalPerformanceLoader: React.FC = () => {
    const {
        globalPerformanceData,
        isGlobalPerformanceLoading,
        loadGlobalPerformanceData
    } = useData();

    useEffect(() => {
        if (!globalPerformanceData && !isGlobalPerformanceLoading) {
            loadGlobalPerformanceData();
        }
    }, [globalPerformanceData, isGlobalPerformanceLoading, loadGlobalPerformanceData]);

    if (isGlobalPerformanceLoading || !globalPerformanceData) {
        return <GlobalPerformanceLoaderSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* FIX: Pass the 'history' array from 'globalPerformanceData' to child components. */}
            <GlobalPerformancePanel performanceData={globalPerformanceData.history} />
            {/* FIX: Pass the 'history' array from 'globalPerformanceData' to child components. */}
            <ModelEvolutionChart performanceData={globalPerformanceData.history} />
            <CognitiveDiagnosisReport />
            <AdaptiveBacktestPanel />
        </div>
    );
};

export default GlobalPerformanceLoader;
