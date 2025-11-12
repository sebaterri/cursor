import React, { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useTeam } from '../context/TeamContext';
import { Player } from '../types';
import PlayerCard from '../components/PlayerCard';
import TeamBuilder from '../components/TeamBuilder';
import StatsDashboard from '../components/StatsDashboard';
import SearchBar from '../components/SearchBar';
import './Dashboard.css';

type ViewMode = 'grid' | 'table' | 'team';
type SortBy = 'fantasyScore' | 'goals' | 'assists' | 'appearances' | 'name';

const Dashboard: React.FC = () => {
  const { getPlayers, getTopPlayers, loading } = useApi();
  const { state: teamState } = useTeam();

  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('fantasyScore');
  const [filterPosition, setFilterPosition] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTopOnly, setShowTopOnly] = useState(false);

  // Load players on mount
  useEffect(() => {
    const loadPlayers = async () => {
      const players = showTopOnly ? await getTopPlayers(50) : await getPlayers();
      setAllPlayers(players);
    };
    loadPlayers();
  }, [showTopOnly, getPlayers, getTopPlayers]);

  // Filter and sort players
  useEffect(() => {
    let filtered = [...allPlayers];

    // Filter by position
    if (filterPosition !== 'ALL') {
      filtered = filtered.filter((p) => p.position === filterPosition);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.club.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'fantasyScore':
          return (b.fantasyScore || 0) - (a.fantasyScore || 0);
        case 'goals':
          return b.stats.goals - a.stats.goals;
        case 'assists':
          return b.stats.assists - a.stats.assists;
        case 'appearances':
          return b.stats.appearances - a.stats.appearances;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredPlayers(filtered);
  }, [allPlayers, sortBy, filterPosition, searchTerm]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Fantasy Soccer Dashboard</h1>
        <p className="page-subtitle">Build your dream team and track top performers</p>
      </div>

      <div className="dashboard-container">
        {/* Main content */}
        <div className="dashboard-main">
          {/* Stats Overview */}
          <StatsDashboard players={allPlayers} selectedPlayers={teamState.selectedPlayers} />

          {/* Controls */}
          <div className="controls-section">
            <div className="controls-row">
              <SearchBar onSearch={setSearchTerm} />
              <div className="controls-group">
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value as any)}
                  className="filter-select"
                >
                  <option value="ALL">All Positions</option>
                  <option value="GK">Goalkeeper</option>
                  <option value="DEF">Defender</option>
                  <option value="MID">Midfielder</option>
                  <option value="FWD">Forward</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="filter-select"
                >
                  <option value="fantasyScore">Fantasy Score</option>
                  <option value="goals">Goals</option>
                  <option value="assists">Assists</option>
                  <option value="appearances">Appearances</option>
                  <option value="name">Name A-Z</option>
                </select>

                <button
                  onClick={() => setShowTopOnly(!showTopOnly)}
                  className={`btn ${showTopOnly ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {showTopOnly ? '⭐ Top Players' : '👥 All Players'}
                </button>
              </div>
            </div>

            <div className="view-controls">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                title="Table View"
              >
                ≡
              </button>
              <button
                onClick={() => setViewMode('team')}
                className={`view-btn ${viewMode === 'team' ? 'active' : ''}`}
                title="Team View"
              >
                👥
              </button>
            </div>
          </div>

          {/* Players Display */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading players...</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="empty-state">
              <p>No players found</p>
              <small>Try adjusting your filters or search term</small>
            </div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <div className="players-grid grid-3">
                  {filteredPlayers.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              )}

              {viewMode === 'table' && (
                <div className="players-table-container">
                  <table className="players-table">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Club</th>
                        <th>Position</th>
                        <th>Goals</th>
                        <th>Assists</th>
                        <th>Clean Sheets</th>
                        <th>Apps</th>
                        <th>Fantasy Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.map((player) => (
                        <PlayerRow key={player.id} player={player} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {viewMode === 'team' && (
                <TeamBuilder />
              )}
            </>
          )}
        </div>

        {/* Sidebar - Team Builder */}
        {viewMode !== 'team' && <TeamBuilder />}
      </div>
    </div>
  );
};

// Player row component for table view
const PlayerRow: React.FC<{ player: Player }> = ({ player }) => {
  const { addPlayer, removePlayer, hasPlayerInTeam } = useTeam();
  const isInTeam = hasPlayerInTeam(player.id);

  const handleToggleTeam = () => {
    if (isInTeam) {
      removePlayer(player.id);
    } else {
      addPlayer(player);
    }
  };

  return (
    <tr className="player-row">
      <td className="player-name">
        <img src={player.photo} alt={player.name} className="player-avatar" onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/40?text=Player';
        }} />
        <span>{player.name}</span>
      </td>
      <td>{player.club}</td>
      <td>
        <span className={`badge badge-${player.position.toLowerCase()}`}>
          {player.position}
        </span>
      </td>
      <td className="stat-value">{player.stats.goals}</td>
      <td className="stat-value">{player.stats.assists}</td>
      <td className="stat-value">{player.stats.cleanSheets}</td>
      <td className="stat-value">{player.stats.appearances}</td>
      <td className="fantasy-score">{(player.fantasyScore || 0).toFixed(1)}</td>
      <td>
        <button
          onClick={handleToggleTeam}
          className={`btn btn-sm ${isInTeam ? 'btn-danger' : 'btn-primary'}`}
        >
          {isInTeam ? '✕ Remove' : '✓ Add'}
        </button>
      </td>
    </tr>
  );
};

export default Dashboard;
