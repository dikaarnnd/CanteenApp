import React from 'react';
import { useHome } from '../../hooks/useHome';
import Navbar from '../../components/common/Navbar';
import WelcomeSection from '../../components/customer/homeComponents/WelcomeSection';
import RestaurantList from '../../components/customer/homeComponents/RestaurantList';

export default function Home() {
  const { sellers, loading, error } = useHome();

  return (
    <div className="bg-[#FFFDED] min-h-screen">
      <Navbar />
      
      {/* Main Content Container */}
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section Container */}
          <section className="mb-12">
            <WelcomeSection />
          </section>

          {/* Restaurant List Section */}
          <section className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Restaurants
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose from our variety of food vendors and satisfy your cravings
              </p>
            </div>
            
            <RestaurantList sellers={sellers} loading={loading} error={error} />
          </section>

          {/* Footer Spacing */}
          <div className="mt-16 text-center text-gray-500">
            <p className="text-sm">
              Enjoy your meal! 🍽️
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}