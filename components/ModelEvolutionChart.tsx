import React from 'react';
import { GlobalPerformanceMetrics } from '../types';
import LineChartIcon from './icons/LineChartIcon';
import { DateTime } from 'luxon';

interface ModelEvolutionChartProps {
    performanceData: GlobalPerformanceMetrics[];
}

const Bar: React.FC<{ value: number; maxValue: number; color: string }> = ({ value, maxValue, color }) => {
    const heightPercentage = (value / maxValue) * 100;
    return (
        <div className="h-full flex items-end justify-center group relative">
            <div 
                className={`w-full rounded-t-md transition-all duration-300 ${color}`} 
                style={{ height: `${heightPercentage}%` }}
            ></div>
            <span className="absolute -top-5 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {value.toFixed(1)}
            </span>
        </div>
    );
};

const ModelEvolutionChart: React.FC<ModelEvolutionChartProps> = ({ performanceData }) => {
    if (!performanceData || performanceData.length === 0) return null;

    const maxSuccessRate = Math.max(...performanceData.map(d => d.successRate), 0);
    const maxRoi = Math.max(...performanceData.map(d => d.netRoi), 0);
    const maxSharpe = Math.max(...performanceData.map(d => d.sharpeRatio), 0);

    const metrics = [
        { key: 'successRate', label: 'Taxa de Acerto (%)', max: maxSuccessRate, color: 'bg-blue-500' },
        { key: 'netRoi', label: 'ROI Líquido (%)', max: maxRoi, color: 'bg-green-500' },
        { key: 'sharpeRatio', label: 'Índice Sharpe', max: maxSharpe, color: 'bg-purple-500' }
    ];

    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <LineChartIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text">Evolução Diária do Modelo</h2>
            </div>
            
            <div className="flex gap-4">
                {metrics.map(metric => (
                    <div key={metric.key} className="flex-1">
                        <h4 className="text-center font-bold text-text-secondary mb-2">{metric.label}</h4>
                        <div className="h-48 bg-background/50 rounded-lg p-2 flex justify-around items-end gap-2">
                            {performanceData.map(data => (
                                <div key={data.date} className="h-full w-full flex flex-col justify-end items-center">
                                    <Bar 
                                        value={data[metric.key as keyof GlobalPerformanceMetrics] as number} 
                                        maxValue={metric.max > 0 ? metric.max * 1.2 : 1}
                                        color={metric.color}
                                    />
                                    <span className="text-xs text-text-secondary mt-1">
                                        {DateTime.fromISO(data.date).toFormat('dd/MM')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelEvolutionChart;
