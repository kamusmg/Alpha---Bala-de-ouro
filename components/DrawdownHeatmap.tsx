import React from 'react';

const DrawdownHeatmap: React.FC = () => {
    // Mock data for visualization
    const data = Array.from({ length: 90 }, () => Math.random());

    const getColor = (value: number) => {
        if (value > 0.8) return 'bg-red-800';
        if (value > 0.6) return 'bg-red-600';
        if (value > 0.4) return 'bg-yellow-600';
        return 'bg-green-600';
    };

    return (
        <div>
            <h4 className="text-lg font-bold text-text mb-2">Heatmap de Drawdown (Simulado)</h4>
            <div className="grid grid-cols-15 grid-rows-6 gap-1 p-2 bg-background/50 rounded-md border border-border/50">
                {data.map((value, index) => (
                     <div key={index} className="relative group">
                        <div
                            className={`w-full h-4 rounded-sm transition-colors ${getColor(value)}`}
                        />
                        <div 
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100"
                        >
                           Dia {index + 1}: Drawdown de {(value * 20).toFixed(1)}%
                        </div>
                    </div>
                ))}
            </div>
             <p className="text-xs text-text-secondary mt-2 text-right">
                Simulação de períodos de rebaixamento da conta. Mais vermelho indica maior drawdown.
            </p>
        </div>
    );
};

export default DrawdownHeatmap;
