import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
// FIX: Corrected import path for types.
import {
    PresentDayAnalysisResult,
    BacktestAnalysisResult,
    PresentDayAssetSignal,
    LivePrices,
    Notification,
    LivePosition,
    AlphaHuntData,
    TradingDeskData,
    ExecutionLogEntry,
    GlobalPerformanceData,
    LucraQuantumAnalysis,
    AsymmetricOpportunitiesData,
    LucraTargetAsset,
    ForwardSimulationResult,
    RiskSizingRecommendation,
    HighConvictionSignal,
    ActiveSimulation,
    ValidatedSimulationReport,
    ActualSimulationResult,
} from '../types';
import { IApiClient } from '../services/api/client';
import { fetchPrices } from '../services/marketService';
import { formatCurrency, formatPercentage } from '../utils/formatters';

// ... (State, Action, Reducer definitions)
interface AppState {
    presentDayData: PresentDayAnalysisResult | null;
    backtestData: BacktestAnalysisResult | null;
    alphaHuntData: AlphaHuntData | null;
    tradingDeskData: TradingDeskData | null;
    globalPerformanceData: GlobalPerformanceData | null;
    lucraQuantumAnalysis: LucraQuantumAnalysis | null;
    asymmetricOpportunitiesData: AsymmetricOpportunitiesData | null;
    
    livePrices: LivePrices;
    livePositions: LivePosition[];
    tradeHistory: LivePosition[];
    notifications: Notification[];
    executionLog: ExecutionLogEntry[];
    simulationHistory: ValidatedSimulationReport[];
    activeSimulation: ActiveSimulation | null;


    lucraTargetAsset: LucraTargetAsset | null;

    isInitialLoading: boolean;
    isRecalculating: boolean;
    isBacktestLoading: boolean;
    isAlphaHuntLoading: boolean;
    isTradingDeskLoading: boolean;
    isGlobalPerformanceLoading: boolean;
    isLucraQuantumLoading: boolean;
    isAsymmetricOpportunitiesLoading: boolean;
    // FIX: Added state properties for risk analysis and simulation loading states.
    isRiskAnalyzing: boolean;
    isSimulating: boolean;

    error: string | null;
}

type Action =
    | { type: 'FETCH_INITIAL_DATA_START' }
    | { type: 'FETCH_INITIAL_DATA_SUCCESS'; payload: { presentDay: PresentDayAnalysisResult; backtest: BacktestAnalysisResult } }
    | { type: 'FETCH_INITIAL_DATA_FAILURE'; payload: string }
    | { type: 'SET_LIVE_PRICES'; payload: LivePrices }
    | { type: 'ACTIVATE_TRADE'; payload: PresentDayAssetSignal }
    | { type: 'CLOSE_POSITION'; payload: string }
    | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'read' | 'timestamp'> }
    | { type: 'MARK_ALL_NOTIFICATIONS_AS_READ' }
    | { type: 'CLEAR_ALL_NOTIFICATIONS' }
    | { type: 'SET_LUCRA_TARGET_ASSET'; payload: LucraTargetAsset | null }
    | { type: 'FETCH_ALPHA_HUNT_START' }
    | { type: 'FETCH_ALPHA_HUNT_SUCCESS'; payload: AlphaHuntData }
    | { type: 'FETCH_ALPHA_HUNT_FAILURE'; payload: string }
    | { type: 'FETCH_TRADING_DESK_START' }
    | { type: 'FETCH_TRADING_DESK_SUCCESS'; payload: TradingDeskData }
    | { type: 'FETCH_TRADING_DESK_FAILURE'; payload: string }
    | { type: 'FETCH_GLOBAL_PERFORMANCE_START' }
    | { type: 'FETCH_GLOBAL_PERFORMANCE_SUCCESS'; payload: GlobalPerformanceData }
    | { type: 'FETCH_GLOBAL_PERFORMANCE_FAILURE'; payload: string }
    | { type: 'FETCH_LUCRA_QUANTUM_START' }
    | { type: 'FETCH_LUCRA_QUANTUM_SUCCESS'; payload: LucraQuantumAnalysis }
    | { type: 'FETCH_LUCRA_QUANTUM_FAILURE'; payload: string }
    | { type: 'FETCH_ASYMMETRIC_OPPORTUNITIES_START' }
    | { type: 'FETCH_ASYMMETRIC_OPPORTUNITIES_SUCCESS'; payload: AsymmetricOpportunitiesData }
    | { type: 'FETCH_ASYMMETRIC_OPPORTUNITIES_FAILURE'; payload: string }
    // FIX: Added actions for risk analysis and forward simulation.
    | { type: 'RUN_RISK_ANALYSIS_START' }
    | { type: 'RUN_RISK_ANALYSIS_SUCCESS'; payload: RiskSizingRecommendation }
    | { type: 'RUN_RISK_ANALYSIS_FAILURE'; payload: string }
    | { type: 'RUN_FORWARD_SIMULATION_START' }
    | { type: 'RUN_FORWARD_SIMULATION_SUCCESS'; payload: ForwardSimulationResult }
    | { type: 'RUN_FORWARD_SIMULATION_FAILURE'; payload: string }
    | { type: 'START_SIMULATION_VALIDATION'; payload: ActiveSimulation }
    | { type: 'COMPLETE_SIMULATION_VALIDATION'; payload: ValidatedSimulationReport };


