// backend/src/services/geminiService.ts
import { GoogleGenAI, Type } from '@google/genai';
import { 
    PresentDayAnalysisResult,
    BacktestAnalysisResult,
    AlphaHuntData,
    SelfAnalysis,
    RobustnessAuditReport,
    TradingDeskData,
    GlobalPerformanceData,
    LucraQuantumAnalysis,
    AdaptiveBacktestResult,
    AsymmetricSignal,
    AsymmetricSignalTier,
    AsymmetricArsenal,
    DangerZoneAsset,
    // FIX: Added missing type import
    AsymmetricOpportunitiesData
} from '../types.js';
import { DateTime } from 'luxon';

const getAIClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY for Gemini is not set in environment variables.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}


const generateAsymmetricSignal = async (tier: AsymmetricSignalTier): Promise<AsymmetricSignal | null> => {
    const ai = getAIClient();
    let prompt: string;
    let candidateTicker: string;
    let mode: string;
    let riskLevel: AsymmetricSignal['riskLevel'];

    switch(tier) {
        case 'Gold':
            mode = 'ALQUIMISTA';
            riskLevel = 'Absoluto';
            candidateTicker = 'PAAL'; // Exemplo de micro-cap
            prompt = `**MODO ${mode} ATIVADO.** Foque em criptoativos de micro-capitalização (fora do top 150) com potencial de 1000x. O ativo ${candidateTicker} mostrou anomalias extremas de dados sociais e on-chain. **Sua missão:** Valide se é uma gema rara ou um 'rug pull'. Investigue os fundamentos qualitativos — tokenomics, equipe, comunidade, narrativa subjacente. Forneça um racional para um trade de risco absoluto e recompensa alquímica.`;
            break;
        case 'Silver':
            mode = 'ARQUEÓLOGO';
            riskLevel = 'Extremo';
            candidateTicker = 'KAS'; // Exemplo de mid-cap volátil
            prompt = `**MODO ${mode} ATIVADO.** O ativo de baixa a média capitalização ${candidateTicker} passou por filtros de anomalia quantitativa (volume, momentum). **Sua missão:** Investigue os fundamentos qualitativos. Valide se é uma potencial gema de 100x ou uma armadilha. Forneça o racional para um trade de altíssimo risco e recompensa.`;
            break;
        case 'Bronze':
            mode = 'ESTRATEGISTA';
            riskLevel = 'Elevado';
            candidateTicker = 'INJ'; // Exemplo de ativo mais estabelecido
            prompt = `**MODO ${mode} ATIVADO.** O ativo estabelecido ${candidateTicker} está em um ponto de inflexão técnico e narrativo. **Sua missão:** Analise se o risco/recompensa é favorável para uma aposta estratégica. Confirme a força dos suportes e da narrativa atual. Forneça o racional para um trade de risco elevado, porém calculado.`;
            break;
    }
    
    console.log(`[GEMINI SERVICE] Gerando Bala de ${tier} para ${candidateTicker} com ${mode}.`);

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            rationale: { type: Type.STRING, description: "O racional detalhado para o trade, alinhado com o modo de operação." },
            counterSignalRisk: { type: Type.STRING, description: "A análise dos riscos e contra-sinais." }
        },
        required: ["rationale", "counterSignalRisk"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: responseSchema },
        });

        const parsedJson = JSON.parse(response.text);

        // Mock data for entry points, etc. This would come from a technical analysis module.
        const justifications = {
            'Gold': { entry: { min: 0.40, max: 0.42 }, target: 1.50, stop: 0.28 },
            'Silver': { entry: { min: 0.15, max: 0.16 }, target: 0.28, stop: 0.12 },
            'Bronze': { entry: { min: 24.5, max: 25.5 }, target: 45.0, stop: 22.0 }
        }[tier];

        const signal: AsymmetricSignal = {
            id: `ab-${tier.toLowerCase()}-${candidateTicker.toLowerCase()}-01`,
            tier: tier, assetName: candidateTicker, ticker: candidateTicker, category: 'L1/L2', confidence: 'Alta', status: 'WAITING',
            onChainIntelligence: { summary: `Anomalias detectadas pelo modo ${mode}.` },
            automationSetup: { justification: `Sinal de caça de risco ${riskLevel}.` },
            entryChecklist: { score: 9.5, items: [] },
            justifications: {
                strategy: 'LONG',
                entryRange: { value: justifications.entry, tooltip: 'Zona de entrada calculada.' },
                target: { value: justifications.target, tooltip: 'Alvo de potencial explosivo.' },
                stopLoss: { value: justifications.stop, tooltip: 'Ponto de invalidação da tese.' },
                confidenceScore: { value: 95, tooltip: 'Confluência de gatilhos de anomalia.' }
            },
            explosionPotential: { 'Gold': 98, 'Silver': 95, 'Bronze': 82 }[tier],
            riskLevel: riskLevel,
            rationale: parsedJson.rationale,
            counterSignalRisk: parsedJson.counterSignalRisk,
        };
        return signal;

    } catch (error) {
        console.error(`Erro ao gerar Bala de ${tier}:`, error);
        return null;
    }
}

