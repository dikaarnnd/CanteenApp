import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/Logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasActiveOrders, setHasActiveOrders] = useState(false);
  const [basketCount, setBasketCount] = useState(0);
  const [userName, setUserName] = useState('');
  
  // Fetch user name
  useEffect(() => {
    const fetchUserName = async () => {
      const nim = localStorage.getItem('nim');
      if (!nim) return;

      try {
        const { data, error } = await supabase
          .from('mahasiswa')
          .select('nama')
          .eq('nim', nim)
          .single();

        if (data && !error) {
          setUserName(data.nama.split(' ')[0]); // Get first name only
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  // Check for active orders and basket count
  useEffect(() => {
    const checkUserStatus = async () => {
      const nim = localStorage.getItem('nim');
      if (!nim) return;

      try {
        const { start, end } = getTodayDateRangeInUTC();

        // Check for active orders (today only)
        const { data: activeProgressData } = await supabase
          .from('progress')
          .select(`
            invoice_id, 
            order_status,
            invoice!inner(
              created_at,
              mhs_nim
            )
          `)
          .in('order_status', ['queue', 'process', 'ready', 'npaid'])
          .eq('invoice.mhs_nim', nim)
          .gte('invoice.created_at', start)
          .lt('invoice.created_at', end);

        setHasActiveOrders(activeProgressData && activeProgressData.length > 0);

        // Check basket count
        const { data: basketItems } = await supabase
          .from('keranjang')
          .select('quantity')
          .eq('mhs_nim', nim);

        const totalItems = basketItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setBasketCount(totalItems);
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    checkUserStatus();
    
    // Refresh every 30 seconds to check for order updates
    const interval = setInterval(checkUserStatus, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('nim');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#9BA38D] via-[#8A9284] to-[#7F8C69] shadow-xl fixed top-0 left-0 w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left - Logo */}
          <div 
            className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => navigate('/home')}
          >
            <div className="w-12 h-12 bg-white rounded-full p-1.5 shadow-lg">
              <img
                src={logo}
                alt="Kanteen Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48x48/9BA38D/FFFFFF?text=K';
                }}
              />
            </div>
          </div>

          {/* Center - Title (Absolutely positioned for perfect centering) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div 
              className="text-center cursor-pointer group"
              onClick={() => navigate('/home')}
            >
              <div className="text-white font-bold text-2xl tracking-wider drop-shadow-lg group-hover:scale-105 transition-transform duration-200">
                Kanteen
              </div>
              {userName && (
                <div className="text-white/80 text-xs font-medium">
                  Welcome, {userName}!
                </div>
              )}
            </div>
          </div>

          {/* Right - Action Icons */}
          <div className="ml-auto flex items-center space-x-1">
            {/* Basket Button */}
            <button
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                isActive('/order') 
                  ? 'bg-white/30 scale-110 shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 hover:scale-105'
              }`}
              onClick={() => navigate('/order')}
              title="View Basket"
            >
              <span className="text-white text-lg">🛒</span>
              {basketCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-md">
                  {basketCount > 99 ? '99+' : basketCount}
                </div>
              )}
            </button>

            {/* Order Status Button */}
            <button
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                isActive('/order-status') 
                  ? 'bg-white/30 scale-110 shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 hover:scale-105'
              }`}
              onClick={() => navigate('/order-status')}
              title="Check Order Status"
            >
              <span className="text-white text-lg">📋</span>
              {hasActiveOrders && (
                <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full w-3 h-3 animate-bounce shadow-md">
                </div>
              )}
            </button>

            {/* Profile Button */}
            <button
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                isActive('/profile') 
                  ? 'bg-white/30 scale-110 shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 hover:scale-105'
              }`}
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              <span className="text-white text-lg">👤</span>
            </button>

            {/* Logout Button */}
            <button
              className="p-2.5 rounded-xl bg-red-500/80 hover:bg-red-600 hover:scale-105 transition-all duration-200 ml-2 shadow-lg"
              onClick={handleLogout}
              title="Logout"
            >
              <span className="text-white text-lg">🚪</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Indicator */}
      <div className="md:hidden bg-gradient-to-r from-white/5 to-white/10 px-4 py-2 backdrop-blur-sm">
        <div className="flex justify-center space-x-8 text-xs">
          <div className={`flex flex-col items-center transition-colors duration-200 ${
            isActive('/order') ? 'text-white font-semibold' : 'text-white/70'
          }`}>
            <span>🛒</span>
            <span>Basket</span>
            {basketCount > 0 && <span className="text-red-300">({basketCount})</span>}
          </div>
          <div className={`flex flex-col items-center transition-colors duration-200 ${
            isActive('/order-status') ? 'text-white font-semibold' : 'text-white/70'
          }`}>
            <span>📋</span>
            <span>Orders</span>
            {hasActiveOrders && <span className="text-orange-300">●</span>}
          </div>
          <div className={`flex flex-col items-center transition-colors duration-200 ${
            isActive('/profile') ? 'text-white font-semibold' : 'text-white/70'
          }`}>
            <span>👤</span>
            <span>Profile</span>
          </div>
        </div>
      </div>
    </nav>
  );
}