const initialState: AppState = {
    presentDayData: null,
    backtestData: null,
    alphaHuntData: null,
    tradingDeskData: null,
    globalPerformanceData: null,
    lucraQuantumAnalysis: null,
    asymmetricOpportunitiesData: null,
    livePrices: {},
    livePositions: [
        // Bala de Ouro
        { id: uuidv4(), asset: 'PAAL', type: 'LONG', entryPrice: 0.41, currentPrice: 0.41, size: 10000, pnl: 0, pnlPercentage: 0, entryDate: new Date().toISOString() },
        // Bala de Prata
        { id: uuidv4(), asset: 'KAS', type: 'LONG', entryPrice: 0.155, currentPrice: 0.155, size: 20000, pnl: 0, pnlPercentage: 0, entryDate: new Date().toISOString() },
        // Bala de Bronze
        { id: uuidv4(), asset: 'INJ', type: 'LONG', entryPrice: 25.0, currentPrice: 25.0, size: 100, pnl: 0, pnlPercentage: 0, entryDate: new Date().toISOString() },
        // Top 3 Oportunidades
        { id: uuidv4(), asset: 'ETH', type: 'LONG', entryPrice: 3500, currentPrice: 3500, size: 1, pnl: 0, pnlPercentage: 0, entryDate: new Date().toISOString() },
        { id: uuidv4(), asset: 'RNDR', type: 'LONG', entryPrice: 10.5, currentPrice: 10.5, size: 500, pnl: 0, pnlPercentage: 0, entryDate: new Date().toISOString() },
        { id: uuidv4(), asset: 'SOL', type: 'LONG', entryPrice: 148.0, currentPrice: 148.0, size: 20, pnl: 0, pnlPercentage: 0, entryDate: new Date().toISOString() },
    ],
    tradeHistory: [],
    notifications: [],
    executionLog: [],
    simulationHistory: [],
    activeSimulation: null,
    lucraTargetAsset: null,
    isInitialLoading: true,
    isRecalculating: false,
    isBacktestLoading: true,
    isAlphaHuntLoading: false,
    isTradingDeskLoading: false,
    isGlobalPerformanceLoading: false,
    isLucraQuantumLoading: false,
    isAsymmetricOpportunitiesLoading: false,
    // FIX: Initialized new state properties.
    isRiskAnalyzing: false,
    isSimulating: false,
    error: null,
};

