// components/lucra/LucraActivationScreen.tsx
import React from 'react';
import ZapIcon from '../icons/ZapIcon';
import ServerIcon from '../icons/ServerIcon';
import WaveformIcon from '../icons/WaveformIcon';

interface LucraActivationScreenProps {
    onActivate: () => void;
}

const FeaturePill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 bg-background/50 border border-border/50 rounded-full px-3 py-1 text-sm text-text-secondary">
        {icon}
        <span>{text}</span>
    </div>
);

const LucraActivationScreen: React.FC<LucraActivationScreenProps> = ({ onActivate }) => {
    return (
        <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-8 shadow-lg text-center flex flex-col items-center">
            <div className="text-primary mb-4">
                <ZapIcon className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold text-text">Módulo LUCRA Desativado</h2>
            <p className="text-text-secondary mt-2 max-w-lg mx-auto">
                Ative o agente reativo de baixa latência para iniciar a análise de fluxo de ordens e geração de sinais de curto prazo em tempo real.
            </p>
            <div className="flex flex-wrap justify-center gap-3 my-6">
                <FeaturePill icon={<ServerIcon className="h-4 w-4" />} text="Conexão WebSocket" />
                <FeaturePill icon={<WaveformIcon className="h-4 w-4" />} text="Análise de Liquidez" />
                <FeaturePill icon={<ZapIcon className="h-4 w-4" />} text="Sinais de Baixa Latência" />
            </div>
            <button
                onClick={onActivate}
                className="bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all text-lg"
            >
                Ativar Módulo LUCRA
            </button>
            <p className="text-xs text-text-secondary mt-4 max-w-md mx-auto">
                <strong>Aviso:</strong> A ativação do módulo estabelece uma conexão WebSocket contínua com a exchange para streaming de dados de mercado.
            </p>
        </div>
    );
};

export default LucraActivationScreen;
