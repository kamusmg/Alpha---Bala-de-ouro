// backend/src/types.ts
import { DateTime } from 'luxon';

export type AssetCategory = 'L1/L2' | 'DeFi' | 'Gaming' | 'Infra' | 'Other';
export type MarketRegime = 'Bull' | 'Bear' | 'Sideways' | 'Stress';
export type NarrativeMaturity = 'Descoberta' | 'Expansão' | 'Saturação' | 'Declínio';
export type SignalStatus = 'WAITING' | 'ACTIVE' | 'INVALIDATED';
export type AsymmetricSignalTier = 'Gold' | 'Silver' | 'Bronze';

export interface MacroIndicator {
  name: string;
  value: string;
  interpretation: string;
  status: 'critical' | 'warning' | 'neutral' | 'good';
}

export interface TraditionalAsset {
    name: string;
    ticker: string;
    value: number;
    change: number;
}

export interface JustificationItem {
    value: any;
    tooltip: string;
}

export interface ChecklistItem {
    item: string;
    status: boolean;
    value: string;
}

export interface PresentDayAssetSignal {
    id: string;
    assetName: string;
    ticker: string;
    category: AssetCategory;
    confidence: 'Alta' | 'Média' | 'Baixa';
    narrativeAlignment?: string;
    status: SignalStatus;
    invalidationReason?: string;
    onChainIntelligence: {
        summary: string;
    };
    automationSetup: {
        justification: string;
    };
    entryChecklist: {
        score: number;
        items: ChecklistItem[];
    };
    justifications: {
        strategy: 'LONG' | 'SHORT';
        entryRange: JustificationItem & { value: { min: number; max: number } };
        target: JustificationItem & { value: number };
        stopLoss: JustificationItem & { value: number };
        confidenceScore: JustificationItem & { value: number };
    };
}

export interface AsymmetricSignal extends PresentDayAssetSignal {
    tier: AsymmetricSignalTier;
    explosionPotential: number;
    riskLevel: 'Absoluto' | 'Extremo' | 'Elevado';
    rationale: string;
    counterSignalRisk: string;
}

export interface DangerZoneAsset {
    ticker: string;
    name: string;
    rationale: string;
}

export interface AsymmetricArsenal {
    gold: AsymmetricSignal | null;
    silver: AsymmetricSignal | null;
    bronze: AsymmetricSignal | null;
    dangerZone: DangerZoneAsset[];
}

export interface DivergentAlpha {
    name: string;
    ticker: string;
    performanceVsMarket: {
        asset: number;
        market: number;
    };
    rationale: string;
    strengthScore: number;
}

export interface OnChainMetric {
    name: string;
    value: string;
    status: 'bullish' | 'bearish' | 'neutral';
    interpretation: string;
}

export interface DeepOnChainAnalysis {
    overallSentiment: 'bullish' | 'bearish' | 'neutral';
    sentimentScore: number;
    keyMetrics: OnChainMetric[];
    whaleWatch: {
        last24hNetFlow: number;
    };
    exchangeFlows: {
        last24hNetFlow: number;
    };
}

export interface RegimeDay {
    date: string;
    regime: MarketRegime;
}

export interface AdvancedMarketRegime {
    currentRegime: MarketRegime;
    regimeTransitionDetected: boolean;
    transitionFrom: MarketRegime | null;
    accelerationScore: number;
    exhaustionScore: number;
    interclassDominance: {
        btcVsAlts: 'BTC' | 'ALTS';
        spotVsDerivatives: 'Spot' | 'Derivatives';
        strongestNarrative: string;
    };
    heatmap90d: RegimeDay[];
    strategyRecommendation: string;
    recommendationRationale: string;
}

export interface AssetClassSummary {
    category: AssetCategory;
    assetCount: number;
    sentiment: number;
}

export interface PresentDayAnalysisResult {
    macroContext: MacroIndicator[];
    presentDayBuySignals: PresentDayAssetSignal[];
    presentDaySellSignals: PresentDayAssetSignal[];
    asymmetricArsenal: AsymmetricArsenal;
    alphaDivergence: DivergentAlpha[];
    deepOnChainAnalysis: DeepOnChainAnalysis;
    advancedMarketRegime: AdvancedMarketRegime;
    assetClassSummaries: AssetClassSummary[];
    crossAssetAnalysis: {
        traditionalAssets: TraditionalAsset[];
    }
}

export interface BacktestSignal {
    id: string;
    assetName: string;
    signalType: 'COMPRA' | 'VENDA';
    strategy: string;
    entryDatetime: string;
    exitDatetime: string;
    investment: number;
    finalValue: number;
    profit: number;
    roiPercentage: number;
    pastPrice: number;
    futurePrice: number;
    technicalDrivers?: { [key: string]: any };
}

