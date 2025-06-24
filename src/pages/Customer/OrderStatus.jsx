import React from 'react';
import { useOrderStatus } from '../../hooks/useOrderStatus';
import OrderStatusHeader from '../../components/customer/ordersComponents/OrderStatusHeader';
import OrdersList from '../../components/customer/ordersComponents/OrdersList';

export default function OrderStatus() {
  const {
    orders,
    loading,
    fetchAllOrders,
    handleConfirmPickup,
    handleCancelOrder
  } = useOrderStatus();

  return (
    <div className="bg-[#FFFDED] min-h-screen p-4">
      <OrderStatusHeader />
      <OrdersList
        orders={orders}
        loading={loading}
        onConfirmPickup={handleConfirmPickup}
        onCancelOrder={handleCancelOrder}
        onRefresh={fetchAllOrders}
      />
    </div>
  );
}