import React from 'react';
import SynergyIcon from './icons/SynergyIcon';
import LucraQuantumMonitorSkeleton from './skeletons/LucraQuantumMonitorSkeleton';
// FIX: Imported LucraQuantumAnalysis type to define component props.
import { LucraQuantumAnalysis } from '../types';

const Stat: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="bg-background/50 p-4 rounded-lg border border-border/50 text-center">
        <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-secondary">{value}</p>
    </div>
);

// FIX: Added analysis to the component's props to receive data.
interface LucraQuantumMonitorProps {
    isLoading: boolean;
    analysis: LucraQuantumAnalysis | null; // Allow null
}


const LucraQuantumMonitor: React.FC<LucraQuantumMonitorProps> = ({ isLoading, analysis }) => {
    if (isLoading || !analysis) {
        return <LucraQuantumMonitorSkeleton />;
    }

    // FIX: Used the analysis prop to display dynamic data instead of static values.
    return (
        <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
                <SynergyIcon className="h-8 w-8 text-secondary" />
                <h2 className="text-2xl font-bold text-text">Monitor Quântico LUCRA</h2>
            </div>
            <p className="text-sm text-text-secondary mb-6">
                Análise da sinergia entre o fluxo de ordens de curto prazo e os vetores macroeconômicos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Stat label="Sinergia Macro-Tática" value={`${analysis.coherenceScore}%`} />
                <Stat label="Alertas de Conflito" value={String(analysis.conflictAlerts.length)} />
                <Stat label="Vetor de Risco" value={analysis.riskVector} />
            </div>
        </div>
    );
};

export default LucraQuantumMonitor;
