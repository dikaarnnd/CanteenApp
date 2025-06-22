import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(ArcElement, Tooltip, Legend,)

export default function PieChart({ sellerId }) {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true)

      // Filter data hanya untuk hari ini
      const today = new Date().toISOString().slice(0, 10)

      const { data, error } = await supabase
        .from('invoice_with_seller')
        .select('product_id, quantity, product_name, created_at, order_status, seller_id')
        .eq('seller_id', sellerId)
        .eq('order_status', 'paid')

      if (error) {
        console.error('Gagal fetch data:', error)
        setLoading(false)
        return
      }

      const filtered = data.filter(item => item.created_at?.startsWith(today))

      // Hitung total quantity per produk
      const totals = {}
      let grandTotal = 0
      filtered.forEach(item => {
        const name = item.product_name || 'Tidak diketahui'
        totals[name] = (totals[name] || 0) + item.quantity
        grandTotal += item.quantity
      })

      // Konversi jadi array untuk chart dan list
      const structured = Object.entries(totals).map(([name, quantity], index) => {
        const percentage = ((quantity / grandTotal) * 100).toFixed(1)
        return {
          id: index + 1,
          name,
          amount: `${quantity} Terjual`,
          percentage: `${percentage}%`,
          expensesCount: quantity
        }
      })
      setChartData(structured)

      // const labels = Object.keys(totals)
      // const values = Object.values(totals)
      
      // setChartData({
      //   labels,
      //   datasets: [
      //     {
      //       data: values,
      //       backgroundColor: [
      //         '#FF6384', '#36A2EB', '#FFCE56',
      //         '#4BC0C0', '#9966FF', '#F67019', '#00A36C'
      //       ],
      //       borderWidth: 1,
      //     },
      //   ],
      // })
      setLoading(false)
    }

    fetchChartData()
  }, [sellerId])

  // Data untuk pie chart
  const pieValues = chartData.map(c => parseFloat(c.percentage))
  const pieData = {
    datasets: [
      {
        data: pieValues,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#F67019',
          '#00A36C',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#F67019',
          '#00A36C',
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // hide labels
      },
      // datalabels: {
      //   color: '#000',
      //   font: {
      //     weight: 'bold',
      //     size: 10,
      //   },
      //   formatter: (value, context) => {
      //     const label = context.chart.data.labels[context.dataIndex]
      //     return `${label}\n(${value})`
      //   },
      // },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const product = chartData[tooltipItem.dataIndex]
            return `${product.name}: ${product.amount} (${product.percentage})`
          },
        },
      },
    },
  }

  return (
    <div>
      {loading ? (
        <p className='text-center'>Memuat grafik...</p>
      ) : (
        <>
          <div className='w-full flex justify-center items-center h-42'>
            <Pie data={pieData} options={options} />
            {/* <Pie data={chartData} options={options} /> */}
          </div>
        </>
      )}
    </div>
  )
}
