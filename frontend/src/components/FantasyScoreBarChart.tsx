import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { PlayerDetail } from '../types/player';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FantasyScoreBarChartProps {
  players: PlayerDetail[];
}

const FantasyScoreBarChart: React.FC<FantasyScoreBarChartProps> = ({ players }) => {
  const data = {
    labels: players.map(player => player.name),
    datasets: [
      {
        label: 'Fantasy Score',
        data: players.map(player => player.fantasyScore),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
        text: 'Fantasy Team Score Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Fantasy Score',
        },
      },
    },
  };

  return (
    <div className="w-full md:w-full lg:w-2/3 mx-auto p-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default FantasyScoreBarChart;
