import React from 'react';
import { Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface PlayersGridProps {
  players: Player[];
  selectedPlayerIds: string[];
  onAddPlayer: (player: Player) => void;
  isLoading?: boolean;
}

export function PlayersGrid({
  players,
  selectedPlayerIds,
  onAddPlayer,
  isLoading = false,
}: PlayersGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">No players found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isSelected={selectedPlayerIds.includes(player.id)}
          onAdd={() => onAddPlayer(player)}
          showActions={true}
        />
      ))}
    </div>
  );
}
