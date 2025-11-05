// components/AlphaHunt.tsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
// FIX: Corrected import path for types
import { AlphaHuntResult } from '../types';
import NarrativeDetailCard from './NarrativeDetailCard';
// FIX: Corrected import path for AlphaOpportunityCard
import { AlphaOpportunityCard } from './AlphaOpportunityCard';
import AlphaHuntSkeleton from './skeletons/AlphaHuntSkeleton';
import { translations } from '../utils/translations';
import SparklesIcon from './SparklesIcon';

const AlphaHunt: React.FC = () => {
    const { 
        alphaHuntData, 
        isAlphaHuntLoading, 
        loadAlphaHuntData, 
        error 
    } = useData();
    const t = translations.pt;

    useEffect(() => {
        if (!alphaHuntData && !isAlphaHuntLoading) {
            loadAlphaHuntData();
        }
    }, [alphaHuntData, isAlphaHuntLoading, loadAlphaHuntData]);

    if (isAlphaHuntLoading) {
        return <AlphaHuntSkeleton />;
    }

    if (error && !alphaHuntData) {
        return (
            <div className="bg-danger/10 text-center p-4 text-danger rounded-lg">
                <p>{t.alphaHuntError}: {error}</p>
            </div>
        );
    }
    
    if (!alphaHuntData || alphaHuntData.results.length === 0) {
        return (
            <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-text mb-2 flex items-center gap-2">
                    <SparklesIcon className="h-6 w-6 text-primary" />
                    {t.alphaHuntTitle}
                </h3>
                <p className="text-text-secondary">{t.alphaHuntDescription}</p>
                <div className="text-center py-8 text-text-secondary">
                    Nenhuma narrativa quente encontrada no momento.
                </div>
            </div>
        );
    }

    const { results, vortexStatus } = alphaHuntData;

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-text mb-2 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-primary" />
                {t.alphaHuntTitle}
            </h3>
            <p className="text-sm text-text-secondary mb-6">{t.alphaHuntDescription}</p>
            
            <div className="space-y-8">
                {results.map((result, index) => (
                    <div key={index} className="bg-background/30 p-4 rounded-lg border border-border/30">
                        <NarrativeDetailCard narrative={result.narrative} />
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.opportunities.map(opp => (
                                <AlphaOpportunityCard 
                                    key={opp.ticker} 
                                    opportunity={opp} 
                                    vortexStatus={vortexStatus[opp.ticker]} 
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlphaHunt;
