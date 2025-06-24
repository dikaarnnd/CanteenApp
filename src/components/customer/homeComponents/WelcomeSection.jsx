import React from 'react';

export default function WelcomeSection() {
  const nim = localStorage.getItem('nim') || 'NIM';
  const namaMahasiswa = 'Nama Mahasiswa';

  return (
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
  );
}