import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('nim'); // Clear session
    navigate('/login'); // Redirect to login page
  };

  const handleCardClick = (id) => {
    navigate(`/resto/${id}`); // Navigate to the dynamic route
  };

  const nim = localStorage.getItem('nim') || 'NIM'; // Retrieve NIM from localStorage
  const namaMahasiswa = 'Nama Mahasiswa'; // Replace with actual logic to fetch the name

  return (
    <div className="p-4 text-center bg-[#FFFDED] min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-[#9BA38D] p-4 w-full fixed top-0 left-0">
        <div className="text-white font-bold text-lg">Kanteen</div>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full"></div> {/* Placeholder logo */}
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 bg-white rounded-full"></div> {/* Star placeholder */}
          <div className="w-6 h-6 bg-white rounded-full"></div> {/* Notification placeholder */}
          <div className="w-6 h-6 bg-white rounded-full"></div> {/* Three dots placeholder */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="mt-16 text-black">
        <nav>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
      <h1 className="text-2xl font-bold mt-8 text-black">Selamat Siang, {nim}/{namaMahasiswa}</h1>
      <h3 className="text-2xl font-bold mt-8 text-black">Jangan Lupa Makan, Ya!</h3>
      <hr className="border-dashed border-2 border-gray-400 my-8" />

      {/* Cards Section */}
      <div className="grid grid-cols-2 gap-6 px-6 text-black">
        <div
          className="bg-[#F9F4DA] p-6 rounded shadow-md h-32 w-40 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(1)}
        >
          Card 1
        </div>
        <div
          className="bg-[#F9F4DA] p-6 rounded shadow-md h-32 w-40 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(2)}
        >
          Card 2
        </div>
        <div
          className="bg-[#F9F4DA] p-6 rounded shadow-md h-32 w-40 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(3)}
        >
          Card 3
        </div>
        <div
          className="bg-[#F9F4DA] p-6 rounded shadow-md h-32 w-40 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(4)}
        >
          Card 4
        </div>
      </div>
    </div>
  );
}