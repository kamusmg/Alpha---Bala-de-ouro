// components/AlphaOpportunityCard.tsx
import React from 'react';
import { AlphaOpportunity } from '../types';

interface AlphaOpportunityCardProps {
    opportunity: AlphaOpportunity;
    vortexStatus?: 'hot' | 'neutral' | 'cold';
}

const VortexIndicator: React.FC<{ status?: 'hot' | 'neutral' | 'cold' }> = ({ status }) => {
    const config = {
        hot: { label: "Hot", color: "bg-red-500", shadow: "shadow-red-500/50" },
        neutral: { label: "Neutral", color: "bg-yellow-500", shadow: "shadow-yellow-500/50" },
        cold: { label: "Cold", color: "bg-blue-500", shadow: "shadow-blue-500/50" },
    };

    if (!status) return null;
    const { label, color, shadow } = config[status];

    return (
        <div className="flex items-center gap-2">
            <div className={`relative w-3 h-3 rounded-full ${color} ${shadow}`}>
                <div className={`absolute inset-0 rounded-full ${color} animate-ping`}></div>
            </div>
            <span className="text-xs font-bold">{label}</span>
        </div>
    );
};


export const AlphaOpportunityCard: React.FC<AlphaOpportunityCardProps> = ({ opportunity, vortexStatus }) => {
    const confidenceColors = {
        'Alta': 'border-success text-success',
        'Média': 'border-yellow-400 text-yellow-400',
        'Baixa': 'border-danger text-danger',
    };

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-4 h-full flex flex-col transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-lg font-bold text-white">{opportunity.name}</h4>
                        <p className="text-sm text-text-secondary">{opportunity.ticker}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${confidenceColors[opportunity.confidence]}`}>
                        {opportunity.confidence}
                    </span>
                </div>
                <p className="text-sm text-text-secondary my-3">{opportunity.rationale}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                <div className="text-left">
                    <span className="text-xs text-text-secondary">Relevância</span>
                    <p className="font-bold text-white">{opportunity.marketRelevanceScore}/100</p>
                </div>
                <div className="text-right">
                     <span className="text-xs text-text-secondary">Vortex Status</span>
                    <VortexIndicator status={vortexStatus} />
                </div>
            </div>
        </div>
    );
};
