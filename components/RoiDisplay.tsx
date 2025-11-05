import React from 'react';
// FIX: Removed .ts extension from import path
import { formatPercentage } from '../utils/formatters';

interface RoiDisplayProps {
    profit: number;
    roiPercentage: number;
}

const RoiDisplay: React.FC<RoiDisplayProps> = ({ profit, roiPercentage }) => {
    const isProfit = profit >= 0;

    return (
        <div className="flex justify-between items-center">
            <span className="text-text-secondary">Retorno (ROI):</span>
            <span className={`font-bold text-lg ${isProfit ? 'text-success' : 'text-danger'}`}>{formatPercentage(roiPercentage)}</span>
        </div>
    );
}

export default RoiDisplay;
