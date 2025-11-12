import React from 'react';
import { Player, TeamComposition } from '../types';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';
import { validateTeamComposition } from '../utils/calculations';

interface TeamSummaryProps {
  players: Player[];
  totalScore: number;
  composition: TeamComposition;
}

export function TeamSummary({ players, totalScore, composition }: TeamSummaryProps) {
  const validation = validateTeamComposition(composition);
  const avgScore = players.length > 0 ? totalScore / players.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Players */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm font-medium">Team Size</span>
          <Users className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900">{players.length}</div>
        <p className="text-xs text-gray-500 mt-1">/11 players</p>
      </div>

      {/* Total Score */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm font-medium">Total Score</span>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-3xl font-bold text-gray-900">{totalScore.toFixed(0)}</div>
        <p className="text-xs text-gray-500 mt-1">Avg: {avgScore.toFixed(1)}</p>
      </div>

      {/* Composition Grid */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm font-medium">Composition</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-red-50 p-2 rounded">
            <p className="text-gray-600">GK</p>
            <p className="font-bold text-red-600">{composition.goalkeepers}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-gray-600">DEF</p>
            <p className="font-bold text-blue-600">{composition.defenders}</p>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <p className="text-gray-600">MID</p>
            <p className="font-bold text-green-600">{composition.midfielders}</p>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <p className="text-gray-600">FWD</p>
            <p className="font-bold text-yellow-600">{composition.forwards}</p>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className={`p-4 rounded-lg shadow-md ${validation.valid ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
            Team Status
          </span>
          <AlertCircle className={`w-5 h-5 ${validation.valid ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div className={`text-sm font-semibold ${validation.valid ? 'text-green-700' : 'text-red-700'}`}>
          {validation.valid ? '✓ Valid' : '✗ Invalid'}
        </div>
        {!validation.valid && (
          <div className="text-xs text-red-600 mt-1 space-y-1">
            {validation.errors.map((error, i) => (
              <p key={i}>• {error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
