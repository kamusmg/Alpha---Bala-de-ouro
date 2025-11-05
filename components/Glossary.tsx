import React from 'react';

const GlossaryItem: React.FC<{ term: string; definition: string }> = ({ term, definition }) => (
    <div className="border-b border-border/50 pb-2 mb-2">
        <h4 className="font-bold text-white">{term}</h4>
        <p className="text-sm text-text-secondary">{definition}</p>
    </div>
);

const Glossary: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4">Glossário de Termos</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                <GlossaryItem term="On-Chain Intelligence" definition="Análise de dados diretamente da blockchain, como transações de grandes carteiras ('baleias'), para prever movimentos de mercado." />
                <GlossaryItem term="Risco/Recompensa (RR)" definition="Uma razão que compara o lucro potencial de uma operação com sua perda potencial. Um RR de 1:3 significa que você arrisca $1 para potencialmente ganhar $3." />
                <GlossaryItem term="Funding Rate (Taxa de Financiamento)" definition="Pagamentos periódicos entre traders de posições long (compradas) e short (vendidas) em mercados de futuros perpétuos. Ajuda a manter o preço do contrato alinhado com o preço à vista." />
                <GlossaryItem term="Open Interest (OI)" definition="O número total de contratos de derivativos em aberto que não foram liquidados. Um OI crescente indica novo capital entrando no mercado." />
                <GlossaryItem term="Liquidação" definition="O fechamento forçado da posição alavancada de um trader quando ele não tem mais margem suficiente para manter a posição aberta." />
            </div>
        </div>
    );
};

export default Glossary;
