// components/skeletons/CrossAssetIntelligencePanelSkeleton.tsx
import React from 'react';

const CrossAssetIntelligencePanelSkeleton: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 space-y-6 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-border rounded-full"></div>
                <div className="h-6 w-80 bg-border rounded-md"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="h-5 w-3/4 bg-border rounded-md"></div>
                    <div className="space-y-3">
                        <div className="h-6 w-full bg-background/50 rounded-full"></div>
                        <div className="h-6 w-full bg-background/50 rounded-full"></div>
                        <div className="h-6 w-full bg-background/50 rounded-full"></div>
                        <div className="h-6 w-full bg-background/50 rounded-full"></div>
                    </div>
                </div>
                 <div className="space-y-4">
                    <div className="h-5 w-3/4 bg-border rounded-md"></div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-20 bg-background/50 rounded-lg"></div>
                       <div className="h-20 bg-background/50 rounded-lg"></div>
                       <div className="h-20 bg-background/50 rounded-lg"></div>
                       <div className="h-20 bg-background/50 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossAssetIntelligencePanelSkeleton;
