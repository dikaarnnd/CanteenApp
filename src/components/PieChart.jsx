import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrasi elemen chart
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  // Data dan konfigurasi chart
  const data = {
    labels: ['Makanan', 'Transportasi', 'Belanja', 'Lainnya'],
    datasets: [
      {
        label: 'Pengeluaran Bulanan',
        data: [300, 150, 100, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
