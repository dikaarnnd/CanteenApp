import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ReadPage() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase.from('profiles').select('id, username, email, password')
    if (!error) setProfiles(data)
  }

  return (
    <div>
      <h2>Read Page</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-center">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Password</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="border px-4 py-2">{profile.id}</td>
                <td className="border px-4 py-2">{profile.username}</td>
                <td className="border px-4 py-2">{profile.email}</td>
                <td className="border px-4 py-2">{profile.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
