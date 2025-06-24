import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const useOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    const nim = localStorage.getItem('nim');
    
    if (!nim) {
      alert('You must be logged in to view your orders.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // First, get active progress records (not paid or cancelled)
      const { data: activeProgressData, error: progressError } = await supabase
        .from('progress')
        .select('invoice_id, order_status')
        .in('order_status', ['queue', 'process', 'ready', 'npaid']); // Only active statuses

      if (progressError) {
        console.error('Error fetching active progress:', progressError);
        throw progressError;
      }

      console.log('📊 Active progress data:', activeProgressData);

      // If no active orders, return empty
      if (!activeProgressData || activeProgressData.length === 0) {
        setOrders([]);
        return;
      }

      // Get the invoice IDs that have active progress
      const activeInvoiceIds = activeProgressData.map(p => p.invoice_id);
      
      // Now fetch the invoice details for these active orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('invoice')
        .select(`
          id,
          mhs_nim,
          product_id,
          quantity,
          price,
          total,
          created_at,
          product:product_id (
            name,
            desk,
            seller_id
          )
        `)
        .eq('mhs_nim', nim)
        .in('id', activeInvoiceIds)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      console.log('📊 Active orders data:', ordersData);

      // Group orders and add their current status from progress
      const groupedOrders = groupOrdersByInvoice(ordersData || [], activeProgressData);
      console.log('📊 Grouped active orders:', groupedOrders);
      setOrders(groupedOrders);

    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load current orders');
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByInvoice = (ordersData, progressData) => {
    const grouped = {};
    
    // Create a map of invoice_id to status for quick lookup
    const statusMap = {};
    progressData.forEach(progress => {
      statusMap[progress.invoice_id] = progress.order_status;
    });
    
    ordersData.forEach(order => {
      const invoiceId = order.id;
      
      if (!grouped[invoiceId]) {
        // Get the current status from our progress data
        const orderStatus = statusMap[invoiceId] || 'queue';
        
        console.log(`📋 Order ${invoiceId}: status = ${orderStatus}`);
        
        grouped[invoiceId] = {
          invoice_id: invoiceId,
          created_at: order.created_at,
          order_status: orderStatus,
          seller_id: order.product?.seller_id,
          items: [],
          total: 0
        };
      }
      
      grouped[invoiceId].items.push({
        product_name: order.product?.name || 'Unknown Product',
        quantity: order.quantity,
        price: order.price,
        rating: null,
        subtotal: order.total || (order.price * order.quantity)
      });
      
      grouped[invoiceId].total += order.total || (order.price * order.quantity);
    });
    
    return Object.values(grouped);
  };

  // USER ACTION: Confirm pickup for 'ready' orders
  const handleConfirmPickup = async (invoiceId) => {
    try {
      const { error } = await supabase
        .from('progress')
        .update({ order_status: 'paid' })
        .eq('invoice_id', invoiceId);

      if (error) throw error;

      fetchAllOrders(); // Refresh to remove completed order
      alert('Order marked as completed! Thank you!');
    } catch (error) {
      console.error('Error confirming pickup:', error);
      alert('Failed to confirm pickup. Please try again.');
    }
  };

  // USER ACTION: Mark as taken for 'npaid' orders
  const handleMarkAsTaken = async (invoiceId) => {
    try {
      const { error } = await supabase
        .from('progress')
        .update({ order_status: 'paid' })
        .eq('invoice_id', invoiceId);

      if (error) throw error;

      fetchAllOrders(); // Refresh to remove completed order
      alert('Order marked as taken! Thank you!');
    } catch (error) {
      console.error('Error marking as taken:', error);
      alert('Failed to mark as taken. Please try again.');
    }
  };

  // USER ACTION: Cancel order (only allowed for 'queue' status)
  const handleCancelOrder = async (invoiceId) => {
    try {
      const { data: currentStatus, error: checkError } = await supabase
        .from('progress')
        .select('order_status')
        .eq('invoice_id', invoiceId)
        .single();

      if (checkError) {
        console.error('Error checking order status:', checkError);
        throw checkError;
      }

      if (currentStatus.order_status !== 'queue') {
        alert('This order cannot be cancelled. Only orders in queue can be cancelled.');
        return;
      }

      const { error: updateError } = await supabase
        .from('progress')
        .update({ order_status: 'cancel' })
        .eq('invoice_id', invoiceId)
        .eq('order_status', 'queue');

      if (updateError) {
        console.error('Error cancelling order:', updateError);
        throw updateError;
      }

      fetchAllOrders(); // Refresh to remove cancelled order
      alert('Order has been cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return {
    orders,
    loading,
    fetchAllOrders,
    handleConfirmPickup,
    handleMarkAsTaken,
    handleCancelOrder
  };
};