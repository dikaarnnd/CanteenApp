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
    <div className="text-center">
      <TopBar />
      <div>
        <nav>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={handleLogout}> Logout</button>
        </nav>
      </div>
      <h1 className="text-2xl font-bold">Selamat Datang di ProfileSlr</h1>
      {/* <p className="mt-2">Kamu berhasil login atau register 🎉</p> */}
    </div>
  )
}
