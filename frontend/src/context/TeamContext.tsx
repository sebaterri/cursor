import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Player, FantasyTeam } from '../types';

interface TeamState {
  selectedPlayers: Player[];
  teams: FantasyTeam[];
  currentTeamName: string;
  teamValidation: { valid: boolean; errors: string[] } | null;
}

type TeamAction =
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'SET_SELECTED_PLAYERS'; payload: Player[] }
  | { type: 'CLEAR_TEAM' }
  | { type: 'SAVE_TEAM'; payload: { name: string; totalScore: number } }
  | { type: 'DELETE_TEAM'; payload: string }
  | { type: 'SET_TEAM_NAME'; payload: string }
  | { type: 'SET_TEAM_VALIDATION'; payload: { valid: boolean; errors: string[] } }
  | { type: 'REORDER_PLAYERS'; payload: Player[] };

const initialState: TeamState = {
  selectedPlayers: [],
  teams: [],
  currentTeamName: 'My Fantasy Team',
  teamValidation: null,
};

const TeamContext = createContext<
  | {
      state: TeamState;
      addPlayer: (player: Player) => void;
      removePlayer: (playerId: string) => void;
      clearTeam: () => void;
      saveTeam: (name: string, totalScore: number) => void;
      deleteTeam: (teamId: string) => void;
      setTeamName: (name: string) => void;
      setTeamValidation: (valid: boolean, errors: string[]) => void;
      reorderPlayers: (players: Player[]) => void;
      getTeamSize: () => number;
      hasPlayerInTeam: (playerId: string) => boolean;
      getPositionCount: (position: 'GK' | 'DEF' | 'MID' | 'FWD') => number;
    }
  | undefined
>(undefined);

function teamReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      // Check if player already in team
      if (state.selectedPlayers.find((p) => p.id === action.payload.id)) {
        return state;
      }
      // Max 11 players
      if (state.selectedPlayers.length >= 11) {
        return state;
      }
      return {
        ...state,
        selectedPlayers: [...state.selectedPlayers, action.payload],
      };
    }

    case 'REMOVE_PLAYER': {
      return {
        ...state,
        selectedPlayers: state.selectedPlayers.filter((p) => p.id !== action.payload),
      };
    }

    case 'SET_SELECTED_PLAYERS': {
      return {
        ...state,
        selectedPlayers: action.payload.slice(0, 11),
      };
    }

    case 'CLEAR_TEAM': {
      return {
        ...state,
        selectedPlayers: [],
        teamValidation: null,
      };
    }

    case 'SAVE_TEAM': {
      const newTeam: FantasyTeam = {
        id: `team_${Date.now()}`,
        name: action.payload.name,
        players: state.selectedPlayers,
        totalScore: action.payload.totalScore,
      };
      return {
        ...state,
        teams: [...state.teams, newTeam],
        selectedPlayers: [],
        teamValidation: null,
      };
    }

    case 'DELETE_TEAM': {
      return {
        ...state,
        teams: state.teams.filter((t) => t.id !== action.payload),
      };
    }

    case 'SET_TEAM_NAME': {
      return {
        ...state,
        currentTeamName: action.payload,
      };
    }

    case 'SET_TEAM_VALIDATION': {
      return {
        ...state,
        teamValidation: {
          valid: action.payload.valid,
          errors: action.payload.errors,
        },
      };
    }

    case 'REORDER_PLAYERS': {
      return {
        ...state,
        selectedPlayers: action.payload,
      };
    }

    default:
      return state;
  }
}

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(teamReducer, initialState);

  const addPlayer = useCallback((player: Player) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  }, []);

  const clearTeam = useCallback(() => {
    dispatch({ type: 'CLEAR_TEAM' });
  }, []);

  const saveTeam = useCallback((name: string, totalScore: number) => {
    dispatch({ type: 'SAVE_TEAM', payload: { name, totalScore } });
  }, []);

  const deleteTeam = useCallback((teamId: string) => {
    dispatch({ type: 'DELETE_TEAM', payload: teamId });
  }, []);

  const setTeamName = useCallback((name: string) => {
    dispatch({ type: 'SET_TEAM_NAME', payload: name });
  }, []);

  const setTeamValidation = useCallback((valid: boolean, errors: string[]) => {
    dispatch({ type: 'SET_TEAM_VALIDATION', payload: { valid, errors } });
  }, []);

  const reorderPlayers = useCallback((players: Player[]) => {
    dispatch({ type: 'REORDER_PLAYERS', payload: players });
  }, []);

  const getTeamSize = useCallback(() => state.selectedPlayers.length, [state.selectedPlayers]);

  const hasPlayerInTeam = useCallback(
    (playerId: string) => state.selectedPlayers.some((p) => p.id === playerId),
    [state.selectedPlayers]
  );

  const getPositionCount = useCallback(
    (position: 'GK' | 'DEF' | 'MID' | 'FWD') =>
      state.selectedPlayers.filter((p) => p.position === position).length,
    [state.selectedPlayers]
  );

  const value = {
    state,
    addPlayer,
    removePlayer,
    clearTeam,
    saveTeam,
    deleteTeam,
    setTeamName,
    setTeamValidation,
    reorderPlayers,
    getTeamSize,
    hasPlayerInTeam,
    getPositionCount,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
