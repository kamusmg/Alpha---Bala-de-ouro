// components/PresentDayDashboard.tsx
import React, { useState } from 'react';
import MacroDashboard from './MacroDashboard';
import AdvancedMarketRegimePanel from './AdvancedMarketRegimePanel';
import DeepOnChainMonitor from './DeepOnChainMonitor';
import CrossAssetIntelligencePanel from './CrossAssetIntelligencePanel';
import AssetClassSummary from './AssetClassSummary';
import MajorAssetSection from './MajorAssetSection';
import { useData } from '../contexts/DataContext';
import { AssetCategory } from '../types';
import PresentDaySignalCardSkeleton from './skeletons/PresentDaySignalCardSkeleton';
import AlphaDivergenceRadar from './AlphaDivergenceRadar';

const PresentDayDashboard: React.FC = () => {
    const { presentDayData, isInitialLoading } = useData();
    const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'All'>('All');

    if (isInitialLoading || !presentDayData) {
        return <PresentDaySignalCardSkeleton />;
    }

    return (
        <div className="space-y-8">
            <MacroDashboard />
            <AlphaDivergenceRadar />
            <AdvancedMarketRegimePanel />
            <DeepOnChainMonitor />
            <CrossAssetIntelligencePanel />
            <AssetClassSummary 
                summaries={presentDayData.assetClassSummaries}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            <MajorAssetSection selectedCategory={selectedCategory} />
        </div>
    );
};

export default PresentDayDashboard;