import { Router, Request, Response } from 'express';
import { Player, PlayerStats, PlayerDetail } from '../types/player';

// Simple in-memory cache
const playerCache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const entry = playerCache[key];
  if (entry && (Date.now() - entry.timestamp < CACHE_DURATION)) {
    return entry.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  playerCache[key] = { data, timestamp: Date.now() };
};

// Mock Data (replace with actual data fetching later)
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Lionel Messi',
    club: 'PSG',
    position: 'FWD',
    photo: 'https://example.com/messi.jpg',
  },
  {
    id: '2',
    name: 'Cristiano Ronaldo',
    club: 'Al Nassr',
    position: 'FWD',
    photo: 'https://example.com/ronaldo.jpg',
  },
  {
    id: '3',
    name: 'Virgil van Dijk',
    club: 'Liverpool',
    position: 'DEF',
    photo: 'https://example.com/vandijk.jpg',
  },
  {
    id: '4',
    name: 'Kevin De Bruyne',
    club: 'Manchester City',
    position: 'MID',
    photo: 'https://example.com/debruyne.jpg',
  },
];

const mockPlayerStats: { [key: string]: PlayerStats } = {
  '1': { goals: 30, assists: 20, appearances: 40, cleanSheets: 0, yellowCards: 2, redCards: 0 },
  '2': { goals: 25, assists: 10, appearances: 35, cleanSheets: 0, yellowCards: 5, redCards: 1 },
  '3': { goals: 3, assists: 5, appearances: 45, cleanSheets: 20, yellowCards: 3, redCards: 0 },
  '4': { goals: 15, assists: 25, appearances: 38, cleanSheets: 0, yellowCards: 4, redCards: 0 },
};

// Helper function to calculate fantasy score
const calculateFantasyScore = (stats: PlayerStats): number => {
  return (
    stats.goals * 4 +
    stats.assists * 3 +
    stats.cleanSheets * 2 -
    stats.yellowCards -
    stats.redCards * 3
  );
};

// Middleware for player validation
const validatePlayerId = (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  if (!mockPlayers.some(p => p.id === id)) {
    return res.status(404).send('Player not found');
  }
  next();
};

// GET /players
router.get('/', (req: Request, res: Response) => {
  const cachedPlayers = getCachedData('allPlayers');
  if (cachedPlayers) {
    return res.json(cachedPlayers);
  }
  setCachedData('allPlayers', mockPlayers);
  res.json(mockPlayers);
});

// GET /players/:id/stats
router.get('/:id/stats', validatePlayerId, (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `playerStats-${id}`;
  const cachedStats = getCachedData(cacheKey);
  if (cachedStats) {
    return res.json(cachedStats);
  }
  const stats = mockPlayerStats[id];
  if (stats) {
    setCachedData(cacheKey, stats);
    res.json(stats);
  } else {
    res.status(404).send('Player stats not found');
  }
});

// GET /players/:id/fantasyScore
router.get('/:id/fantasyScore', validatePlayerId, (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `fantasyScore-${id}`;
  const cachedScore = getCachedData(cacheKey);
  if (cachedScore) {
    return res.json(cachedScore);
  }
  const stats = mockPlayerStats[id];
  if (stats) {
    const fantasyScore = calculateFantasyScore(stats);
    setCachedData(cacheKey, { id, fantasyScore });
    res.json({ id, fantasyScore });
  } else {
    res.status(404).send('Player stats not found');
  }
});

// GET /topPlayers?limit=10&position=DEF|MID|FWD
router.get('/topPlayers', (req: Request, res: Response) => {
  const { limit, position } = req.query;
  const cacheKey = `topPlayers-${limit || 'noLimit'}-${position || 'noPosition'}`;
  const cachedTopPlayers = getCachedData(cacheKey);
  if (cachedTopPlayers) {
    return res.json(cachedTopPlayers);
  }

  let filteredPlayers: PlayerDetail[] = [];

  // Combine mockPlayers with their stats and fantasy scores
  const playersWithScores: PlayerDetail[] = mockPlayers.map(player => {
    const stats = mockPlayerStats[player.id];
    const fantasyScore = stats ? calculateFantasyScore(stats) : 0;
    return { ...player, stats, fantasyScore };
  });

  // Filter by position if provided
  if (position && typeof position === 'string') {
    filteredPlayers = playersWithScores.filter(player => player.position === (position as string).toUpperCase());
  } else {
    filteredPlayers = playersWithScores;
  }

  // Sort by fantasy score in descending order
  filteredPlayers.sort((a, b) => b.fantasyScore - a.fantasyScore);

  // Apply limit if provided
  if (limit) {
    const parsedLimit = parseInt(limit as string, 10);
    if (!isNaN(parsedLimit)) {
      filteredPlayers = filteredPlayers.slice(0, parsedLimit);
    }
  }

  setCachedData(cacheKey, filteredPlayers);
  res.json(filteredPlayers);
});

export default router;
