import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/logo.png'; // Import the logo

export default function Home() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);

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
    };

    fetchSellers();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/resto/${id}`);
  };

  const nim = localStorage.getItem('nim') || 'NIM';
  const namaMahasiswa = 'Nama Mahasiswa';

  return (
    <div className="p-4 text-center bg-[#FFFDED] min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-[#9BA38D] p-4 w-full fixed top-0 left-0">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="w-8 h-8">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-white font-bold text-lg">Kanteen</div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
            onClick={() => navigate('/profile')}
          >
            {/* Profile Icon */}
            <span className="text-sm">👤</span>
          </button>
          <div className="w-6 h-6 bg-white rounded-full"></div> {/* Notification placeholder */}
          <div className="w-6 h-6 bg-white rounded-full"></div> {/* Three dots placeholder */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="mt-16 text-black">
        <h1 className="text-2xl font-bold mt-8 text-black">Selamat Siang, {nim}/{namaMahasiswa}</h1>
        <h3 className="text-2xl font-bold mt-8 text-black">Jangan Lupa Makan, Ya!</h3>
        <hr className="border-dashed border-2 border-gray-400 my-8" />

        {/* Cards Section */}
        <div className="grid grid-cols-2 gap-80 px-40 text-black">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-[#F9F4DA] p-4 rounded shadow-md flex h-48 w-full cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCardClick(seller.id)}
            >
              {/* Left Grid: Image */}
              <div className="w-1/2 h-full">
                <div className="w-full h-full bg-gray-200 rounded overflow-hidden">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Resto"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Grid: Details */}
              <div className="w-1/2 flex flex-col justify-between pl-4">
                <h2 className="text-lg font-bold">{seller.nama_kantin}</h2>
                <p className="text-left">Owned by: {seller.nama}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm">⭐</span>
                    </div>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm">🔔</span>
                    </div>
                  </div>
                  <button className="bg-[#9BA38D] text-white px-2 py-1 rounded hover:bg-[#7F8C69]">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}