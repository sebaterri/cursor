import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Player } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ComparisonChartProps {
  players: Player[];
  maxPlayers?: number;
}

export function ComparisonChart({ players, maxPlayers = 10 }: ComparisonChartProps) {
  const displayPlayers = players.slice(0, maxPlayers);

  const chartData = {
    labels: displayPlayers.map((p) => p.name),
    datasets: [
      {
        label: 'Fantasy Score',
        data: displayPlayers.map((p) => p.fantasyScore || 0),
        backgroundColor: displayPlayers.map((p) => {
          switch (p.position) {
            case 'GK':
              return '#ef4444';
            case 'DEF':
              return '#3b82f6';
            case 'MID':
              return '#22c55e';
            case 'FWD':
              return '#eab308';
            default:
              return '#6b7280';
          }
        }),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Player Fantasy Score Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
