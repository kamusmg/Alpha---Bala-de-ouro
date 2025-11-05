// components/skeletons/AlphaDivergenceRadarSkeleton.tsx
import React from 'react';

const DivergenceCardSkeleton: React.FC = () => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-border rounded-md"></div>
            <div className="h-4 w-24 bg-border rounded-md"></div>
        </div>
        <div className="flex items-start gap-3 pt-3 border-t border-border/50">
            <div className="h-5 w-5 bg-border rounded-full mt-1"></div>
            <div className="flex-1 space-y-2">
                <div className="h-3 w-full bg-border/50 rounded-md"></div>
                <div className="h-3 w-5/6 bg-border/50 rounded-md"></div>
            </div>
        </div>
        <div className="h-6 w-full bg-border/50 rounded-md mt-2"></div>
    </div>
);


const AlphaDivergenceRadarSkeleton: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-border rounded-full"></div>
                <div className="h-6 w-80 bg-border rounded-md"></div>
            </div>
            <div className="h-4 w-full bg-border/50 rounded-md mb-6"></div>
            <div className="space-y-4">
                <DivergenceCardSkeleton />
                <DivergenceCardSkeleton />
                <DivergenceCardSkeleton />
            </div>
        </div>
    );
};

export default AlphaDivergenceRadarSkeleton;