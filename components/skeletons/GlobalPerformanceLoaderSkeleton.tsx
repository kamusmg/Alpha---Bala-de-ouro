
import React from 'react';

const PanelSkeleton: React.FC<{ heightClass: string }> = ({ heightClass }) => (
     <div className={`bg-surface/50 border border-border/50 rounded-lg p-6 space-y-4 ${heightClass}`}>
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-border rounded-full"></div>
            <div className="h-6 w-3/4 bg-border rounded-md"></div>
        </div>
        <div className="h-4 w-full bg-border/50 rounded-md"></div>
        <div className="h-4 w-5/6 bg-border/50 rounded-md"></div>
        <div className="flex-grow bg-background/50 rounded-lg"></div>
    </div>
);

const GlobalPerformanceLoaderSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 animate-pulse">
            <PanelSkeleton heightClass="h-48" />
            <PanelSkeleton heightClass="h-48" />
            <PanelSkeleton heightClass="h-64" />
            <PanelSkeleton heightClass="h-56" />
        </div>
    );
};

export default GlobalPerformanceLoaderSkeleton;
