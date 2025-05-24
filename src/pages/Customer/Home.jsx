import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Hapus session/login state jika kamu menyimpannya
    localStorage.removeItem('nim')
    // Redirect ke halaman login
    navigate('/login')
  }
  return (
    <div className="p-4 text-center">
      <div>
        <nav>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={handleLogout}> Logout</button>
        </nav>
      </div>
      <h1 className="text-2xl font-bold">Selamat Datang di Home</h1>
      {/* <p className="mt-2">Kamu berhasil login atau register 🎉</p> */}
    </div>
  )
}
