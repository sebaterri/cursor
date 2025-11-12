import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';
import { Player, PlayerStats, ScoringFormula, TeamComposition, TeamValidation } from '../types';

interface ApiContextType {
  loading: boolean;
  error: string | null;
  getPlayers: (position?: string, sortBy?: string) => Promise<Player[]>;
  getPlayerById: (id: string) => Promise<Player | null>;
  getPlayerStats: (id: string) => Promise<PlayerStats | null>;
  getPlayerFantasyScore: (id: string) => Promise<{ fantasyScore: number; avgScore: number } | null>;
  getTopPlayers: (limit: number, position?: string) => Promise<Player[]>;
  validateTeam: (composition: TeamComposition) => Promise<TeamValidation | null>;
  calculateTeamScore: (playerIds: string[]) => Promise<any | null>;
  calculateCustomScore: (stats: PlayerStats, formula: ScoringFormula) => Promise<any | null>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const getPlayers = useCallback(async (position?: string, sortBy?: string) => {
    setLoading(true);
    clearError();
    try {
      const players = await apiClient.getPlayers(position, sortBy);
      return players || [];
    } catch (err: any) {
      setError(err.message || 'Failed to fetch players');
      return [];
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getPlayerById = useCallback(async (id: string) => {
    setLoading(true);
    clearError();
    try {
      const player = await apiClient.getPlayerById(id);
      return player;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch player');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getPlayerStats = useCallback(async (id: string) => {
    setLoading(true);
    clearError();
    try {
      const stats = await apiClient.getPlayerStats(id);
      return stats;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch player stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getPlayerFantasyScore = useCallback(async (id: string) => {
    setLoading(true);
    clearError();
    try {
      const score = await apiClient.getPlayerFantasyScore(id);
      return score;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fantasy score');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getTopPlayers = useCallback(async (limit: number, position?: string) => {
    setLoading(true);
    clearError();
    try {
      const players = await apiClient.getTopPlayers(limit, position);
      return players || [];
    } catch (err: any) {
      setError(err.message || 'Failed to fetch top players');
      return [];
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const validateTeam = useCallback(async (composition: TeamComposition) => {
    setLoading(true);
    clearError();
    try {
      const validation = await apiClient.validateTeam(composition);
      return validation;
    } catch (err: any) {
      setError(err.message || 'Failed to validate team');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const calculateTeamScore = useCallback(async (playerIds: string[]) => {
    setLoading(true);
    clearError();
    try {
      const score = await apiClient.calculateTeamScore(playerIds);
      return score;
    } catch (err: any) {
      setError(err.message || 'Failed to calculate team score');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const calculateCustomScore = useCallback(async (stats: PlayerStats, formula: ScoringFormula) => {
    setLoading(true);
    clearError();
    try {
      const score = await apiClient.calculateCustomScore(stats, formula);
      return score;
    } catch (err: any) {
      setError(err.message || 'Failed to calculate custom score');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const value: ApiContextType = {
    loading,
    error,
    getPlayers,
    getPlayerById,
    getPlayerStats,
    getPlayerFantasyScore,
    getTopPlayers,
    validateTeam,
    calculateTeamScore,
    calculateCustomScore,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
