import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import Tab from '../../assets/TabBtn.png'
import Logo from '../../assets/Logo.png'

export default function HomeSlr() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Hapus session/login state jika kamu menyimpannya
    localStorage.clear()
    // Redirect ke halaman login
    navigate('/loginslr')
  }
  return (
    <div className='flex flex-col bg-[#FFFDED]'>
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-[#9BA38D] px-2">
        <div className="">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer" className="btn bg-[#9BA38D] border border-none">
              <img src={Tab} className='h-[30px] w-[25px]' />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-40 p-4">
              {/* Sidebar content here */}
              <li><a>Sidebar Item 1</a></li>
              <li><a>Sidebar Item 2</a></li>
            </ul>
          </div>
        </div>
        <div className='my-auto'>
          <Link to="/homeslr"><img src={Logo} className='w-12' /></Link>
        </div>
        <div className='pr-2'>
          <h1 className='font-bold'>KANTEEN for Seller</h1>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className='flex-grow grid grid-cols-2 gap-2 p-4'>
        <div className='grid grid-rows-2 min-h-screen gap-2'>
          <div className='grid grid-cols-5 gap-2'>
            <div className='col-span-2  grid grid-rows-3 gap-2'>
              {/* Total Pendapatan */}
              <div className='border-2 border-black bg-blue-400 rounded-xl'></div>
              {/* Chart */}
              <div className='border-2 border-black row-span-2 bg-blue-400 rounded-xl'></div>
            </div>
            {/* Menu Favorit */}
            <div className='border-2 border-black col-span-3 bg-purple-400 rounded-xl'></div>
          </div>
          {/* Grafik */}
          <div className='border-2 border-black bg-emerald-400 rounded-xl'></div>
        </div>
        {/* Orderan */}
        <div className='border-2 border-black bg-amber-400 rounded-xl'></div>
      </div>
    </div>
  )
}
