// components/MaturityIndicator.tsx
import React from 'react';
import { NarrativeMaturity } from '../types';

interface MaturityIndicatorProps {
    currentStage: NarrativeMaturity;
}

const STAGES: NarrativeMaturity[] = ['Descoberta', 'Expansão', 'Saturação', 'Declínio'];

const MaturityIndicator: React.FC<MaturityIndicatorProps> = ({ currentStage }) => {
    const currentIndex = STAGES.indexOf(currentStage);

    return (
        <div className="flex items-center justify-between gap-1">
            {STAGES.map((stage, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                
                let bgColor = 'bg-border';
                if (isActive) {
                    bgColor = 'bg-primary animate-pulse';
                } else if (isCompleted) {
                    bgColor = 'bg-primary/50';
                }

                return (
                    <div key={stage} className="flex-1 flex flex-col items-center">
                        <div className={`w-full h-1.5 rounded-full ${bgColor} transition-colors`}></div>
                        <span className={`mt-1 text-[10px] font-semibold text-center ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                            {stage}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default MaturityIndicator;
