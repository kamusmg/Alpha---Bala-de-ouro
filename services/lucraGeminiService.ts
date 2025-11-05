// services/lucraGeminiService.ts
import { InternalIndicators, DeepOnChainAnalysis, LucraSignal, SignalType } from '../types';

/**
 * MOCK IMPLEMENTATION
 * In a real-world scenario, this function would make a call to the Gemini API,
 * sending the context (indicators, on-chain data) and receiving a structured
 * trading signal as a response.
 */
export const generateLucraSignal = async (
    indicators: InternalIndicators,
    onChainAnalysis: DeepOnChainAnalysis
): Promise<LucraSignal> => {
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    // Simple mock logic:
    // If order book and whale flow are aligned, create a strong signal.
    // Otherwise, create a weaker or neutral signal.
    
    const imbalanceDirection = indicators.orderBookImbalance > 1.05 ? 'COMPRA' : indicators.orderBookImbalance < 0.95 ? 'VENDA' : 'NEUTRO';
    const whaleDirection = onChainAnalysis.whaleWatch.last24hNetFlow > 0 ? 'COMPRA' : 'VENDA';

    let signalType: SignalType = 'NEUTRO';
    let confidence = Math.random() * 0.3 + 0.4; // Base confidence 40-70%
    let rationale = "Condições mistas de mercado, aguardando catalisador.";

    if (imbalanceDirection !== 'NEUTRO' && imbalanceDirection === whaleDirection) {
        signalType = imbalanceDirection;
        confidence = Math.random() * 0.2 + 0.75; // 75-95% confidence
        rationale = `Forte confluência entre o fluxo de ordens de curto prazo e a acumulação de baleias. Open interest em ${indicators.oiTrend}.`;
    } else if (imbalanceDirection !== 'NEUTRO') {
        signalType = imbalanceDirection;
        confidence = Math.random() * 0.2 + 0.5; // 50-70% confidence
        rationale = `Fluxo de ordens indica viés, mas sem confirmação da atividade de baleias.`;
    }

    // Never signal against a strong whale trend
    if (signalType !== 'NEUTRO' && signalType !== whaleDirection) {
        signalType = 'NEUTRO';
        rationale = "Sinal de curto prazo invalidado por forte divergência com o fluxo de baleias."
    }

    return {
        symbol: 'BTC/USDT',
        signalType: signalType,
        probability: `${(confidence * 100).toFixed(0)}%`,
        finalConfidenceScore: parseFloat(confidence.toFixed(2)),
        recommendedPositionSize: confidence > 0.8 ? 'Médio' : confidence > 0.6 ? 'Mínimo' : 'Não Operar',
        mode: 'hybrid',
        regimeTag: 'normal',
        strictnessLevel: 'full',
        bucket: 'exploit',
        entryDatetime: new Date().toISOString(),
        exitDatetime: new Date(Date.now() + 3600 * 1000 * 4).toISOString(), // 4 hours later
        entryWindow: '15m',
        exitWindow: '1h',
        passedValidations: ['Veredito OK'],
        rationale: rationale,
        horizon: 'Curto Prazo'
    };
};
