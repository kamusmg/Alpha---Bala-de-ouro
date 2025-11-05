// components/AsymmetricOpportunityCard.tsx
import React from 'react';
// FIX: Corrected import path for types
import { AsymmetricOpportunity } from '../types';
import GoldBulletIcon from './icons/GoldBulletIcon';
import GhostIcon from './icons/GhostIcon';
import RadiationIcon from './icons/RadiationIcon';
import CrosshairIcon from './icons/CrosshairIcon';
import { useData } from '../contexts/DataContext';

const ClassificationBadge: React.FC<{ classification: AsymmetricOpportunity['classification'] }> = ({ classification }) => {
    const config = {
        'Bala de Ouro': { icon: <GoldBulletIcon className="h-5 w-5" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        'Projétil Fantasma': { icon: <GhostIcon className="h-5 w-5" />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        'Zona Radioativa': { icon: <RadiationIcon className="h-5 w-5" />, color: 'text-danger', bg: 'bg-danger/10' },
    };
    const current = config[classification];
    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${current.bg} ${current.color}`}>
            {current.icon}
            <span>{classification}</span>
        </div>
    );
};

const Metric: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="text-center bg-background/50 p-2 rounded-md">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-bold text-white">{value}%</p>
    </div>
);

interface AsymmetricOpportunityCardProps {
    opportunity: AsymmetricOpportunity;
}

const AsymmetricOpportunityCard: React.FC<AsymmetricOpportunityCardProps> = ({ opportunity }) => {
    const { setLucraTargetAsset } = useData();

    const handleActivateLucra = () => {
        setLucraTargetAsset({
            ticker: opportunity.ticker,
            isRadioactive: opportunity.classification === 'Zona Radioativa'
        });
    };

    const isGoldBullet = opportunity.classification === 'Bala de Ouro';

    return (
        <div className={`bg-background/50 border border-border/50 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 transition-all hover:border-secondary/50 ${isGoldBullet ? 'animate-strong-pulse border-secondary/30' : ''}`}>
            <div className="flex-shrink-0 w-full md:w-48 text-center">
                <h3 className="text-xl font-bold text-white">{opportunity.name} ({opportunity.ticker})</h3>
                <div className="mt-2 inline-block">
                    <ClassificationBadge classification={opportunity.classification} />
                </div>
            </div>
            <div className="flex-1 w-full">
                <p className="text-sm text-text-secondary mb-3">{opportunity.rationale}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center bg-secondary/10 p-2 rounded-md">
                        <p className="text-xs text-secondary font-bold">EXPLOSÃO</p>
                        <p className="text-4xl font-bold text-white">{opportunity.explosionScore}</p>
                    </div>
                    <Metric label="Δ Volume" value={opportunity.metrics.volumeAnomalydelta} />
                    <Metric label="Δ Holders" value={opportunity.metrics.newHoldersDelta} />
                    <Metric label="Δ Social" value={opportunity.metrics.socialMentionsDelta} />
                </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                 <button onClick={handleActivateLucra} className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary/20 text-primary font-semibold py-2 px-4 rounded-md hover:bg-primary/30 transition-colors">
                    <CrosshairIcon className="h-5 w-5" />
                    Ativar LUCRA
                </button>
            </div>
        </div>
    );
};

export default AsymmetricOpportunityCard;
