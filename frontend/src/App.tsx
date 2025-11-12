import React, { useEffect, useState, useReducer, useCallback } from 'react';
import { Player, PlayerStats, PlayerDetail } from './types/player';
import PlayerCard from './components/PlayerCard';
import FantasyTeamPositionChart from './components/FantasyTeamPositionChart';
import FantasyScoreBarChart from './components/FantasyScoreBarChart';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Define types for useReducer
interface FantasyTeamState {
  players: PlayerDetail[];
}

type FantasyTeamAction = 
  | { type: 'ADD_PLAYER'; payload: PlayerDetail }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'REORDER_PLAYERS'; payload: PlayerDetail[] };

const fantasyTeamReducer = (state: FantasyTeamState, action: FantasyTeamAction): FantasyTeamState => {
  switch (action.type) {
    case 'ADD_PLAYER':
      // Prevent adding the same player twice
      if (state.players.find(p => p.id === action.payload.id)) {
        return state;
      }
      return { ...state, players: [...state.players, action.payload] };
    case 'REMOVE_PLAYER':
      return { ...state, players: state.players.filter(player => player.id !== action.payload) };
    case 'REORDER_PLAYERS':
      return { ...state, players: action.payload };
    default:
      return state;
  }
};

type SortKey = 'name' | 'club' | 'position' | 'goals' | 'assists' | 'fantasyScore';

function App() {
  const [allPlayers, setAllPlayers] = useState<PlayerDetail[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [fantasyTeamState, dispatch] = useReducer(fantasyTeamReducer, { players: [] });

  const fetchAllPlayerDetails = useCallback(async () => {
    try {
      const playersResponse = await fetch('http://localhost:3000/players');
      if (!playersResponse.ok) {
        throw new Error(`HTTP error! status: ${playersResponse.status}`);
      }
      const playersData: Player[] = await playersResponse.json();

      const detailedPlayersPromises = playersData.map(async (player) => {
        const statsResponse = await fetch(`http://localhost:3000/players/${player.id}/stats`);
        const scoreResponse = await fetch(`http://localhost:3000/players/${player.id}/fantasyScore`);

        if (!statsResponse.ok || !scoreResponse.ok) {
          throw new Error(`Failed to fetch details for player ${player.name}`);
        }

        const statsData: PlayerStats = await statsResponse.json();
        const scoreData: { id: string; fantasyScore: number } = await scoreResponse.json();

        return { ...player, stats: statsData, fantasyScore: scoreData.fantasyScore };
      });

      const detailedPlayers = await Promise.all(detailedPlayersPromises);
      setAllPlayers(detailedPlayers);
      setFilteredPlayers(detailedPlayers); // Initialize filtered players with all players
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPlayerDetails();
  }, [fetchAllPlayerDetails]);

  useEffect(() => {
    let results = [...allPlayers.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    )];

    // Apply sorting
    results.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortKey === 'name' || sortKey === 'club' || sortKey === 'position') {
        valA = a[sortKey];
        valB = b[sortKey];
      } else if (sortKey === 'goals' || sortKey === 'assists') {
        valA = a.stats[sortKey]; 
        valB = b.stats[sortKey];
      } else if (sortKey === 'fantasyScore') {
        valA = a.fantasyScore;
        valB = b.fantasyScore;
      } else {
        valA = 0; // Default or handle other cases
        valB = 0;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

    setFilteredPlayers(results);
  }, [searchTerm, allPlayers, sortKey, sortDirection]);

  const handleAddToTeam = (player: PlayerDetail) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
  };

  const handleRemoveFromTeam = (playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedPlayers = Array.from(fantasyTeamState.players);
    const [removed] = reorderedPlayers.splice(result.source.index, 1);
    reorderedPlayers.splice(result.destination.index, 0, removed);

    dispatch({ type: 'REORDER_PLAYERS', payload: reorderedPlayers });
  };

  if (loading) {
    return <div className="text-center mt-8">Loading players...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Fantasy Soccer Dashboard</h1>

      <div className="mb-8 p-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Search Players</h2>
        <input
          type="text"
          placeholder="Search by player name..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h3 className="text-xl font-bold mb-3">All Players</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('name')}>Name {sortKey === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('club')}>Club {sortKey === 'club' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('position')}>Position {sortKey === 'position' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('goals')}>Goals {sortKey === 'goals' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('assists')}>Assists {sortKey === 'assists' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('fantasyScore')}>Fantasy Score {sortKey === 'fantasyScore' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b flex items-center">
                    <img src={player.photo} alt={player.name} className="w-8 h-8 rounded-full mr-2 object-cover" />
                    {player.name}
                  </td>
                  <td className="py-2 px-4 border-b">{player.club}</td>
                  <td className="py-2 px-4 border-b">{player.position}</td>
                  <td className="py-2 px-4 border-b">{player.stats.goals}</td>
                  <td className="py-2 px-4 border-b">{player.stats.assists}</td>
                  <td className="py-2 px-4 border-b font-bold">{player.fantasyScore}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleAddToTeam(player)}
                      className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Fantasy Team ({fantasyTeamState.players.length} players)</h2>
        {fantasyTeamState.players.length === 0 ? (
          <p className="text-gray-600">No players in your fantasy team yet. Add some!</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fantasy-team-droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {fantasyTeamState.players.map((player, index) => (
                    <Draggable key={player.id} draggableId={player.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border p-3 rounded shadow-sm flex items-center justify-between bg-gray-50"
                        >
                          <div className="flex items-center">
                            <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full mr-3 object-cover" />
                            <div>
                              <p className="font-bold">{player.name}</p>
                              <p className="text-sm text-gray-600">{player.club} - {player.position}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFromTeam(player.id)}
                            className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <FantasyTeamPositionChart players={fantasyTeamState.players} />
          <FantasyScoreBarChart players={fantasyTeamState.players} />
        </div>
      </div>
    </div>
  );
}

export default App;
