import React, { useState } from 'react';
import { Player } from '../types';
import { ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { getPositionColor, getPositionLabel } from '../utils/calculations';

interface PlayersTableProps {
  players: Player[];
  selectedPlayerIds?: string[];
  onAddPlayer?: (player: Player) => void;
  onRemovePlayer?: (playerId: string) => void;
  showActions?: boolean;
}

type SortField = 'name' | 'club' | 'fantasyScore' | 'goals' | 'assists' | 'appearances';

export function PlayersTable({
  players,
  selectedPlayerIds = [],
  onAddPlayer,
  onRemovePlayer,
  showActions = true,
}: PlayersTableProps) {
  const [sortField, setSortField] = useState<SortField>('fantasyScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'club':
        aValue = a.club;
        bValue = b.club;
        break;
      case 'fantasyScore':
        aValue = a.fantasyScore || 0;
        bValue = b.fantasyScore || 0;
        break;
      case 'goals':
        aValue = a.stats.goals;
        bValue = b.stats.goals;
        break;
      case 'assists':
        aValue = a.stats.assists;
        bValue = b.stats.assists;
        break;
      case 'appearances':
        aValue = a.stats.appearances;
        bValue = b.stats.appearances;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const TableHeader = ({ label, field }: { label: string; field: SortField }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="w-full">
        <thead>
          <tr>
            <TableHeader label="Player" field="name" />
            <TableHeader label="Club" field="club" />
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">Pos</th>
            <TableHeader label="Fantasy Score" field="fantasyScore" />
            <TableHeader label="Goals" field="goals" />
            <TableHeader label="Assists" field="assists" />
            <TableHeader label="Apps" field="appearances" />
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">Clean</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">Cards</th>
            {showActions && <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 bg-gray-50">Action</th>}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => {
            const isSelected = selectedPlayerIds.includes(player.id);
            return (
              <tr
                key={player.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect fill=%22%23e5e7eb%22 width=%2240%22 height=%2240%22/%3E%3C/svg%3E';
                      }}
                    />
                    <span className="font-medium text-gray-900">{player.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{player.club}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-blue-600 text-lg">{player.fantasyScore || 0}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center font-medium">{player.stats.goals}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center font-medium">{player.stats.assists}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center font-medium">{player.stats.appearances}</td>
                <td className="px-4 py-3 text-sm text-green-600 text-center font-medium">{player.stats.cleanSheets}</td>
                <td className="px-4 py-3 text-sm text-red-600 text-center font-medium">
                  {player.stats.yellowCards + player.stats.redCards}
                </td>
                {showActions && (
                  <td className="px-4 py-3 text-center">
                    {isSelected ? (
                      <button
                        onClick={() => onRemovePlayer?.(player.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddPlayer?.(player)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {sortedPlayers.length === 0 && (
        <div className="p-8 text-center text-gray-500">No players found</div>
      )}
    </div>
  );
}