export interface BacktestSummary {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    successRate: number;
    totalNetProfit: number;
    totalNetProfitPercentage: number;
    maxDrawdown: number;
    sharpeRatio: number;
}

export interface SelfAnalysis {
    failedModel: string;
    errorExplanation: string;
    errorImpactAnalysis: string;
}

export interface RobustnessAuditReport {
    successRate: number;
    totalNetProfit: number;
    totalNetProfitPercentage: number;
    robustnessConclusion: 'Satisfatório' | 'Insatisfatório';
    errorDiagnosis: string;
    positiveExamples: string[];
    negativeExamples: string[];
}

export interface CognitiveDiagnosis {
    diagnosis: string;
    errorImpact: string;
    correctionProposal: string;
    robustnessTest: string;
}

export interface AdaptiveBacktestResult {
    summary: BacktestSummary;
    buySignals: BacktestSignal[];
    sellSignals: BacktestSignal[];
    failedSignal: BacktestSignal;
    selfAnalysis: SelfAnalysis;
    evolutionPrompt: string;
    correctionSuggestion: string;
    backtestStrengths: string;
    backtestWeaknesses: string;
    robustnessAudit: RobustnessAuditReport;
    alphaDecay: number;
    statisticalRobustness: number;
    avgNetExposure: number;
    crossTradeCorrelation: number;
    drawdownHeatmap: number[];
    aiCommentary: string;
    cognitiveDiagnosis: CognitiveDiagnosis;
}


export interface BacktestAnalysisResult {
    Geral: AdaptiveBacktestResult;
    'L1/L2': AdaptiveBacktestResult;
    DeFi: AdaptiveBacktestResult;
    Gaming: AdaptiveBacktestResult;
    Infra: AdaptiveBacktestResult;
    Other: AdaptiveBacktestResult;
}

export interface NarrativeDetails {
    name: string;
    description: string;
    popularityIndex: number;
    weeklyChange: number;
    mentionGrowthRate: number;
    dominantSentiment: 'Positivo' | 'Negativo' | 'Neutro';
    maturity: NarrativeMaturity;
}

export interface AlphaOpportunity {
    name: string;
    ticker: string;
    rationale: string;
    confidence: 'Alta' | 'Média' | 'Baixa';
    marketRelevanceScore: number;
}

export interface AlphaHuntResult {
    narrative: NarrativeDetails;
    opportunities: AlphaOpportunity[];
}

export interface AlphaHuntData {
    results: AlphaHuntResult[];
    vortexStatus: {
        [ticker: string]: 'hot' | 'neutral' | 'cold';
    };
}

export interface ClusterPnl {
    category: AssetCategory;
    tradeCount: number;
    pnl: number;
    pnlPercentage: number;
}

export interface ForwardSimulationResult {
    optimistic: { pnl: number; pnlPercentage: number };
    neutral: { pnl: number; pnlPercentage: number };
    pessimistic: { pnl: number; pnlPercentage: number };
}

export interface RiskSizingRecommendation {
    maxPortfolioRisk: number;
    idealPositionSize: number;
    maxLeverage: number;
}

export interface TradingDeskData {
    clusterPnl: ClusterPnl[];
    forwardSimulation: ForwardSimulationResult;
    riskSizing: RiskSizingRecommendation;
    simulatedSignals: string[];
}

export interface GlobalPerformanceMetrics {
    date: string;
    version: string;
    successRate: number;
    netRoi: number;
    sharpeRatio: number;
    maxDrawdown: number;
    resilienceScore: number;
    modelStability: number;
    moduleConsistency: number;
    cognitiveScore: number;
}

export interface GlobalPerformanceData {
    latest: GlobalPerformanceMetrics;
    history: GlobalPerformanceMetrics[];
}

export interface LucraQuantumAnalysis {
    coherenceScore: number;
    conflictAlerts: string[];
    riskVector: 'Baixo' | 'Moderado' | 'Alto';
}
// FIX: Added missing types for Asymmetric Opportunities
export interface AsymmetricOpportunityMetrics {
    volumeAnomalydelta: number;
    newHoldersDelta: number;
    socialMentionsDelta: number;
}

export interface AsymmetricOpportunity {
    name: string;
    ticker: string;
    classification: 'Bala de Ouro' | 'Projétil Fantasma' | 'Zona Radioativa';
    rationale: string;
    explosionScore: number;
    metrics: AsymmetricOpportunityMetrics;
}

export interface AsymmetricOpportunitiesData {
    top10: AsymmetricOpportunity[];
}
