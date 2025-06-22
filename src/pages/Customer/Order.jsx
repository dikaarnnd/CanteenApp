import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Order() {
  const [basket, setBasket] = useState([]); // State for basket items
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchBasket = async () => {
      const nim = localStorage.getItem('nim'); // Get the NIM from session

      if (!nim) {
        alert('You must be logged in to view your basket.');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('keranjang') // Replace with your actual table name
        .select('id, quantity, product_id, product(name, price, image_url, desk)') // Fetch related product details
        .eq('mhs_nim', nim); // Filter by logged-in student

      if (error) {
        console.error('Error fetching basket:', error);
        alert('Failed to fetch basket items.');
      } else {
        setBasket(data);
      }
      setLoading(false);
    };

    fetchBasket();
  }, [navigate]);

  const handleRemoveItem = async (id) => {
    const { error } = await supabase
      .from('keranjang') // Replace with your actual table name
      .delete()
      .eq('id', id); // Delete the item by its ID

    if (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from basket.');
    } else {
      setBasket((prevBasket) => prevBasket.filter((item) => item.id !== id)); // Update state
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    const { error } = await supabase
      .from('keranjang')
      .update({ quantity: newQuantity })
      .eq('id', id);

    if (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity.');
    } else {
      setBasket((prevBasket) =>
        prevBasket.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return basket.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (basket.length === 0) {
      alert('Your basket is empty!');
      return;
    }
    // Add checkout logic here
    alert('Checkout functionality will be implemented soon!');
  };

  if (loading) {
    return (
      <div className="bg-[#FFFDED] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9BA38D] mx-auto mb-4"></div>
          <p className="text-[#9BA38D] font-medium">Loading your basket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDED] min-h-screen">
      {/* Navigation Header */}
      <div className="bg-[#F9F4DA] shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              className="flex items-center gap-2 bg-[#9BA38D] text-white px-4 py-2 rounded-lg hover:bg-[#7F8C69] transition-colors"
              onClick={() => navigate('/home')}
            >
              <span>←</span>
              Back to Home
            </button>
            <h1 className="text-2xl font-bold text-black">🛒 My Basket</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {basket.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="bg-[#F9F4DA] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Your basket is empty</h2>
            <p className="text-gray-500 mb-8">Add some delicious items from our restaurants!</p>
            <button
              className="bg-[#9BA38D] text-white px-6 py-3 rounded-lg hover:bg-[#7F8C69] transition-colors font-medium"
              onClick={() => navigate('/home')}
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basket Items */}
            <div className="space-y-4">
              {basket.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F9F4DA] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="md:w-32 h-32 bg-gray-200 overflow-hidden">
                      <img
                        src={item.product.image_url || 'https://via.placeholder.com/150x150/9BA38D/FFFFFF?text=Food'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between h-full">
                        <div className="flex-1 mb-4 md:mb-0">
                          <h3 className="text-xl font-bold text-black mb-2">{item.product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.product.desk}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-[#9BA38D]">
                              Rp {item.product.price?.toLocaleString('id-ID')}
                            </span>
                            <span className="text-sm text-gray-500">per item</span>
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                            <button
                              className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Subtotal */}
                          <div className="text-right min-w-[100px]">
                            <p className="text-xs text-gray-500 uppercase">Subtotal</p>
                            <p className="font-bold text-[#9BA38D]">
                              Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="font-bold text-lg">{basket.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-500 uppercase">Total Amount</p>
                    <p className="font-bold text-2xl text-[#9BA38D]">
                      Rp {calculateTotal().toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 border border-[#9BA38D] text-[#9BA38D] rounded-lg hover:bg-[#9BA38D] hover:text-white transition-colors"
                    onClick={() => navigate('/home')}
                  >
                    Add More Items
                  </button>
                  <button
                    className="px-6 py-2 bg-[#9BA38D] text-white rounded-lg hover:bg-[#7F8C69] transition-colors font-medium"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}