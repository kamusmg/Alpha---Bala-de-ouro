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
    const { presentDayData, backtestData, livePositions } = useData();
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

        const macro = presentDayData.macroContext[0];
        const regime = presentDayData.advancedMarketRegime;
        const topBuySignal = presentDayData.presentDayBuySignals[0];
        const backtestSummary = backtestData?.Geral.summary;

        let context = `Você é 'Alpha', um analista de criptomoedass expert, integrado à plataforma Alpha Engine. Sua função é responder às perguntas dos usuários com base nos dados de mercado em tempo real fornecidos abaixo. Seja conciso, direto e aja como um assistente de elite.

DADOS DE MERCADO ATUAIS:
- **Veredito do Mercado:** ${macro.value} (${macro.interpretation}).
- **Regime Atual:** ${regime.currentRegime} com pontuação de Aceleração de ${regime.accelerationScore}% e Exaustão de ${regime.exhaustionScore}%. A narrativa mais forte é ${regime.interclassDominance.strongestNarrative}.
- **Principal Sinal de Compra:** ${topBuySignal?.assetName} (${topBuySignal?.ticker}) com confiança ${topBuySignal?.confidence}.
- **Performance do Modelo (Backtest):** Taxa de acerto de ${backtestSummary ? formatPercentage(backtestSummary.successRate) : 'N/A'}.
`;
        if (livePositions.length > 0) {
            const totalPnl = livePositions.reduce((acc, pos) => acc + pos.pnl, 0);
            context += `- **Posições Abertas:** ${livePositions.length} posições abertas com um P&L total de ${formatCurrency(totalPnl)}.\n`;
        } else {
            context += `- **Posições Abertas:** Nenhuma posição aberta no momento.\n`;
        }
        
        context += "\nResponda à pergunta do usuário com base nesses dados."
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
            if (!chatRef.current) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const context = buildSystemContext();
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    history: [{ role: 'user', parts: [{ text: context }] }],
                });
                chatRef.current = newChat;
            }
            
            const chat = chatRef.current!;
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
        "Qual a sua recomendação para hoje?",
        `Me dê mais detalhes sobre ${presentDayData?.presentDayBuySignals[0]?.assetName || 'o principal ativo'}.`,
        "O mercado está arriscado agora?",
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
