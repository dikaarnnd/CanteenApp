import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import TopBar from '@/components/TopBar'
import Pendapatan from '@/components/Pendapatan'
import HighRating from '@/components/HighRating'

export default function HomeSlr() {
  return (
    <div className='flex flex-col bg-[#FFFDED]'>
      {/* Top Bar */}
      <TopBar />

      {/* Main Dashboard */}
      <div className='flex-grow grid grid-cols-2 gap-2 p-4 h-screen'>
        <div className='grid grid-rows-2 gap-2'>
          <div className='grid grid-cols-5 gap-2'>
            <div className='col-span-2 grid grid-rows-3 gap-2'>
              {/* Total Pendapatan */}
              <section className='min-h-23 flex flex-col bg-[#3A4D39] justify-center items-center rounded-xl shadow-md'>
                <h2 className='text-center font-bold text-lg'>Pendapatan Anda hari ini:</h2>
                <Pendapatan />
              </section>

              {/* Pie Chart */}
              <div className='min-h-47 border-2 border-black row-span-2 rounded-xl shadow-md'></div>
            </div>

            {/* Rating Tertinggi */}
            <section className='min-h-74 max-h-74 border-2 border-black col-span-3 rounded-xl shadow-md flex-grow overflow-y-auto'>
              <h2 className="text-xl text-center font-bold my-3 text-black">Rating Tertinggi</h2>
              <div>
                <HighRating />
              </div>
            </section>
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
