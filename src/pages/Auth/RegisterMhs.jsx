import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import bcrypt from 'bcryptjs'

import imgLogin from '../../assets/LoginReg.png'
import logo from '../../assets/Logo.png'

export default function RegisterSlr() {
  const [nim, setNim] = useState('')
  const [nama, setNama] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!nim || !nama || !password) return alert('Semua field wajib diisi')

    const { data: existingUser, error } = await supabase
      .from('mhs')
      .select('*')
      .eq('nim', nim)
      .eq('nama', nama)
      .single()

    if (error || !existingUser) {
      return alert('Nama atau NIM tidak sesuai.')
    }

    // 🔐 Hash dan simpan password
    const hashedPassword = await bcrypt.hash(password, 10)

    const { error: updateError } = await supabase
      .from('mhs')
      .update({ password: hashedPassword })
      .eq('nim', nim)

    if (updateError) {
      return alert('Gagal menyimpan password.')
    }

    alert('Password berhasil disimpan! Silakan login.')
    navigate('/login')
  }

  return (
    <div className="bgAuth text-black">
      <div className='flex containerAuth'>
        <div className="basis-5/6 items-center justify-center p-4">
          <img src={imgLogin} className="opacity-0 max-w-full h-auto" />
        </div>
        <div className='basis 1/6 flex flex-col container2Auth'>
          <div className='flex justify-center m-3'>
            <img src={logo} className=' max-w-25'/>
          </div>
          <label htmlFor="nim" className='text-sm'>NIM<span className='text-red-700 font-bold'>*</span></label>
          <input
            id='nim'
            className="border p-2 w-full mb-2"
            placeholder=""
            value={nim}
            onChange={(e) => setNim(e.target.value)}
          />
          <label htmlFor="name" className='text-sm'>Nama Lengkap<span className='text-red-700 font-bold'>*</span></label>
          <input
            id='name'
            className="border p-2 w-full mb-2"
            placeholder=""
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <label htmlFor="password" className='text-sm'>Kata Sandi Baru<span className='text-red-700 font-bold'>*</span></label>
          <input
            id='password'
            className="border p-2 w-full mb-4"
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn bg-[#3A4D39] text-white font-bold px-4 py-2 rounded cursor-pointer"
            onClick={handleRegister}
          >
            Daftar
          </button>
          <div className='text-center'>
            <p className='text-sm'>Sudah memiliki akun? <a href="/login" className="font-bold text-sm text-[#3A4D39] hover:underline">
              Masuk
            </a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
