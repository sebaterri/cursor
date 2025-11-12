// Player Statistics Interface
export interface PlayerStats {
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
  avgRating?: number;
}

// Player Interface
export interface Player {
  id: string;
  name: string;
  club: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photo: string;
  stats: PlayerStats;
  fantasyScore?: number;
  market_value?: number;
}

// Fantasy Team Interface
export interface FantasyTeam {
  id?: string;
  name: string;
  players: Player[];
  totalScore: number;
  createdAt?: Date;
}

// Team Validation Result
export interface TeamValidationResult {
  valid: boolean;
  errors: string[];
}

// Scoring Formula Interface
export interface ScoringFormula {
  goalsMultiplier: number;
  assistsMultiplier: number;
  cleanSheetsMultiplier: number;
  yellowCardsPenalty: number;
  redCardsPenalty: number;
}

// Default scoring formula
export const DEFAULT_SCORING_FORMULA: ScoringFormula = {
  goalsMultiplier: 4,
  assistsMultiplier: 3,
  cleanSheetsMultiplier: 2,
  yellowCardsPenalty: 1,
  redCardsPenalty: 3,
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
