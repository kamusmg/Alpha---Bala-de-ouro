// services/geminiService.ts
import { DateTime } from 'luxon';
import { 
    PresentDayAnalysisResult, 
    BacktestAnalysisResult,
    AlphaHuntData,
    SelfAnalysis,
    RobustnessAuditReport,
    AdaptiveBacktestResult,
    MinimalAssetInfo,
    AssetCategory
} from '../types';

// This file contains mock data generators for the frontend.
// In a real remote backend setup, these would be replaced by actual API calls.

const generateAllAssets = (): MinimalAssetInfo[] => {
    // FIX: Explicitly cast 'category' to AssetCategory to resolve a type inference issue where
    // TypeScript was incorrectly widening the type to 'string' in this context.
    const assets: MinimalAssetInfo[] = [
        // L1/L2
        { id: '1', ticker: 'ETH', assetName: 'Ethereum', category: 'L1/L2' as AssetCategory, overallScore: 92 },
        { id: '2', ticker: 'SOL', assetName: 'Solana', category: 'L1/L2' as AssetCategory, overallScore: 88 },
        { id: '3', ticker: 'AVAX', assetName: 'Avalanche', category: 'L1/L2' as AssetCategory, overallScore: 85 },
        { id: '4', ticker: 'SUI', assetName: 'Sui', category: 'L1/L2' as AssetCategory, overallScore: 82 },
        { id: '5', ticker: 'SEI', assetName: 'Sei', category: 'L1/L2' as AssetCategory, overallScore: 81 },
        { id: 'kas-id', ticker: 'KAS', assetName: 'Kaspa', category: 'L1/L2' as AssetCategory, overallScore: 79 },
         ...Array.from({ length: 9 }, (_, i) => ({ id: `l1-${i}`, ticker: `L1-${i}`, assetName: `L1 Asset ${i+1}`, category: 'L1/L2' as AssetCategory, overallScore: 70 - i*2 })),
        // DeFi
        { id: 'inj-id', ticker: 'INJ', assetName: 'Injective', category: 'DeFi' as AssetCategory, overallScore: 86 },
        { id: 'uni-id', ticker: 'UNI', assetName: 'Uniswap', category: 'DeFi' as AssetCategory, overallScore: 84 },
        { id: 'aave-id', ticker: 'AAVE', assetName: 'Aave', category: 'DeFi' as AssetCategory, overallScore: 83 },
         ...Array.from({ length: 17 }, (_, i) => ({ id: `df-${i}`, ticker: `DF-${i}`, assetName: `DeFi Asset ${i+1}`, category: 'DeFi' as AssetCategory, overallScore: 75 - i*2 })),
        // Gaming
        { id: 'imx-id', ticker: 'IMX', assetName: 'Immutable X', category: 'Gaming' as AssetCategory, overallScore: 80 },
         ...Array.from({ length: 9 }, (_, i) => ({ id: `gm-${i}`, ticker: `GM-${i}`, assetName: `Gaming Asset ${i+1}`, category: 'Gaming' as AssetCategory, overallScore: 78 - i*3 })),
        // Infra
        { id: 'paal-id', ticker: 'PAAL', assetName: 'PAAL AI', category: 'Infra' as AssetCategory, overallScore: 95 },
        { id: 'rndr-id', ticker: 'RNDR', assetName: 'Render', category: 'Infra' as AssetCategory, overallScore: 91 },
         ...Array.from({ length: 10 }, (_, i) => ({ id: `in-${i}`, ticker: `IN-${i}`, assetName: `Infra Asset ${i+1}`, category: 'Infra' as AssetCategory, overallScore: 80 - i*2 })),
    ];
    return assets;
}

export const generateSignalDetails = (ticker: string, category: AssetCategory): PresentDayAnalysisResult['presentDayBuySignals'][0] => {
    return {
        id: `${ticker}-id`, assetName: ticker, ticker: ticker, category: category, confidence: 'Alta',
        status: 'WAITING',
        narrativeAlignment: 'Restaking',
        onChainIntelligence: { summary: 'Aumento significativo de staking e atividade em L2s.' },
        automationSetup: { justification: 'Entrada em correção de curto prazo visando nova máxima.' },
        entryChecklist: { score: 8.5, items: [{ item: 'Volume Acima da Média', status: true, value: 'Sim' }] },
        justifications: {
            strategy: 'LONG',
            entryRange: { value: { min: 3450, max: 3550 }, tooltip: 'Zona de suporte.' },
            target: { value: 4100, tooltip: 'Próxima resistência chave.' },
            stopLoss: { value: 3350, tooltip: 'Invalidação da estrutura.' },
            confidenceScore: { value: 85, tooltip: 'Alta confluência de fatores.' }
        }
    };
}


