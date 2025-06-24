import React from 'react';
import { useNavigate } from 'react-router-dom';
import star from '../../../assets/star.png';

export default function RestaurantCard({ seller }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/resto/${seller.id}`);
  };

  return (
    <div
      className="bg-[#F9F4DA] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
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
              handleCardClick();
            }}
          >
            <span className="text-sm font-medium">View Menu →</span>
          </button>
        </div>
      </div>
    </div>
  );
}