const generateDangerZone = async (): Promise<DangerZoneAsset[]> => {
    // This is a simplified mock. A real implementation could be more complex.
    return [
        { ticker: 'WIF', name: 'Dogwifhat', rationale: 'Alta volatilidade e funding rate negativo extremo, risco de short squeeze.' },
        { ticker: 'ZEUS', name: 'Zeus Network', rationale: 'Narrativa de interoperabilidade Solana-BTC, alto engajamento social, mas sem produto claro.' },
        { ticker: 'ORDI', name: 'Ordinals', rationale: 'Atividade on-chain de BRC-20 ressurgindo, mas altamente especulativo.' }
    ];
}

export const generatePresentDayAnalysis = async (): Promise<PresentDayAnalysisResult> => {
    const [gold, silver, bronze, dangerZone] = await Promise.all([
        generateAsymmetricSignal('Gold'),
        generateAsymmetricSignal('Silver'),
        generateAsymmetricSignal('Bronze'),
        generateDangerZone()
    ]);
    
    const asymmetricArsenal: AsymmetricArsenal = { gold, silver, bronze, dangerZone };

    return {
        macroContext: [
            { name: 'Regime de Mercado', value: 'Bear - Volatilidade', interpretation: 'Tendência de baixa com alta volatilidade.', status: 'critical' },
            { name: 'Veredito Final Alpha', value: 'PESSIMISTA', interpretation: 'O motor está pessimista, buscando proteção de capital.', status: 'warning' },
        ],
        presentDayBuySignals: [],
        presentDaySellSignals: [],
        asymmetricArsenal: asymmetricArsenal,
        alphaDivergence: [],
        deepOnChainAnalysis: {
            overallSentiment: 'bearish', sentimentScore: 32,
            keyMetrics: [{ name: 'Net Unrealized Profit/Loss (NUPL)', value: '0.22', status: 'bearish', interpretation: 'Lucro não realizado diminuindo, risco de capitulação.' }],
            whaleWatch: { last24hNetFlow: -350000000 },
            exchangeFlows: { last24hNetFlow: 450000000 }
        },
        advancedMarketRegime: {
            currentRegime: 'Bear', regimeTransitionDetected: true, transitionFrom: 'Sideways',
            accelerationScore: 85, exhaustionScore: 30,
            interclassDominance: { btcVsAlts: 'BTC', spotVsDerivatives: 'Derivatives', strongestNarrative: 'N/A' },
            heatmap90d: Array.from({ length: 90 }).map((_, i) => ({ date: DateTime.now().minus({ days: 90 - i }).toISODate() as string, regime: (['Bull', 'Sideways', 'Bear'] as const)[Math.floor(Math.random()*3)]})),
            strategyRecommendation: 'Proteger Capital / Shortar Resistências',
            recommendationRationale: 'A tendência de baixa está se acelerando. Oportunidades de compra são de altíssimo risco.'
        },
        assetClassSummaries: [
            { category: 'L1/L2', assetCount: 15, sentiment: 25 },
            { category: 'DeFi', assetCount: 20, sentiment: 15 },
        ],
        crossAssetAnalysis: {
            traditionalAssets: [
                { name: 'S&P 500', ticker: 'SPX', value: 5350.20, change: -1.2 },
                { name: 'Dólar (DXY)', ticker: 'DXY', value: 106.5, change: 0.8 }
            ]
        }
    };
};


export const generateBacktestAnalysis = async (): Promise<BacktestAnalysisResult> => {
    // This function can remain as it is, since it's about historical data
    const robustnessAudit = await generateRobustnessAudit();
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
        Geral: generalResult, 'L1/L2': generalResult, DeFi: generalResult, Gaming: generalResult, Infra: generalResult, Other: generalResult,
    };
}


