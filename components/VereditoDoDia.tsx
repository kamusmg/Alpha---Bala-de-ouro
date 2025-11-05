import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { useData } from '../contexts/DataContext';
import { decode, decodeAudioData } from '../utils/audioUtils';
import SpeakerOnIcon from './icons/SpeakerOnIcon';
import LoaderIcon from './icons/LoaderIcon';
import SparklesIcon from './SparklesIcon';

const VereditoDoDia: React.FC = () => {
    const { presentDayData, isInitialLoading } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [verdictText, setVerdictText] = useState('');
    const [error, setError] = useState('');
    
    const audioContextRef = useRef<AudioContext | null>(null);

    const handlePlayVerdict = async () => {
        if (!presentDayData?.advancedMarketRegime || !presentDayData?.presentDayBuySignals) return;

        setIsLoading(true);
        setError('');
        setVerdictText('');

        try {
            const { currentRegime, accelerationScore, exhaustionScore, interclassDominance } = presentDayData.advancedMarketRegime;
            const assetListString = presentDayData.presentDayBuySignals
                .map(s => `${s.assetName} (${s.ticker})`)
                .join(', ');
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // 1. Generate the text verdict first
            const textPrompt = `Aja como um analista de criptomoedas sênior, o 'Motor Alpha'. O contexto de mercado de hoje é: Regime ${currentRegime}, com Aceleração em ${accelerationScore}% e Exaustão em ${exhaustionScore}%. A narrativa dominante é ${interclassDominance.strongestNarrative}.

Com base neste cenário e na lista de ativos promissores a seguir, selecione DOIS:
1. 'A Aposta do Dia': A criptomoeda com o maior potencial explosivo e de alto risco para hoje.
2. 'O Porto Seguro': A criptomoeda mais segura e estável para a condição atual do mercado.

Lista de Ativos: ${assetListString}.

Forneça seu veredito em duas ou três frases curtas, começando com o modo de operação, depois a aposta e o porto seguro, com justificativas breves.`;
            
            const textResult = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: textPrompt,
            });
            const generatedText = textResult.text.trim();
            setVerdictText(generatedText);

            // 2. Generate audio from the text
            const audioResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: generatedText }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A strong, clear voice
                        },
                    },
                },
            });

            const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64Audio) {
                throw new Error("Não foi possível gerar o áudio.");
            }

            // 3. Decode and play audio
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                 audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            // Ensure context is running
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();

            source.onended = () => {
                setIsLoading(false);
            };

        } catch (err: any) {
            console.error("Error generating verdict:", err);
            setError("Ocorreu um erro ao gerar o veredito sonoro. Tente novamente.");
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
             <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg mb-8 animate-pulse">
                <div className="h-6 w-3/4 bg-border rounded-md mx-auto mb-2"></div>
                <div className="h-4 w-full max-w-md bg-border rounded-md mx-auto mb-6"></div>
                <div className="h-12 w-48 bg-border/50 rounded-md mx-auto"></div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2">
                <SparklesIcon className="h-6 w-6 text-primary"/>
                <h2 className="text-2xl font-bold text-text">Veredito Sonoro do Dia</h2>
            </div>
            <p className="text-text-secondary mt-1 mb-6">Ouça a recomendação diária do Motor Alpha para o mercado.</p>
            
            <button
                onClick={handlePlayVerdict}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-80 transition-all text-lg disabled:opacity-50 disabled:cursor-wait mx-auto"
            >
                {isLoading ? (
                    <>
                        <LoaderIcon className="h-6 w-6 animate-spin"/>
                        <span>Gerando...</span>
                    </>
                ) : (
                    <>
                        <SpeakerOnIcon className="h-6 w-6"/>
                        <span>Ouvir Veredito</span>
                    </>
                )}
            </button>

            {verdictText && !isLoading && (
                 <p className="mt-6 text-lg text-text-secondary italic max-w-2xl mx-auto">"{verdictText}"</p>
            )}

            {error && <p className="mt-4 text-sm text-danger">{error}</p>}
        </div>
    );
};

export default VereditoDoDia;
