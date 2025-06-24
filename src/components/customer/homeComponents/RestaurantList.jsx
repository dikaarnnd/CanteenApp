import React from 'react';
import RestaurantCard from './RestaurantCard';

export default function RestaurantList({ sellers, loading, error }) {
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

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">{error}</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
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
            <RestaurantCard key={seller.id} seller={seller} />
          ))}
        </div>
      )}
    </div>
  );
}