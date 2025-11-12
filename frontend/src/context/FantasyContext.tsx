import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Player, ScoringFormula } from '../types';

export const DEFAULT_FORMULA: ScoringFormula = {
  goalsMultiplier: 4,
  assistsMultiplier: 3,
  cleanSheetsMultiplier: 2,
  yellowCardsPenalty: 1,
  redCardsPenalty: 3,
};

export interface FantasyState {
  teamPlayers: Player[];
  totalScore: number;
  scoringFormula: ScoringFormula;
  filters: {
    position?: 'GK' | 'DEF' | 'MID' | 'FWD';
    sortBy?: 'fantasyScore' | 'goals' | 'assists' | 'appearances';
  };
  isLoading: boolean;
  error?: string;
}

export type FantasyAction =
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'SET_TEAM_PLAYERS'; payload: Player[] }
  | { type: 'UPDATE_TOTAL_SCORE'; payload: number }
  | { type: 'SET_FORMULA'; payload: ScoringFormula }
  | { type: 'SET_FILTER'; payload: { position?: 'GK' | 'DEF' | 'MID' | 'FWD'; sortBy?: 'fantasyScore' | 'goals' | 'assists' | 'appearances' } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload?: string }
  | { type: 'CLEAR_TEAM' };

const initialState: FantasyState = {
  teamPlayers: [],
  totalScore: 0,
  scoringFormula: DEFAULT_FORMULA,
  filters: {},
  isLoading: false,
};

function fantasyReducer(state: FantasyState, action: FantasyAction): FantasyState {
  switch (action.type) {
    case 'ADD_PLAYER':
      if (state.teamPlayers.length >= 11) {
        return { ...state, error: 'Team is full (max 11 players)' };
      }
      if (state.teamPlayers.some((p) => p.id === action.payload.id)) {
        return { ...state, error: 'Player already in team' };
      }
      return {
        ...state,
        teamPlayers: [...state.teamPlayers, action.payload],
        error: undefined,
      };

    case 'REMOVE_PLAYER':
      return {
        ...state,
        teamPlayers: state.teamPlayers.filter((p) => p.id !== action.payload),
        error: undefined,
      };

    case 'SET_TEAM_PLAYERS':
      return {
        ...state,
        teamPlayers: action.payload,
      };

    case 'UPDATE_TOTAL_SCORE':
      return {
        ...state,
        totalScore: action.payload,
      };

    case 'SET_FORMULA':
      return {
        ...state,
        scoringFormula: action.payload,
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_TEAM':
      return {
        ...state,
        teamPlayers: [],
        totalScore: 0,
        error: undefined,
      };

    default:
      return state;
  }
}

interface FantasyContextType {
  state: FantasyState;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setTeamPlayers: (players: Player[]) => void;
  updateTotalScore: (score: number) => void;
  setFormula: (formula: ScoringFormula) => void;
  setFilter: (position?: 'GK' | 'DEF' | 'MID' | 'FWD', sortBy?: 'fantasyScore' | 'goals' | 'assists' | 'appearances') => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearTeam: () => void;
}

export const FantasyContext = createContext<FantasyContextType | undefined>(undefined);

export function FantasyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fantasyReducer, initialState);

  const addPlayer = useCallback((player: Player) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  }, []);

  const setTeamPlayers = useCallback((players: Player[]) => {
    dispatch({ type: 'SET_TEAM_PLAYERS', payload: players });
  }, []);

  const updateTotalScore = useCallback((score: number) => {
    dispatch({ type: 'UPDATE_TOTAL_SCORE', payload: score });
  }, []);

  const setFormula = useCallback((formula: ScoringFormula) => {
    dispatch({ type: 'SET_FORMULA', payload: formula });
  }, []);

  const setFilter = useCallback(
    (position?: 'GK' | 'DEF' | 'MID' | 'FWD', sortBy?: 'fantasyScore' | 'goals' | 'assists' | 'appearances') => {
      dispatch({ type: 'SET_FILTER', payload: { position, sortBy } });
    },
    []
  );

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error?: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearTeam = useCallback(() => {
    dispatch({ type: 'CLEAR_TEAM' });
  }, []);

  const value: FantasyContextType = {
    state,
    addPlayer,
    removePlayer,
    setTeamPlayers,
    updateTotalScore,
    setFormula,
    setFilter,
    setLoading,
    setError,
    clearTeam,
  };

  return <FantasyContext.Provider value={value}>{children}</FantasyContext.Provider>;
}

export function useFantasy(): FantasyContextType {
  const context = React.useContext(FantasyContext);
  if (!context) {
    throw new Error('useFantasy must be used within FantasyProvider');
  }
  return context;
}
