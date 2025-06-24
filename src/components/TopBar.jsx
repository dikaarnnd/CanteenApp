import React from 'react'
import { Link } from 'react-router-dom'

import Tab from '../assets/TabBtn.png'
import Logo from '../assets/Logo.png'

export default function TopBar() {
  return (
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
            <li><Link to="/homeslr">Dashboard</Link></li>
            <li><Link to="/productview">Product</Link></li>
            <li><Link to="/profileslr">Profile</Link></li>
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
  )
}
