// services/marketService.ts
import { LivePrices } from '../types';
import { apiClient } from './api/bootstrap';

export const fetchPrices = async (assets: string[]): Promise<LivePrices> => {
    if (assets.length === 0) {
        return {};
    }
    try {
        // All price fetching is now delegated to the backend via the apiClient
        // This solves the CORS "Failed to fetch" errors.
        return await apiClient.fetchMarketPrices(assets);
    } catch (error) {
        console.error("Error fetching prices from backend:", error);
        return {}; // Return empty object on failure to prevent crashes
    }
};
