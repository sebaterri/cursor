import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PerformanceChartProps {
  playerName: string;
  data: number[];
  labels: string[];
}

export function PerformanceChart({ playerName, data, labels }: PerformanceChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: `${playerName} Fantasy Score`,
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
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
        text: `${playerName} - Recent Performance`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
