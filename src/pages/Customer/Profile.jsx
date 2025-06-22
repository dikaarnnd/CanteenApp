import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Profile() {
  const navigate = useNavigate();
  const nim = localStorage.getItem('nim') || 'NIM';
  const namaMahasiswa = 'Nama Mahasiswa'; // Replace with actual logic to fetch the name

  const handleLogout = () => {
    localStorage.removeItem('nim');
    navigate('/login');
  };

  return (
    <div className="p-4 text-center bg-[#FFFDED] min-h-screen">
      <div className="flex flex-col items-center">
        {/* Back Button */}
        <button
          className="bg-[#9BA38D] text-white px-4 py-2 rounded hover:bg-[#7F8C69] transition-colors mb-4"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          ← Back
        </button>

        {/* Logo */}
        <div className="w-24 h-24 mb-4">
          <img
            src={logo}
            alt="Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Profile Info */}
        <h1 className="text-2xl font-bold text-black">Profile</h1>
        <p className="text-lg text-gray-700 mt-2">Name: {namaMahasiswa}</p>
        <p className="text-lg text-gray-700">NIM: {nim}</p>

        {/* Logout Button */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}