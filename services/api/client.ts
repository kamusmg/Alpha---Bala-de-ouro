// services/api/client.ts
// FIX: Corrected import path for types.
import { 
    PresentDayAnalysisResult, 
    BacktestAnalysisResult,
    PresentDayAssetSignal,
    SelfAnalysis,
    AlphaHuntData,
    RobustnessAuditReport,
    TradingDeskData,
    GlobalPerformanceData,
    GlobalPerformanceMetrics,
    LucraQuantumAnalysis,
    AsymmetricOpportunitiesData,
    LivePrices,
    AssetCategory,
    ForwardSimulationResult,
    HighConvictionSignal,
    RiskSizingRecommendation,
    ActualSimulationResult,
    SimulationAIAnalysis,
} from '../../types';

// Interface defining the contract for our API client.
// This allows for easy swapping between a real HTTP client and a mock client.
export interface IApiClient {
    fetchPresentDayAnalysis: () => Promise<PresentDayAnalysisResult>;
    fetchBacktestAnalysis: () => Promise<BacktestAnalysisResult>;
    fetchAlphaHunt: () => Promise<AlphaHuntData>;
    fetchSupervisorDirective: (payload: { analysis: SelfAnalysis; promptText: string; }) => Promise<{ directive: string }>;
    fetchRobustnessAudit: () => Promise<RobustnessAuditReport>;
    fetchTradingDeskData: () => Promise<TradingDeskData>;
    fetchGlobalPerformance: () => Promise<GlobalPerformanceData>;
    fetchLucraQuantumAnalysis: () => Promise<LucraQuantumAnalysis>;
    fetchMarketPrices: (assets: string[]) => Promise<LivePrices>;
    fetchSignalDetails: (ticker: string, category: AssetCategory) => Promise<PresentDayAssetSignal>;
    // FIX: Added method to fetch asymmetric opportunities data to the client interface.
    fetchAsymmetricOpportunitiesData: () => Promise<AsymmetricOpportunitiesData>;
    // FIX: Added methods for new Trading Desk features.
    runForwardSimulation: (signals: HighConvictionSignal[]) => Promise<ForwardSimulationResult>;
    runRiskAnalysis: () => Promise<RiskSizingRecommendation>;
    runSimulationValidation: (payload: { prediction: ForwardSimulationResult; actual: ActualSimulationResult }) => Promise<SimulationAIAnalysis>;
}

// Defines the transport layer (e.g., HTTP fetch, mock).
interface IApiTransport {
    get: <T>(path: string) => Promise<T>;
    post: <T>(path: string, body: any) => Promise<T>;
}

// The ApiClient class implements the IApiClient interface using a given transport.
export class ApiClient implements IApiClient {
    private transport: IApiTransport;

    constructor(transport: IApiTransport) {
        this.transport = transport;
    }

    fetchPresentDayAnalysis = (): Promise<PresentDayAnalysisResult> => {
        return this.transport.get('/api/analysis/present-day');
    }

    fetchBacktestAnalysis = (): Promise<BacktestAnalysisResult> => {
        return this.transport.get('/api/analysis/backtest');
    }

    fetchAlphaHunt = (): Promise<AlphaHuntData> => {
        return this.transport.get('/api/analysis/alpha-hunt');
    }
    
    fetchSupervisorDirective = (payload: { analysis: SelfAnalysis; promptText: string; }): Promise<{ directive: string }> => {
        return this.transport.post('/api/analysis/supervisor-directive', payload);
    }
    
    fetchRobustnessAudit = (): Promise<RobustnessAuditReport> => {
        return this.transport.get('/api/analysis/robustness-audit');
    }
    
    fetchTradingDeskData = (): Promise<TradingDeskData> => {
        return this.transport.get('/api/analysis/trading-desk');
    }
    
    fetchGlobalPerformance = (): Promise<GlobalPerformanceData> => {
        return this.transport.get('/api/analysis/global-performance');
    }

    fetchLucraQuantumAnalysis = (): Promise<LucraQuantumAnalysis> => {
        return this.transport.get('/api/analysis/lucra-quantum');
    }

    fetchMarketPrices = (assets: string[]): Promise<LivePrices> => {
        if (assets.length === 0) return Promise.resolve({});
        return this.transport.get(`/api/analysis/prices?assets=${assets.join(',')}`);
    }

    fetchSignalDetails = (ticker: string, category: AssetCategory): Promise<PresentDayAssetSignal> => {
        // In a real backend, category might not be needed if ticker is unique
        return this.transport.get(`/api/analysis/signal-details/${ticker}`);
    }

    // FIX: Implemented the method to fetch asymmetric opportunities data.
    fetchAsymmetricOpportunitiesData = (): Promise<AsymmetricOpportunitiesData> => {
        return this.transport.get('/api/analysis/asymmetric-opportunities');
    }

    // FIX: Implemented methods for new Trading Desk features.
    runForwardSimulation = (signals: HighConvictionSignal[]): Promise<ForwardSimulationResult> => {
        return this.transport.post('/api/analysis/forward-simulation', { signals });
    }

    runRiskAnalysis = (): Promise<RiskSizingRecommendation> => {
        return this.transport.get('/api/analysis/risk-analysis');
    }

    runSimulationValidation = (payload: { prediction: ForwardSimulationResult; actual: ActualSimulationResult }): Promise<SimulationAIAnalysis> => {
        return this.transport.post('/api/analysis/simulation-validation', payload);
    }
}