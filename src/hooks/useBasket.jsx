import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useBasket = () => {
  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

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
          created_at: new Date().toISOString()
        };

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

      // Create progress records
      const createdProgress = [];
      for (const invoiceId of invoiceIds) {
        const progressPayload = {
          invoice_id: invoiceId,
          order_status: 'npaid'
        };

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

      // Clear basket
      const basketClearPromises = basket.map(item => 
        supabase.from('keranjang').delete().eq('id', item.id)
      );
      await Promise.all(basketClearPromises);

      setBasket([]);
      alert(`Order created successfully! Invoice IDs: ${invoiceIds.join(', ')}`);
      navigate(`/order-status/${invoiceIds[0]}`);

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
    calculateTotal,
    handleCheckout
  };
};