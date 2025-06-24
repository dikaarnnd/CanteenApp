import React from 'react'
import { useNavigate } from 'react-router-dom'

import TopBar from '@/components/TopBar'

export default function ProfileSlr() {
  const navigate = useNavigate()
  
    const handleLogout = () => {
      // Hapus session/login state jika kamu menyimpannya
      localStorage.clear()
      // Redirect ke halaman login
      navigate('/loginslr')
    }
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar />

      <main className="flex-grow p-4">
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          
          {/* Sidebar Kiri */}
          <div className="w-full lg:w-1/3 bg-[#f5f3e7] rounded-md p-4 flex flex-col items-center">
            <img
              src="https://allofresh.id/blog/wp-content/uploads/2023/09/cara-membuat-mie-goreng-4-1-scaled.jpg"
              alt="Mie Goreng"
              className="w-full rounded-md mb-4 object-cover max-h-52"
            />
            <div className="w-full space-y-3">
              <div className="text-left">
                <label className="block text-sm font-semibold mb-1">
                  Nama Pemilik Resto<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="Jokowi"
                  className="w-full border rounded px-3 py-2"
                  readOnly
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-semibold mb-1">
                  Nama Resto<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="Resto Owi"
                  className="w-full border rounded px-3 py-2"
                  readOnly
                />
              </div >
              <button className="w-full bg-[#5f6f53] text-white font-semibold py-2 rounded hover:bg-[#4d5a44] transition">
                Simpan
              </button>

            </div>

            {/* Logout di bawah sidebar */}
            <button
              onClick={handleLogout}
              className="mt-auto w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Area Konten Kanan */}
          <div className="w-full lg:w-2/3 bg-[#fefcea] border rounded-md min-h-[400px]"></div>
        </div>
      </main>
    </div>
  )

}
