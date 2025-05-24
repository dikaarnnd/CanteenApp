import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import bcrypt from 'bcryptjs'
import { Link } from 'react-router-dom'

import imgLogin from '../../assets/LoginReg.png'
import logo from '../../assets/logo.png'

export default function LoginPage() {
  const [nim, setNim] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('nim', nim)
      .single()

    if (error || !data) return alert('NIM tidak ditemukan')

    const match = await bcrypt.compare(password, data.password)

    if (match) {
      // alert('Login berhasil!')
      localStorage.setItem('nim', data.nim) // simpan info login
      navigate('/home')
    } else {
      alert('Password salah!')
    }
  }

  return (
    <div className="bgAuth text-black">
      {/* <nav>
        <Link to="/">Read</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav> */}
      <div className='flex bg-gray-500 containerAuth gap-4'>
        <div className="basis-5/6 items-center justify-center p-4">
          <img src={imgLogin} className="opacity-0 max-w-full h-auto" />
        </div>
        <div className='basis 1/6 flex flex-col container2Auth'>
          <div className='flex justify-center m-3'>
            <img src={logo} className=' max-w-30'/>
          </div>
          <label htmlFor="" className='text-sm'>NIM <span className='text-red-700 font-bold'>*</span></label>
          <input
            className="border p-2 w-full mb-2"
            placeholder=""
            value={nim}
            onChange={(e) => setNim(e.target.value)}
          />
          <label htmlFor="" className='text-sm'>Password <span className='text-red-700 font-bold'>*</span></label>
          <input
            className="border p-2 w-full"
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="/register" className="text-sm text-blue-500 hover:underline ml-auto mb-4">
              Lupa kata sandi?
          </a>
          <button
            className="bg-[#3A4D39] text-white font-bold px-4 py-2 rounded cursor-pointer"
            onClick={handleLogin}
          >
            Masuk
          </button>
          <div className='text-center'>
            <p className='text-sm'>Belum memiliki akun? <a href="/register" className="font-bold text-sm text-blue-500 hover:underline">
              Daftar
            </a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
