import { PlayerStats, ScoringFormula, DEFAULT_SCORING_FORMULA } from './types';

/**
 * Calculate fantasy score based on player statistics and scoring formula
 */
export function calculateFantasyScore(
  stats: PlayerStats,
  formula: ScoringFormula = DEFAULT_SCORING_FORMULA
): number {
  const score =
    stats.goals * formula.goalsMultiplier +
    stats.assists * formula.assistsMultiplier +
    stats.cleanSheets * formula.cleanSheetsMultiplier -
    stats.yellowCards * formula.yellowCardsPenalty -
    stats.redCards * formula.redCardsPenalty;

  return Math.max(0, score); // Never return negative scores
}

/**
 * Calculate average fantasy score per appearance
 */
export function calculateAverageScore(
  stats: PlayerStats,
  formula: ScoringFormula = DEFAULT_SCORING_FORMULA
): number {
  if (stats.appearances === 0) return 0;
  return calculateFantasyScore(stats, formula) / stats.appearances;
}

/**
 * Validate team composition
 */
export interface TeamComposition {
  goalkeepers: number;
  defenders: number;
  midfielders: number;
  forwards: number;
}

export function validateTeamComposition(
  composition: TeamComposition
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Total 11 players
  const total = composition.goalkeepers + composition.defenders + composition.midfielders + composition.forwards;
  if (total !== 11) {
    errors.push(`Team must have exactly 11 players, got ${total}`);
  }

  // At least 1 goalkeeper
  if (composition.goalkeepers < 1) {
    errors.push('Team must have at least 1 goalkeeper');
  }

  // Maximum 3 goalkeepers
  if (composition.goalkeepers > 3) {
    errors.push('Team cannot have more than 3 goalkeepers');
  }

  // Between 3-6 defenders
  if (composition.defenders < 3 || composition.defenders > 6) {
    errors.push('Team must have between 3 and 6 defenders');
  }

  // Between 2-5 midfielders
  if (composition.midfielders < 2 || composition.midfielders > 5) {
    errors.push('Team must have between 2 and 5 midfielders');
  }

  // Between 1-3 forwards
  if (composition.forwards < 1 || composition.forwards > 3) {
    errors.push('Team must have between 1 and 3 forwards');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sort players by various criteria
 */
export function sortPlayers<T extends { stats: PlayerStats; fantasyScore?: number }>(
  players: T[],
  sortBy: 'fantasyScore' | 'goals' | 'assists' | 'appearances' | 'avgRating'
): T[] {
  return [...players].sort((a, b) => {
    switch (sortBy) {
      case 'fantasyScore':
        return (b.fantasyScore || 0) - (a.fantasyScore || 0);
      case 'goals':
        return b.stats.goals - a.stats.goals;
      case 'assists':
        return b.stats.assists - a.stats.assists;
      case 'appearances':
        return b.stats.appearances - a.stats.appearances;
      case 'avgRating':
        return (b.stats.avgRating || 0) - (a.stats.avgRating || 0);
      default:
        return 0;
    }
  });
}
