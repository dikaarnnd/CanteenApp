import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ReadPage() {
  const [mahasiswa, setMahasiswa] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase.from('mahasiswa').select('nim, nama_mahasiswa, password')
    if (!error) setMahasiswa(data)
  }

  return (
    <div>
      <h2>Read Page</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-center">
              <th className="border px-4 py-2">NIM</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Password</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.map((mhs) => (
              <tr key={mhs.nim}>
                <td className="border px-4 py-2">{mhs.nim}</td>
                <td className="border px-4 py-2">{mhs.nama_mahasiswa}</td>
                <td className="border px-4 py-2">{mhs.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
