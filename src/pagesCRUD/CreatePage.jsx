import { useState } from 'react'
import { supabase } from '../supabaseClient'

import '../css/other.css'

export default function CreatePage() {
  const [form, setFrom] = useState({username:'', email:'', password:''})

  const handleCreate = async () => {
    const { error } = await supabase.from('profiles').insert([form])
    if (error) alert('Gagal menambahkan data')
    else alert('Data berhasil ditambahkan!')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Page</h2>
      <input 
        className="border p-2 w-full mb-2"
        value={form.username} 
        onChange={(e) => setFrom({...form, username: e.target.value})} 
        placeholder="Nama" />
      <input 
        className="border p-2 w-full mb-2"
        value={form.email} 
        onChange={(e) => setFrom({...form, email: e.target.value})} 
        placeholder="Email" />
      <input 
        className="border p-2 w-full mb-2"
        value={form.password} 
        onChange={(e) => setFrom({...form, password: e.target.value})} 
        placeholder="Password" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded"
       onClick={handleCreate}>Tambah</button>
    </div>
  )
}
