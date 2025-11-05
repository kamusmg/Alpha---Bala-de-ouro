// components/ExecutionLogPanel.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { ExecutionLogEntry } from '../types';
import { DateTime } from 'luxon';
import { formatCurrency } from '../utils/formatters';
import TerminalIcon from './icons/TerminalIcon';

const LogEntry: React.FC<{ entry: ExecutionLogEntry }> = ({ entry }) => {
    const isBuy = entry.action.includes('LONG') || entry.action.includes('BUY');
    const colorClass = isBuy ? 'text-success' : 'text-danger';

    return (
        <div className="font-mono text-xs flex gap-3 p-1 hover:bg-background/50 rounded">
            <span className="text-text-secondary">{DateTime.fromISO(entry.timestamp).toFormat('HH:mm:ss')}</span>
            <span className={`font-bold w-20 flex-shrink-0 ${colorClass}`}>{entry.action}</span>
            <span className="font-bold text-white w-16 flex-shrink-0">{entry.asset}</span>
            <span className="text-text-secondary w-24 flex-shrink-0">@ {formatCurrency(entry.price)}</span>
            <span className="text-text-secondary/70 truncate">{entry.notes}</span>
        </div>
    );
}

const ExecutionLogPanel: React.FC = () => {
    const { executionLog } = useData();

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TerminalIcon className="h-6 w-6 text-primary" />
                Log de Execução
            </h3>
            <div className="flex-grow bg-background/50 rounded-md p-2 overflow-y-auto h-48 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                {executionLog.length > 0 ? (
                    [...executionLog].reverse().map(entry => <LogEntry key={entry.id} entry={entry} />)
                ) : (
                     <p className="text-center text-text-secondary text-sm py-8">Nenhuma execução registrada.</p>
                )}
            </div>
        </div>
    );
};

export default ExecutionLogPanel;
