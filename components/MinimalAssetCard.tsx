import React from 'react';
import { MinimalAssetInfo } from '../types';
import { formatCurrency } from '../utils/formatters';
import ChevronDownIcon from './ChevronDownIcon';
import LoaderIcon from './icons/LoaderIcon';

interface MinimalAssetCardProps {
    asset: MinimalAssetInfo;
    price?: number;
    onExpand: () => void;
    isExpanded: boolean;
    isLoadingDetails: boolean;
}

const MinimalAssetCard: React.FC<MinimalAssetCardProps> = ({ asset, price, onExpand, isExpanded, isLoadingDetails }) => {
    return (
        <div 
            onClick={onExpand}
            className="bg-background/40 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-background/60 hover:border-primary/50 transition-all"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div>
                        <h4 className="font-bold text-white">{asset.assetName}</h4>
                        <p className="text-xs text-text-secondary">{asset.ticker}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div>
                        <p className="text-sm text-text-secondary text-right">Preço Atual</p>
                        <p className="font-semibold font-mono text-white text-right">{price != null ? formatCurrency(price) : '...'}</p>
                    </div>
                    <div className="text-text-secondary">
                        {isLoadingDetails ? (
                            <LoaderIcon className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                            <ChevronDownIcon className={`h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MinimalAssetCard;
