// components/skeletons/AdvancedMarketRegimePanelSkeleton.tsx
import React from 'react';

const AdvancedMarketRegimePanelSkeleton: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-6 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-border rounded-full"></div>
                <div className="h-6 w-80 bg-border rounded-md"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-32 bg-background/50 rounded-lg border border-border/50"></div>
                <div className="lg:col-span-2 h-32 bg-background/50 rounded-lg border border-border/50"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-background/50 rounded-lg border border-border/50"></div>
                ))}
            </div>

            <div>
                <div className="h-5 w-64 bg-border rounded-md mb-2"></div>
                <div className="h-32 bg-background/50 rounded-lg border border-border/50"></div>
            </div>
        </div>
    );
};

export default AdvancedMarketRegimePanelSkeleton;
