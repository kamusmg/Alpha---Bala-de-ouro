import React from 'react';

const LucraQuantumMonitorSkeleton: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-border rounded-full"></div>
                <div className="h-6 w-3/4 bg-border rounded-md"></div>
            </div>
            <div className="h-4 w-full bg-border rounded-md mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-24 bg-background/50 rounded-lg border border-border/50"></div>
                <div className="h-24 bg-background/50 rounded-lg border border-border/50"></div>
                <div className="h-24 bg-background/50 rounded-lg border border-border/50"></div>
            </div>
        </div>
    );
};

export default LucraQuantumMonitorSkeleton;