export const generatePresentDayAnalysis = (): PresentDayAnalysisResult => {
    const allAssets = generateAllAssets();
    const assetSummaries = allAssets.reduce((acc, asset) => {
        if (!acc[asset.category]) {
            acc[asset.category] = { category: asset.category, assetCount: 0, sentiment: 0, totalScore: 0 };
        }
        acc[asset.category].assetCount++;
        acc[asset.category].totalScore += asset.overallScore;
        return acc;
    }, {} as Record<AssetCategory, { category: AssetCategory, assetCount: number, sentiment: number, totalScore: number }>);
    
    return {
        macroContext: [
            { name: 'Regime de Mercado', value: 'Bull - Cautela', interpretation: 'Tendência de alta com sinais de exaustão.', status: 'good' },
            { name: 'Veredito Final Alpha', value: 'OTIMISTA', interpretation: 'O motor está otimista, mas recomenda cautela.', status: 'good' },
            { name: 'Fluxo de Capital', value: '+ $250M', interpretation: 'Entrada líquida de capital em cripto nas últimas 24h.', status: 'good' },
            { name: 'Sentimento', value: 'Ganância (72)', interpretation: 'O mercado está em um estado de ganância.', status: 'warning' },
        ],
        presentDayBuySignals: [
            generateSignalDetails('ETH', 'L1/L2'),
        ],
        presentDaySellSignals: [],
        asymmetricArsenal: {
            gold: {
                id: 'ab-gold-paal-01', tier: 'Gold', assetName: 'PAAL AI', ticker: 'PAAL', category: 'Infra', confidence: 'Alta', status: 'WAITING',
                onChainIntelligence: { summary: 'Anomalias extremas de volume social e atividade de novas carteiras.' },
                automationSetup: { justification: 'Sinal de caça de risco absoluto baseado em potencial de narrativa viral.' },
                entryChecklist: { score: 9.8, items: [] },
                justifications: {
                    strategy: 'LONG',
                    entryRange: { value: { min: 0.40, max: 0.42 }, tooltip: 'Zona de breakout de micro-range.' },
                    target: { value: 1.50, tooltip: 'Projeção de expansão de 10x do movimento inicial.' },
                    stopLoss: { value: 0.28, tooltip: 'Invalidação da estrutura de breakout de baixo tempo gráfico.' },
                    confidenceScore: { value: 98, tooltip: 'Confluência de gatilhos de anomalia extrema.' }
                },
                explosionPotential: 98, riskLevel: 'Absoluto',
                rationale: 'MODO ALQUIMISTA (IA VIVA): PAAL foi sinalizado por métricas sociais e on-chain exponenciais. A IA validou a tese de "agente de IA", identificando um potencial de valorização de 1000x com risco de perda total. A comunidade é fanática e o desenvolvimento é rápido.',
                counterSignalRisk: 'Risco de ser uma "narrativa de um dia". A tecnologia ainda não foi provada em escala e o ativo é suscetível a manipulação extrema.'
            },
            silver: {
                id: 'ab-silver-kas-01', tier: 'Silver', assetName: 'Kaspa', ticker: 'KAS', category: 'L1/L2', confidence: 'Alta', status: 'WAITING',
                onChainIntelligence: { summary: 'Aumento notável de novas carteiras e volume de transações.' },
                automationSetup: { justification: 'Sinal de caça assimétrica baseado em anomalia de volume e contração de volatilidade.' },
                entryChecklist: { score: 9.5, items: [] },
                justifications: {
                    strategy: 'LONG',
                    entryRange: { value: { min: 0.15, max: 0.16 }, tooltip: 'Zona de reacumulação pós-compressão das Bandas de Bollinger.' },
                    target: { value: 0.28, tooltip: 'Projeção de Fibonacci da onda anterior.' },
                    stopLoss: { value: 0.12, tooltip: 'Ponto de invalidação da estrutura de breakout.' },
                    confidenceScore: { value: 95, tooltip: 'Confluência de múltiplos gatilhos de anomalia.' }
                },
                explosionPotential: 95, riskLevel: 'Extremo',
                rationale: 'MODO ARQUEÓLOGO (IA VIVA): Kaspa (KAS) foi sinalizado por anomalias quantitativas. A IA investigou e validou a tese de PoW-DAG, identificando um potencial de valorização assimétrico apesar do risco extremo. A comunidade é forte e o desenvolvimento ativo.',
                counterSignalRisk: 'O principal risco é a competição de L1s mais estabelecidas e a volatilidade inerente a ativos de baixa capitalização.'
            },
            bronze: {
                id: 'ab-bronze-inj-01', tier: 'Bronze', assetName: 'Injective', ticker: 'INJ', category: 'DeFi', confidence: 'Média', status: 'WAITING',
                onChainIntelligence: { summary: 'Atividade de staking estável e crescimento de TVL no ecossistema.' },
                automationSetup: { justification: 'Sinal de risco elevado calculado em ponto de inflexão técnico.' },
                entryChecklist: { score: 8.2, items: [] },
                justifications: {
                    strategy: 'LONG',
                    entryRange: { value: { min: 24.5, max: 25.5 }, tooltip: 'Zona de forte suporte e retração de Fibonacci de 0.618.' },
                    target: { value: 45.0, tooltip: 'Retorno à máxima local anterior.' },
                    stopLoss: { value: 22.0, tooltip: 'Perda do nível de suporte chave.' },
                    confidenceScore: { value: 82, tooltip: 'Confluência de suporte técnico e força da narrativa de interoperabilidade.' }
                },
                explosionPotential: 82, riskLevel: 'Elevado',
                rationale: 'MODO ESTRATEGISTA (IA VIVA): Injective está em um ponto técnico de inflexão claro, com fundamentos sólidos. A IA validou que o risco/recompensa é favorável para uma aposta estratégica, aproveitando a narrativa de interoperabilidade e DeFi 2.0.',
                counterSignalRisk: 'Risco de falha do suporte técnico se o mercado geral (BTC) mostrar fraqueza. A competição no setor de interoperabilidade é alta.'
            },
            dangerZone: [
                { ticker: 'WIF', name: 'Dogwifhat', rationale: 'Alta volatilidade e funding rate negativo extremo, risco de short squeeze.' },
                { ticker: 'ZEUS', name: 'Zeus Network', rationale: 'Narrativa de interoperabilidade Solana-BTC, alto engajamento social, mas sem produto claro.' },
                { ticker: 'ORDI', name: 'Ordinals', rationale: 'Atividade on-chain de BRC-20 ressurgindo, mas altamente especulativo.' }
            ]
        },
        alphaDivergence: [
            { name: 'Render', ticker: 'RNDR', performanceVsMarket: { asset: 8.5, market: -1.2 }, rationale: 'A narrativa de IA e DePIN continua forte, atraindo capital especulativo.', strengthScore: 88 }
        ],
        deepOnChainAnalysis: {
            overallSentiment: 'bullish', sentimentScore: 78,
            keyMetrics: [{ name: 'Net Unrealized Profit/Loss (NUPL)', value: '0.62', status: 'bullish', interpretation: 'Lucro não realizado indica confiança dos detentores.' }],
            whaleWatch: { last24hNetFlow: 150000000 },
            exchangeFlows: { last24hNetFlow: -250000000 }
        },
        advancedMarketRegime: {
            currentRegime: 'Bull', regimeTransitionDetected: false, transitionFrom: null,
            accelerationScore: 75, exhaustionScore: 60,
            interclassDominance: { btcVsAlts: 'ALTS', spotVsDerivatives: 'Spot', strongestNarrative: 'AI' },
            heatmap90d: Array.from({ length: 90 }).map((_, i) => ({ date: DateTime.now().minus({ days: 90 - i }).toISODate() as string, regime: (['Bull', 'Sideways', 'Bear'] as const)[Math.floor(Math.random()*3)]})),
            strategyRecommendation: 'Comprar em Baixas (Dip Buying)',
            recommendationRationale: 'A tendência de alta permanece intacta, mas a exaustão sugere que as melhores entradas ocorrerão durante correções de curto prazo.'
        },
        assetClassSummaries: Object.values(assetSummaries).map(s => ({...s, sentiment: s.totalScore / s.assetCount})),
        crossAssetAnalysis: {
            traditionalAssets: [
                { name: 'S&P 500', ticker: 'SPX', value: 5400.50, change: 0.5 },
                { name: 'Dólar (DXY)', ticker: 'DXY', value: 105.2, change: -0.2 }
            ]
        },
        allAssets: allAssets,
    };
};

