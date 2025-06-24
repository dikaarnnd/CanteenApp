import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../../hooks/useBasket';
import BasketItem from '../../components/customer/BasketItems';
import EmptyBasket from '../../components/customer/EmptyBasket';
import CheckoutSummary from '../../components/customer/CheckoutSummary';

export default function Order() {
  const navigate = useNavigate();
  const {
    basket,
    loading,
    isProcessing,
    handleRemoveItem,
    calculateTotal,
    handleCheckout
  } = useBasket();

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
    <div className="bg-[#FFFDED] min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="bg-[#9BA38D] text-white px-4 py-2 rounded hover:bg-[#7F8C69] transition-colors"
          onClick={() => navigate('/home')}
        >
          ← Back to Home
        </button>
        <h1 className="text-2xl font-bold text-black">🛒 My Basket</h1>
        <div className="w-20"></div>
      </div>

      {basket.length === 0 ? (
        <EmptyBasket />
      ) : (
        <div>
          {/* Basket Items */}
          <div className="space-y-4 mb-6">
            {basket.map((item) => (
              <BasketItem 
                key={item.id} 
                item={item} 
                onRemove={handleRemoveItem} 
              />
            ))}
          </div>

          {/* Checkout Summary */}
          <CheckoutSummary 
            total={calculateTotal()}
            onCheckout={handleCheckout}
            isProcessing={isProcessing}
          />
        </div>
      )}
    </div>
  );
}