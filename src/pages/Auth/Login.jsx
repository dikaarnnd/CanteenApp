import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import bcrypt from 'bcryptjs'

export default function LoginPage() {
  const [nim, setNim] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('nim', nim)
      .single()

    if (error || !data) return alert('NIM tidak ditemukan')

    const match = await bcrypt.compare(password, data.password)

    if (match) {
      alert('Login berhasil!')
      navigate('/home') // 👉 Redirect ke halaman home
    } else {
      alert('Password salah!')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="NIM"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  )
}
