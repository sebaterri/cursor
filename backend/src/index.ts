import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import {
  Player,
  PlayerStats,
  ScoringFormula,
  DEFAULT_SCORING_FORMULA,
  ApiResponse,
} from './types';
import {
  calculateFantasyScore,
  calculateAverageScore,
  validateTeamComposition,
  TeamComposition,
  sortPlayers,
} from './scoring';
import {
  getMockPlayers,
  getMockPlayerById,
  getMockPlayersByPosition,
  getTopMockPlayers,
} from './mockData';
import { cacheService } from './cache';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

// =====================
// Endpoints
// =====================

/**
 * GET /health - Health check
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ success: true, status: 'OK' });
});

/**
 * GET /players - Fetch list of all players
 * Query params: position (GK|DEF|MID|FWD), sortBy (fantasyScore|goals|assists)
 */
app.get('/players', (req: Request, res: Response) => {
  try {
    const cacheKey = `players:${JSON.stringify(req.query)}`;
    const cached = cacheService.get<ApiResponse<Player[]>>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let players = getMockPlayers();

    // Filter by position
    if (req.query.position) {
      const position = req.query.position as string;
      if (['GK', 'DEF', 'MID', 'FWD'].includes(position)) {
        players = players.filter((p) => p.position === position);
      }
    }

    // Sort
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy as string;
      if (['fantasyScore', 'goals', 'assists', 'appearances'].includes(sortBy)) {
        players = sortPlayers(
          players,
          sortBy as 'fantasyScore' | 'goals' | 'assists' | 'appearances'
        );
      }
    }

    const response: ApiResponse<Player[]> = {
      success: true,
      data: players,
    };

    cacheService.set(cacheKey, response, 600);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch players',
    });
  }
});

/**
 * GET /players/:id - Fetch single player
 */
app.get('/players/:id', (req: Request, res: Response) => {
  try {
    const cacheKey = `player:${req.params.id}`;
    const cached = cacheService.get<ApiResponse<Player>>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const player = getMockPlayerById(req.params.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Player not found',
      });
    }

    const response: ApiResponse<Player> = {
      success: true,
      data: player,
    };

    cacheService.set(cacheKey, response, 600);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch player',
    });
  }
});

/**
 * GET /players/:id/stats - Fetch detailed player stats
 */
app.get('/players/:id/stats', (req: Request, res: Response) => {
  try {
    const cacheKey = `player:stats:${req.params.id}`;
    const cached = cacheService.get<ApiResponse<PlayerStats>>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const player = getMockPlayerById(req.params.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Player not found',
      });
    }

    const response: ApiResponse<PlayerStats> = {
      success: true,
      data: player.stats,
    };

    cacheService.set(cacheKey, response, 600);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch player stats',
    });
  }
});

/**
 * GET /players/:id/fantasyScore - Get calculated fantasy score
 * Optional: formula in body for custom scoring
 */
app.get('/players/:id/fantasyScore', (req: Request, res: Response) => {
  try {
    const cacheKey = `player:fantasy:${req.params.id}`;
    const cached = cacheService.get<ApiResponse<{ fantasyScore: number; avgScore: number }>>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const player = getMockPlayerById(req.params.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Player not found',
      });
    }

    const formula = (req.query.formula as any) || DEFAULT_SCORING_FORMULA;

    const response: ApiResponse<{ fantasyScore: number; avgScore: number }> = {
      success: true,
      data: {
        fantasyScore: calculateFantasyScore(player.stats, formula),
        avgScore: calculateAverageScore(player.stats, formula),
      },
    };

    cacheService.set(cacheKey, response, 600);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fantasy score',
    });
  }
});

/**
 * GET /topPlayers - Get leaderboard of top players
 * Query params: limit, position (optional)
 */
app.get('/topPlayers', (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const cacheKey = `topPlayers:${limit}:${req.query.position || 'all'}`;
    const cached = cacheService.get<ApiResponse<Player[]>>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let players = getTopMockPlayers(limit);

    if (req.query.position) {
      const position = req.query.position as string;
      if (['GK', 'DEF', 'MID', 'FWD'].includes(position)) {
        players = players.filter((p) => p.position === position);
      }
    }

    const response: ApiResponse<Player[]> = {
      success: true,
      data: players,
    };

    cacheService.set(cacheKey, response, 600);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top players',
    });
  }
});

/**
 * POST /validate-team - Validate team composition
 * Body: { composition: { goalkeepers, defenders, midfielders, forwards } }
 */
app.post('/validate-team', (req: Request, res: Response) => {
  try {
    const { composition } = req.body as { composition: TeamComposition };

    if (!composition) {
      return res.status(400).json({
        success: false,
        error: 'Team composition required',
      });
    }

    const validation = validateTeamComposition(composition);

    res.json({
      success: true,
      data: validation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to validate team',
    });
  }
});

/**
 * POST /calculate-team-score - Calculate total fantasy score for a team
 * Body: { playerIds: string[] }
 */
app.post('/calculate-team-score', (req: Request, res: Response) => {
  try {
    const { playerIds } = req.body as { playerIds: string[] };

    if (!playerIds || !Array.isArray(playerIds)) {
      return res.status(400).json({
        success: false,
        error: 'Player IDs array required',
      });
    }

    const allPlayers = getMockPlayers();
    const teamPlayers = playerIds
      .map((id) => allPlayers.find((p) => p.id === id))
      .filter((p): p is Player => p !== undefined);

    if (teamPlayers.length !== playerIds.length) {
      return res.status(400).json({
        success: false,
        error: 'One or more players not found',
      });
    }

    const totalScore = teamPlayers.reduce((sum, p) => sum + (p.fantasyScore || 0), 0);
    const avgScore = totalScore / teamPlayers.length;

    // Count composition
    const composition: TeamComposition = {
      goalkeepers: teamPlayers.filter((p) => p.position === 'GK').length,
      defenders: teamPlayers.filter((p) => p.position === 'DEF').length,
      midfielders: teamPlayers.filter((p) => p.position === 'MID').length,
      forwards: teamPlayers.filter((p) => p.position === 'FWD').length,
    };

    const validation = validateTeamComposition(composition);

    res.json({
      success: true,
      data: {
        totalScore,
        avgScore,
        playerCount: teamPlayers.length,
        composition,
        isValid: validation.valid,
        errors: validation.errors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate team score',
    });
  }
});

/**
 * POST /custom-scoring - Calculate scores with custom formula
 * Body: { stats: PlayerStats, formula: ScoringFormula }
 */
app.post('/custom-scoring', (req: Request, res: Response) => {
  try {
    const { stats, formula } = req.body as {
      stats: PlayerStats;
      formula: ScoringFormula;
    };

    if (!stats || !formula) {
      return res.status(400).json({
        success: false,
        error: 'Stats and formula required',
      });
    }

    const fantasyScore = calculateFantasyScore(stats, formula);
    const avgScore = calculateAverageScore(stats, formula);

    res.json({
      success: true,
      data: {
        fantasyScore,
        avgScore,
        formula,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate custom scoring',
    });
  }
});

/**
 * POST /clear-cache - Clear the cache (admin endpoint)
 */
app.post('/clear-cache', (req: Request, res: Response) => {
  try {
    cacheService.clear();
    res.json({
      success: true,
      message: 'Cache cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fantasy Soccer API running on http://localhost:${PORT}`);
  console.log(`📚 GET http://localhost:${PORT}/players - List all players`);
  console.log(`🔝 GET http://localhost:${PORT}/topPlayers?limit=10 - Top players`);
  console.log(`❤️ GET http://localhost:${PORT}/health - Health check`);
});

export default app;
