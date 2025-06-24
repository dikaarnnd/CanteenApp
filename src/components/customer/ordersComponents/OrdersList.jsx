import React from 'react';
import OrderCard from './OrderCard';
import EmptyOrders from './EmptyOrders';

export default function OrdersList({ orders, loading, onConfirmPickup, onCancelOrder, onRefresh }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9BA38D] mx-auto mb-4"></div>
          <p className="text-[#9BA38D] font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.invoice_id}
              order={order}
              onConfirmPickup={onConfirmPickup}
              onCancelOrder={onCancelOrder}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          className="bg-white text-[#9BA38D] px-6 py-2 rounded-lg border border-[#9BA38D] hover:bg-[#9BA38D] hover:text-white transition-colors"
          onClick={onRefresh}
        >
          🔄 Refresh Orders
        </button>
      </div>
    </>
  );
}