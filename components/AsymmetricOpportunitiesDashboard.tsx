// components/AsymmetricOpportunitiesDashboard.tsx
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
// FIX: Corrected import path
import AsymmetricOpportunityCard from './AsymmetricOpportunityCard';
import AsymmetricOpportunitiesDashboardSkeleton from './skeletons/AsymmetricOpportunitiesDashboardSkeleton';
import RocketIcon from './RocketIcon';

const AsymmetricOpportunitiesDashboard: React.FC = () => {
    const {
        asymmetricOpportunitiesData,
        isAsymmetricOpportunitiesLoading,
        loadAsymmetricOpportunitiesData,
        error,
    } = useData();

    useEffect(() => {
        if (!asymmetricOpportunitiesData && !isAsymmetricOpportunitiesLoading) {
            loadAsymmetricOpportunitiesData();
        }
    }, [asymmetricOpportunitiesData, isAsymmetricOpportunitiesLoading, loadAsymmetricOpportunitiesData]);

    if (isAsymmetricOpportunitiesLoading) {
        return <AsymmetricOpportunitiesDashboardSkeleton />;
    }

    if (error && !asymmetricOpportunitiesData) {
        return <div className="text-center text-danger">Erro ao carregar oportunidades.</div>;
    }

    if (!asymmetricOpportunitiesData || asymmetricOpportunitiesData.top10.length === 0) {
        return <div className="text-center text-text-secondary">Nenhuma oportunidade assimétrica encontrada.</div>;
    }

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <RocketIcon className="h-8 w-8 text-secondary" />
                <h2 className="text-2xl font-bold text-text">Radar de Oportunidades Assimétricas</h2>
            </div>
            <p className="text-sm text-text-secondary mb-6">
                Ranking em tempo real de ativos emergentes com alto potencial de valorização, classificados por um Score de Explosão.
            </p>
            <div className="space-y-4">
                {asymmetricOpportunitiesData.top10.map(opp => (
                    <AsymmetricOpportunityCard key={opp.ticker} opportunity={opp} />
                ))}
            </div>
        </div>
    );
};

export default AsymmetricOpportunitiesDashboard;
