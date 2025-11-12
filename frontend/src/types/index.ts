// Player Statistics
export interface PlayerStats {
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
  avgRating?: number;
}

// Player
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

// Fantasy Team
export interface FantasyTeam {
  id?: string;
  name: string;
  players: Player[];
  totalScore: number;
}

// Scoring Formula
export interface ScoringFormula {
  goalsMultiplier: number;
  assistsMultiplier: number;
  cleanSheetsMultiplier: number;
  yellowCardsPenalty: number;
  redCardsPenalty: number;
}

// Team Composition
export interface TeamComposition {
  goalkeepers: number;
  defenders: number;
  midfielders: number;
  forwards: number;
}

// Team Validation
export interface TeamValidation {
  valid: boolean;
  errors: string[];
}
