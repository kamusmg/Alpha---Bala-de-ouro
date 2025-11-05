// This file is renamed to StrategicSimulationCenter.tsx
import React, { useState } from 'react';
import { ForwardSimulationResult } from '../types';
// FIX: Removed unused formatCurrency import.
import { formatPercentage } from '../utils/formatters';
import ClockFastFowardIcon from './icons/ClockFastFowardIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';

interface StrategicSimulationCenterProps {
    simulation: ForwardSimulationResult | null;
    simulatedSignals: string[];
}

// FIX: Updated ScenarioResultCard to only require pnlPercentage, as pnl is no longer available in the data type.
const ScenarioResultCard: React.FC<{ label: string; pnlPercentage: number; icon: React.ReactNode }> = ({ label, pnlPercentage, icon }) => {
    const isProfit = pnlPercentage >= 0;
    return (
        <div className={`p-3 rounded-lg text-center ${isProfit ? 'bg-success/10' : 'bg-danger/10'}`}>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-text-secondary">
                {icon} {label}
            </div>
            <p className={`text-2xl font-bold font-mono ${isProfit ? 'text-success' : 'text-danger'}`}>{formatPercentage(pnlPercentage, true)}</p>
        </div>
    )
}

const StrategicSimulationCenter: React.FC<StrategicSimulationCenterProps> = ({ simulation, simulatedSignals }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSimulate = () => {
        setIsSimulating(true);
        setShowResults(false);
        setTimeout(() => {
            setShowResults(true);
            setIsSimulating(false);
        }, 2000);
    };

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <ClockFastFowardIcon className="h-6 w-6 text-primary" />
                Centro de Simulação Estratégica (4h)
            </h3>
            <p className="text-xs text-text-secondary mb-4">Simulando P&L para os sinais de maior convicção: <span className="font-bold text-primary">{simulatedSignals.join(', ')}</span></p>

            {/* FIX: Check for simulation.total and access nested properties to match the ForwardSimulationResult type. */}
            {showResults && simulation && simulation.total ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ScenarioResultCard label="Otimista" pnlPercentage={simulation.total.optimistic.pnlPercentage} icon={<TrendingUpIcon className="h-4 w-4" />} />
                    <ScenarioResultCard label="Neutro" pnlPercentage={simulation.total.neutral.pnlPercentage} icon={<span className="font-bold">-</span>} />
                    <ScenarioResultCard label="Pessimista" pnlPercentage={simulation.total.pessimistic.pnlPercentage} icon={<TrendingDownIcon className="h-4 w-4" />} />
                </div>
            ) : (
                <p className="text-sm text-text-secondary text-center py-6">
                    {isSimulating ? 'Executando simulações de Monte Carlo...' : 'Clique para projetar o desempenho potencial dos sinais.'}
                </p>
            )}

            <div className="mt-4 text-center">
                 <button 
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="w-full bg-primary/20 text-primary font-semibold py-2 px-4 rounded-md text-sm hover:bg-primary/30 disabled:opacity-50 transition-colors"
                 >
                    {isSimulating ? 'Simulando...' : 'Executar Simulação Estratégica'}
                 </button>
            </div>
        </div>
    );
};

export default StrategicSimulationCenter;