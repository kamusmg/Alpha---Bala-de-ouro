// components/RobustnessAudit.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { formatPercentage } from '../utils/formatters';
import ShieldCheckIcon from './ShieldCheckIcon';
import GoIcon from './GoIcon';
import CautionIcon from './CautionIcon';
import DrawdownHeatmap from './DrawdownHeatmap';

const RobustnessAudit: React.FC = () => {
    const { backtestData } = useData();
    // FIX: Access robustnessAudit from the 'Geral' property to match the BacktestAnalysisResult type.
    const audit = backtestData?.Geral.robustnessAudit;

    if (!audit) {
        // You can add a skeleton loader here if needed
        return <div>Loading Robustness Audit...</div>;
    }

    const isSatisfactory = audit.robustnessConclusion === 'Satisfatório';

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Auditoria de Robustez do Modelo</h2>
            </div>
            <p className="text-sm text-text-secondary mb-6">
                Análise de estresse simulando condições de mercado adversas para testar a resiliência e os limites do modelo de IA.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className={`lg:col-span-1 p-6 rounded-lg border-2 ${isSatisfactory ? 'border-success bg-success/10' : 'border-danger bg-danger/10'}`}>
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider text-center">Conclusão da Auditoria</h4>
                    <p className={`text-4xl font-bold text-center my-2 ${isSatisfactory ? 'text-success' : 'text-danger'}`}>{audit.robustnessConclusion}</p>
                    <p className="text-xs text-text-secondary text-center">{audit.errorDiagnosis}</p>
                </div>
                 <div className="lg:col-span-2 bg-background/50 border border-border/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-bold text-white text-center mb-2">Métricas sob Estresse</h4>
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-xs text-text-secondary">Taxa de Acerto</p>
                            <p className="text-2xl font-bold text-primary">{formatPercentage(audit.successRate)}</p>
                        </div>
                         <div>
                            <p className="text-xs text-text-secondary">Lucro Líquido Total</p>
                            <p className="text-2xl font-bold text-white">{formatPercentage(audit.totalNetProfitPercentage)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <GoIcon className="h-6 w-6 text-green-400" />
                        <h5 className="font-bold text-green-300">Cenários de Sucesso (Exemplos)</h5>
                    </div>
                    <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                        {audit.positiveExamples.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                </div>
                <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
                     <div className="flex items-center gap-3 mb-2">
                        <CautionIcon className="h-6 w-6 text-red-400" />
                        <h5 className="font-bold text-red-300">Cenários de Falha (Exemplos)</h5>
                    </div>
                     <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                        {audit.negativeExamples.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                </div>
            </div>
            
            <DrawdownHeatmap />
        </div>
    );
};

export default RobustnessAudit;