const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'FETCH_INITIAL_DATA_START':
            return { ...state, isInitialLoading: true, isRecalculating: true, error: null };
        case 'FETCH_INITIAL_DATA_SUCCESS':
            return {
                ...state,
                isInitialLoading: false,
                isRecalculating: false,
                presentDayData: action.payload.presentDay,
                backtestData: action.payload.backtest,
            };
        case 'FETCH_INITIAL_DATA_FAILURE':
            return { ...state, isInitialLoading: false, isRecalculating: false, error: action.payload };
        case 'SET_LIVE_PRICES':
            // Update live positions with new prices
            const updatedPositions = state.livePositions.map(pos => {
                const currentPrice = action.payload[pos.asset];
                if (currentPrice) {
                    const pnl = (currentPrice - pos.entryPrice) * pos.size * (pos.type === 'LONG' ? 1 : -1);
                    const pnlPercentage = (pnl / (pos.entryPrice * pos.size)) * 100;
                    return { ...pos, currentPrice, pnl, pnlPercentage };
                }
                return pos;
            });
            return { ...state, livePrices: action.payload, livePositions: updatedPositions };
        case 'ACTIVATE_TRADE':
            const signal = action.payload;
            const newPosition: LivePosition = {
                id: uuidv4(),
                asset: signal.ticker,
                type: signal.justifications.strategy,
                entryPrice: state.livePrices[signal.ticker] || signal.justifications.entryRange.value.min,
                currentPrice: state.livePrices[signal.ticker] || signal.justifications.entryRange.value.min,
                size: 1, // Simplified size
                pnl: 0,
                pnlPercentage: 0,
                entryDate: new Date().toISOString(),
            };
            const newLog: ExecutionLogEntry = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                action: `OPEN ${newPosition.type}`,
                asset: newPosition.asset,
                price: newPosition.entryPrice,
                notes: `Ativado via sinal ${signal.confidence}`
            };
            return { ...state, livePositions: [...state.livePositions, newPosition], executionLog: [...state.executionLog, newLog] };
        case 'CLOSE_POSITION':
            const posToClose = state.livePositions.find(p => p.id === action.payload);
            if (!posToClose) {
                return state;
            }
            const closeLog: ExecutionLogEntry = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                action: `CLOSE ${posToClose.type}`,
                asset: posToClose.asset,
                price: posToClose.currentPrice,
                notes: `Posição fechada com P&L de ${formatCurrency(posToClose.pnl)} (${formatPercentage(posToClose.pnlPercentage)})`
            };
            return {
                ...state,
                livePositions: state.livePositions.filter(p => p.id !== action.payload),
                tradeHistory: [...state.tradeHistory, posToClose],
                executionLog: [...state.executionLog, closeLog]
            };
        case 'ADD_NOTIFICATION':
            const newNotification: Notification = {
                ...action.payload,
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                read: false,
            };
            return { ...state, notifications: [newNotification, ...state.notifications] };
        case 'MARK_ALL_NOTIFICATIONS_AS_READ':
            return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
        case 'CLEAR_ALL_NOTIFICATIONS':
            return { ...state, notifications: [] };
        case 'SET_LUCRA_TARGET_ASSET':
            return { ...state, lucraTargetAsset: action.payload };
        // Other cases for specific data fetches
        case 'FETCH_ALPHA_HUNT_START': return { ...state, isAlphaHuntLoading: true };
        case 'FETCH_ALPHA_HUNT_SUCCESS': return { ...state, isAlphaHuntLoading: false, alphaHuntData: action.payload };
        case 'FETCH_ALPHA_HUNT_FAILURE': return { ...state, isAlphaHuntLoading: false, error: action.payload };
        case 'FETCH_TRADING_DESK_START': return { ...state, isTradingDeskLoading: true };
        case 'FETCH_TRADING_DESK_SUCCESS': return { ...state, isTradingDeskLoading: false, tradingDeskData: action.payload };
        case 'FETCH_TRADING_DESK_FAILURE': return { ...state, isTradingDeskLoading: false, error: action.payload };
        case 'FETCH_GLOBAL_PERFORMANCE_START': return { ...state, isGlobalPerformanceLoading: true };
        case 'FETCH_GLOBAL_PERFORMANCE_SUCCESS': return { ...state, isGlobalPerformanceLoading: false, globalPerformanceData: action.payload };
        case 'FETCH_GLOBAL_PERFORMANCE_FAILURE': return { ...state, isGlobalPerformanceLoading: false, error: action.payload };
        case 'FETCH_LUCRA_QUANTUM_START': return { ...state, isLucraQuantumLoading: true };
        case 'FETCH_LUCRA_QUANTUM_SUCCESS': return { ...state, isLucraQuantumLoading: false, lucraQuantumAnalysis: action.payload };
        case 'FETCH_LUCRA_QUANTUM_FAILURE': return { ...state, isLucraQuantumLoading: false, error: action.payload };
        case 'FETCH_ASYMMETRIC_OPPORTUNITIES_START': return { ...state, isAsymmetricOpportunitiesLoading: true };
        case 'FETCH_ASYMMETRIC_OPPORTUNITIES_SUCCESS': return { ...state, isAsymmetricOpportunitiesLoading: false, asymmetricOpportunitiesData: action.payload };
        case 'FETCH_ASYMMETRIC_OPPORTUNITIES_FAILURE': return { ...state, isAsymmetricOpportunitiesLoading: false, error: action.payload };
        // FIX: Added reducer cases for new actions.
        case 'RUN_RISK_ANALYSIS_START': return { ...state, isRiskAnalyzing: true };
        case 'RUN_RISK_ANALYSIS_SUCCESS':
            return {
                ...state,
                isRiskAnalyzing: false,
                tradingDeskData: state.tradingDeskData ? { ...state.tradingDeskData, riskSizing: action.payload } : null,
            };
        case 'RUN_RISK_ANALYSIS_FAILURE': return { ...state, isRiskAnalyzing: false, error: action.payload };
        case 'RUN_FORWARD_SIMULATION_START': return { ...state, isSimulating: true };
        case 'RUN_FORWARD_SIMULATION_SUCCESS':
            return {
                ...state,
                isSimulating: false,
                tradingDeskData: state.tradingDeskData ? { ...state.tradingDeskData, forwardSimulation: action.payload } : null,
            };
        case 'RUN_FORWARD_SIMULATION_FAILURE': return { ...state, isSimulating: false, error: action.payload };
        case 'START_SIMULATION_VALIDATION':
            return {
                ...state,
                activeSimulation: action.payload,
            };
        case 'COMPLETE_SIMULATION_VALIDATION':
            return {
                ...state,
                activeSimulation: null,
                simulationHistory: [action.payload, ...state.simulationHistory],
            };
        default:
            return state;
    }
};