export const generateBacktestAnalysis = (): BacktestAnalysisResult => {
    const robustnessAudit = generateRobustnessAudit();
    const generalResult: AdaptiveBacktestResult = {
        summary: { totalTrades: 150, winningTrades: 95, losingTrades: 55, successRate: 63.33, totalNetProfit: 125030.45, totalNetProfitPercentage: 12.5, maxDrawdown: 15.2, sharpeRatio: 1.8 },
        buySignals: Array.from({length: 5}, () => ({ id: Math.random().toString(), assetName: 'BTC', signalType: 'COMPRA', strategy: 'Momentum Breakout', entryDatetime: '2023-05-10 14:30', exitDatetime: '2023-05-12 09:00', investment: 10000, finalValue: 11200, profit: 1200, roiPercentage: 12, pastPrice: 27000, futurePrice: 30240 })),
        sellSignals: Array.from({length: 3}, () => ({ id: Math.random().toString(), assetName: 'ETH', signalType: 'VENDA', strategy: 'Mean Reversion', entryDatetime: '2023-06-01 10:00', exitDatetime: '2023-06-02 18:00', investment: 10000, finalValue: 9500, profit: -500, roiPercentage: -5, pastPrice: 1900, futurePrice: 1805 })),
        failedSignal: { id: Math.random().toString(), assetName: 'SOL', signalType: 'COMPRA', strategy: 'Dip Buying', entryDatetime: '2023-04-20 08:00', exitDatetime: '2023-04-21 12:00', investment: 10000, finalValue: 8800, profit: -1200, roiPercentage: -12, pastPrice: 22, futurePrice: 19.36 },
        selfAnalysis: { failedModel: "Modelo 'Dip Buyer v2.1'", errorExplanation: "O modelo falhou em distinguir uma correção saudável de um colapso de estrutura de mercado, resultando em uma entrada prematura.", errorImpactAnalysis: "A falha causou um drawdown de 12% na operação, impactando o resultado mensal em -0.8%." },
        evolutionPrompt: "Refine a lógica de 'Dip Buying' para incluir um filtro de volatilidade e um critério de confirmação de volume mais rigoroso. O modelo deve esperar por uma vela de confirmação de 4H antes de acionar uma entrada.",
        correctionSuggestion: "Adicionar um filtro de VIX/VIX_Cripto e requerer que o volume da vela de entrada seja 150% maior que a média das 20 velas anteriores.",
        backtestStrengths: "O modelo performa bem em mercados de tendência clara, capturando grandes movimentos direcionais.",
        backtestWeaknesses: "O modelo é vulnerável a 'whipsaws' (movimentos bruscos de preço para cima e para baixo) em mercados laterais e de baixa volatilidade.",
        robustnessAudit: robustnessAudit,
        alphaDecay: 0.15,
        statisticalRobustness: 0.82,
        avgNetExposure: 0.45,
        crossTradeCorrelation: 0.22,
        drawdownHeatmap: Array.from({ length: 90 }, () => Math.random()),
        aiCommentary: "The model shows strong performance in trending markets but needs refinement in range-bound conditions to reduce false signals.",
        cognitiveDiagnosis: {
            diagnosis: "Slight confirmation bias detected in high-momentum scenarios.",
            errorImpact: "Led to over-leveraging on two occasions during the simulation.",
            correctionProposal: "Introduce a momentum divergence indicator as a cross-check before entry.",
            robustnessTest: "Passed 8/10 stress tests, failing only in extreme low-liquidity scenarios."
        }
    };
     return {
        Geral: generalResult,
        'L1/L2': generalResult,
        'DeFi': generalResult,
        'Gaming': generalResult,
        'Infra': generalResult,
        'Other': generalResult,
    };
};

