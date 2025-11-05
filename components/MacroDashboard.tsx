import React from 'react';
// FIX: Corrected import path for DataContext
import { useData } from '../contexts/DataContext';
import MacroDashboardSkeleton from './skeletons/MacroDashboardSkeleton';
// FIX: Corrected import path for translations
import { translations } from '../utils/translations';
import ChevronDownIcon from './ChevronDownIcon';
// FIX: Corrected import path for types
import { MacroIndicator, TraditionalAsset } from '../types';
import CompassIcon from './icons/CompassIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';
import { formatCurrency, formatPercentage } from '../utils/formatters';


const statusConfig = {
    critical: {
        textColor: 'text-danger',
        borderColor: 'border-danger',
        baseColor: 'danger',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
    },
    warning: {
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-400',
        baseColor: 'yellow',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
    },
    neutral: {
        textColor: 'text-blue-400',
        borderColor: 'border-blue-400',
        baseColor: 'blue',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
    },
    good: {
        textColor: 'text-green-400',
        borderColor: 'border-green-400',
        baseColor: 'green',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
    }
};

const RegimeCard: React.FC<{ indicator: MacroIndicator }> = ({ indicator }) => {
    const config = statusConfig[indicator.status] || statusConfig.neutral;
    const bgColorClass = {
        danger: 'bg-danger/10',
        yellow: 'bg-yellow-400/10',
        blue: 'bg-blue-400/10',
        green: 'bg-green-400/10',
    }[config.baseColor] || 'bg-blue-400/10';

    return (
        <div className={`col-span-full lg:col-span-2 bg-gradient-to-br from-primary/20 via-surface to-surface border-2 ${config.borderColor} rounded-lg p-6 shadow-lg flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left`}>
            <div className={`flex-shrink-0 ${bgColorClass} p-4 rounded-full border-2 ${config.borderColor}`}>
                <CompassIcon className={`h-16 w-16 ${config.textColor}`} />
            </div>
            <div>
                <h3 className="text-base font-bold text-text-secondary uppercase tracking-wider">{indicator.name}</h3>
                <p className={`text-4xl font-bold ${config.textColor} my-1`}>{indicator.value}</p>
                <p className="text-base text-text-secondary">{indicator.interpretation}</p>
            </div>
        </div>
    );
};

const TraditionalAssetCard: React.FC<{ asset: TraditionalAsset }> = ({ asset }) => {
    const isUp = asset.change >= 0;
    const colorClass = isUp ? 'text-success' : 'text-danger';
    const borderColorClass = isUp ? 'border-success' : 'border-danger';
    const Icon = isUp ? TrendingUpIcon : TrendingDownIcon;

    return (
        <div className={`bg-surface border-l-4 ${borderColorClass} rounded-r-lg p-4 shadow-md`}>
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-text-secondary text-sm">{asset.name} ({asset.ticker})</h4>
                <span className={colorClass}><Icon className="h-5 w-5"/></span>
            </div>
            <p className="text-2xl font-bold text-text mb-1">{formatCurrency(asset.value)}</p>
            <p className={`text-sm font-bold ${colorClass}`}>{formatPercentage(asset.change, true)}</p>
        </div>
    )
}


const MacroDashboard: React.FC = () => {
    const { presentDayData, isInitialLoading, isRecalculating } = useData();
    const t = translations.pt;


    if (isInitialLoading) return <MacroDashboardSkeleton />;
    if (!presentDayData || !presentDayData.macroContext) return null;

    const { macroContext, crossAssetAnalysis } = presentDayData;

    const regimeIndicator = macroContext.find(ind => ind.name.toLowerCase().includes('regime'));
    const otherIndicators = macroContext.filter(ind => !ind.name.toLowerCase().includes('regime'));
    
    // Display the top 4 indicators prominently, hide the rest.
    const primaryIndicators = otherIndicators.slice(0, 2);
    const secondaryIndicators = otherIndicators.slice(2);

    const renderIndicatorCard = (indicator: MacroIndicator, key: string | number) => {
        const config = statusConfig[indicator.status] || statusConfig.neutral;
        return (
            <div key={key} className={`bg-surface border-l-4 ${config.borderColor} rounded-r-lg p-4 shadow-md`}>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-text-secondary text-sm">{indicator.name}</h4>
                    <span className={config.textColor}>{config.icon}</span>
                </div>
                <p className="text-2xl font-bold text-text mb-1">{indicator.value}</p>
                <p className={`text-xs ${config.textColor}`}>{indicator.interpretation}</p>
            </div>
        );
    };

    return (
        <div className="relative">
             {isRecalculating && (
                <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-lg z-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <div>
                <h2 className="text-3xl font-bold text-text mb-6 pb-2 border-b-2 border-border">Painel de Controle Macro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {regimeIndicator && <RegimeCard indicator={regimeIndicator} />}
                    {crossAssetAnalysis?.traditionalAssets.map((asset) => (
                        <TraditionalAssetCard key={asset.ticker} asset={asset} />
                    ))}
                    {primaryIndicators.map((indicator, index) => renderIndicatorCard(indicator, index))}
                </div>

                {secondaryIndicators.length > 0 && (
                     <details className="group mt-4 bg-surface/30 rounded-lg border border-transparent open:border-border/50 transition-all">
                        <summary className="cursor-pointer list-none flex items-center justify-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors p-3">
                            {/* FIX: Use correct translation keys. */}
                            <span className="group-open:hidden">{t.showMore}</span>
                            {/* FIX: Use correct translation key. */}
                            <span className="hidden group-open:inline">{t.showLess}</span>
                            <ChevronDownIcon className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
                        </summary>
                        <div className="p-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {secondaryIndicators.map((indicator, index) => renderIndicatorCard(indicator, `secondary-${index}`))}
                        </div>
                    </details>
                )}
            </div>
        </div>
    );
};

export default MacroDashboard;