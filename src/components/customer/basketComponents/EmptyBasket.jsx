import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmptyBasket() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold text-gray-600 mb-4">Your basket is empty</h2>
      <p className="text-gray-500 mb-8">Add some delicious items from our restaurants!</p>
      <button
        className="bg-[#9BA38D] text-white px-6 py-3 rounded-lg hover:bg-[#7F8C69] transition-colors"
        onClick={() => navigate('/home')}
      >
        Browse Restaurants
      </button>
    </div>
  );
}