// ... (Context definition)
interface IDataContext extends AppState {
    apiClient: IApiClient;
    loadPresentDayData: (force?: boolean) => void;
    loadBacktestData: () => void;
    activateTrade: (signal: PresentDayAssetSignal) => void;
    closePosition: (id: string) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
    markAllNotificationsAsRead: () => void;
    clearAllNotifications: () => void;
    setLucraTargetAsset: (target: LucraTargetAsset | null) => void;
    loadAlphaHuntData: () => void;
    loadTradingDeskData: () => void;
    loadGlobalPerformanceData: () => void;
    loadLucraQuantumData: () => void;
    loadAsymmetricOpportunitiesData: () => void;
    refreshPrice: (ticker: string) => Promise<void>;
    runForwardSimulation: (signals: HighConvictionSignal[]) => void;
}

const DataContext = createContext<IDataContext | undefined>(undefined);

// ... (DataProvider implementation)
export const DataProvider: React.FC<{ apiClient: IApiClient; children: ReactNode }> = ({ apiClient, children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const priceUpdateInterval = useRef<number | null>(null);

    const loadPresentDayData = useCallback(async (force = false) => {
        if (!state.presentDayData || force) {
            dispatch({ type: 'FETCH_INITIAL_DATA_START' });
            try {
                const [presentDay, backtest] = await Promise.all([
                    apiClient.fetchPresentDayAnalysis(),
                    apiClient.fetchBacktestAnalysis()
                ]);
                dispatch({ type: 'FETCH_INITIAL_DATA_SUCCESS', payload: { presentDay, backtest } });
            } catch (e: any) {
                dispatch({ type: 'FETCH_INITIAL_DATA_FAILURE', payload: e.message });
            }
        }
    }, [apiClient, state.presentDayData]);
    
    // Specific data loaders
    const loadBacktestData = useCallback(async () => { /* ... */ }, []);

    const refreshPrice = useCallback(async (ticker: string) => {
        const prices = await fetchPrices([ticker]);
        dispatch({ type: 'SET_LIVE_PRICES', payload: {...state.livePrices, ...prices} });
    }, [state.livePrices]);

    const runRiskAnalysis = useCallback(async () => {
        dispatch({ type: 'RUN_RISK_ANALYSIS_START' });
        try {
            const recommendation = await apiClient.runRiskAnalysis();
            dispatch({ type: 'RUN_RISK_ANALYSIS_SUCCESS', payload: recommendation });
        } catch (e: any) {
            dispatch({ type: 'RUN_RISK_ANALYSIS_FAILURE', payload: e.message });
        }
    }, [apiClient]);

    const loadAlphaHuntData = useCallback(async () => { /* ... */ }, []);
    const loadTradingDeskData = useCallback(async () => {
        dispatch({ type: 'FETCH_TRADING_DESK_START' });
        try {
            const data = await apiClient.fetchTradingDeskData();
            dispatch({ type: 'FETCH_TRADING_DESK_SUCCESS', payload: data });
            runRiskAnalysis();
        } catch (e: any) {
            dispatch({ type: 'FETCH_TRADING_DESK_FAILURE', payload: e.message });
        }
    }, [apiClient, runRiskAnalysis]);
    const loadGlobalPerformanceData = useCallback(async () => { /* ... */ }, []);
    const loadLucraQuantumData = useCallback(async () => { /* ... */ }, []);
    const loadAsymmetricOpportunitiesData = useCallback(async () => { /* ... */ }, []);

    const runForwardSimulation = useCallback(async (signals: HighConvictionSignal[]) => {
        if (state.activeSimulation) return; // Prevent new simulation while one is active

        dispatch({ type: 'RUN_FORWARD_SIMULATION_START' });
        try {
            const result = await apiClient.runForwardSimulation(signals);
            dispatch({ type: 'RUN_FORWARD_SIMULATION_SUCCESS', payload: result });

            const initialPrices = signals.map(s => ({ 
                ticker: s.ticker, 
                price: state.livePrices[s.ticker] 
            })).filter(p => p.price != null) as { ticker: string; price: number }[];

            if (initialPrices.length !== signals.length) {
                console.error("Could not get initial prices for all selected assets. Aborting validation.");
                return;
            }

            const activeSim: ActiveSimulation = {
                id: uuidv4(),
                startTime: new Date().toISOString(),
                predictedResult: result,
                initialPrices,
                signals,
            };

            dispatch({ type: 'START_SIMULATION_VALIDATION', payload: activeSim });
            
            const VALIDATION_TIMEOUT = 4 * 60 * 60 * 1000;
            
            setTimeout(async () => {
                try {
                    console.log("Validation timer fired!");
                    const tickers = activeSim.signals.map(s => s.ticker);
                    const newPrices = await fetchPrices(tickers);
                    
                    const actualBreakdown = activeSim.initialPrices.map(initial => {
                        const finalPrice = newPrices[initial.ticker];
                        const pnlPercentage = finalPrice ? ((finalPrice - initial.price) / initial.price) * 100 : 0;
                        return { ticker: initial.ticker, pnlPercentage };
                    });

                    const totalActualPnl = actualBreakdown.length > 0 ? actualBreakdown.reduce((sum, item) => sum + item.pnlPercentage, 0) / actualBreakdown.length : 0;

                    const actualResult: ActualSimulationResult = {
                        pnlPercentage: totalActualPnl,
                        breakdown: actualBreakdown
                    };

                    const aiAnalysis = await apiClient.runSimulationValidation({
                        prediction: activeSim.predictedResult,
                        actual: actualResult,
                    });

                    const report: ValidatedSimulationReport = {
                        ...activeSim,
                        endTime: new Date().toISOString(),
                        actualResult,
                        aiAnalysis,
                    };

                    dispatch({ type: 'COMPLETE_SIMULATION_VALIDATION', payload: report });
                } catch (e) {
                     console.error("Error during simulation validation:", e);
                     // Optionally, dispatch an action to clear the active simulation on error
                }

            }, VALIDATION_TIMEOUT);

        } catch (e: any) {
            dispatch({ type: 'RUN_FORWARD_SIMULATION_FAILURE', payload: e.message });
        }
    }, [apiClient, state.livePrices, state.activeSimulation]);


    useEffect(() => {
        loadPresentDayData();
    }, [loadPresentDayData]);

    // Live price updates
    useEffect(() => {
        const updatePrices = async () => {
            const assetsToTrack = new Set<string>();
            if (state.presentDayData) {
                state.presentDayData.presentDayBuySignals.forEach(s => assetsToTrack.add(s.ticker));
                state.presentDayData.presentDaySellSignals.forEach(s => assetsToTrack.add(s.ticker));
                // FIX: Property 'silverBulletSignal' does not exist. Replaced with asymmetricArsenal signals.
                if (state.presentDayData.asymmetricArsenal) {
                    const { gold, silver, bronze } = state.presentDayData.asymmetricArsenal;
                    if (gold) assetsToTrack.add(gold.ticker);
                    if (silver) assetsToTrack.add(silver.ticker);
                    if (bronze) assetsToTrack.add(bronze.ticker);
                }
            }
            state.livePositions.forEach(p => assetsToTrack.add(p.asset));
            
            if (assetsToTrack.size > 0) {
                const prices = await fetchPrices(Array.from(assetsToTrack));
                dispatch({ type: 'SET_LIVE_PRICES', payload: prices });
            }
        };

        if(priceUpdateInterval.current) clearInterval(priceUpdateInterval.current);
        priceUpdateInterval.current = window.setInterval(updatePrices, 15000);
        updatePrices(); // Initial fetch

        return () => {
            if (priceUpdateInterval.current) clearInterval(priceUpdateInterval.current);
        };
    }, [state.presentDayData, state.livePositions]);

    const value: IDataContext = {
        ...state,
        apiClient,
        loadPresentDayData,
        loadBacktestData,
        activateTrade: (signal) => dispatch({ type: 'ACTIVATE_TRADE', payload: signal }),
        closePosition: (id) => dispatch({ type: 'CLOSE_POSITION', payload: id }),
        addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
        markAllNotificationsAsRead: () => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_AS_READ' }),
        clearAllNotifications: () => dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' }),
        setLucraTargetAsset: (target) => dispatch({ type: 'SET_LUCRA_TARGET_ASSET', payload: target }),
        refreshPrice,
        loadAlphaHuntData,
        loadTradingDeskData,
        loadGlobalPerformanceData,
        loadLucraQuantumData,
        loadAsymmetricOpportunitiesData,
        runForwardSimulation,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): IDataContext => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};