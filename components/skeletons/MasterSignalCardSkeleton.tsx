import React from 'react';

const MasterSignalCardSkeleton: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-surface to-background/50 border border-border/70 rounded-xl p-6 shadow-lg animate-pulse">
            <div className="flex justify-between items-start mb-4">
                 <div className="h-8 w-3/4 max-w-lg bg-border rounded-md"></div>
                 <div className="h-9 w-36 bg-border rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-border rounded-full"></div>
                        <div>
                            <div className="h-10 w-40 bg-border rounded-md"></div>
                            <div className="h-6 w-24 bg-border rounded-md mt-2"></div>
                        </div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-border/50 h-32"></div>
                    <div className="bg-background/30 rounded-lg border border-border/30 h-40"></div>
                </div>

                {/* Middle Column */}
                <div className="lg:col-span-1 bg-background/50 rounded-lg p-4 border border-border/50 space-y-3">
                    <div className="h-4 w-1/3 bg-border rounded-md mb-4"></div>
                     {[...Array(7)].map((_, i) => (
                         <div key={i} className="flex justify-between items-center h-8">
                             <div className="h-4 w-1/4 bg-border rounded-md"></div>
                             <div className="h-4 w-1/2 bg-border rounded-md"></div>
                         </div>
                    ))}
                </div>

                 {/* Right Column */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-background/30 p-4 rounded-lg border border-border/30 h-24"></div>
                    <div className="bg-background/30 p-4 rounded-lg border border-border/30 h-24"></div>
                    <div className="bg-background/30 p-4 rounded-lg border border-border/30 h-24"></div>
                </div>
            </div>
        </div>
    );
};

export default MasterSignalCardSkeleton;
