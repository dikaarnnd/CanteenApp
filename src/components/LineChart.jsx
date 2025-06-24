import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Filler,
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
  Filler,
);

export default function LineChart({ sellerId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySales = async () => {
      setLoading(true);

      const now = DateTime.now().setZone('Asia/Jakarta')
      const monday = now.startOf('week') // Senin
      const sunday = monday.plus({ days: 6 }).endOf('day') // Minggu

      const { data, error } = await supabase
        .from('invoice_with_seller')
        .select('created_at, quantity, price')
        .eq('seller_id', sellerId)
        .eq('order_status', 'paid')
        .gte('created_at', monday.toISO())
        .lte('created_at', sunday.toISO());

      if (error) {
        console.error('Error fetching weekly sales:', error);
        setLoading(false);
        return;
      }

      const weeklyTotals = {
        Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
      };

      data.forEach((item) => {
        const date = DateTime.fromISO(item.created_at, { zone: 'Asia/Jakarta' })
        const dayKey = date.toFormat('ccc') // "Mon", "Tue", dst
        if (weeklyTotals[dayKey] !== undefined) {
          weeklyTotals[dayKey] += item.price * item.quantity
        }
      })

      const finalData = [
        { day: 'Mon', total_pendapatan: weeklyTotals.Mon },
        { day: 'Tue', total_pendapatan: weeklyTotals.Tue },
        { day: 'Wed', total_pendapatan: weeklyTotals.Wed },
        { day: 'Thu', total_pendapatan: weeklyTotals.Thu },
        { day: 'Fri', total_pendapatan: weeklyTotals.Fri },
        { day: 'Sat', total_pendapatan: weeklyTotals.Sat },
        { day: 'Sun', total_pendapatan: weeklyTotals.Sun },
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
        data: data.map((item) => item.total_pendapatan),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        pointBorderWidth: 3,
        pointRadius: 6,
        tension: 0.4, // garis halus
        fill: false,
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
