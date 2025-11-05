// FIX: Corrected import path for types.
import { FuturesDataTick } from '../types';

const WEBSOCKET_URL = 'wss://fstream.binance.com/ws';

export class BinanceFuturesStream {
    private symbol: string;
    private ws: WebSocket | null = null;
    private callback: (data: FuturesDataTick) => void;
    private latestTick: Partial<FuturesDataTick> = { liquidations: [] };

    constructor(symbol: string, callback: (data: FuturesDataTick) => void) {
        this.symbol = symbol.toLowerCase();
        this.callback = callback;
    }

    public connect = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                console.warn('WebSocket is already connected.');
                resolve();
                return;
            }

            const streams = [
                `${this.symbol}@depth5@100ms`, // Order book depth, 5 levels, every 100ms
                `${this.symbol}@forceOrder`, // Liquidation orders
                `${this.symbol}@aggTrade`, // To get funding rate and OI updates (via REST fallback)
            ];

            this.ws = new WebSocket(`${WEBSOCKET_URL}/${streams.join('/')}`);

            this.ws.onopen = () => {
                console.log(`[WebSocket] Connected to Binance Futures for ${this.symbol}`);
                this.fetchInitialData();
                resolve();
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleStreamData(data.stream, data.data);
            };

            this.ws.onerror = (error) => {
                console.error('[WebSocket] Error:', error);
                reject(error);
            };

            this.ws.onclose = () => {
                console.log('[WebSocket] Connection closed.');
                this.ws = null;
            };
        });
    }

    private handleStreamData = (stream: string, data: any) => {
        if (stream.includes('@depth')) {
            this.latestTick.orderBook = { bids: data.b, asks: data.a };
        } else if (stream.includes('@forceOrder')) {
            const liquidation = {
                // FIX: Added type assertion to ensure the 'side' property matches the expected 'BUY' | 'SELL' type.
                side: (data.o.S === 'BUY' ? 'SELL' : 'BUY') as 'BUY' | 'SELL', // Liquidation is opposite of original order side
                price: parseFloat(data.o.p),
                quantity: parseFloat(data.o.q),
            };
            this.latestTick.liquidations?.push(liquidation);
        }

        // When we have an order book update, we assume a full "tick" is ready
        if (stream.includes('@depth')) {
            // In a real scenario, we'd need to poll REST for funding rate/OI or get it from another stream
            // For now, we'll just mock it if it's missing.
            if (!this.latestTick.fundingRate) this.latestTick.fundingRate = 0.0001;
            if (!this.latestTick.openInterest) this.latestTick.openInterest = 1_000_000_000;
            
            this.latestTick.timestamp = Date.now();
            this.callback(this.latestTick as FuturesDataTick);
            
            // Reset liquidations for the next tick
            this.latestTick.liquidations = [];
        }
    }
    
    private fetchInitialData = async () => {
        try {
            const response = await fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${this.symbol.toUpperCase()}`);
            const data = await response.json();
            this.latestTick.fundingRate = parseFloat(data.lastFundingRate);
            this.latestTick.openInterest = parseFloat(data.openInterest);
        } catch (e) {
            console.error('Failed to fetch initial funding/OI data', e);
        }
    }


    public disconnect = () => {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
