// components/TargetingTerminal.tsx
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { DangerZoneAsset } from '../types';
import CrosshairIcon from './icons/CrosshairIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import SearchIcon from './icons/SearchIcon';
import LoaderIcon from './icons/LoaderIcon';
import XCircleIcon from './icons/XCircleIcon';

interface AnalysisResult {
    rationale: string;
    risk: string;
}

const TargetingTerminal: React.FC<{ dangerZone: DangerZoneAsset[] }> = ({ dangerZone }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!searchTerm.trim()) return;
        setIsLoading(true);
        setAnalysisResult(null);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `**MODO ARQUEÓLOGO (ANÁLISE DIRECIONADA)**: Analise o ativo cripto "${searchTerm.toUpperCase()}". Investigue seus fundamentos, atividade on-chain, sentimento social e potencial narrativo. Forneça (1) um racional conciso sobre seu potencial de trade assimétrico e (2) uma análise dos principais riscos.`;
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            // Simple parsing for now. A more robust solution would use a JSON schema.
            const text = result.text;
            const rationaleMatch = text.match(/1\)(.+?)2\)/s);
            const riskMatch = text.match(/2\)(.+)/s);
            
            if (rationaleMatch && riskMatch) {
                setAnalysisResult({
                    rationale: rationaleMatch[1].trim(),
                    risk: riskMatch[1].trim()
                });
            } else {
                // Fallback for unstructured response
                setAnalysisResult({ rationale: text, risk: 'Análise de risco não pôde ser extraída.' });
            }

        } catch (e: any) {
            setError('Falha ao analisar o ativo. Por favor, tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <CrosshairIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Terminal de Alvo ("Bala Direcionada")</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Manual */}
                <div>
                    <h3 className="font-bold text-white mb-2">Radar Manual</h3>
                    <p className="text-sm text-text-secondary mb-3">Aponte o poder do Arqueólogo para qualquer ativo de seu interesse.</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Analisar Ticker (ex: RNDR)"
                            className="flex-grow bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                        <button onClick={handleAnalyze} disabled={isLoading} className="bg-primary text-white font-semibold px-4 rounded-md text-sm hover:bg-opacity-80 disabled:opacity-50">
                            {isLoading ? <LoaderIcon className="h-5 w-5 animate-spin"/> : <SearchIcon />}
                        </button>
                    </div>
                    {analysisResult && (
                        <div className="mt-4 bg-background/50 p-3 rounded-md border border-border/50">
                            <h4 className="font-bold text-primary">Racional do Arqueólogo:</h4>
                            <p className="text-sm text-text-secondary italic mt-1">{analysisResult.rationale}</p>
                             <h4 className="font-bold text-danger mt-3">Análise de Risco:</h4>
                            <p className="text-sm text-text-secondary italic mt-1">{analysisResult.risk}</p>
                        </div>
                    )}
                     {error && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-danger"><XCircleIcon className="h-5 w-5" />{error}</div>
                    )}
                </div>
                {/* Zona de Perigo */}
                <div>
                     <h3 className="font-bold text-white mb-2">Zona de Perigo</h3>
                     <p className="text-sm text-text-secondary mb-3">Lista curada pela IA de ativos voláteis mostrando sinais preliminares de anomalia.</p>
                     <div className="space-y-2">
                        {dangerZone.map(asset => (
                            <div key={asset.ticker} className="bg-danger/10 border-l-4 border-danger/50 p-2 rounded-r-md">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="h-5 w-5 text-danger flex-shrink-0"/>
                                    <div>
                                        <p className="font-bold text-white text-sm">{asset.name} ({asset.ticker})</p>
                                        <p className="text-xs text-text-secondary">{asset.rationale}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default TargetingTerminal;
