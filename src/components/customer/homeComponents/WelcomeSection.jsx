import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

export default function WelcomeSection() {
  const [studentData, setStudentData] = useState({
    nim: localStorage.getItem('nim') || 'NIM',
    nama: 'Loading...'
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      const nim = localStorage.getItem('nim');
      
      if (!nim) {
        setStudentData(prev => ({ ...prev, nama: 'Guest' }));
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
      }
    };

    fetchStudentData();
  }, []);

  // Get greeting based on time
  const getGreeting = () => {
    // Create a date object with Indonesian timezone
    const indonesianTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    const hour = new Date(indonesianTime).getHours();

    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-center mb-16">
      <div className="bg-gradient-to-r from-[#F9F4DA] to-[#FFFDED] rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-black mb-2">
          {getGreeting()}, <span className="text-[#9BA38D]">{studentData.nama}</span>
        </h1>
        <p className="text-lg text-gray-600 mb-4">NIM: {studentData.nim}</p>
        <div className="flex items-center justify-center space-x-2 text-[#9BA38D]">
          <span className="text-2xl">🍽️</span>
          <h2 className="text-xl font-semibold">Jangan Lupa Makan, Ya!</h2>
          <span className="text-2xl">😊</span>
        </div>
      </div>
    </div>
  );
}