import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasActiveOrders, setHasActiveOrders] = useState(false);
  const [basketCount, setBasketCount] = useState(0);

  // Check for active orders and basket count
  useEffect(() => {
    const checkUserStatus = async () => {
      const nim = localStorage.getItem('nim');
      if (!nim) return;

      try {
        // Check for active orders
        const { data: orders } = await supabase
          .from('progress')
          .select('invoice_id, order_status')
          .eq('invoice_id', supabase.from('invoice').select('id').eq('mhs_nim', nim))
          .in('order_status', ['npaid', 'paid', 'cooking']);

        setHasActiveOrders(orders && orders.length > 0);

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

  return (
    <nav className="bg-gradient-to-r from-[#9BA38D] to-[#7F8C69] shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/home')}
          >
            <div className="w-10 h-10 bg-white rounded-full p-1">
              <img
                src={logo}
                alt="Kanteen Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40x40/9BA38D/FFFFFF?text=K';
                }}
              />
            </div>
            <div className="text-white font-bold text-xl tracking-wide">Kanteen</div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Basket Button */}
            <button
              className={`relative bg-white/20 hover:bg-white/30 transition-all duration-200 rounded-full p-2 ${
                isActive('/order') ? 'bg-white/30 scale-110' : ''
              }`}
              onClick={() => navigate('/order')}
              title="View Basket"
            >
              <span className="text-white text-lg">🛒</span>
              {basketCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {basketCount > 9 ? '9+' : basketCount}
                </div>
              )}
            </button>

            {/* Order Status Button */}
            <button
              className={`relative bg-white/20 hover:bg-white/30 transition-all duration-200 rounded-full p-2 ${
                isActive('/order-status') ? 'bg-white/30 scale-110' : ''
              }`}
              onClick={() => navigate('/order-status')}
              title="Check Order Status"
            >
              <span className="text-white text-lg">📋</span>
              {hasActiveOrders && (
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-3 h-3 animate-bounce">
                </div>
              )}
            </button>

            {/* Profile Button */}
            <button
              className={`bg-white/20 hover:bg-white/30 transition-all duration-200 rounded-full p-2 ${
                isActive('/profile') ? 'bg-white/30 scale-110' : ''
              }`}
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              <span className="text-white text-lg">👤</span>
            </button>

            {/* Logout Button */}
            <button
              className="bg-red-500/80 hover:bg-red-600 transition-all duration-200 rounded-full p-2 ml-2"
              onClick={() => {
                localStorage.removeItem('nim');
                navigate('/login');
              }}
              title="Logout"
            >
              <span className="text-white text-sm">↗️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Indicator */}
      <div className="md:hidden bg-white/10 px-4 py-1">
        <div className="flex justify-center space-x-6 text-xs text-white/80">
          <span className={isActive('/home') ? 'text-white font-semibold' : ''}>Home</span>
          <span className={isActive('/order') ? 'text-white font-semibold' : ''}>Basket</span>
          <span className={isActive('/order-status') ? 'text-white font-semibold' : ''}>Orders</span>
          <span className={isActive('/profile') ? 'text-white font-semibold' : ''}>Profile</span>
        </div>
      </div>
    </nav>
  );
}