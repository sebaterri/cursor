import { Router, Request, Response } from 'express';
import { Player, PlayerStats, PlayerDetail } from '../types/player';

const router = Router();

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

// GET /players
router.get('/', (req: Request, res: Response) => {
  res.json(mockPlayers);
});

// GET /players/:id/stats
router.get('/:id/stats', (req: Request, res: Response) => {
  const { id } = req.params;
  const stats = mockPlayerStats[id];

  if (stats) {
    res.json(stats);
  } else {
    res.status(404).send('Player stats not found');
  }
});


// GET /topPlayers?limit=10&position=DEF|MID|FWD
router.get('/topPlayers', (req: Request, res: Response) => {
  let { limit, position } = req.query;
  let filteredPlayers: PlayerDetail[] = [];

  // Combine mockPlayers with their stats and fantasy scores
  const playersWithScores: PlayerDetail[] = mockPlayers.map(player => {
    const stats = mockPlayerStats[player.id];
    const fantasyScore = stats ? calculateFantasyScore(stats) : 0;
    return { ...player, stats, fantasyScore };
  });

  // Filter by position if provided
  if (position && typeof position === 'string') {
    filteredPlayers = playersWithScores.filter(player => player.position === position.toUpperCase());
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

  res.json(filteredPlayers);
});

// GET /players/:id/fantasyScore
router.get('/:id/fantasyScore', (req: Request, res: Response) => {
  const { id } = req.params;
  const stats = mockPlayerStats[id];

  if (stats) {
    const fantasyScore = calculateFantasyScore(stats);
    res.json({ id, fantasyScore });
  } else {
    res.status(404).send('Player stats not found');
  }
});

export default router;
