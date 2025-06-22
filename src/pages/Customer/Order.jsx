import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Order() {
  const [basket, setBasket] = useState([]); // State for basket items
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchBasket = async () => {
      const nim = localStorage.getItem('nim'); // Get the NIM from session

      if (!nim) {
        alert('You must be logged in to view your basket.');
        return;
      }

      const { data, error } = await supabase
        .from('keranjang') // Replace with your actual table name
        .select('id, quantity, product_id, product(name, price, image_url)') // Fetch related product details
        .eq('mhs_nim', nim); // Filter by logged-in student

      if (error) {
        console.error('Error fetching basket:', error);
        alert('Failed to fetch basket items.');
      } else {
        setBasket(data);
      }
    };

    fetchBasket();
  }, []);

  const handleRemoveItem = async (id) => {
    const { error } = await supabase
      .from('keranjang') // Replace with your actual table name
      .delete()
      .eq('id', id); // Delete the item by its ID

    if (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from basket.');
    } else {
      setBasket((prevBasket) => prevBasket.filter((item) => item.id !== id)); // Update state
      alert('Item removed from basket.');
    }
  };

  return (
    <div className="p-4 text-center bg-[#FFFDED] min-h-screen">
      <button
        className="bg-[#9BA38D] text-white px-4 py-2 rounded hover:bg-[#7F8C69] mb-4"
        onClick={() => navigate('/home')} // Navigate back to Home
      >
        Back to Home
      </button>
      <h1 className="text-2xl font-bold mb-4 text-black">Your Basket</h1>
      {basket.length === 0 ? (
        <p className="text-lg text-black">Your basket is empty.</p>
      ) : (
        <div className="grid gap-4">
          {basket.map((item) => (
            <div
              key={item.id}
              className="bg-[#F9F4DA] p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-bold text-black">{item.product.name}</h2>
                <p className="text-sm text-black">Price: Rp {item.product.price}</p>
                <p className="text-sm text-black">Quantity: {item.quantity}</p>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}