import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function DeletePage() {
  const [id, setId] = useState('')

  const handleDelete = async () => {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) alert('Gagal menghapus')
    else alert('Data berhasil dihapus')
  }

  return (
    <div>
      <h2>Delete Page</h2>
      <input placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={handleDelete}>Hapus</button>
    </div>
  )
}
