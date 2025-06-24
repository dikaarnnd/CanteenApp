import React, { useState } from 'react';

export default function BasketItem({ item, onRemove, onUpdateQuantity }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!item.product) {
    return null; // Don't render invalid items
  }

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(); // Remove item if quantity is less than 1
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const totalPrice = item.product.price * item.quantity;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0 w-20 h-20">
          {item.product.image_url && !imageError ? (
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            // Fallback: Simple colored div with food icon
            <div className="w-full h-full bg-[#9BA38D] flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 truncate">
                {item.product.name}
              </h3>
              {item.product.desk && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {item.product.desk}
                </p>
              )}

              {/* Price per item */}
              <p className="text-sm text-gray-500 mb-2">
                Rp {item.product.price.toLocaleString('id-ID')} each
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isUpdating
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={isUpdating}
                >
                  −
                </button>
                <span className="text-sm font-medium text-gray-900 min-w-[60px] text-center">
                  {item.quantity} item{item.quantity > 1 ? 's' : ''}
                </span>
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isUpdating
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={isUpdating}
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price & Actions */}
            <div className="text-right ml-4 flex-shrink-0">
              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                <p className="text-xl font-bold text-[#9BA38D]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Remove Button */}
              <button
                className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isRemoving
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 active:bg-red-200'
                }`}
                onClick={handleRemove}
                disabled={isRemoving}
                title="Remove from basket"
              >
                {isRemoving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-1"></div>
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay when updating quantity */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#9BA38D]"></div>
        </div>
      )}
    </div>
  );
}