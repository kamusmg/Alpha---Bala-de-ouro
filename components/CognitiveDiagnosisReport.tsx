import React from 'react';
import StethoscopeIcon from './icons/StethoscopeIcon';
import WrenchIcon from './icons/WrenchIcon';
import BeakerIcon from './icons/BeakerIcon';

const DiagnosisItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="text-primary">{icon}</div>
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <p className="text-sm text-text-secondary">{description}</p>
    </div>
);

const CognitiveDiagnosisReport: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
                <StethoscopeIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Relatório de Diagnóstico Cognitivo</h2>
            </div>
            <p className="text-text-secondary text-sm">
                Uma análise interna dos vieses cognitivos, heurísticas e desempenho do modelo de IA em cenários simulados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DiagnosisItem 
                    icon={<WrenchIcon className="h-6 w-6" />}
                    title="Ajuste Heurístico"
                    description="O modelo mostra um leve viés de confirmação em mercados de alta, necessitando de ajuste nos pesos de indicadores contrários."
                />
                <DiagnosisItem
                    icon={<BeakerIcon className="h-6 w-6" />}
                    title="Teste de Racionalidade"
                    description="Aprovado no teste de racionalidade sob estresse. As decisões em cenários de 'cisne negro' simulados foram consistentes com os protocolos de risco."
                />
                 <DiagnosisItem
                    icon={<StethoscopeIcon className="h-6 w-6" />}
                    title="Saúde do Modelo"
                    description="Nenhum sinal de 'overfitting' detectado. A taxa de aprendizado está estável e a degradação do modelo está dentro dos limites esperados."
                />
            </div>
        </div>
    );
};

export default CognitiveDiagnosisReport;
