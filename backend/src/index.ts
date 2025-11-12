import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playerRoutes from './routes/players';
import { ApiError } from './types';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/players', playerRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    path: req.path,
  });
});

// Global error handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  if (error && typeof error === 'object' && 'code' in error && 'statusCode' in error) {
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number') {
    const apiError = error as ApiError;
    return res.status(apiError.statusCode).json({
      error: apiError.message,
      code: ('code' in apiError && typeof apiError.code === 'string') ? apiError.code : 'API_ERROR',
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      error: error.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
  
  // Generic error handling for unexpected error types
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return res.status(500).json({
      error: error.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }

  return res.status(500).json({
    error: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
  });

  res.status(500).json({
    error: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
  });
});

app.listen(PORT, () => {
  console.log(`⚽ Soccer Klout API running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation:`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/players?name=NAME - Search players`);
  console.log(`   GET  /api/players/:id/stats - Get player stats`);
  console.log(`   GET  /api/players/:id/klout - Get influence score`);
  console.log(`   GET  /api/players/leaderboard/top - Top players`);
  console.log(`   POST /api/players/compare - Compare players`);
});

export default app;
