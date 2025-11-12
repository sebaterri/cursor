export interface Player {
  id: string;
  name: string;
  club: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photo: string;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  appearances: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
}

export interface PlayerDetail extends Player {
  stats: PlayerStats;
  fantasyScore: number;
}
