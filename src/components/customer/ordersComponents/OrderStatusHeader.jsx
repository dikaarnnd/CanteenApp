import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderStatusHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        className="bg-[#9BA38D] text-white px-4 py-2 rounded hover:bg-[#7F8C69] transition-colors"
        onClick={() => navigate('/home')}
      >
        ← Back to Home
      </button>
      <h1 className="text-2xl font-bold text-black">📋 Current Orders</h1>
      <div className="w-20"></div>
    </div>
  );
}