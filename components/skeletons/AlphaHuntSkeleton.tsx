// components/skeletons/AlphaHuntSkeleton.tsx
import React from 'react';

const NarrativeDetailSkeleton: React.FC = () => (
    <div className="mb-4">
        <div className="h-8 w-1/2 bg-border rounded-md mb-2"></div>
        <div className="h-4 w-full max-w-3xl bg-border rounded-md mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-background/50 p-3 rounded-lg border border-border/50 h-16 flex items-center gap-3">
                    <div className="w-8 h-8 bg-border/50 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-border/50 rounded-md"></div>
                        <div className="h-5 w-1/2 bg-border/50 rounded-md"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const OpportunitySkeleton: React.FC = () => (
    <div className="bg-surface/50 border border-border/50 rounded-lg p-4 h-48 flex flex-col">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="h-6 w-32 bg-border rounded-md"></div>
                    <div className="h-4 w-16 bg-border rounded-md"></div>
                </div>
                <div className="h-5 w-16 bg-border rounded-full"></div>
            </div>
            <div className="space-y-2 mt-3">
                <div className="h-3 w-full bg-border/50 rounded-md"></div>
                <div className="h-3 w-5/6 bg-border/50 rounded-md"></div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
            <div className="h-8 w-full bg-border rounded-md"></div>
        </div>
    </div>
);


const AlphaHuntSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="bg-background/30 p-4 rounded-lg border border-border/30">
                <NarrativeDetailSkeleton />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <OpportunitySkeleton />
                    <OpportunitySkeleton />
                    <OpportunitySkeleton />
                </div>
            </div>
        </div>
    );
};

export default AlphaHuntSkeleton;