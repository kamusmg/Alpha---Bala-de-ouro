// components/lucra/LucraRolloutPlan.tsx
import React from 'react';
import FileTextIcon from '../icons/FileTextIcon';
import SlidersIcon from '../icons/SlidersIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';

const Phase: React.FC<{ number: number; title: string; description: string; status: 'complete' | 'active' | 'planned' }> = ({ number, title, description, status }) => {
    const statusConfig = {
        complete: {
            textColor: 'text-success',
            icon: <CheckCircleIcon className="h-5 w-5" />,
            label: 'Completo'
        },
        active: {
            textColor: 'text-primary',
            icon: <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />,
            label: 'Ativo'
        },
        planned: {
            textColor: 'text-text-secondary',
            icon: <div className="h-4 w-4 rounded-full bg-border" />,
            label: 'Planejado'
        }
    };
    const config = statusConfig[status];

    return (
        <div className={`p-4 rounded-lg bg-background/50 border border-border/50 ${status === 'active' ? 'border-primary/50' : ''}`}>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white">{number}. {title}</h4>
                <div className={`flex items-center gap-2 text-xs font-semibold ${config.textColor}`}>
                    {config.icon}
                    <span>{config.label}</span>
                </div>
            </div>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
    );
}

const LucraRolloutPlan: React.FC = () => {
    return (
        <details className="group mt-8 bg-surface/30 rounded-lg border border-transparent open:border-border/50 transition-all">
            <summary className="cursor-pointer list-none flex items-center gap-3 text-sm font-semibold text-text-secondary hover:text-primary transition-colors p-3">
                <FileTextIcon className="h-5 w-5" />
                <span>Plano de Rollout do Módulo LUCRA</span>
            </summary>
            <div className="p-4 border-t border-border/50">
                 <div className="space-y-4">
                    <Phase 
                        number={1} 
                        title="Veredito (Observação)"
                        description="Implementação do pipeline de dados e modelo Gemini inicial. O sistema gera sinais em modo de observação, sem execução."
                        status="complete"
                    />
                     <Phase 
                        number={2} 
                        title="Veredito Labs (Ajuste Fino)"
                        description="Análise dos sinais gerados na Fase 1, ajuste de parâmetros e refinamento dos modelos de risco e confiança."
                        status="active"
                    />
                    <Phase 
                        number={3} 
                        title="Modo Híbrido (Execução Parcial)"
                        description="O sistema ganha capacidade de executar ordens de baixo risco via API, com confirmação manual obrigatória."
                        status="planned"
                    />
                 </div>
            </div>
        </details>
    );
};

export default LucraRolloutPlan;
