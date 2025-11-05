// components/AlphaHunter.tsx
import React, { useState } from 'react';
// FIX: Corrected import path for DataContext
import { useData } from '../contexts/DataContext';
import RocketIcon from './RocketIcon';
import FlameIcon from './icons/FlameIcon';
import SearchIcon from './icons/SearchIcon';
// FIX: Corrected import path for types
import { MemeCoinSignal, GenesisOpportunity } from '../types';
import { DateTime } from 'luxon';

// Mock data for this new component, as it's not in the original data flow
const mockMemeCoins: MemeCoinSignal[] = [
    { name: "DegenChain", ticker: "DEGEN", description: "Infraestrutura L3 para o ecossistema Farcaster com alto potencial de viralização.", potential: 'Alto', risk: 'Extremo' },
    // FIX: Corrected typo in potential value from "Médio" to "Média" to match the type definition.
    { name: "CatCoin", ticker: "CAT", description: "Narrativa de 'cat coins' ganhando tração contra as 'dog coins'.", potential: 'Média', risk: 'Extremo' },
];

// FIX: Corrected mock data to use Luxon's DateTime to match the type definition.
const mockGenesis: GenesisOpportunity[] = [
    { name: "Monad", category: "L1 Blockchain", launchDate: DateTime.fromISO('2024-09-15'), description: "Nova L1 de alta performance com EVM paralelizado, prometendo 10,000 TPS.", potentialScore: 92 },
    { name: "EigenLayer", category: "Restaking", launchDate: DateTime.fromISO('2024-08-20'), description: "Protocolo de 'restaking' que permite que stakers de ETH validem outras redes.", potentialScore: 88 },
];


const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="text-secondary">{icon}</div>
            <h3 className="text-xl font-bold text-secondary">{title}</h3>
        </div>
        {children}
    </div>
);

const AlphaHunter: React.FC = () => {
    const { isInitialLoading } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    if (isInitialLoading) {
        return <div>Loading...</div>; // Add a skeleton later if needed
    }

    return (
        <div className="space-y-12">
            <div className="text-center">
                <RocketIcon className="h-16 w-16 text-primary mx-auto" />
                <h2 className="text-4xl font-bold text-text mt-4">Alpha Hunter: Oportunidades Explosivas</h2>
                <p className="text-text-secondary mt-2 max-w-2xl mx-auto">
                    Esta seção é dedicada à caça de "alfa" em nichos de altíssimo risco e potencial.
                </p>
            </div>
            {/* The rest of the component will be implemented in future tasks */}
        </div>
    );
};

export default AlphaHunter;