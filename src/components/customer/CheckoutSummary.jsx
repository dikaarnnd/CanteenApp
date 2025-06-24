import React from 'react';

export default function CheckoutSummary({ total, onCheckout, isProcessing }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-2xl font-bold text-[#9BA38D]">
          Rp {total.toLocaleString('id-ID')}
        </span>
      </div>
      <button
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isProcessing 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-[#9BA38D] text-white hover:bg-[#7F8C69]'
        }`}
        onClick={onCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
      </button>
    </div>
  );
}