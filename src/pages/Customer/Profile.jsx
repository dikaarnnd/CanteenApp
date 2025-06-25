import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/Logo.png';

export default function Profile() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    nim: localStorage.getItem('nim') || 'NIM',
    nama: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      const nim = localStorage.getItem('nim');
      
      if (!nim) {
        setStudentData(prev => ({ ...prev, nama: 'Guest' }));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('mhs') // Replace with your actual table name
          .select('nim, nama')
          .eq('nim', nim)
          .single();

        if (error) {
          console.error('Error fetching student data:', error);
          setStudentData(prev => ({ ...prev, nama: 'Mahasiswa' }));
        } else if (data) {
          setStudentData({
            nim: data.nim,
            nama: data.nama
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setStudentData(prev => ({ ...prev, nama: 'Mahasiswa' }));
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('nim');
      navigate('/login');
    }
  };

  return (
    <div className="bg-[#FFFDED] min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="bg-[#9BA38D] text-white px-4 py-2 rounded-lg hover:bg-[#7F8C69] transition-colors shadow-md"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-black">Profile</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#9BA38D] to-[#7F8C69] p-1 shadow-lg">
                <img
                  src={logo}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full bg-white"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>

          {/* Student Info */}
          <div className="text-center mb-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {studentData.nama}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  NIM: {studentData.nim}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Active Student
                </div>
              </>
            )}
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F9F4DA] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#9BA38D] mb-1">
                📚
              </div>
              <p className="text-sm text-gray-600">Student</p>
            </div>
            <div className="bg-[#F9F4DA] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#9BA38D] mb-1">
                🍽️
              </div>
              <p className="text-sm text-gray-600">Foodie</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Navigation Buttons */}
          <button
            className="w-full bg-[#9BA38D] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#7F8C69] transition-colors shadow-md flex items-center justify-center gap-2"
            onClick={() => navigate('/order-status')}
          >
            <span>📋</span>
            View My Orders
          </button>

          <button
            className="w-full bg-white text-[#9BA38D] py-3 px-4 rounded-xl font-medium border-2 border-[#9BA38D] hover:bg-[#9BA38D] hover:text-white transition-colors shadow-md flex items-center justify-center gap-2"
            onClick={() => navigate('/order')}
          >
            <span>🛒</span>
            View Basket
          </button>

          {/* Logout Button */}
          <button
            className="w-full bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors shadow-md flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Canteen App v1.0</p>
          <p className="text-xs mt-1">Made with ❤️ for students</p>
        </div>
      </div>
    </div>
  );
}