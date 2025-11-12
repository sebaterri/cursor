import axios, { AxiosInstance } from 'axios';
import { Player, PlayerStats, ScoringFormula, TeamComposition, TeamValidation } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  // Players endpoints
  async getPlayers(position?: string, sortBy?: string): Promise<Player[]> {
    const response = await this.client.get('/players', {
      params: { position, sortBy },
    });
    return response.data.data || [];
  }

  async getPlayerById(id: string): Promise<Player> {
    const response = await this.client.get(`/players/${id}`);
    return response.data.data;
  }

  async getPlayerStats(id: string): Promise<PlayerStats> {
    const response = await this.client.get(`/players/${id}/stats`);
    return response.data.data;
  }

  async getPlayerFantasyScore(id: string): Promise<{ fantasyScore: number; avgScore: number }> {
    const response = await this.client.get(`/players/${id}/fantasyScore`);
    return response.data.data;
  }

  async getTopPlayers(limit: number = 10, position?: string): Promise<Player[]> {
    const response = await this.client.get('/topPlayers', {
      params: { limit, position },
    });
    return response.data.data || [];
  }

  // Team validation
  async validateTeam(composition: TeamComposition): Promise<TeamValidation> {
    const response = await this.client.post('/validate-team', { composition });
    return response.data.data;
  }

  async calculateTeamScore(playerIds: string[]): Promise<{
    totalScore: number;
    avgScore: number;
    playerCount: number;
    composition: TeamComposition;
    isValid: boolean;
    errors: string[];
  }> {
    const response = await this.client.post('/calculate-team-score', { playerIds });
    return response.data.data;
  }

  // Custom scoring
  async calculateCustomScore(
    stats: PlayerStats,
    formula: ScoringFormula
  ): Promise<{ fantasyScore: number; avgScore: number; formula: ScoringFormula }> {
    const response = await this.client.post('/custom-scoring', { stats, formula });
    return response.data.data;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.data.success;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
