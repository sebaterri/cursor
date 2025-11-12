import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TeamComposition } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CompositionChartProps {
  composition: TeamComposition;
}

export function CompositionChart({ composition }: CompositionChartProps) {
  const chartData = {
    labels: ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards'],
    datasets: [
      {
        data: [
          composition.goalkeepers,
          composition.defenders,
          composition.midfielders,
          composition.forwards,
        ],
        backgroundColor: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Team Composition',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
