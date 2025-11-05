import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { BacktestSignal, SelfAnalysis } from '../types';
import SignalCard from './SignalCard';
import SelfAnalysisCard from './SelfAnalysisCard';
import EvolutionPromptBox from './EvolutionPromptBox';
import RocketIcon from './RocketIcon';
import EvolutionCycleCardSkeleton from './skeletons/EvolutionCycleCardSkeleton';

interface EvolutionCycleCardProps {
  failedSignal: BacktestSignal;
  selfAnalysis: SelfAnalysis;
  evolutionPrompt: string;
  correctionSuggestion: string;
  backtestStrengths: string;
  backtestWeaknesses: string;
}

const EvolutionCycleCard: React.FC<EvolutionCycleCardProps> = ({ failedSignal, selfAnalysis, evolutionPrompt, correctionSuggestion, backtestStrengths, backtestWeaknesses }) => {
  const { apiClient } = useData();
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionResult, setEvolutionResult] = useState<string | null>(null);

  const handleEvolve = async () => {
    setIsEvolving(true);
    setEvolutionResult(null);
    try {
      const response = await apiClient.fetchSupervisorDirective({
        analysis: selfAnalysis,
        promptText: evolutionPrompt,
      });
      setEvolutionResult(response.directive);
    } catch (error: any) {
      setEvolutionResult(`Error during evolution: ${error.message}`);
    } finally {
      setIsEvolving(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg relative">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h2 className="text-3xl font-bold text-text mb-1">Ciclo de Evolução e Aprendizagem</h2>
            <p className="text-text-secondary max-w-2xl">
                Análise de falhas críticas do backtest para gerar diretivas de aprimoramento para a próxima versão do modelo de IA.
            </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
            <h3 className="text-xl font-bold text-danger mb-4 text-center">Análise da Falha Crítica</h3>
            <SignalCard signal={failedSignal} />
        </div>
        <div className="space-y-6">
            <SelfAnalysisCard analysis={selfAnalysis} backtestStrengths={backtestStrengths} backtestWeaknesses={backtestWeaknesses} />
            <EvolutionPromptBox promptText={evolutionPrompt} correctionSuggestion={correctionSuggestion} />
        </div>
      </div>

      <div className="text-center pt-8 mt-8 border-t-4 border-primary/50">
        <h3 className="text-2xl font-bold text-primary">Injeção de Diretiva de Supervisor</h3>
        <p className="text-text-secondary mt-1 mb-4">Comandar o aprimoramento do modelo com base na análise da falha.</p>
        <button
            onClick={handleEvolve}
            disabled={isEvolving}
            className="flex items-center justify-center gap-3 bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-80 transition-all text-lg disabled:opacity-50 disabled:cursor-wait mx-auto"
        >
            <RocketIcon className={`h-6 w-6 ${isEvolving ? 'animate-bounce' : ''}`} />
            {isEvolving ? 'Evoluindo Modelo...' : 'Iniciar Ciclo de Evolução'}
        </button>
        {evolutionResult && (
            <div className="mt-4 p-3 bg-background/50 rounded-md text-sm text-text-secondary font-mono max-w-2xl mx-auto">
                {evolutionResult}
            </div>
        )}
      </div>
    </div>
  );
};

export default EvolutionCycleCard;
