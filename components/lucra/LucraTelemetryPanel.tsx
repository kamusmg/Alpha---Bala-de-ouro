// components/lucra/LucraTelemetryPanel.tsx
import React from 'react';
// FIX: Corrected import path for types
import { FuturesDataTick } from '../../types';
import { formatLargeNumber } from '../../utils/formatters';
import { DateTime } from 'luxon';
import DatabaseIcon from '../icons/DatabaseIcon';
import FlameIcon from '../icons/FlameIcon';

const TelemetryItem: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between text-sm py-1.5 border-b border-border/50">
        <span className="text-text-secondary">{label}:</span>
        <span className="font-semibold text-white font-mono">{value}</span>
    </div>
);


interface LucraTelemetryPanelProps {
    tick: FuturesDataTick | null;
}

const LucraTelemetryPanel: React.FC<LucraTelemetryPanelProps> = ({ tick }) => {
    if (!tick) {
        return (
            <div className="bg-background/50 border border-border/50 rounded-lg p-4 h-full">
                <h3 className="text-lg font-bold text-text mb-4">Telemetria de Mercado</h3>
                <div className="text-center py-10 text-text-secondary">
                    Aguardando dados...
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-background/50 border border-border/50 rounded-lg p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-text flex items-center gap-2"><DatabaseIcon className="h-5 w-5"/> Telemetria</h3>
                <span className="text-xs text-text-secondary font-mono">{DateTime.fromMillis(tick.timestamp).toFormat('HH:mm:ss.SSS')}</span>
            </div>

            <div className="space-y-2">
                <TelemetryItem label="Open Interest" value={formatLargeNumber(tick.openInterest)} />
                <TelemetryItem label="Funding Rate" value={`${(tick.fundingRate * 100).toFixed(4)}%`} />
            </div>

            <div className="mt-4">
                <h4 className="text-md font-bold text-text mb-2 flex items-center gap-2"><FlameIcon className="h-5 w-5 text-danger" /> Liquidações Recentes</h4>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                    {tick.liquidations.length > 0 ? (
                        tick.liquidations.map((l, i) => (
                             <div key={i} className={`text-xs p-1 rounded-sm flex justify-between ${l.side === 'SELL' ? 'bg-success/10' : 'bg-danger/10'}`}>
                                <span className={l.side === 'SELL' ? 'text-success' : 'text-danger'}>{l.side}</span>
                                <span>{formatLargeNumber(l.price)}</span>
                                <span>{l.quantity.toFixed(3)} BTC</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-text-secondary text-center py-4">Nenhuma liquidação no último tick.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LucraTelemetryPanel;
