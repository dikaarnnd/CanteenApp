import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import bcrypt from 'bcryptjs'

import imgLogin from '../../assets/LoginReg.png'
import logo from '../../assets/logo.png'

export default function RegisterSlr() {
  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  const [namaKantin, setNamaKantin] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!id || !nama || !namaKantin || !password) return alert('Semua field wajib diisi')

    const { data: existingUser, error } = await supabase
      .from('seller')
      .select('*')
      .eq('id', id)
      .eq('nama', nama)
      .single()

    if (error || !existingUser) {
      return alert('Nama atau ID tidak sesuai.')
    }

    // 🔐 Hash dan simpan password
    const hashedPassword = await bcrypt.hash(password, 10)

    const { error: updateError } = await supabase
      .from('seller')
      .update({ nama_kantin: namaKantin, password: hashedPassword })
      .eq('id', id)

    if (updateError) {
      return alert('Gagal menyimpan kata sandi.')
    }

    alert('Kata sandi berhasil disimpan! Silakan login.')
    navigate('/loginslr')
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
          <label htmlFor="id" className='text-sm'>ID Kantin<span className='text-red-700 font-bold'>*</span></label>
          <input
            id='id'
            className="border p-2 w-full mb-2"
            placeholder=""
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <label htmlFor="nama" className='text-sm'>Nama Lengkap<span className='text-red-700 font-bold'>*</span></label>
          <input
            id='nama'
            className="border p-2 w-full mb-2"
            placeholder=""
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <label htmlFor="namakantin" className='text-sm'>Nama Kantin<span className='text-red-700 font-bold'>*</span></label>
          <input
            id='namakantin'
            className="border p-2 w-full mb-2"
            placeholder=""
            value={namaKantin}
            onChange={(e) => setNamaKantin(e.target.value)}
          />
          <label htmlFor="password" className='text-sm'>Kata Sandi baru<span className='text-red-700 font-bold'>*</span></label>
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
            <p className='text-sm'>Sudah memiliki akun? <a href="/loginslr" className="font-bold text-sm text-[#3A4D39] hover:underline">
              Masuk
            </a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
