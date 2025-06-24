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
      
      {/* Main Content */}
      <div className="pt-20 pb-12">
        <WelcomeSection />
        <RestaurantList sellers={sellers} loading={loading} error={error} />
      </div>
    </div>
  );
}