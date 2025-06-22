import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import TopBar from '@/components/TopBar'
import Pendapatan from '@/components/Pendapatan'
import HighRating from '@/components/HighRating'
import PieChart from '../../components/PieChart'
import LineChart from '../../components/LineChart'
import Pesanan from '../../components/Pesanan'

export default function HomeSlr() {
  const sellerId = localStorage.getItem('seller_id')
    if (!sellerId) {
      console.warn('seller_id tidak ditemukan')
      setLoading(false)
      return
    }
  return (
    <div className='flex flex-col bg-[#FFFDED]'>
      {/* Top Bar */}
      <TopBar />

      {/* Main Dashboard */}
      <div className='flex-grow grid grid-cols-2 gap-2 p-4 h-screen overflow-hidden'>
        <div className='grid grid-rows-2 gap-2'>
          <div className='grid grid-cols-5 gap-2'>
            <div className='col-span-2 grid grid-rows-3 gap-2'>
              {/* Total Pendapatan */}
              <section className='min-h-23 flex flex-col bg-[#3A4D39] justify-center items-center rounded-xl shadow-md'>
                <h2 className='text-center text-[#FFFDED] font-bold text-lg'>Pendapatan Anda hari ini:</h2>
                <Pendapatan sellerId={sellerId} />
              </section>

              {/* Pie Chart */}
              <section className='flex justify-center items-center min-h-47 border-2 border-black row-span-2 rounded-xl shadow-md'>
                <PieChart sellerId={sellerId} />
              </section>
            </div>

            {/* Rating Tertinggi */}
            <section className='min-h-74 grid grid-rows-5 border-2 border-black col-span-3 rounded-xl shadow-md'>
              <div>
                <h2 className="text-xl text-center font-bold my-3 text-[#3A4D39]">Rating Tertinggi</h2>
              </div>
              <div className='row-span-4 flex-grow overflow-y-auto'>
                <HighRating sellerId={sellerId} />
              </div>
            </section>
          </div>

          {/* Grafik */}
          <div className='min-h-75 border-2 border-black rounded-xl shadow-md'>
            <LineChart sellerId={sellerId} />
          </div>
        </div>

        {/* Orderan */}
        <div className='min-h-full border-2 border-black rounded-xl shadow-md'>
          <h2 className="text-xl text-center font-bold my-3 text-[#3A4D39]">Pesanan</h2>
          <Pesanan sellerId={sellerId} />
        </div>
      </div>
    </div>
  )
}
