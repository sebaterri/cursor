import { PlayerStats, ScoringFormula, Player, TeamComposition } from '../types';

/**
 * Calculate fantasy score for a player
 */
export function calculateFantasyScore(stats: PlayerStats, formula: ScoringFormula): number {
  const score =
    stats.goals * formula.goalsMultiplier +
    stats.assists * formula.assistsMultiplier +
    stats.cleanSheets * formula.cleanSheetsMultiplier -
    stats.yellowCards * formula.yellowCardsPenalty -
    stats.redCards * formula.redCardsPenalty;

  return Math.max(0, score);
}

/**
 * Calculate average fantasy score per appearance
 */
export function calculateAverageScore(stats: PlayerStats, formula: ScoringFormula): number {
  if (stats.appearances === 0) return 0;
  return calculateFantasyScore(stats, formula) / stats.appearances;
}

/**
 * Get team composition
 */
export function getTeamComposition(players: Player[]): TeamComposition {
  return {
    goalkeepers: players.filter((p) => p.position === 'GK').length,
    defenders: players.filter((p) => p.position === 'DEF').length,
    midfielders: players.filter((p) => p.position === 'MID').length,
    forwards: players.filter((p) => p.position === 'FWD').length,
  };
}

/**
 * Validate team composition
 */
export function validateTeamComposition(composition: TeamComposition): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const total = composition.goalkeepers + composition.defenders + composition.midfielders + composition.forwards;
  if (total !== 11) {
    errors.push(`Team must have exactly 11 players, got ${total}`);
  }

  if (composition.goalkeepers < 1) {
    errors.push('Team must have at least 1 goalkeeper');
  }

  if (composition.goalkeepers > 3) {
    errors.push('Team cannot have more than 3 goalkeepers');
  }

  if (composition.defenders < 3 || composition.defenders > 6) {
    errors.push('Team must have between 3 and 6 defenders');
  }

  if (composition.midfielders < 2 || composition.midfielders > 5) {
    errors.push('Team must have between 2 and 5 midfielders');
  }

  if (composition.forwards < 1 || composition.forwards > 3) {
    errors.push('Team must have between 1 and 3 forwards');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Get position color
 */
export function getPositionColor(position: 'GK' | 'DEF' | 'MID' | 'FWD'): string {
  switch (position) {
    case 'GK':
      return 'bg-red-100 text-red-800';
    case 'DEF':
      return 'bg-blue-100 text-blue-800';
    case 'MID':
      return 'bg-green-100 text-green-800';
    case 'FWD':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get position label
 */
export function getPositionLabel(position: 'GK' | 'DEF' | 'MID' | 'FWD'): string {
  switch (position) {
    case 'GK':
      return 'Goalkeeper';
    case 'DEF':
      return 'Defender';
    case 'MID':
      return 'Midfielder';
    case 'FWD':
      return 'Forward';
    default:
      return 'Unknown';
  }
}
