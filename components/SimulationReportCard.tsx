// components/SimulationReportCard.tsx
import React from 'react';
import { ValidatedSimulationReport, SimulationAIAnalysis } from '../types';
import { formatPercentage } from '../utils/formatters';
import { DateTime } from 'luxon';
import HistoryIcon from './HistoryIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const ScenarioPill: React.FC<{ scenario: SimulationAIAnalysis['closestScenario'], actualPnl: number }> = ({ scenario, actualPnl }) => {
    const config = {
        optimistic: { text: "Otimista", color: "text-success", bg: "bg-success/10" },
        neutral: { text: "Neutro", color: "text-yellow-400", bg: "bg-yellow-400/10" },
        pessimistic: { text: "Pessimista", color: "text-danger", bg: "bg-danger/10" },
        "N/A": { text: "N/A", color: "text-text-secondary", bg: "bg-border" },
    };
    const current = config[scenario];
    const actualColor = actualPnl >= 0 ? 'text-success' : 'text-danger';

    return (
        <div className={`p-3 rounded-lg text-center ${current.bg}`}>
            <p className="text-xs font-bold text-text-secondary uppercase">Cenário Próximo</p>
            <div className="flex items-center justify-center gap-4">
                <div>
                     <p className={`text-xl font-bold ${current.color}`}>{current.text}</p>
                </div>
                <div>
                    <p className="text-xs text-text-secondary">Resultado Real</p>
                    <p className={`text-xl font-bold ${actualColor}`}>{formatPercentage(actualPnl, true)}</p>
                </div>
            </div>
        </div>
    );
};

const SimulationReportCard: React.FC<{ report: ValidatedSimulationReport }> = ({ report }) => {
    const { startTime, endTime, predictedResult, actualResult, aiAnalysis, signals } = report;

    return (
        <div className="bg-background/50 border border-border/70 rounded-lg p-4">
            <div className="flex justify-between items-center text-xs text-text-secondary mb-3">
                <div className="flex items-center gap-1">
                    <HistoryIcon className="h-4 w-4" />
                    <span>{DateTime.fromISO(startTime).toFormat('dd/MM/yy HH:mm')}</span>
                    <span>-</span>
                    <span>{DateTime.fromISO(endTime).toFormat('HH:mm')}</span>
                </div>
                <span>ID: {report.id.substring(0, 8)}</span>
            </div>
            
            <ScenarioPill scenario={aiAnalysis.closestScenario} actualPnl={actualResult.pnlPercentage} />

            <div className="mt-4">
                <div className="max-h-40 overflow-y-auto text-xs font-mono pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                    <div className="grid grid-cols-5 gap-2 text-center font-bold text-text-secondary border-b border-border/50 pb-1 mb-1 sticky top-0 bg-background/50">
                        <div>Ativo</div>
                        <div>Otimista</div>
                        <div>Neutro</div>
                        <div>Pessimista</div>
                        <div className="text-primary">Real</div>
                    </div>
                    {predictedResult.breakdown.map(pred => {
                        const actual = actualResult.breakdown.find(a => a.ticker === pred.ticker);
                        if (!actual) return null;
                        const isActualProfit = actual.pnlPercentage >= 0;
                        return (
                             <div key={pred.ticker} className="grid grid-cols-5 gap-2 text-center py-1 border-b border-border/30 last:border-0">
                                <div className="font-bold text-left text-white">{pred.ticker}</div>
                                <div className="text-success/80">{formatPercentage(pred.optimistic.pnlPercentage, true)}</div>
                                <div className="text-yellow-400/80">{formatPercentage(pred.neutral.pnlPercentage, true)}</div>
                                <div className="text-danger/80">{formatPercentage(pred.pessimistic.pnlPercentage, true)}</div>
                                <div className={`font-bold ${isActualProfit ? 'text-success' : 'text-danger'}`}>{formatPercentage(actual.pnlPercentage, true)}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

             <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-text-secondary italic">
                    <strong className="text-primary not-italic">Autoanálise da IA:</strong> {aiAnalysis.rationale}
                </p>
            </div>
        </div>
    );
};

export default SimulationReportCard;