export const generateAlphaHunt = async (): Promise<AlphaHuntData> => {
    return { results: [], vortexStatus: {} }; // Simplified as it's not the focus
};

export const runSupervisorDirective = async (analysis: SelfAnalysis, promptText: string): Promise<{ directive: string }> => {
    return { directive: `[BACKEND MOCK] Directive received for ${analysis.failedModel}.` };
};

export const generateRobustnessAudit = async (): Promise<RobustnessAuditReport> => {
     return {
        successRate: 58.7, totalNetProfit: 89450.12, totalNetProfitPercentage: 8.95,
        robustnessConclusion: 'Satisfatório',
        errorDiagnosis: "O sistema demonstrou resiliência em cenários de alta volatilidade, mas apresentou perdas em mercados de baixa liquidez.",
        positiveExamples: ["Flash crash do BTC (-20%)", "Crise de liquidez de stablecoin"],
        negativeExamples: ["Mercado lateral prolongado (choppy)", "Baixo volume de negociação no fim de semana"]
    };
};

export const generateTradingDeskData = async (): Promise<TradingDeskData> => {
    const mainAnalysis = await generatePresentDayAnalysis();
    const highConvictionSignals = [
        mainAnalysis.asymmetricArsenal.gold?.ticker,
        mainAnalysis.asymmetricArsenal.silver?.ticker,
        mainAnalysis.asymmetricArsenal.bronze?.ticker,
    ].filter((t): t is string => !!t);

    return {
        clusterPnl: [], forwardSimulation: { optimistic: { pnl: 0, pnlPercentage: 0 }, neutral: { pnl: 0, pnlPercentage: 0 }, pessimistic: { pnl: 0, pnlPercentage: 0 }, },
        riskSizing: { maxPortfolioRisk: 2.5, idealPositionSize: 5, maxLeverage: 10, },
        simulatedSignals: highConvictionSignals,
    };
};

export const generateGlobalPerformance = async (): Promise<GlobalPerformanceData> => {
    const history: any[] = [
        { date: '2023-08-01', version: 'v9.8', successRate: 62.1, netRoi: 15.3, sharpeRatio: 1.75, maxDrawdown: -12.5, resilienceScore: 88, modelStability: 95, moduleConsistency: 92, cognitiveScore: 89 },
        { date: '2023-08-05', version: 'v10.0', successRate: 63.8, netRoi: 16.2, sharpeRatio: 1.82, maxDrawdown: -11.8, resilienceScore: 90, modelStability: 96, moduleConsistency: 94, cognitiveScore: 91 },
    ];
    return { latest: history[history.length - 1], history };
};

export const generateLucraQuantumAnalysis = async (): Promise<LucraQuantumAnalysis> => {
    return { coherenceScore: 82, conflictAlerts: ["Fluxo de baleias diverge do Open Interest em prazos curtos."], riskVector: 'Moderado', };
};

// FIX: Added missing function to generate asymmetric opportunities data.
export const generateAsymmetricOpportunitiesData = async (): Promise<AsymmetricOpportunitiesData> => {
    // This is a simplified mock for the backend.
    console.log('[GEMINI SERVICE] Generating Asymmetric Opportunities Data');
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
        top10: [
            { name: 'Kaspa', ticker: 'KAS', classification: 'Bala de Ouro', rationale: 'L1 PoW com alta vazão e segurança, ganhando tração para pagamentos digitais.', explosionScore: 95, metrics: { volumeAnomalydelta: 150, newHoldersDelta: 25, socialMentionsDelta: 80 } },
            { name: 'Bittensor', ticker: 'TAO', classification: 'Projétil Fantasma', rationale: 'Mercado descentralizado para IA, permitindo que modelos compitam e sejam recompensados.', explosionScore: 92, metrics: { volumeAnomalydelta: 120, newHoldersDelta: 18, socialMentionsDelta: 65 } },
            { name: 'Pepe', ticker: 'PEPE', classification: 'Zona Radioativa', rationale: 'Memecoin com forte comunidade e potencial para novas altas explosivas, mas com risco extremo.', explosionScore: 88, metrics: { volumeAnomalydelta: 250, newHoldersDelta: 40, socialMentionsDelta: 150 } },
        ]
    };
};
