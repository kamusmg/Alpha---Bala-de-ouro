// components/NarrativeDetailCard.tsx
import React from 'react';
import { NarrativeDetails } from '../types';
import { formatPercentage } from '../utils/formatters';
import TrendingUpIcon from './icons/TrendingUpIcon';
import UsersIcon from './icons-narrative/UsersIcon';
import SentimentIcon from './icons-narrative/SentimentIcon';
import MaturityIndicator from './MaturityIndicator';

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
    <div className="bg-background/50 p-3 rounded-lg border border-border/50 flex items-center gap-3">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</p>
            <div className="text-lg font-bold text-white">{value}</div>
        </div>
    </div>
);

const NarrativeDetailCard: React.FC<{ narrative: NarrativeDetails }> = ({ narrative }) => {
    const isPositiveChange = narrative.weeklyChange >= 0;

    return (
        <div className="mb-4">
            <h3 className="text-2xl font-bold text-primary mb-1">{narrative.name}</h3>
            <p className="text-sm text-text-secondary mb-4 max-w-4xl">{narrative.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailItem
                    icon={<TrendingUpIcon className="h-6 w-6" />}
                    label="Popularidade"
                    value={
                        <div className="flex items-center gap-2">
                            <span>{narrative.popularityIndex}</span>
                            <span className={`text-xs font-bold ${isPositiveChange ? 'text-success' : 'text-danger'}`}>
                                ({formatPercentage(narrative.weeklyChange, true)})
                            </span>
                        </div>
                    }
                />
                <DetailItem
                    icon={<UsersIcon className="h-6 w-6" />}
                    label="Menções Sociais"
                    value={<span className="text-success">{formatPercentage(narrative.mentionGrowthRate, true)}</span>}
                />
                <DetailItem
                    icon={<SentimentIcon className="h-6 w-6" />}
                    label="Sentimento"
                    value={narrative.dominantSentiment}
                />
                 <div className="col-span-2 md:col-span-1 bg-background/50 p-3 rounded-lg border border-border/50">
                     <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 text-center">Maturidade da Narrativa</p>
                    <MaturityIndicator currentStage={narrative.maturity} />
                </div>
            </div>
        </div>
    );
};

export default NarrativeDetailCard;
