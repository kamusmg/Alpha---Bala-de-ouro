// components/AsymmetricBulletCard.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { AsymmetricSignal, SignalStatus, AsymmetricSignalTier } from '../types';
import { formatCurrency } from '../utils/formatters';
import ZapIcon from './icons/ZapIcon';
import RadiationIcon from './icons/RadiationIcon';
import XCircleIcon from '../components/icons/XCircleIcon';
import GoldBulletIcon from './icons/GoldBulletIcon';
import AlienCoinIcon from './icons/AlienCoinIcon';

const tierConfig: Record<AsymmetricSignalTier, { title: string; riskLabel: AsymmetricSignal['riskLevel']; potentialLabel: string; colors: { border: string; shadow: string; text: string; from: string; via: string }; icon: React.ReactNode }> = {
    Gold: {
        title: "Bala de Ouro: Caça Alquímica", riskLabel: "Absoluto", potentialLabel: "Potencial Alquímico",
        colors: { border: 'border-yellow-400/50', shadow: 'shadow-yellow-400/20', text: 'text-yellow-400', from: 'from-gray-900', via: 'via-yellow-400/20' },
        icon: <GoldBulletIcon className="w-64 h-64" />
    },
    Silver: {
        title: "Bala de Prata: Caça Assimétrica", riskLabel: "Extremo", potentialLabel: "Potencial de Explosão",
        colors: { border: 'border-secondary/50', shadow: 'shadow-secondary/20', text: 'text-secondary', from: 'from-gray-900', via: 'via-secondary/30' },
        icon: <AlienCoinIcon className="w-64 h-64" />
    },
    Bronze: {
        title: "Bala de Bronze: Aposta Estratégica", riskLabel: "Elevado", potentialLabel: "Potencial Estratégico",
        colors: { border: 'border-orange-400/50', shadow: 'shadow-orange-400/20', text: 'text-orange-400', from: 'from-gray-900', via: 'via-orange-400/20' },
        icon: <ZapIcon className="w-64 h-64" />
    }
};

const ProximityBar: React.FC<{ current: number, min: number, max: number }> = ({ current, min, max }) => {
    if (current > max || current < min) return null;
    const range = max - min;
    const progress = range > 0 ? ((current - min) / range) * 100 : (current >= min ? 100 : 0);
    return (
        <div className="w-full bg-border/50 rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{width: `${progress}%`}}></div></div>
    );
};

const AsymmetricBulletCard: React.FC<{ signal: AsymmetricSignal }> = ({ signal }) => {
    const { activateTrade, livePrices } = useData();
    const config = tierConfig[signal.tier];
    
    const currentPrice = livePrices[signal.ticker];
    let status: SignalStatus = signal.status;
    let invalidationReason = signal.invalidationReason;

    if (currentPrice != null) {
        if (currentPrice < signal.justifications.stopLoss.value) {
            status = 'INVALIDATED';
            invalidationReason = 'Preço atual abaixo do stop loss antes da entrada.';
        } else if (currentPrice >= signal.justifications.entryRange.value.min && currentPrice <= signal.justifications.entryRange.value.max) {
            status = 'ACTIVE';
        } else {
            status = 'WAITING';
        }
    }

    if (status === 'INVALIDATED') {
        return (
            <div className="relative bg-background border-2 border-border/50 rounded-xl p-6 text-center opacity-60">
                <XCircleIcon className="h-10 w-10 text-danger mx-auto mb-2" />
                <h3 className="text-lg font-bold text-text">Sinal {signal.tier} Invalidado: {signal.assetName}</h3>
                <p className="text-sm text-text-secondary mt-1">{invalidationReason}</p>
            </div>
        )
    }

    return (
        <div className={`relative bg-gradient-to-tr ${config.colors.from} ${config.colors.via} to-background border-2 ${config.colors.border} rounded-xl p-6 shadow-2xl ${config.colors.shadow} overflow-hidden ${status === 'ACTIVE' ? 'animate-strong-pulse' : ''}`}>
             <div className={`absolute -top-16 -right-16 ${config.colors.text}/10`}>{config.icon}</div>
             <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <p className={`text-sm font-bold ${config.colors.text} uppercase tracking-widest`}>{config.title}</p>
                        <h2 className="text-4xl font-bold text-white">{signal.assetName} ({signal.ticker})</h2>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                        <p className="text-sm font-bold text-text-secondary uppercase">{config.potentialLabel}</p>
                        <p className={`text-5xl font-bold ${config.colors.text}`}>{signal.explosionPotential}</p>
                    </div>
                </div>
                
                 <div className="mt-4 flex items-center gap-2 bg-danger/10 text-danger font-bold text-sm px-3 py-1 rounded-full w-fit">
                    <RadiationIcon className="h-5 w-5" />
                    <span>Risco: {signal.riskLevel}</span>
                </div>

                <div className="mt-6">
                    <h4 className="font-bold text-white mb-2">Racional do {signal.tier === 'Gold' ? 'Alquimista' : signal.tier === 'Silver' ? 'Arqueólogo' : 'Estrategista'} (IA)</h4>
                    <p className="text-text-secondary max-w-4xl text-sm italic">{signal.rationale}</p>
                </div>
                 
                 <div className="mt-6 pt-6 border-t border-border/50 text-center">
                    {status === 'WAITING' && currentPrice != null && (
                        <div className="max-w-md mx-auto mb-4">
                            <div className="flex justify-between text-xs text-text-secondary mb-1">
                                <span>Preço Atual: {formatCurrency(currentPrice)}</span>
                                <span>Entrada: {formatCurrency(signal.justifications.entryRange.value.min)}</span>
                            </div>
                            <ProximityBar current={currentPrice} min={signal.justifications.entryRange.value.min} max={signal.justifications.entryRange.value.max} />
                        </div>
                    )}
                    <button 
                        onClick={() => activateTrade(signal)}
                        disabled={status !== 'ACTIVE'}
                        className={`inline-flex items-center justify-center gap-3 ${status === 'ACTIVE' ? config.colors.text.replace('text-', 'bg-') : 'bg-gray-600'} text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <ZapIcon className="h-6 w-6" />
                        {status === 'ACTIVE' ? `EXECUTAR ${signal.justifications.strategy}` : `Aguardando Entrada`}
                    </button>
                    <p className="text-xs text-text-secondary mt-2">Faixa de Entrada: {formatCurrency(signal.justifications.entryRange.value.min)} - {formatCurrency(signal.justifications.entryRange.value.max)}</p>
                 </div>
            </div>
        </div>
    );
};

export default AsymmetricBulletCard;