import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PlayerDetail } from '../types/player';

ChartJS.register(ArcElement, Tooltip, Legend);

interface FantasyTeamPositionChartProps {
  players: PlayerDetail[];
}

const FantasyTeamPositionChart: React.FC<FantasyTeamPositionChartProps> = ({ players }) => {
  const positionCounts = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(positionCounts),
    datasets: [
      {
        label: 'Players',
        data: Object.values(positionCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // FWD
          'rgba(54, 162, 235, 0.6)', // MID
          'rgba(255, 206, 86, 0.6)', // DEF
          'rgba(75, 192, 192, 0.6)', // GK
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
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
        text: 'Fantasy Team Position Distribution',
      },
    },
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 mx-auto p-4">
      <Pie data={data} options={options} />
    </div>
  );
};

export default FantasyTeamPositionChart;
