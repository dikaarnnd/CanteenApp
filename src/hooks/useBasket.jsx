import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useBasket = () => {
  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Add Indonesian time function
  const getIndonesianTime = () => {
    const now = new Date();
    // Convert to Indonesian time (UTC+7)
    const offsetInMs = 7 * 60 * 60 * 1000;
    const indonesianTime = new Date(now.getTime() + offsetInMs);
    return indonesianTime.toISOString();
  };

  const fetchBasket = async () => {
    const nim = localStorage.getItem('nim');

    if (!nim) {
      alert('You must be logged in to view your basket.');
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('keranjang')
        .select('id, quantity, product_id, product(name, price, image_url, desk)')
        .eq('mhs_nim', nim);

      if (error) {
        console.error('Error fetching basket:', error);
        alert('Failed to fetch basket items.');
      } else {
        // Filter out items with null/deleted products
        const validItems = data?.filter(item => item.product) || [];
        setBasket(validItems);
      }
    } catch (error) {
      console.error('Error:', error);
      setBasket([]);
    }
    
    setLoading(false);
  };

  const handleRemoveItem = async (id) => {
    try {
      const { error } = await supabase
        .from('keranjang')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item from basket.');
      } else {
        setBasket(prevBasket => prevBasket.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error in handleRemoveItem:', error);
      alert('An error occurred while removing the item.');
    }
  };

  const calculateTotal = () => {
    return basket.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity is less than 1, remove the item
      handleRemoveItem(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('keranjang')
        .update({ quantity: newQuantity })
        .eq('id', id);

      if (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity.');
      } else {
        // Update the local state immediately for better UX
        setBasket(prevBasket => 
          prevBasket.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error in handleUpdateQuantity:', error);
      alert('An error occurred while updating quantity.');
    }
  };

  const handleCheckout = async () => {
    if (basket.length === 0) {
      alert('Your basket is empty!');
      return;
    }

    setIsProcessing(true);
    const nim = localStorage.getItem('nim');

    try {
      const invoiceIds = [];
      const createdInvoices = [];
      
      // Get Indonesian time for all orders
      const indonesianTime = getIndonesianTime();
      console.log('🕐 Order created at Indonesian time:', indonesianTime);

      // Create orders in the invoice table
      for (const item of basket) {
        // Validate item before processing
        if (!item.product || !item.product.price || !item.quantity) {
          throw new Error(`Invalid item: ${item.product?.name || 'Unknown'}`);
        }

        const payload = {
          mhs_nim: nim,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
          created_at: indonesianTime
        };

        console.log('📦 Creating invoice with payload:', payload);

        const { data, error: invoiceError } = await supabase
          .from('invoice')
          .insert(payload)
          .select('id');

        if (invoiceError) {
          console.error('Error inserting invoice:', invoiceError);
          // Rollback previously created invoices
          for (const invoiceId of createdInvoices) {
            await supabase.from('invoice').delete().eq('id', invoiceId);
          }
          throw new Error('Failed to create invoice');
        }

        if (data && data[0]) {
          invoiceIds.push(data[0].id);
          createdInvoices.push(data[0].id);
        }
      }

      console.log('✅ Created invoice IDs:', invoiceIds);

      // Create progress records
      const createdProgress = [];
      for (const invoiceId of invoiceIds) {
        const progressPayload = {
          invoice_id: invoiceId,
          order_status: 'queue'
        };

        console.log('📊 Creating progress record:', progressPayload);

        const { error: progressError } = await supabase
          .from('progress')
          .insert(progressPayload);

        if (progressError) {
          console.error('Error inserting progress record:', progressError);
          // Rollback
          for (const id of createdInvoices) {
            await supabase.from('invoice').delete().eq('id', id);
          }
          for (const id of createdProgress) {
            await supabase.from('progress').delete().eq('invoice_id', id);
          }
          throw new Error('Failed to create progress record');
        }
        createdProgress.push(invoiceId);
      }

      console.log('✅ Created progress records for invoice IDs:', createdProgress);

      // Clear basket
      const basketClearPromises = basket.map(item => 
        supabase.from('keranjang').delete().eq('id', item.id)
      );
      await Promise.all(basketClearPromises);

      setBasket([]);
      alert(`Order created successfully! Invoice IDs: ${invoiceIds.join(', ')}`);
      navigate('/order-status');

    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  return {
    basket,
    loading,
    isProcessing,
    handleRemoveItem,
    handleUpdateQuantity,
    calculateTotal,
    handleCheckout
  };
};