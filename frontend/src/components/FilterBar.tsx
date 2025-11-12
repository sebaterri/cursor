import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  positions: ('GK' | 'DEF' | 'MID' | 'FWD')[];
  selectedPosition?: string;
  onPositionChange: (position: string | undefined) => void;
  sortBy?: string;
  onSortChange: (sortBy: string) => void;
}

export function FilterBar({
  positions,
  selectedPosition,
  onPositionChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters & Sort</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Position Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onPositionChange(undefined)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !selectedPosition
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {positions.map((position) => (
              <button
                key={position}
                onClick={() => onPositionChange(position)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPosition === position
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy || 'fantasyScore'}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fantasyScore">Fantasy Score</option>
            <option value="goals">Goals</option>
            <option value="assists">Assists</option>
            <option value="appearances">Appearances</option>
          </select>
        </div>
      </div>
    </div>
  );
}
