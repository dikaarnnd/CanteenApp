import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import TopBar from '@/components/TopBar'
import HighRating from '@/components/HighRating'

export default function HomeSlr() {
  return (
    <div className='flex flex-col bg-[#FFFDED]'>
      {/* Top Bar */}
      <TopBar />

      {/* Main Dashboard */}
      <div className='flex-grow grid grid-cols-2 gap-2 p-4'>
        <div className='grid grid-rows-2 min-h-screen gap-2'>
          <div className='grid grid-cols-5 gap-2'>
            <div className='col-span-2  grid grid-rows-3 gap-2'>
              {/* Total Pendapatan */}
              <section className='flex  flex-col bg-[#3A4D39] justify-center items-center rounded-xl shadow-md'>
                <h2 className='text-center font-bold text-lg'>Pendapatan Anda hari ini:</h2>
                <p className='text-center text-2xl'>Rp. 1.200.000</p>
              </section>
              {/* Chart */}
              <div className='border-2 border-black row-span-2 rounded-xl shadow-md'></div>
            </div>
            {/* Ratingg Tertinggi */}
            <div className='border-2 border-black col-span-3 rounded-xl shadow-md'>
              <HighRating />
            </div>
          </div>
          {/* Grafik */}
          <div className='border-2 border-black rounded-xl shadow-md'></div>
        </div>
        {/* Orderan */}
        <div className='border-2 border-black rounded-xl shadow-md'></div>
      </div>
    </div>
  )
}
