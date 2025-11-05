// components/RegimeHeatmap.tsx
import React from 'react';
import { RegimeDay, MarketRegime } from '../types';

interface RegimeHeatmapProps {
    data: RegimeDay[];
}

const RegimeHeatmap: React.FC<RegimeHeatmapProps> = ({ data }) => {
    const regimeColors: Record<MarketRegime, string> = {
        Bull: 'bg-success/70 hover:bg-success',
        Bear: 'bg-danger/70 hover:bg-danger',
        Sideways: 'bg-yellow-400/70 hover:bg-yellow-400',
        Stress: 'bg-secondary/70 hover:bg-secondary',
    };

    return (
        <div>
            <div className="grid grid-cols-15 grid-rows-6 gap-1 p-2 bg-background/50 rounded-md border border-border/50">
                {data.map((day, index) => (
                    <div key={index} className="relative group">
                        <div
                            className={`w-full h-4 rounded-sm transition-colors ${regimeColors[day.regime]}`}
                        />
                        <div 
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                            role="tooltip"
                        >
                            {day.date}: {day.regime}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end items-center gap-4 mt-2 text-xs text-text-secondary">
                {Object.entries(regimeColors).map(([regime, className]) => (
                    <div key={regime} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm ${className.split(' ')[0]}`}></div>
                        <span>{regime}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegimeHeatmap;
