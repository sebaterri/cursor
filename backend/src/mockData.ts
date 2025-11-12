import { Player } from './types';
import { calculateFantasyScore, DEFAULT_SCORING_FORMULA } from './scoring';

const MOCK_PLAYERS: Omit<Player, 'fantasyScore'>[] = [
  {
    id: 'p1',
    name: 'Mohamed Salah',
    club: 'Liverpool',
    position: 'FWD',
    photo: 'https://api.sofascore.com/api/v1/player/123456/image',
    stats: {
      goals: 18,
      assists: 8,
      cleanSheets: 0,
      yellowCards: 3,
      redCards: 0,
      appearances: 32,
      avgRating: 8.2,
    },
    market_value: 95000000,
  },
  {
    id: 'p2',
    name: 'Erling Haaland',
    club: 'Manchester City',
    position: 'FWD',
    photo: 'https://api.sofascore.com/api/v1/player/123457/image',
    stats: {
      goals: 27,
      assists: 5,
      cleanSheets: 0,
      yellowCards: 2,
      redCards: 0,
      appearances: 31,
      avgRating: 8.5,
    },
    market_value: 120000000,
  },
  {
    id: 'p3',
    name: 'Harry Kane',
    club: 'Bayern Munich',
    position: 'FWD',
    photo: 'https://api.sofascore.com/api/v1/player/123458/image',
    stats: {
      goals: 20,
      assists: 6,
      cleanSheets: 0,
      yellowCards: 2,
      redCards: 0,
      appearances: 30,
      avgRating: 8.1,
    },
    market_value: 85000000,
  },
  {
    id: 'p4',
    name: 'Vinicius Jr',
    club: 'Real Madrid',
    position: 'MID',
    photo: 'https://api.sofascore.com/api/v1/player/123459/image',
    stats: {
      goals: 15,
      assists: 10,
      cleanSheets: 0,
      yellowCards: 5,
      redCards: 0,
      appearances: 32,
      avgRating: 8.3,
    },
    market_value: 90000000,
  },
  {
    id: 'p5',
    name: 'Rodri',
    club: 'Manchester City',
    position: 'MID',
    photo: 'https://api.sofascore.com/api/v1/player/123460/image',
    stats: {
      goals: 6,
      assists: 5,
      cleanSheets: 12,
      yellowCards: 1,
      redCards: 0,
      appearances: 28,
      avgRating: 8.4,
    },
    market_value: 85000000,
  },
  {
    id: 'p6',
    name: 'Jude Bellingham',
    club: 'Real Madrid',
    position: 'MID',
    photo: 'https://api.sofascore.com/api/v1/player/123461/image',
    stats: {
      goals: 8,
      assists: 7,
      cleanSheets: 5,
      yellowCards: 4,
      redCards: 0,
      appearances: 30,
      avgRating: 8.0,
    },
    market_value: 100000000,
  },
  {
    id: 'p7',
    name: 'Florian Wirtz',
    club: 'Bayer Leverkusen',
    position: 'MID',
    photo: 'https://api.sofascore.com/api/v1/player/123462/image',
    stats: {
      goals: 11,
      assists: 9,
      cleanSheets: 2,
      yellowCards: 2,
      redCards: 0,
      appearances: 28,
      avgRating: 8.1,
    },
    market_value: 75000000,
  },
  {
    id: 'p8',
    name: 'Antonio Rudiger',
    club: 'Real Madrid',
    position: 'DEF',
    photo: 'https://api.sofascore.com/api/v1/player/123463/image',
    stats: {
      goals: 1,
      assists: 0,
      cleanSheets: 15,
      yellowCards: 4,
      redCards: 0,
      appearances: 32,
      avgRating: 7.9,
    },
    market_value: 15000000,
  },
  {
    id: 'p9',
    name: 'Virgil van Dijk',
    club: 'Liverpool',
    position: 'DEF',
    photo: 'https://api.sofascore.com/api/v1/player/123464/image',
    stats: {
      goals: 0,
      assists: 1,
      cleanSheets: 18,
      yellowCards: 2,
      redCards: 0,
      appearances: 30,
      avgRating: 8.0,
    },
    market_value: 45000000,
  },
  {
    id: 'p10',
    name: 'Kyle Walker',
    club: 'Manchester City',
    position: 'DEF',
    photo: 'https://api.sofascore.com/api/v1/player/123465/image',
    stats: {
      goals: 1,
      assists: 2,
      cleanSheets: 16,
      yellowCards: 3,
      redCards: 0,
      appearances: 31,
      avgRating: 7.8,
    },
    market_value: 12000000,
  },
  {
    id: 'p11',
    name: 'Joao Cancelo',
    club: 'Barcelona',
    position: 'DEF',
    photo: 'https://api.sofascore.com/api/v1/player/123466/image',
    stats: {
      goals: 2,
      assists: 5,
      cleanSheets: 12,
      yellowCards: 2,
      redCards: 0,
      appearances: 28,
      avgRating: 7.9,
    },
    market_value: 20000000,
  },
  {
    id: 'p12',
    name: 'Ederson',
    club: 'Manchester City',
    position: 'GK',
    photo: 'https://api.sofascore.com/api/v1/player/123467/image',
    stats: {
      goals: 0,
      assists: 0,
      cleanSheets: 16,
      yellowCards: 0,
      redCards: 0,
      appearances: 30,
      avgRating: 8.1,
    },
    market_value: 45000000,
  },
  {
    id: 'p13',
    name: 'Alisson',
    club: 'Liverpool',
    position: 'GK',
    photo: 'https://api.sofascore.com/api/v1/player/123468/image',
    stats: {
      goals: 0,
      assists: 0,
      cleanSheets: 18,
      yellowCards: 1,
      redCards: 0,
      appearances: 30,
      avgRating: 8.0,
    },
    market_value: 40000000,
  },
  {
    id: 'p14',
    name: 'Gianluigi Donnarumma',
    club: 'Paris Saint-Germain',
    position: 'GK',
    photo: 'https://api.sofascore.com/api/v1/player/123469/image',
    stats: {
      goals: 0,
      assists: 0,
      cleanSheets: 14,
      yellowCards: 1,
      redCards: 0,
      appearances: 28,
      avgRating: 7.8,
    },
    market_value: 50000000,
  },
];

/**
 * Get all mock players with calculated fantasy scores
 */
export function getMockPlayers(): Player[] {
  return MOCK_PLAYERS.map((player) => ({
    ...player,
    fantasyScore: calculateFantasyScore(player.stats, DEFAULT_SCORING_FORMULA),
  }));
}

/**
 * Get a single mock player by ID
 */
export function getMockPlayerById(id: string): Player | undefined {
  const player = MOCK_PLAYERS.find((p) => p.id === id);
  if (!player) return undefined;

  return {
    ...player,
    fantasyScore: calculateFantasyScore(player.stats, DEFAULT_SCORING_FORMULA),
  };
}

/**
 * Get players by position
 */
export function getMockPlayersByPosition(position: 'GK' | 'DEF' | 'MID' | 'FWD'): Player[] {
  return getMockPlayers().filter((p) => p.position === position);
}

/**
 * Get top players by fantasy score
 */
export function getTopMockPlayers(limit: number = 10): Player[] {
  const allPlayers = getMockPlayers();
  return allPlayers
    .sort((a, b) => (b.fantasyScore || 0) - (a.fantasyScore || 0))
    .slice(0, limit);
}
