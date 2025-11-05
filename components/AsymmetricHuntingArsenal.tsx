// components/AsymmetricHuntingArsenal.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import AsymmetricBulletCard from './AsymmetricBulletCard';
import TargetingTerminal from './TargetingTerminal';
import SilverBulletCardSkeleton from './skeletons/SilverBulletCardSkeleton'; // Re-using for simplicity

const AsymmetricHuntingArsenal: React.FC = () => {
    const { presentDayData, isInitialLoading, activateTrade, livePrices } = useData();

    if (isInitialLoading) {
        return <SilverBulletCardSkeleton />;
    }

    const arsenal = presentDayData?.asymmetricArsenal;

    if (!arsenal) {
        return (
             <div className="bg-surface/50 border border-border/50 rounded-lg p-6 text-center">
                <p className="text-text-secondary">Arsenal de Caça Assimétrica indisponível.</p>
            </div>
        );
    }
    
    const { gold, silver, bronze, dangerZone } = arsenal;

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-text mb-2 text-center">O Arsenal de Caça Assimétrica</h2>
                <p className="text-text-secondary max-w-3xl mx-auto text-center">
                    Um conjunto de ferramentas de IA para identificar oportunidades de alto risco e recompensa em diferentes espectros do mercado, desde gemas desconhecidas até apostas estratégicas.
                </p>
            </div>

            <TargetingTerminal dangerZone={dangerZone} />

            <div className="space-y-8">
                {gold && <AsymmetricBulletCard signal={gold} />}
                {silver && <AsymmetricBulletCard signal={silver} />}
                {bronze && <AsymmetricBulletCard signal={bronze} />}

                {!gold && !silver && !bronze && (
                     <div className="bg-surface/50 border border-border/50 rounded-lg p-6 text-center">
                        <p className="text-text-secondary">Nenhuma oportunidade assimétrica encontrada no momento.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AsymmetricHuntingArsenal;