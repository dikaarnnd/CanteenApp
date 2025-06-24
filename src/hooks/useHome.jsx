import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useHome = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('seller')
        .select('id, nama, nama_kantin');

      if (error) {
        console.error('Error fetching sellers:', error);
        setError('Failed to load restaurants');
      } else {
        setSellers(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return {
    sellers,
    loading,
    error,
    refetch: fetchSellers
  };
};