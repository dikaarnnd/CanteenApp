import React, { useEffect, useState } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { supabase } from '../supabaseClient'; // Sesuaikan path

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function LineChart({ sellerId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySales = async () => {
      setLoading(true);

      const today = new Date();
      const dayOfWeek = today.getDay(); // Minggu = 0
      const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      const monday = new Date(today);
      monday.setDate(today.getDate() - daysSinceMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('invoice_with_seller')
        .select('created_at, quantity, price')
        .eq('seller_id', sellerId)
        .eq('order_status', 'paid')
        .gte('created_at', monday.toISOString())
        .lte('created_at', sunday.toISOString());

      if (error) {
        console.error('Error fetching weekly sales:', error);
        setLoading(false);
        return;
      }

      const weeklyTotals = {
        Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
      };

      data.forEach((item) => {
        const date = new Date(item.created_at);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const key = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(day) ? day : 'Sun';
        weeklyTotals[key] += item.price * item.quantity;
      });

      const finalData = [
        { day: 'Mon', total_expense: weeklyTotals.Mon },
        { day: 'Tue', total_expense: weeklyTotals.Tue },
        { day: 'Wed', total_expense: weeklyTotals.Wed },
        { day: 'Thu', total_expense: weeklyTotals.Thu },
        { day: 'Fri', total_expense: weeklyTotals.Fri },
        { day: 'Sat', total_expense: weeklyTotals.Sat },
        { day: 'Sun', total_expense: weeklyTotals.Sun },
      ];

      setData(finalData);
      setLoading(false);
    };

    fetchWeeklySales();
  }, [sellerId]);

  const chartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [
      {
        label: 'Penjualan Harian (Rp)',
        data: data.map((item) => item.total_expense),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        pointBorderWidth: 3,
        pointRadius: 6,
        tension: 0.4, // garis halus
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => 'Rp ' + value.toLocaleString('id-ID'),
        },
        grid: { drawBorder: false },
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        display: false, // sembunyikan legend
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            'Rp ' + context.raw.toLocaleString('id-ID'),
        },
      },
    },
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-4">
      {loading ? (
        <p className="text-center text-black">Memuat data...</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
}
