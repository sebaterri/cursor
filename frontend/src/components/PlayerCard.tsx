import React, { useState, useEffect } from 'react';
import { PlayerDetail, PlayerStats } from '../types/player';

interface PlayerCardProps {
  player: PlayerDetail;
  onAddToTeam: (player: PlayerDetail) => void; // New prop for adding to team
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onAddToTeam }) => {
  // Note: Stats and fantasyScore are now directly available in player: PlayerDetail
  // No need to fetch them individually here anymore

  return (
    <div className="border p-4 m-2 rounded shadow-lg flex flex-col items-center bg-white">
      <img src={player.photo} alt={player.name} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
      <h3 className="font-bold text-lg text-center">{player.name}</h3>
      <p className="text-center text-gray-600">{player.club} - {player.position}</p>

      <div className="mt-4 text-sm w-full text-left">
        <p><strong>Goals:</strong> {player.stats.goals}</p>
        <p><strong>Assists:</strong> {player.stats.assists}</p>
        <p><strong>Appearances:</strong> {player.stats.appearances}</p>
        <p><strong>Clean Sheets:</strong> {player.stats.cleanSheets}</p>
        <p><strong>Yellow Cards:</strong> {player.stats.yellowCards}</p>
        <p><strong>Red Cards:</strong> {player.stats.redCards}</p>
        <p className="text-lg font-bold mt-2">Fantasy Score: {player.fantasyScore}</p>
      </div>
      <button
        onClick={() => onAddToTeam(player)}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add to Team
      </button>
    </div>
  );
};

export default PlayerCard;
