import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { PresentDayAssetSignal, LivePrices, AssetCategory, MinimalAssetInfo } from '../types';
import { SignalBlock } from './PresentDaySignalCard';
import PresentDaySignalCardSkeleton from './skeletons/PresentDaySignalCardSkeleton';
import MinimalAssetCard from './MinimalAssetCard';
import SearchIcon from './icons/SearchIcon';
import XIcon from './icons/XIcon';

interface MajorAssetSectionProps {
    selectedCategory: AssetCategory | 'All';
}

const MajorAssetSection: React.FC<MajorAssetSectionProps> = ({ selectedCategory }) => {
    const { presentDayData, livePrices, isInitialLoading, activateTrade, apiClient } = useData();
    const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);
    const [detailedSignals, setDetailedSignals] = useState<{[key: string]: PresentDayAssetSignal}>({});
    const [isLoadingDetails, setIsLoadingDetails] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pre-load the initial top signal into the detailed view cache
    useEffect(() => {
        if (presentDayData?.presentDayBuySignals.length) {
            const topSignal = presentDayData.presentDayBuySignals[0];
            setDetailedSignals(prev => ({ ...prev, [topSignal.id]: topSignal }));
            setExpandedAssetId(topSignal.id);
        }
    }, [presentDayData?.presentDayBuySignals]);


    if (isInitialLoading || !presentDayData) {
        return <PresentDaySignalCardSkeleton />;
    }

    const handleToggleExpand = async (asset: MinimalAssetInfo) => {
        if (expandedAssetId === asset.id) {
            setExpandedAssetId(null); // Collapse if already open
            return;
        }

        // If details are not cached, fetch them
        if (!detailedSignals[asset.id]) {
            setIsLoadingDetails(asset.id);
            try {
                // This would be an API call in a real app
                const signalDetails = await apiClient.fetchSignalDetails(asset.ticker, asset.category);
                setDetailedSignals(prev => ({ ...prev, [asset.id]: signalDetails }));
            } catch (error) {
                console.error("Failed to fetch signal details:", error);
                // Handle error appropriately
            } finally {
                setIsLoadingDetails(null);
            }
        }
        setExpandedAssetId(asset.id);
    };
    
    const { allAssets } = presentDayData;
    const filteredAssets = allAssets
        .filter(s => selectedCategory === 'All' || s.category === selectedCategory)
        .filter(s => s.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || s.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.overallScore - a.overallScore);

    const gradientClass = 'from-green-600/10 via-surface/30 to-surface/80';
    const borderClass = 'border-border/50';

    return (
        <div className={`bg-gradient-to-br ${gradientClass} border ${borderClass} rounded-lg p-6 shadow-2xl`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-4 md:mb-0">Sinais de Compra e Venda</h3>
                <div className="relative w-full md:w-64">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                    <input 
                        type="text"
                        placeholder="Buscar ativo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background/50 border border-border/70 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                    />
                     {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white">
                            <XIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
            
            {filteredAssets.length > 0 ? (
                <div className="space-y-4">
                    {filteredAssets.map((asset) => {
                        const isExpanded = expandedAssetId === asset.id;
                        const detailedSignal = detailedSignals[asset.id];
                        
                        if (isExpanded && detailedSignal) {
                            return <SignalBlock key={asset.id} signal={detailedSignal} livePrices={livePrices} onActivate={activateTrade} />;
                        } else {
                            return (
                                <MinimalAssetCard 
                                    key={asset.id}
                                    asset={asset}
                                    price={livePrices[asset.ticker]}
                                    onExpand={() => handleToggleExpand(asset)}
                                    isExpanded={isExpanded}
                                    isLoadingDetails={isLoadingDetails === asset.id}
                                />
                            );
                        }
                    })}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-text-secondary">Nenhum ativo encontrado para a categoria '{selectedCategory}' com o termo '{searchTerm}'.</p>
                </div>
            )}
        </div>
    );
};

export default MajorAssetSection;
