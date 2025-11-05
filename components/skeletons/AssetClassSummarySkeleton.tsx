import React from 'react';
import PieChartIcon from '../icons/PieChartIcon';

const CategorySkeleton: React.FC = () => (
    <div className="w-full p-3 rounded-lg bg-background/50 border-2 border-border/50">
        <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-border rounded-md"></div>
            <div className="h-5 w-8 bg-border rounded-full"></div>
        </div>
        <div className="mt-3 h-5 w-full bg-border rounded-md"></div>
    </div>
);

const AssetClassSummarySkeleton: React.FC = () => {
    return (
        <div className="bg-surface/50 border border-border/50 rounded-lg p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
                 <div className="h-6 w-6 bg-border rounded-full"></div>
                 <div className="h-6 w-48 bg-border rounded-md"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => <CategorySkeleton key={i} />)}
            </div>
        </div>
    );
};

export default AssetClassSummarySkeleton;