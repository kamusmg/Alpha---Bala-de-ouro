// backend/src/services/marketService.ts
import fetch from 'node-fetch'; // Use node-fetch for backend

// Define a simple type for the response, since we don't have the full frontend types here.
type LivePrices = Record<string, number>;

const API_BASE_URLS = [
    'https://api.binance.com/api/v3',
    'https://api.kucoin.com', // Base URL for KuCoin
    'https://api.exchange.coinbase.com' // Updated Coinbase URL
];

const getTickerSymbol = (asset: string, exchange: string): string => {
    const suffix = 'USDT';
    switch (exchange) {
        case 'coinbase':
            return `${asset}-USD`;
        case 'kucoin':
            return `${asset}-${suffix}`; // Correct format for KuCoin
        default: // binance
            return `${asset}${suffix}`;
    }
};

const parsePrice = (data: any, exchange: string): number | null => {
    try {
        switch (exchange) {
            case 'binance':
                return parseFloat(data.price);
            case 'kucoin':
                return parseFloat(data.data.price); // Correct for /api/v1/market/orderbook/level1
            case 'coinbase':
                 return parseFloat(data.price);
            default:
                return null;
        }
    } catch {
        return null;
    }
};

export const fetchPrices = async (assets: string[]): Promise<LivePrices> => {
    const prices: LivePrices = {};
    const promises = assets.map(async (asset) => {
        for (let i = 0; i < API_BASE_URLS.length; i++) {
            const baseUrl = API_BASE_URLS[i];
            const exchange = i === 0 ? 'binance' : (i === 1 ? 'kucoin' : 'coinbase');
            const symbol = getTickerSymbol(asset, exchange);
            
            let url: string;
            switch(exchange) {
                case 'binance':
                    url = `${baseUrl}/ticker/price?symbol=${symbol}`;
                    break;
                case 'kucoin':
                    url = `${baseUrl}/api/v1/market/orderbook/level1?symbol=${symbol}`;
                    break;
                case 'coinbase':
                    url = `${baseUrl}/products/${symbol}/ticker`;
                    break;
                default:
                    continue; // Should not happen
            }
            
            try {
                // @ts-ignore
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch from ${exchange} with status ${response.status}`);
                }
                const data = await response.json();
                const price = parsePrice(data, exchange);

                if (price !== null) {
                    prices[asset] = price;
                    return; // Success, move to next asset
                }
            } catch (error) {
                console.warn(`Error fetching ${asset} from ${exchange}:`, error);
                // Try next exchange
            }
        }
    });

    await Promise.all(promises);
    return prices;
};