export const generateAlphaHuntFromDailyAlpha = (): AlphaHuntData => {
    return {
        results: [
            {
                narrative: {
                    name: "Inteligência Artificial (IA)",
                    description: "Ativos relacionados à IA continuam a mostrar força relativa, impulsionados por avanços no setor e especulação sobre seu impacto futuro.",
                    popularityIndex: 88,
                    weeklyChange: 12.5,
                    mentionGrowthRate: 35,
                    dominantSentiment: 'Positivo',
                    maturity: 'Expansão',
                },
                opportunities: [
                    { name: 'Bittensor', ticker: 'TAO', rationale: 'Líder de mercado em IA descentralizada, com forte comunidade.', confidence: 'Alta', marketRelevanceScore: 92 },
                    { name: 'Render', ticker: 'RNDR', rationale: 'Rede de renderização GPU descentralizada, essencial para o treinamento de modelos de IA.', confidence: 'Alta', marketRelevanceScore: 89 },
                    { name: 'Fetch.ai', ticker: 'FET', rationale: 'Plataforma para agentes autônomos de IA, com ecossistema em crescimento.', confidence: 'Média', marketRelevanceScore: 85 }
                ]
            }
        ],
        vortexStatus: {
            'TAO': 'hot',
            'RNDR': 'hot',
            'FET': 'neutral'
        }
    };
};

export const runSupervisorDirective = (analysis: SelfAnalysis, promptText: string): { directive: string } => {
    return { directive: `[MOCK] Diretiva recebida para ${analysis.failedModel}. O prompt será executado.` };
};

export const generateRobustnessAudit = (): RobustnessAuditReport => {
     return {
        successRate: 58.7,
        totalNetProfit: 89450.12,
        totalNetProfitPercentage: 8.95,
        robustnessConclusion: 'Satisfatório',
        errorDiagnosis: "O sistema demonstrou resiliência em cenários de alta volatilidade, mas apresentou perdas em mercados de baixa liquidez.",
        positiveExamples: ["Flash crash do BTC (-20%)", "Crise de liquidez de stablecoin"],
        negativeExamples: ["Mercado lateral prolongado (choppy)", "Baixo volume de negociação no fim de semana"]
    };
}