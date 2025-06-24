import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function OrderStatus() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStatus();
  }, [invoiceId]);

  const fetchOrderStatus = async () => {
    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('invoice_with_seller')
        .select('*')
        .eq('invoice_id', invoiceId);

      if (orderError) throw orderError;

      // Fetch progress status
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('invoice_id', invoiceId)
        .single();

      if (progressError) throw progressError;

      setOrderData(orderData || []);
      setProgressData(progressData);

    } catch (error) {
      console.error('Error fetching order status:', error);
      alert('Failed to load order status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'npaid': return 'Payment Pending';
      case 'paid': return 'Order Confirmed';
      case 'ready': return 'Ready for Pickup';
      default: return 'Unknown Status';
    }
  };

  const calculateTotal = () => {
    return orderData.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="bg-[#FFFDED] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9BA38D] mx-auto mb-4"></div>
          <p className="text-[#9BA38D] font-medium">Loading order status...</p>
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
        <h1 className="text-2xl font-bold text-black">Order Status</h1>
        <div className="w-20"></div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order #{invoiceId}</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {getStatusText(progressData?.order_status)}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Order placed: {new Date().toLocaleDateString()}
        </div>

        {/* Status Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className={`flex items-center ${progressData?.order_status !== 'npaid' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${progressData?.order_status !== 'npaid' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                ✓
              </div>
              <span className="ml-2 text-xs">Payment</span>
            </div>
            
            <div className={`flex items-center ${progressData?.order_status === 'paid' || progressData?.order_status === 'ready' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${progressData?.order_status === 'paid' || progressData?.order_status === 'ready' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                ✓
              </div>
              <span className="ml-2 text-xs">Preparing</span>
            </div>
            
            <div className={`flex items-center ${progressData?.order_status === 'ready' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${progressData?.order_status === 'ready' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                ✓
              </div>
              <span className="ml-2 text-xs">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Order Items</h3>
        <div className="space-y-2">
          {orderData.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">{item.product_name}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-[#9BA38D]">Rp {calculateTotal().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        className="w-full bg-[#9BA38D] text-white py-3 rounded-lg hover:bg-[#7F8C69] transition-colors font-medium"
        onClick={() => navigate('/home')}
      >
        Continue Shopping
      </button>
    </div>
  );
}