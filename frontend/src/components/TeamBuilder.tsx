import React, { useState, useEffect } from 'react';
import { useTeam } from '../context/TeamContext';
import { useApi } from '../context/ApiContext';
import './TeamBuilder.css';

const TeamBuilder: React.FC = () => {
  const { state, clearTeam, saveTeam, removePlayer, setTeamName, setTeamValidation, getPositionCount } = useTeam();
  const { calculateTeamScore } = useApi();
  const [teamScore, setTeamScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [teamName, setLocalTeamName] = useState('My Fantasy Team');

  const selectedPlayers = state.selectedPlayers;
  const teamSize = selectedPlayers.length;

  // Calculate team score whenever players change
  useEffect(() => {
    const calculateScore = async () => {
      if (selectedPlayers.length === 0) {
        setTeamScore(null);
        setTeamValidation(false, []);
        return;
      }

      setLoading(true);
      const playerIds = selectedPlayers.map((p) => p.id);
      const result = await calculateTeamScore(playerIds);

      if (result) {
        setTeamScore(result);
        setTeamValidation(result.isValid, result.errors);
      }
      setLoading(false);
    };

    calculateScore();
  }, [selectedPlayers, calculateTeamScore, setTeamValidation]);

  const handleSaveTeam = () => {
    if (teamSize < 11) {
      alert('Team must have exactly 11 players');
      return;
    }
    if (teamScore && !teamScore.isValid) {
      alert('Invalid team composition. ' + teamScore.errors.join(', '));
      return;
    }
    saveTeam(teamName, teamScore?.totalScore || 0);
    setLocalTeamName('My Fantasy Team');
  };

  const gk = getPositionCount('GK');
  const def = getPositionCount('DEF');
  const mid = getPositionCount('MID');
  const fwd = getPositionCount('FWD');

  return (
    <div className="team-builder card">
      <div className="team-builder-header">
        <h2 className="team-title">🏆 Team Builder</h2>
        <span className="team-size-badge">{teamSize}/11</span>
      </div>

      {/* Team composition display */}
      <div className="team-composition">
        <div className="composition-row">
          <div className="composition-item">
            <span className="position-badge position-gk">GK</span>
            <span className="composition-count">{gk}</span>
          </div>
          <div className="composition-item">
            <span className="position-badge position-def">DEF</span>
            <span className="composition-count">{def}</span>
          </div>
          <div className="composition-item">
            <span className="position-badge position-mid">MID</span>
            <span className="composition-count">{mid}</span>
          </div>
          <div className="composition-item">
            <span className="position-badge position-fwd">FWD</span>
            <span className="composition-count">{fwd}</span>
          </div>
        </div>
      </div>

      {/* Team validation */}
      {state.teamValidation && !state.teamValidation.valid && (
        <div className="validation-errors">
          <div className="error-icon">⚠️</div>
          {state.teamValidation.errors.map((error, idx) => (
            <p key={idx} className="error-text">{error}</p>
          ))}
        </div>
      )}

      {/* Team score */}
      {teamScore && (
        <div className="team-stats">
          <div className="stat-row">
            <span className="stat-label">Total Score:</span>
            <span className="stat-value">{teamScore.totalScore.toFixed(1)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Avg Score:</span>
            <span className="stat-value">{teamScore.avgScore.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Players list */}
      <div className="team-players">
        <div className="players-list-header">
          <h3>Selected Players</h3>
          <span className="players-count">{teamSize}</span>
        </div>

        {selectedPlayers.length === 0 ? (
          <div className="empty-team">
            <p>👈 Add players from the list</p>
          </div>
        ) : (
          <div className="players-list">
            {selectedPlayers.map((player, index) => (
              <div key={player.id} className="player-item">
                <div className="player-info">
                  <span className="player-index">{index + 1}</span>
                  <div className="player-details">
                    <span className="player-name">{player.name}</span>
                    <span className="player-position">{player.position}</span>
                  </div>
                </div>
                <div className="player-score">
                  <span className="score">{(player.fantasyScore || 0).toFixed(1)}</span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="btn-remove"
                    title="Remove player"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save team section */}
      {teamSize > 0 && (
        <div className="save-team-section">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setLocalTeamName(e.target.value)}
            placeholder="Team name"
            className="team-name-input"
          />
          <button
            onClick={handleSaveTeam}
            disabled={teamSize !== 11 || loading || !teamScore?.isValid}
            className="btn btn-primary btn-full"
          >
            {loading ? 'Calculating...' : '💾 Save Team'}
          </button>
        </div>
      )}

      {/* Clear team button */}
      {teamSize > 0 && (
        <button
          onClick={clearTeam}
          className="btn btn-danger btn-full"
        >
          🗑️ Clear Team
        </button>
      )}
    </div>
  );
};

export default TeamBuilder;
