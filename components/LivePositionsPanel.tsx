import React from 'react';
import { useData } from '../contexts/DataContext';
import { LivePosition } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { DateTime } from 'luxon';
import XIcon from './icons/XIcon';
import ActivityIcon from './icons/ActivityIcon';

const PositionRow: React.FC<{ position: LivePosition; onClose: (id: string) => void }> = ({ position, onClose }) => {
    const isProfit = position.pnl >= 0;
    const typeClass = position.type === 'LONG' ? 'text-success' : 'text-danger';

    return (
        <tr className="border-b border-border/50 hover:bg-background/50">
            <td className="p-3 text-sm">
                <div className="font-bold text-white">{position.asset}</div>
                <div className={`text-xs font-bold ${typeClass}`}>{position.type}</div>
            </td>
            <td className="p-3 text-sm text-white font-mono">{formatCurrency(position.entryPrice)}</td>
            <td className="p-3 text-sm text-white font-mono">{formatCurrency(position.currentPrice)}</td>
            <td className="p-3 text-sm text-white font-mono">{position.size}</td>
            <td className={`p-3 text-sm font-semibold font-mono ${isProfit ? 'text-success' : 'text-danger'}`}>
                {formatPercentage(position.pnlPercentage, true)}
            </td>
            <td className="p-3 text-xs text-text-secondary">{DateTime.fromISO(position.entryDate).toFormat('dd/MM/yy HH:mm')}</td>
            <td className="p-3 text-center">
                <button 
                    onClick={() => onClose(position.id)} 
                    className="p-1.5 text-text-secondary hover:text-white hover:bg-danger/50 rounded-full"
                    title="Fechar Posição"
                >
                    <XIcon className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );
};

const LivePositionsPanel: React.FC = () => {
    const { livePositions, closePosition } = useData();

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ActivityIcon className="h-6 w-6 text-primary" />
                Posições Abertas
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border text-xs text-text-secondary uppercase">
                            <th className="p-3 font-semibold">Ativo</th>
                            <th className="p-3 font-semibold">Entrada</th>
                            <th className="p-3 font-semibold">Preço Atual</th>
                            <th className="p-3 font-semibold">Tamanho</th>
                            <th className="p-3 font-semibold">P&L %</th>
                            <th className="p-3 font-semibold">Data</th>
                            <th className="p-3 font-semibold text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {livePositions.length > 0 ? (
                            livePositions.map(pos => <PositionRow key={pos.id} position={pos} onClose={closePosition} />)
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-text-secondary">
                                    Nenhuma posição aberta no momento.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LivePositionsPanel;