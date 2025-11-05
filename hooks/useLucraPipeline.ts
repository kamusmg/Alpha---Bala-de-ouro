import { useState, useRef, useCallback, useEffect } from 'react';
import {
    LucraSystemStatus,
    FuturesDataTick,
    InternalIndicators,
    LucraSignal,
    DeepOnChainAnalysis
} from '../types';
import { BinanceFuturesStream } from '../services/binanceFuturesService';
import { calculateIndicators } from '../services/lucraIndicatorService';
import { generateLucraSignal } from '../services/lucraGeminiService';

export const useLucraPipeline = (initialOnChainAnalysis: DeepOnChainAnalysis | null) => {
    const [status, setStatus] = useState<LucraSystemStatus>('INACTIVE');
    const [tick, setTick] = useState<FuturesDataTick | null>(null);
    const [indicators, setIndicators] = useState<InternalIndicators | null>(null);
    const [signals, setSignals] = useState<LucraSignal[]>([]);
    
    const streamRef = useRef<BinanceFuturesStream | null>(null);
    const onChainAnalysisRef = useRef(initialOnChainAnalysis);

    useEffect(() => {
        onChainAnalysisRef.current = initialOnChainAnalysis;
    }, [initialOnChainAnalysis]);

    const handleMessage = useCallback(async (data: FuturesDataTick) => {
        setTick(data);

        // Simple volatility check
        if (data.liquidations.length > 5) {
            setStatus('ACTIVE_VOLATILITY');
        } else {
            setStatus('ACTIVE_CALM');
        }

        const calculatedIndicators = calculateIndicators(data);
        setIndicators(calculatedIndicators);

        if (onChainAnalysisRef.current) {
            const newSignal = await generateLucraSignal(calculatedIndicators, onChainAnalysisRef.current);
            if (newSignal.signalType !== 'NEUTRO') {
                 setSignals(prev => [newSignal, ...prev.slice(0, 19)]);
            }
        }

    }, []);

    const activate = useCallback(() => {
        if (streamRef.current) return;

        setStatus('CONNECTING');
        const stream = new BinanceFuturesStream('btcusdt', handleMessage);
        streamRef.current = stream;
        stream.connect()
            .then(() => setStatus('ACTIVE_CALM'))
            .catch(() => setStatus('INACTIVE'));

    }, [handleMessage]);

    const deactivate = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.disconnect();
            streamRef.current = null;
        }
        setStatus('INACTIVE');
        setTick(null);
        setIndicators(null);
    }, []);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            deactivate();
        };
    }, [deactivate]);

    return {
        status,
        tick,
        indicators,
        signals,
        activate,
        deactivate,
    };
};
