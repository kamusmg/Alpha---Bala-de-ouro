import React from 'react';
import { PresentDayAssetSignal, LivePrices, ChecklistItem } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import InfoTooltip from './InfoTooltip';
import ChecklistCollapse from './ChecklistCollapse';
import BuyIcon from './icons/BuyIcon';
import SellIcon from './icons/SellIcon';
import ShieldIcon from './ShieldIcon';
import TargetIcon from './icons/TargetIcon';
import LockIcon from './LockIcon';
import EntryIcon from './EntryIcon';
import ConfidenceIcon from './ConfidenceIcon';
import ChainIcon from './ChainIcon';
import BotIcon from './BotIcon';
import SynergyIcon from './icons/SynergyIcon';

interface SignalBlockProps {
    signal: PresentDayAssetSignal;
    livePrices: LivePrices;
    onActivate: (signal: PresentDayAssetSignal) => void;
}

const JustificationItem: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass?: string; tooltip?: string }> = ({ icon, label, value, colorClass = 'text-white', tooltip }) => (
    <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/30 last:border-0">
        <div className="flex items-center gap-2 text-text-secondary">
            {icon}
            <span>{label}</span>
            {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <span className={`font-semibold font-mono ${colorClass}`}>{value}</span>
    </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-background/40 p-3 rounded-md border border-border/30">
        <h5 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2 mb-2">
            {icon} {title}
        </h5>
        {children}
    </div>
);

const Checklist: React.FC<{ items: ChecklistItem[] }> = ({ items }) => (
    <div className="space-y-1 pt-2">
        {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
                <span className="text-text-secondary">{item.item}</span>
                <span className={`font-bold ${item.status ? 'text-success' : 'text-danger'}`}>{item.value}</span>
            </div>
        ))}
    </div>
);

export const SignalBlock: React.FC<SignalBlockProps> = ({ signal, livePrices, onActivate }) => {
    const currentPrice = livePrices[signal.ticker];
    const isBuy = signal.justifications.strategy === 'LONG';
    const priceDiff = currentPrice != null ? currentPrice - signal.justifications.entryRange.value.min : null;
    const priceDiffPercent = (priceDiff != null && signal.justifications.entryRange.value.min > 0) ? (priceDiff / signal.justifications.entryRange.value.min) * 100 : null;

    const isPriceInRange = currentPrice != null && currentPrice >= signal.justifications.entryRange.value.min && currentPrice <= signal.justifications.entryRange.value.max;

    return (
        <div className="bg-background/50 rounded-lg p-4 flex flex-col h-full border border-border/50 backdrop-blur-sm">
            <div className="flex-grow">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h4 className="text-xl font-bold text-white">{signal.assetName}</h4>
                        <div className="flex items-center gap-2 -mt-1 flex-wrap">
                            <span className="text-xs text-text-secondary">{signal.ticker}</span>
                            <span className="text-text-secondary text-xs">•</span>
                             <span className={`px-2 py-0.5 text-xs rounded-full ${signal.confidence === 'Alta' ? 'bg-primary/20 text-primary' : 'bg-border'}`}>{signal.confidence}</span>
                             {signal.narrativeAlignment && (
                                <div className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-secondary/20 text-secondary font-semibold" title={`Alinhado com a narrativa: ${signal.narrativeAlignment}`}>
                                    <SynergyIcon className="h-3 w-3" />
                                    <span>Sinergia</span>
                                </div>
                             )}
                        </div>
                    </div>
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${isBuy ? 'bg-success/20' : 'bg-danger/20'}`}>
                        {isBuy ? <BuyIcon className="h-5 w-5 text-success" /> : <SellIcon className="h-5 w-5 text-danger" />}
                    </div>
                </div>
                
                <div className="bg-background/50 rounded-md p-2 mb-4 border border-border/30 text-center text-xs">
                    <p className="font-bold text-text-secondary uppercase tracking-wider">Preço Atual</p>
                    {currentPrice != null ? (
                        <>
                            <p className="text-2xl font-bold text-white my-0.5">{formatCurrency(currentPrice)}</p>
                            {priceDiffPercent != null && <p className={priceDiffPercent >= 0 ? 'text-success' : 'text-danger'}>{formatPercentage(priceDiffPercent, true)}</p>}
                        </>
                    ) : (
                        <p className="text-2xl font-bold text-text-secondary my-0.5">Carregando...</p>
                    )}
                </div>

                <div className="space-y-4 text-xs mb-4">
                    <Section icon={<ChainIcon className="h-4 w-4" />} title="Inteligência On-Chain">
                        <p className="text-text-secondary leading-relaxed">{signal.onChainIntelligence.summary}</p>
                    </Section>
                    <Section icon={<BotIcon className="h-4 w-4" />} title="Setup de Automação">
                        <p className="text-text-secondary leading-relaxed">{signal.automationSetup.justification}</p>
                    </Section>
                </div>
                
                <ChecklistCollapse approved={signal.entryChecklist.score > 7} score={signal.entryChecklist.score}>
                    <Checklist items={signal.entryChecklist.items} />
                </ChecklistCollapse>
            </div>

            <div className="flex-shrink-0 mt-auto pt-4 border-t border-border/30 space-y-3">
                 <div>
                    <JustificationItem icon={<EntryIcon className="h-4 w-4" />} label="Faixa de Entrada" value={`${formatCurrency(signal.justifications.entryRange.value.min)} - ${formatCurrency(signal.justifications.entryRange.value.max)}`} tooltip={signal.justifications.entryRange.tooltip} />
                    <JustificationItem icon={<TargetIcon className="h-4 w-4" />} label="Alvo" value={formatCurrency(signal.justifications.target.value)} colorClass="text-success" tooltip={signal.justifications.target.tooltip} />
                    <JustificationItem icon={<LockIcon className="h-4 w-4" />} label="Stop Loss" value={formatCurrency(signal.justifications.stopLoss.value)} colorClass="text-danger" tooltip={signal.justifications.stopLoss.tooltip} />
                    <JustificationItem icon={<ConfidenceIcon className="h-4 w-4" />} label="Confiança" value={`${signal.justifications.confidenceScore.value}%`} />
                 </div>
                 <div className="mt-3 pt-3 border-t border-border/30 text-center">
                    <button 
                        onClick={() => onActivate(signal)}
                        disabled={!isPriceInRange}
                        className={`w-full font-bold py-2 px-4 rounded-md transition-all
                        ${isPriceInRange ? 'bg-primary text-white hover:bg-opacity-80' 
                            : 'bg-border/50 text-text-secondary cursor-not-allowed'}
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isPriceInRange ? `Ativar Trade ${signal.justifications.strategy}` : `Aguardando Faixa de Entrada`}
                    </button>
                 </div>
            </div>
        </div>
    );
};