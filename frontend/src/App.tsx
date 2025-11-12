import React, { useState, useEffect } from 'react';
import { FantasyProvider, useFantasy } from './context/FantasyContext';
import { Player } from './types';
import { apiClient } from './api/client';
import { getTeamComposition } from './utils/calculations';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { state, addPlayer, removePlayer, setLoading, setError, updateTotalScore, setTeamPlayers } = useFantasy();
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        const players = await apiClient.getPlayers();
        setAllPlayers(players);
      } catch (error) {
        setError('Failed to load players');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [setLoading, setError]);

  // Calculate and update total score whenever team changes
  useEffect(() => {
    const calculateScore = async () => {
      if (state.teamPlayers.length === 0) {
        updateTotalScore(0);
        return;
      }

      try {
        const result = await apiClient.calculateTeamScore(state.teamPlayers.map((p) => p.id));
        updateTotalScore(result.totalScore);
      } catch (error) {
        console.error('Failed to calculate team score:', error);
      }
    };

    calculateScore();
  }, [state.teamPlayers, updateTotalScore]);

  return (
    <Dashboard
      allPlayers={allPlayers}
      teamPlayers={state.teamPlayers}
      totalScore={state.totalScore}
      onAddPlayer={addPlayer}
      onRemovePlayer={removePlayer}
      isLoading={state.isLoading}
    />
  );
}

function App() {
  return (
    <FantasyProvider>
      <AppContent />
    </FantasyProvider>
  );
}

export default App;
