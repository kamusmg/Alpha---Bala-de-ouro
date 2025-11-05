import React from 'react';
import BookOpenIcon from './BookOpenIcon';
import CollapsibleSection from './CollapsibleSection';

interface GuideStepProps {
    step: number;
    title: string;
    description: string;
}

const GuideStep: React.FC<GuideStepProps> = ({ step, title, description }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg">
                {step}
            </div>
            <div className="w-px h-full bg-border"></div>
        </div>
        <div className="pb-8">
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-sm text-text-secondary mt-1">{description}</p>
        </div>
    </div>
);


const RealTradingGuide: React.FC = () => {
    return (
        <CollapsibleSection
            title="Guia para Operar com Dinheiro Real"
            icon={<BookOpenIcon className="h-8 w-8 text-primary" />}
        >
            <div className="space-y-4">
                <GuideStep 
                    step={1} 
                    title="Análise e Confluência" 
                    description="Nunca siga um sinal cegamente. Use os insights da IA como um ponto de partida. Verifique se o sinal se alinha com sua própria análise e estratégia."
                />
                 <GuideStep 
                    step={2} 
                    title="Gerenciamento de Risco" 
                    description="Ajuste o tamanho da posição de acordo com sua tolerância ao risco. O valor de risco e o tamanho da posição sugeridos pela IA são baseados em um modelo padrão. Adapte-os à sua realidade."
                />
                 <GuideStep 
                    step={3} 
                    title="Entrada e Saída" 
                    description="Não precisa entrar no preço exato. Use a 'faixa de entrada' como uma zona. Da mesma forma, considere realizar lucros parciais ao se aproximar do alvo."
                />
                 <GuideStep 
                    step={4} 
                    title="O Stop-Loss é Sagrado" 
                    description="Sempre defina um stop-loss. É a sua rede de segurança. Se o mercado invalidar a tese do sinal, o stop-loss protege seu capital para a próxima oportunidade."
                />
                <div className="text-center text-xs text-text-secondary pt-4">
                    <strong>Disclaimer:</strong> Esta ferramenta é um assistente de análise e não fornece aconselhamento financeiro. Todas as operações são de sua inteira responsabilidade.
                </div>
            </div>
        </CollapsibleSection>
    );
};

export default RealTradingGuide;
