// components/StrategicSimulationCenter.tsx
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { ForwardSimulationResult, HighConvictionSignal, SignalSource } from '../types';
import { formatPercentage } from '../utils/formatters';
import ClockFastFowardIcon from './icons/ClockFastFowardIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';
import LoaderIcon from './icons/LoaderIcon';
import SimulationReportCard from './SimulationReportCard';
import { DateTime } from 'luxon';

interface StrategicSimulationCenterProps {
    simulation: ForwardSimulationResult | null;
    highConvictionSignals: HighConvictionSignal[];
    isLoading: boolean;
    runSimulation: (signals: HighConvictionSignal[]) => void;
}

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

const colorConfig: Record<SignalSource, { base: string; selected: string }> = {
    gold: { base: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50', selected: 'bg-yellow-400 text-black border-yellow-300' },
    silver: { base: 'bg-gray-400/20 text-gray-300 border-gray-400/50', selected: 'bg-gray-300 text-black border-gray-200' },
    bronze: { base: 'bg-orange-600/20 text-orange-400 border-orange-600/50', selected: 'bg-orange-500 text-white border-orange-400' },
    opportunity: { base: 'bg-primary/20 text-primary border-primary/50', selected: 'bg-primary text-white border-blue-300' },
};

const StrategicSimulationCenter: React.FC<StrategicSimulationCenterProps> = ({ simulation, highConvictionSignals, isLoading, runSimulation }) => {
    const { activeSimulation, simulationHistory } = useData();
    const [selectedTickers, setSelectedTickers] = useState<Set<string>>(new Set());
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if (!activeSimulation) return;

        const interval = setInterval(() => {
            const VALIDATION_DURATION = { hours: 4 };
            const endTime = DateTime.fromISO(activeSimulation.startTime).plus(VALIDATION_DURATION);
            const now = DateTime.now();
            const diff = endTime.diff(now, ['hours', 'minutes', 'seconds']);
            
            if (diff.as('seconds') <= 0) {
                setCountdown('Validando...');
                clearInterval(interval);
            } else {
                setCountdown(diff.toFormat("hh:mm:ss"));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSimulation]);


    const handleToggleSelection = (ticker: string) => {
        if (activeSimulation) return; // Don't allow selection while a simulation is active
        const newSelection = new Set(selectedTickers);
        if (newSelection.has(ticker)) {
            newSelection.delete(ticker);
        } else {
            newSelection.add(ticker);
        }
        setSelectedTickers(newSelection);
    };
    
    const handleRunSimulation = () => {
        const selectedSignals = highConvictionSignals.filter(s => selectedTickers.has(s.ticker));
        runSimulation(selectedSignals);
    }

    const renderResults = () => {
        if (!simulation || !simulation.total) return null;
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ScenarioResultCard label="Total Otimista" pnlPercentage={simulation.total.optimistic.pnlPercentage} icon={<TrendingUpIcon className="h-4 w-4" />} />
                    <ScenarioResultCard label="Total Neutro" pnlPercentage={simulation.total.neutral.pnlPercentage} icon={<span className="font-bold">-</span>} />
                    <ScenarioResultCard label="Total Pessimista" pnlPercentage={simulation.total.pessimistic.pnlPercentage} icon={<TrendingDownIcon className="h-4 w-4" />} />
                </div>
                {simulation.rationale && (
                    <p className="text-xs text-text-secondary italic mt-3 text-center">
                        <strong className="text-primary not-italic">Racional da IA:</strong> {simulation.rationale}
                    </p>
                )}
                {simulation.breakdown && simulation.breakdown.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="font-bold text-white text-sm mb-2 text-center">Detalhes da Simulação</h4>
                        <div className="max-h-32 overflow-y-auto text-xs font-mono pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                            <div className="grid grid-cols-4 gap-2 text-center font-bold text-text-secondary border-b border-border/50 pb-1 mb-1 sticky top-0 bg-background/50">
                                <div>Ativo</div><div>Otimista</div><div>Neutro</div><div>Pessimista</div>
                            </div>
                            {simulation.breakdown.map(item => (
                                <div key={item.ticker} className="grid grid-cols-4 gap-2 text-center py-1">
                                    <div className="font-bold text-left text-white">{item.ticker}</div>
                                    <div className="text-success">{formatPercentage(item.optimistic.pnlPercentage, true)}</div>
                                    <div className="text-yellow-400">{formatPercentage(item.neutral.pnlPercentage, true)}</div>
                                    <div className="text-danger">{formatPercentage(item.pessimistic.pnlPercentage, true)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <ClockFastFowardIcon className="h-6 w-6 text-primary" />
                Centro de Simulação Estratégica (4h)
            </h3>
            <p className="text-xs text-text-secondary mb-4">{activeSimulation ? 'Simulação em andamento para validação:' : 'Selecione os ativos para simular o P&L potencial:'}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {highConvictionSignals.map(signal => {
                    const isSelected = activeSimulation ? activeSimulation.signals.some(s => s.ticker === signal.ticker) : selectedTickers.has(signal.ticker);
                    const styles = colorConfig[signal.type];
                    return (
                         <button 
                            key={signal.ticker} 
                            onClick={() => handleToggleSelection(signal.ticker)}
                            disabled={!!activeSimulation}
                            className={`px-3 py-1 text-xs font-bold rounded-full border transition-all duration-200 ${isSelected ? styles.selected : styles.base} ${activeSimulation ? 'cursor-not-allowed' : ''}`}
                         >
                            {signal.ticker}
                        </button>
                    )
                })}
            </div>

            <div className="flex-grow mt-4 bg-background/30 rounded-lg p-4 min-h-[150px] flex flex-col justify-center items-center">
                {isLoading ? (
                    <div className="text-center text-text-secondary">
                        <LoaderIcon className="h-8 w-8 animate-spin text-primary mx-auto" />
                        <p className="mt-2 text-sm font-semibold">Executando simulações...</p>
                    </div>
                ) : (
                    <div className="w-full space-y-4">
                        {activeSimulation && (
                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/50 text-center">
                                <p className="text-sm font-semibold text-primary">Validação da Previsão em Andamento</p>
                                <p className="text-3xl font-bold text-white font-mono">{countdown}</p>
                                <p className="text-xs text-text-secondary">A previsão abaixo será comparada com o resultado real.</p>
                            </div>
                        )}
                        
                        {(simulation && simulation.total) ? renderResults() 
                        : !activeSimulation ? (
                            <div className="text-center text-text-secondary py-10">
                                <p className="font-semibold">Nenhuma simulação executada.</p>
                                <p className="text-sm mt-1">Selecione um ou mais ativos e clique em executar.</p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <div className="mt-4 text-center">
                <button 
                    onClick={handleRunSimulation}
                    disabled={isLoading || selectedTickers.size === 0 || !!activeSimulation}
                    className="w-full bg-primary/20 text-primary font-semibold py-2 px-4 rounded-md text-sm hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading ? <><LoaderIcon className="h-4 w-4 animate-spin"/> Simulando...</> : `Executar Simulação (${selectedTickers.size})`}
                </button>
            </div>
            
            {simulationHistory.length > 0 && (
                <div className="mt-8">
                    <h4 className="text-lg font-bold text-white mb-4">Histórico de Simulações</h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                        {simulationHistory.map(report => (
                            <SimulationReportCard key={report.id} report={report} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StrategicSimulationCenter;