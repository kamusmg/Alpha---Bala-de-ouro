import React, { useState } from 'react';
import { BacktestSignal } from '../types';
import SignalCard from './SignalCard';
import ChevronDownIcon from './ChevronDownIcon';

interface BacktestHorizonSectionProps {
  title: string;
  signals: BacktestSignal[];
  defaultOpen?: boolean;
}

const BacktestHorizonSection: React.FC<BacktestHorizonSectionProps> = ({ title, signals, defaultOpen = true }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedSignals = showAll ? signals : signals.slice(0, 3);

    return (
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-text mb-6 pb-2 border-b-2 border-border">{title}</h2>
            {signals.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedSignals.map((signal) => (
                        <SignalCard key={signal.id} signal={signal} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-surface/30 rounded-lg">
                    <p className="text-text-secondary">Nenhum sinal encontrado para este horizonte.</p>
                </div>
            )}
            {signals.length > 3 && (
                <div className="text-center mt-6">
                    <button 
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 mx-auto text-sm font-semibold text-primary hover:text-opacity-80"
                    >
                        <span>{showAll ? 'Mostrar Menos' : 'Mostrar Todos'}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            )}
        </section>
    );
};

export default BacktestHorizonSection;
