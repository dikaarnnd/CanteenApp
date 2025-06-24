import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/logo.png';
import star from '../../assets/star.png'; 

export default function Home() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      const { data, error } = await supabase
        .from('seller')
        .select('id, nama, nama_kantin');

      if (error) {
        console.error('Error fetching sellers:', error);
      } else {
        setSellers(data);
      }
      setLoading(false);
    };

    fetchSellers();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/resto/${id}`);
  };

  const nim = localStorage.getItem('nim') || 'NIM';
  const namaMahasiswa = 'Nama Mahasiswa';

  if (loading) {
    return (
      <div className="bg-[#FFFDED] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9BA38D] mx-auto mb-4"></div>
          <p className="text-[#9BA38D] font-medium">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDED] min-h-screen">
      {/* Enhanced Navbar */}
      <nav className="bg-gradient-to-r from-[#9BA38D] to-[#7F8C69] shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full p-1">
                <img
                  src={logo}
                  alt="Kanteen Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-white font-bold text-xl tracking-wide">Kanteen</div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button
                className="bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-full p-2"
                onClick={() => navigate('/order')}
                title="View Basket"
              >
                <span className="text-white text-lg">🛒</span>
              </button>
              <button
                className="bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-full p-2"
                onClick={() => navigate('/profile')}
                title="Profile"
              >
                <span className="text-white text-lg">👤</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12">
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <div className="bg-gradient-to-r from-[#F9F4DA] to-[#FFFDED] rounded-2xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-black mb-2">
              Selamat Siang, <span className="text-[#9BA38D]">{nim}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4">{namaMahasiswa}</p>
            <div className="flex items-center justify-center space-x-2 text-[#9BA38D]">
              <span className="text-2xl">🍽️</span>
              <h2 className="text-xl font-semibold">Jangan Lupa Makan, Ya!</h2>
              <span className="text-2xl">😊</span>
            </div>
          </div>
        </div>

        {/* Restaurants Section */}
        <div className="max-w-6xl mx-auto px-0">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-black mb-2">Kantin</h3>
            <p className="text-gray-600">Pilih favoritmu!</p>
          </div>

          {/* Restaurant Cards */}
          {sellers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No restaurants available</h3>
              <p className="text-gray-500">Check back later for new restaurants!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-[#F9F4DA] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
                  onClick={() => handleCardClick(seller.id)}
                >
                  {/* Restaurant Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#9BA38D] to-[#7F8C69] overflow-hidden">
                    <img
                      src="https://via.placeholder.com/300x200/9BA38D/FFFFFF?text=Restaurant+Image"
                      alt={seller.nama_kantin}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        • Open
                      </span>
                    </div>
                  </div>

                  {/* Restaurant Details */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#9BA38D] transition-colors">
                        {seller.nama_kantin}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="text-[#9BA38D] mr-1">👨‍🍳</span>
                        Seller: <span className="font-medium ml-1">{seller.nama}</span>
                      </p>
                    </div>

                    {/* Rating and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white rounded-full px-2 py-1 text-sm">
                          <span className="text-yellow-500 mr-1">
                            <img
                              src={star}
                              alt="Bintang"
                              className="w-4 h-4 object-cover rounded-full"
                            />
                          </span>
                          <span className="font-medium text-gray-700">4.5</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <span className="mr-1">🕒</span>
                          <span>15-20 min</span>
                        </div>
                      </div>

                      <button
                        className="bg-[#9BA38D] text-white p-2 rounded-lg hover:bg-[#7F8C69] transition-colors duration-200 group-hover:scale-110 transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(seller.id);
                        }}
                      >
                        <span className="text-sm font-medium">View Menu →</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}