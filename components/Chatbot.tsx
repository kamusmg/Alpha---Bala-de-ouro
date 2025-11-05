import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useData } from '../contexts/DataContext';
import ChatBotIcon from './icons/ChatBotIcon';
import XIcon from './icons/XIcon';
import SendIcon from './SendIcon';
import BrainIcon from './BrainIcon';
import UserIcon from './UserIcon';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const Chatbot: React.FC = () => {
    const { 
        presentDayData, 
        backtestData, 
        livePositions,
        tradingDeskData,
        alphaHuntData,
        asymmetricOpportunitiesData,
        globalPerformanceData
    } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const buildSystemContext = (): string => {
        if (!presentDayData) return "O analista está offline. Avise o usuário que os dados não estão disponíveis.";

        let context = `Você é 'Alpha', um co-piloto e analista expert da plataforma Alpha Engine. Sua função é fornecer insights profundos e respostas contextualizadas, cruzando informações de TODAS as fontes de dados disponíveis na plataforma, que estão consolidadas abaixo. Seja proativo. Se um usuário perguntar sobre um ativo, cruze a informação com o regime de mercado atual e a recomendação de risco. Não se limite a repetir os dados; interprete-os como um especialista faria para seu cliente.

### CONTEXTO MACRO E REGIME DE MERCADO (HOJE)
- **Veredito do Mercado:** ${presentDayData.macroContext[0]?.value} (${presentDayData.macroContext[0]?.interpretation}).
- **Regime Atual:** ${presentDayData.advancedMarketRegime.currentRegime}. Aceleração: ${presentDayData.advancedMarketRegime.accelerationScore}%, Exaustão: ${presentDayData.advancedMarketRegime.exhaustionScore}%.
- **Recomendação Estratégica:** ${presentDayData.advancedMarketRegime.strategyRecommendation}.
- **Análise On-Chain:** Sentimento ${presentDayData.deepOnChainAnalysis.overallSentiment} com score ${presentDayData.deepOnChainAnalysis.sentimentScore}.

### POSIÇÕES ABERTAS EM TEMPO REAL
${livePositions.length > 0
    ? `- **Total de Posições:** ${livePositions.length}\n` +
      `- **P&L Total (Aberto):** ${formatCurrency(livePositions.reduce((acc, pos) => acc + pos.pnl, 0))}\n` +
      livePositions.map(p => `  - ${p.asset}: P&L ${formatPercentage(p.pnlPercentage, true)}`).join('\n')
    : "- Nenhuma posição aberta no momento."
}

### SINAIS DE ALTA CONVICÇÃO E OPORTUNIDADES
- **Principal Sinal de Compra:** ${presentDayData.presentDayBuySignals[0]?.assetName || 'N/A'}.
- **Bala de Ouro:** ${presentDayData.asymmetricArsenal.gold?.ticker || 'N/A'}. Racional: ${presentDayData.asymmetricArsenal.gold?.rationale.substring(0, 100)}...
- **Bala de Prata:** ${presentDayData.asymmetricArsenal.silver?.ticker || 'N/A'}.
- **Bala de Bronze:** ${presentDayData.asymmetricArsenal.bronze?.ticker || 'N/A'}.
- **Narrativa Quente (Caça ao Alfa):** ${alphaHuntData?.results[0]?.narrative.name || 'N/A'}.
- **Principal Ativo Divergente:** ${presentDayData.alphaDivergence[0]?.ticker || 'N/A'}, performando ${formatPercentage(presentDayData.alphaDivergence[0]?.performanceVsMarket.asset)} vs mercado.

### ANÁLISE DE RISCO E PERFORMANCE
- **Recomendação de Risco Atual:** Tamanho de posição ideal de ${tradingDeskData?.riskSizing?.idealPositionSize || 'N/A'}% com alavancagem máxima de ${tradingDeskData?.riskSizing?.maxLeverage || 'N/A'}x.
- **Performance Histórica (Backtest):** Taxa de acerto de ${backtestData ? formatPercentage(backtestData.Geral.summary.successRate) : 'N/A'}.
- **Performance Global (Hoje):** Taxa de acerto de ${globalPerformanceData ? formatPercentage(globalPerformanceData.latest.successRate) : 'N/A'}.

Com base em TODA essa informação, responda à pergunta do usuário de forma completa e integrada.
`;
        return context;
    };

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Re-create chat session if it's the first message or if we want fresh context
            // For a true co-pilot, creating it each time ensures the latest data.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = buildSystemContext();
            
            // Start a new chat with the full, updated context
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: [{ role: 'user', parts: [{ text: systemInstruction }] }],
            });
            
            const chat = chatRef.current!;
            // Now send the user's actual message
            const result = await chat.sendMessage({ message: currentInput });
            
            const aiMessage: Message = { sender: 'ai', text: result.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error: any) {
            console.error("Chatbot error:", error);
            const errorMessage: Message = { sender: 'ai', text: `Desculpe, ocorreu um erro ao me conectar com o motor de IA. Por favor, tente novamente.` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePromptSuggestion = (prompt: string) => {
        setInput(prompt);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const promptSuggestions = [
        "Compare a 'Bala de Ouro' com o principal ativo da 'Caça ao Alfa'.",
        "Qual o risco de abrir uma nova posição agora, considerando o veredito do dia?",
        "Resuma a performance histórica do modelo versus as posições abertas atualmente.",
    ];

    return (
        <>
            <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-transform hover:scale-110"
                    aria-label="Open chatbot"
                >
                    <ChatBotIcon className="h-8 w-8" />
                </button>
            </div>

            <div className={`fixed bottom-8 right-8 z-50 w-[calc(100vw-4rem)] max-w-lg h-[70vh] max-h-[600px] flex flex-col bg-surface/80 backdrop-blur-xl border border-border/70 rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <BrainIcon className="h-8 w-8 text-primary" />
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Alpha, o Analista IA</h3>
                            <p className="text-xs text-text-secondary">Conectado ao Alpha Engine v10.0</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-text-secondary hover:text-white rounded-full hover:bg-border transition-colors" aria-label="Close chatbot">
                        <XIcon className="h-5 w-5" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-surface">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                            <BrainIcon className="h-12 w-12 mb-2 text-primary/50" />
                            <p className="font-semibold text-white">Como posso te ajudar?</p>
                            <div className="mt-4 w-full space-y-2">
                                {promptSuggestions.map((prompt, i) => (
                                    <button key={i} onClick={() => handlePromptSuggestion(prompt)} className="w-full text-left text-sm p-2 bg-background/50 rounded-md hover:bg-border transition-colors">
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 items-end ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><BrainIcon className="h-5 w-5 text-primary" /></div>}
                            <div className={`max-w-md p-3 rounded-lg text-white ${msg.sender === 'user' ? 'bg-primary' : 'bg-background'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center"><UserIcon className="h-5 w-5 text-secondary" /></div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><BrainIcon className="h-5 w-5 text-primary" /></div>
                            <div className="max-w-md p-3 rounded-lg bg-background flex items-center gap-2">
                                <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:0s]"></span>
                                <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t border-border">
                    <div className="flex items-center gap-2 bg-background/50 rounded-lg border border-border focus-within:border-primary transition-colors">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Pergunte ao Alpha..."
                            className="w-full bg-transparent p-3 text-sm text-text placeholder-text-secondary focus:outline-none resize-none"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || input.trim() === ''}
                            className="self-center m-2 p-2 rounded-full bg-primary text-white disabled:bg-border disabled:text-text-secondary transition-colors"
                            aria-label="Send message"
                        >
                            <SendIcon className="h-5 w-5" />
                        </button>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;