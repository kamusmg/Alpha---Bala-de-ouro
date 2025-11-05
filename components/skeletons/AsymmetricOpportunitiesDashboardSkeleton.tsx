import React from 'react';

const CardSkeleton: React.FC = () => (
    <div className="bg-background/50 border border-border/50 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-shrink-0 w-full md:w-48 text-center space-y-2">
            <div className="h-8 w-3/4 bg-border rounded-md mx-auto"></div>
            <div className="h-6 w-1/2 bg-border rounded-full mx-auto"></div>
        </div>
        <div className="flex-1 w-full space-y-3">
            <div className="h-4 w-full bg-border/50 rounded-md"></div>
            <div className="h-4 w-5/6 bg-border/50 rounded-md"></div>
            <div className="h-16 w-full bg-surface/50 rounded-md mt-2"></div>
        </div>
    </div>
);

const AsymmetricOpportunitiesDashboardSkeleton: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-border rounded-full"></div>
                <div className="h-6 w-80 bg-border rounded-md"></div>
            </div>
            <div className="h-4 w-full bg-border/50 rounded-md mb-6"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};

export default AsymmetricOpportunitiesDashboardSkeleton;
