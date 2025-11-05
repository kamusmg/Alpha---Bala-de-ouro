// backend/src/api/analysisController.ts
// FIX: Removed direct imports of Request, Response, NextFunction to avoid global type conflicts.
import express, { Router } from 'express';
// FIX: Corrected import path for geminiService.
import * as geminiService from '../services/geminiService.js';
import * as marketService from '../services/marketService.js';

const router: Router = express.Router();

// Present Day Analysis
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/present-day', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generatePresentDayAnalysis();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Backtest Analysis
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/backtest', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generateBacktestAnalysis();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Alpha Hunt
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/alpha-hunt', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generateAlphaHunt();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Supervisor Directive (POST request)
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.post('/supervisor-directive', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { analysis, promptText } = req.body;
        if (!analysis || !promptText) {
            return res.status(400).json({ message: 'Analysis and promptText are required' });
        }
        const result = await geminiService.runSupervisorDirective(analysis, promptText);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Robustness Audit
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/robustness-audit', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generateRobustnessAudit();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Trading Desk Data
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/trading-desk', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generateTradingDeskData();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Global Performance
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/global-performance', async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generateGlobalPerformance();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Lucra Quantum Analysis
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/lucra-quantum', async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generateLucraQuantumAnalysis();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Market Prices
router.get('/prices', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const assetsQuery = req.query.assets as string;
        if (!assetsQuery) {
            return res.status(400).json({ message: 'Assets query parameter is required' });
        }
        const assets = assetsQuery.split(',').filter(a => a);
        if (assets.length === 0) {
            return res.json({});
        }
        const prices = await marketService.fetchPrices(assets);
        res.json(prices);
    } catch (error) {
        next(error);
    }
});

// FIX: Added route for asymmetric opportunities.
// FIX: Use express.Request, express.Response, express.NextFunction to ensure correct types.
router.get('/asymmetric-opportunities', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await geminiService.generateAsymmetricOpportunitiesData();
        res.json(result);
    } catch (error) {
        next(error);
    }
});


export default router;