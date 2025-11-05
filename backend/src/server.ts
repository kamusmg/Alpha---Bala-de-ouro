// backend/src/server.ts
// FIX: Removed direct imports of Request, Response, NextFunction to avoid global type conflicts.
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// FIX: Corrected import path for analysisController
import analysisController from './api/analysisController.js';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' })); // Increased limit for images

// --- Routes ---
// FIX: Use express.Request and express.Response types to ensure correct type checking.
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Alpha Engine Backend is running!');
});

app.use('/api/analysis', analysisController);


// --- Error Handling ---
// FIX: Use express.Request, express.Response, and express.NextFunction types for error handler middleware.
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!', error: err.message });
});


// --- Server Activation ---
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
