// components/lucra/LucraStatusHeader.tsx
import React from 'react';
// FIX: Corrected import path for types
import { LucraSystemStatus } from '../../types';

interface LucraStatusHeaderProps {
    status: LucraSystemStatus;
    onDeactivate: () => void;
}

const LucraStatusHeader: React.FC<LucraStatusHeaderProps> = ({ status, onDeactivate }) => {
    const statusConfig = {
        INACTIVE: { text: 'Inativo', color: 'text-text-secondary', pulse: false },
        CONNECTING: { text: 'Conectando...', color: 'text-blue-400', pulse: true },
        ACTIVE_CALM: { text: 'Ativo (Calmo)', color: 'text-success', pulse: true },
        ACTIVE_VOLATILITY: { text: 'Ativo (Volatilidade)', color: 'text-danger', pulse: true },
    };

    const current = statusConfig[status];

    if (status === 'INACTIVE') return null;

    return (
        <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className={`relative flex h-3 w-3 ${current.pulse ? '' : 'hidden'}`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${current.color.replace('text-', 'bg-')} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${current.color.replace('text-', 'bg-')}`}></span>
                </span>
                <span className={`font-semibold ${current.color}`}>{current.text}</span>
            </div>
             <button
                onClick={onDeactivate}
                className="text-xs font-semibold bg-danger/20 text-danger px-3 py-1 rounded-lg hover:bg-danger/30 transition-colors"
            >
                Desativar
            </button>
        </div>
    );
};

export default LucraStatusHeader;
