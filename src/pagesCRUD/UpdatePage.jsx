import { useState } from 'react'
import { supabase } from '../supabaseClient'

import '../css/other.css'

export default function UpdatePage() {
  const [name, setName] = useState('')
  const [updates, setUpdates] = useState({ username: '', email: '', password: '' })

  const handleUpdate = async () => {
    if (!name) {
      alert('isi Nama terlebih dahulu')
      return
    }

    // 1. Ambil data lama dari Supabase
    const { data: existingData, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', name)
      .single()

    if (fetchError || !existingData) {
      alert('Data tidak ditemukan')
      return
    }

    // 2. Update data berdasarkan field yang diisi
    const updateData = {
      username: updates.username.trim() || existingData.username,
      email: updates.email.trim() || existingData.email,
      password: updates.password.trim() || existingData.password,
    }

    const { error } = await supabase.from('profiles').update(updateData).eq('username', name)
    if (error) alert('Gagal update')
    else alert('Berhasil update')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2>Update Page</h2>
      <input 
        className="border p-2 w-full mb-2"
        placeholder="Username lama" 
        value={name} 
        onChange={(e) => setName(e.target.value)} />
      <input 
        className="border p-2 w-full mb-2"
        placeholder="Username baru" 
        value={updates.username} 
        onChange={(e) => setUpdates({...updates, username: e.target.value})} />
      <input 
        className="border p-2 w-full mb-2"
        placeholder="Email baru"
        value={updates.email} 
        onChange={(e) => setUpdates({...updates, email: e.target.value})} />
      <input 
        className="border p-2 w-full mb-2"
        placeholder="Password baru" 
        value={updates.password} 
        onChange={(e) => setUpdates({...updates, password: e.target.value})} />
      <button onClick={handleUpdate} className="btn btn-outline btn-success">Update</button>
    </div>
  )
}
    