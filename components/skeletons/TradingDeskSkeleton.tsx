// components/skeletons/TradingDeskSkeleton.tsx
import React from 'react';

const PanelSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
    <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-4">
        <div className="h-6 w-3/4 bg-border rounded-md"></div>
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-8 w-full bg-background/50 rounded-md"></div>
            ))}
        </div>
    </div>
);

const TradingDeskSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-surface/50 border border-border/50 rounded-lg p-6">
                <div className="h-6 w-1/3 bg-border rounded-md mb-4"></div>
                <div className="h-10 w-full bg-background/50 rounded-md mb-2"></div>
                <div className="h-10 w-full bg-background/50 rounded-md mb-2"></div>
                <div className="h-10 w-full bg-background/50 rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PanelSkeleton lines={4} />
                <PanelSkeleton lines={6} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PanelSkeleton lines={1} />
                <PanelSkeleton lines={3} />
            </div>
             <div className="h-64 bg-surface/50 border border-border/50 rounded-lg p-6"></div>
        </div>
    );
};

export default TradingDeskSkeleton;
