// FIX: Corrected import path for types
import { InternalIndicators, FuturesDataTick } from '../types';

// Maintain a short history of OI to determine trend
const oiHistory: number[] = [];
const OI_HISTORY_LENGTH = 15; // Number of ticks to consider for trend

export const calculateIndicators = (tick: FuturesDataTick): InternalIndicators => {
    // --- OI Trend Calculation ---
    oiHistory.push(tick.openInterest);
    if (oiHistory.length > OI_HISTORY_LENGTH) {
        oiHistory.shift();
    }

    let oiTrend: 'up' | 'down' | 'flat' = 'flat';
    let oiDeltaPercent = 0;
    if (oiHistory.length > 1) {
        const first = oiHistory[0];
        const last = oiHistory[oiHistory.length - 1];
        const change = last - first;
        oiDeltaPercent = (change / first) * 100;

        // Simple linear regression slope could be used for more accuracy,
        // but for a quick indicator, comparing start and end is sufficient.
        if (oiDeltaPercent > 0.1) { // Threshold to consider it an upward trend
            oiTrend = 'up';
        } else if (oiDeltaPercent < -0.1) { // Threshold for downward trend
            oiTrend = 'down';
        }
    }

    // --- Order Book Imbalance Calculation ---
    const { bids, asks } = tick.orderBook;
    const bidVolume = bids.slice(0, 20).reduce((acc, level) => acc + (parseFloat(level[0]) * parseFloat(level[1])), 0);
    const askVolume = asks.slice(0, 20).reduce((acc, level) => acc + (parseFloat(level[0]) * parseFloat(level[1])), 0);
    const orderBookImbalance = askVolume > 0 ? bidVolume / askVolume : 1;
    
    // --- Liquidation Hotspots ---
    // In a real system, this would involve complex clustering of liquidation data.
    // For this simulation, we just count recent liquidations.
    const liquidationHotspots = tick.liquidations.map(l => 
        `${l.side} @ ${l.price.toFixed(2)} (${l.quantity.toFixed(3)} BTC)`
    );

    return {
        orderBookImbalance,
        oiTrend,
        oiDeltaPercent,
        fundingRate: tick.fundingRate,
        liquidityClusters: { bids: [], asks: [] }, // This would require more complex logic
        liquidationHotspots,
    };
};
