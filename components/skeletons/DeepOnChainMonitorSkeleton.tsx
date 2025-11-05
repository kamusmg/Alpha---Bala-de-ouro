// components/skeletons/DeepOnChainMonitorSkeleton.tsx
import React from 'react';

const DeepOnChainMonitorSkeleton: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-6 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-border rounded-full"></div>
                <div className="h-6 w-96 bg-border rounded-md"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 h-36 bg-background/50 rounded-lg border border-border/50 p-6 space-y-3">
                    <div className="h-4 w-3/4 bg-border/50 rounded-md mx-auto"></div>
                    <div className="h-12 w-full bg-border/50 rounded-md"></div>
                    <div className="h-2 w-full bg-border/50 rounded-full"></div>
                </div>
                <div className="lg:col-span-2 h-36 bg-background/50 rounded-lg border border-border/50 p-4 space-y-3">
                    <div className="h-4 w-1/3 bg-border/50 rounded-md"></div>
                    <div className="h-6 w-full bg-border/50 rounded-md"></div>
                    <div className="h-6 w-full bg-border/50 rounded-md"></div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="h-24 bg-background/50 rounded-lg border border-border/50 p-4 space-y-2">
                    <div className="h-4 w-1/2 bg-border/50 rounded-md"></div>
                    <div className="h-8 w-2/3 bg-border/50 rounded-md"></div>
                    <div className="h-3 w-full bg-border/50 rounded-md"></div>
                 </div>
                 <div className="h-24 bg-background/50 rounded-lg border border-border/50 p-4 space-y-2">
                    <div className="h-4 w-1/2 bg-border/50 rounded-md"></div>
                    <div className="h-8 w-2/3 bg-border/50 rounded-md"></div>
                    <div className="h-3 w-full bg-border/50 rounded-md"></div>
                 </div>
            </div>
        </div>
    );
};

export default DeepOnChainMonitorSkeleton;
