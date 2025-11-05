import React, { useState } from 'react';
// FIX: Import GoogleGenAI to use Gemini API directly for quick analysis.
import { GoogleGenAI } from '@google/genai';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/formatters';
import StarIcon from './icons/StarIcon';
import XIcon from './icons/XIcon';
import SearchIcon from './icons/SearchIcon';
import RotateCwIcon from './RotateCwIcon';

const useLocalStorage = (key: string, initialValue: string[]) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: string[] | ((val: string[]) => string[])) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

type AnalysisState = {
    [ticker: string]: {
        isLoading: boolean;
        conclusion?: 'BUY' | 'SELL' | 'HOLD';
        reason?: string;
        error?: string;
    }
};

const Watchlist: React.FC = () => {
    // FIX: Removed apiClient as it's no longer used for quick analysis.
    const { livePrices } = useData();
    const [watchlist, setWatchlist] = useLocalStorage('alpha-engine-watchlist', ['BTC', 'ETH', 'SOL']);
    const [newSymbol, setNewSymbol] = useState('');
    const [analyses, setAnalyses] = useState<AnalysisState>({});

    const addSymbol = (e: React.FormEvent) => {
        e.preventDefault();
        const symbolToAdd = newSymbol.trim().toUpperCase();
        if (symbolToAdd && !watchlist.includes(symbolToAdd)) {
            setWatchlist([...watchlist, symbolToAdd]);
            setNewSymbol('');
        }
    };

    const removeSymbol = (symbolToRemove: string) => {
        setWatchlist(watchlist.filter((symbol: string) => symbol !== symbolToRemove));
        // Also remove analysis from state
        setAnalyses(prev => {
            const newAnalyses = { ...prev };
            delete newAnalyses[symbolToRemove];
            return newAnalyses;
        });
    };
    
    // FIX: handleAnalyze now uses GoogleGenAI directly, consistent with other components, to fix the missing method error.
    const handleAnalyze = async (ticker: string) => {
        setAnalyses(prev => ({ ...prev, [ticker]: { isLoading: true } }));
        try {
            const prompt = `Should I buy, sell, or hold ${ticker} right now based on current market conditions? Provide a very brief, one-sentence justification, then on a new line, conclude with a single word: BUY, SELL, or HOLD.`;
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const responseText = response.text;
            
            const lines = responseText.trim().split('\n');
            const conclusionRaw = lines.pop()?.trim().toUpperCase();
            const reason = lines.join('\n').trim();

            let conclusion: 'BUY' | 'SELL' | 'HOLD' | undefined;
            if (conclusionRaw === 'BUY' || conclusionRaw === 'SELL' || conclusionRaw === 'HOLD') {
                conclusion = conclusionRaw;
            }

            setAnalyses(prev => ({ ...prev, [ticker]: { isLoading: false, conclusion, reason } }));
        } catch (e: any) {
            setAnalyses(prev => ({ ...prev, [ticker]: { isLoading: false, error: 'Falha na análise.' } }));
        }
    };

     const getConclusionBadge = (conclusion?: 'BUY' | 'SELL' | 'HOLD') => {
        if (!conclusion) return null;
        const styles = {
            BUY: 'bg-success/20 text-success',
            SELL: 'bg-danger/20 text-danger',
            HOLD: 'bg-yellow-400/20 text-yellow-400',
        };
        return <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${styles[conclusion]}`}>{conclusion}</span>
    };

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <StarIcon className="h-6 w-6 text-primary" />
                Watchlist Pessoal
            </h3>
            <form onSubmit={addSymbol} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="Adicionar Ticker (ex: ADA)"
                    className="flex-grow bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                />
                <button type="submit" className="bg-primary text-white font-semibold px-4 rounded-md text-sm hover:bg-opacity-80">+</button>
            </form>
            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                {watchlist.length > 0 ? (
                    watchlist.map((symbol: string) => {
                        const analysis = analyses[symbol];
                        return (
                            <div key={symbol} className="bg-background/30 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-white text-lg">{symbol}</p>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-white text-sm">{formatCurrency(livePrices[symbol]) || '...'}</p>
                                        <button onClick={() => removeSymbol(symbol)} className="text-text-secondary hover:text-danger">
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-border/50 min-h-[44px] flex items-center">
                                    {analysis?.isLoading ? (
                                        <div className="text-sm text-text-secondary animate-pulse w-full">Analisando...</div>
                                    ) : analysis?.conclusion || analysis?.error ? (
                                        <div className="w-full">
                                            <div className="flex justify-between items-center">
                                                {analysis.conclusion ? getConclusionBadge(analysis.conclusion) : <span className="text-xs text-danger">{analysis.error}</span>}
                                                <button onClick={() => handleAnalyze(symbol)} className="text-text-secondary hover:text-primary p-1" title="Analisar Novamente">
                                                    <RotateCwIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {analysis.reason && <p className="text-xs text-text-secondary mt-1">{analysis.reason}</p>}
                                        </div>
                                    ) : (
                                        <button onClick={() => handleAnalyze(symbol)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition-colors">
                                            <SearchIcon className="h-4 w-4" />
                                            Análise Rápida
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-text-secondary text-sm py-8">Sua watchlist está vazia.</p>
                )}
            </div>
        </div>
    );
};

export default Watchlist;
