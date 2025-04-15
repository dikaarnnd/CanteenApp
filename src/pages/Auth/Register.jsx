import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import bcrypt from 'bcryptjs'

export default function Register() {
  const [nim, setNim] = useState('')
  const [nama, setNama] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!nim || !nama || !password) return alert('Semua field wajib diisi')

    const { data: existingUser, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('nim', nim)
      .eq('nama_mahasiswa', nama)
      .single()

    if (error || !existingUser) {
      return alert('Nama atau NIM tidak sesuai.')
    }

    // 🔐 Hash dan simpan password
    const hashedPassword = await bcrypt.hash(password, 10)

    const { error: updateError } = await supabase
      .from('mahasiswa')
      .update({ password: hashedPassword })
      .eq('nim', nim)

    if (updateError) {
      return alert('Gagal menyimpan password.')
    }

    alert('Password berhasil disimpan! Silakan login.')
    navigate('/login')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="NIM"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  )
}
