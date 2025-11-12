import React, { useState } from 'react';
import { Player } from '../types';
import { useTeam } from '../context/TeamContext';
import PlayerModal from './PlayerModal';
import './PlayerCard.css';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const { addPlayer, removePlayer, hasPlayerInTeam } = useTeam();
  const [showModal, setShowModal] = useState(false);
  const isInTeam = hasPlayerInTeam(player.id);

  const handleToggleTeam = () => {
    if (isInTeam) {
      removePlayer(player.id);
    } else {
      addPlayer(player);
    }
  };

  return (
    <>
      <div className="player-card card animate-fade-in">
        {/* Header with photo and position */}
        <div className="player-card-header">
          <img
            src={player.photo}
            alt={player.name}
            className="player-photo"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/200?text=Player';
            }}
          />
          <div className={`position-badge position-${player.position.toLowerCase()}`}>
            {player.position}
          </div>
          {isInTeam && <div className="in-team-badge">✓ In Team</div>}
        </div>

        {/* Body content */}
        <div className="player-card-body">
          <h3 className="player-name">{player.name}</h3>
          <p className="player-club">{player.club}</p>

          {/* Fantasy score highlight */}
          <div className="fantasy-score-box">
            <div className="score-label">Fantasy Score</div>
            <div className="score-value">{(player.fantasyScore || 0).toFixed(1)}</div>
          </div>

          {/* Key stats */}
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">⚽</span>
              <div className="stat-content">
                <span className="stat-value">{player.stats.goals}</span>
                <span className="stat-label">Goals</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <div className="stat-content">
                <span className="stat-value">{player.stats.assists}</span>
                <span className="stat-label">Assists</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🛡️</span>
              <div className="stat-content">
                <span className="stat-value">{player.stats.cleanSheets}</span>
                <span className="stat-label">Clean Sheets</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📊</span>
              <div className="stat-content">
                <span className="stat-value">{player.stats.appearances}</span>
                <span className="stat-label">Apps</span>
              </div>
            </div>
          </div>

          {/* Cards and rating */}
          <div className="cards-rating">
            <div className="card-item">
              <span className="card-icon yellow">🟨</span>
              <span>{player.stats.yellowCards}</span>
            </div>
            <div className="card-item">
              <span className="card-icon red">🟥</span>
              <span>{player.stats.redCards}</span>
            </div>
            <div className="rating-item">
              <span className="rating-icon">⭐</span>
              <span>{player.stats.avgRating?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="player-card-footer">
          <button
            onClick={handleToggleTeam}
            className={`btn btn-card ${isInTeam ? 'btn-danger' : 'btn-primary'}`}
          >
            {isInTeam ? '✕ Remove' : '✓ Add'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-secondary btn-card"
          >
            Details
          </button>
        </div>
      </div>

      {/* Player detail modal */}
      {showModal && (
        <PlayerModal player={player} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default PlayerCard;
