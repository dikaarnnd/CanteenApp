import React, { useState } from 'react';
import { getStatusText, getStatusColor, formatDate } from './orderStatusUtils';

export default function OrderCard({ order, onConfirmPickup, onMarkAsTaken, onCancelOrder }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await onCancelOrder(order.invoice_id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmPickup = async () => {
    setIsLoading(true);
    try {
      await onConfirmPickup(order.invoice_id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Order #{order.invoice_id}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
          {getStatusText(order.order_status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.product_name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Qty: {item.quantity}</span>
                <span>@ Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                Rp {item.subtotal.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-xl font-bold text-[#9BA38D]">
            Rp {order.total.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {/* QUEUE: User can cancel */}
        {order.order_status === 'queue' && (
          <button
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            onClick={handleCancelOrder}
            disabled={isLoading}
          >
            {isLoading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}

        {/* PROCESS: Show status but no actions for user */}
        {order.order_status === 'process' && (
          <div className="flex-1 text-center py-3 px-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-pulse">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                </svg>
              </div>
              <span className="text-orange-700 font-medium">Order is being prepared...</span>
            </div>
            <p className="text-xs text-orange-600 mt-1">Please wait while the seller prepares your order</p>
          </div>
        )}

        {/* READY: User can confirm pickup */}
        {order.order_status === 'ready' && (
          <button
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            onClick={handleConfirmPickup}
            disabled={isLoading}
          >
            {isLoading ? 'Confirming...' : 'Confirm Pickup'}
          </button>
        )}

        {/* NPAID: Show reminder that payment is needed (read-only) */}
        {order.order_status === 'npaid' && (
          <div className="flex-1 text-center py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-pulse">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-blue-700 font-medium">Payment Required</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">Please pay at the counter to complete your order</p>
          </div>
        )}

        {/* PAID: Completed orders - show reorder option */}
        {order.order_status === 'paid' && (
          <button
            className="flex-1 px-4 py-2 border border-[#9BA38D] text-[#9BA38D] rounded-lg hover:bg-[#9BA38D] hover:text-white transition-colors"
            onClick={() => {
              alert('Reorder functionality coming soon!');
            }}
          >
            Reorder
          </button>
        )}

        {/* CANCEL: Cancelled orders - show reorder option */}
        {order.order_status === 'cancel' && (
          <button
            className="flex-1 px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => {
              alert('Reorder functionality coming soon!');
            }}
          >
            Reorder
          </button>
        )}
      </div>
    </div>
  );
}