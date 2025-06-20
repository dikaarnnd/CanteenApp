import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function RestoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resto, setResto] = useState(null);
  const [products, setProducts] = useState([]);
  const [basket, setBasket] = useState([]); // State for basket items
  

  useEffect(() => {
    const fetchResto = async () => {
      const { data, error } = await supabase
        .from('seller')
        .select('nama, nama_kantin')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching resto:', error);
      } else {
        setResto(data);
      }
    };

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('product')
        .select('id, name, desk, price, image_url')
        .eq('seller_id', id);

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
      }
    };

    fetchResto();
    fetchProducts();
  }, [id]);

    const handleAddToBasket = async (product) => {
    const nim = localStorage.getItem('nim'); // Get the NIM from session

    if (!nim) {
        alert('You must be logged in to add items to the basket.');
        return;
    }

    const { data, error } = await supabase
        .from('keranjang') // Replace with your actual table name
        .insert([
        {
            product_id: product.id,
            quantity: 1, // Default quantity
            mhs_nim: nim, // Associate with the logged-in student
        },
        ]);

    if (error) {
        console.error('Error adding to basket:', error);
        alert('Failed to add item to basket.');
    } else {
        alert('Item added to basket successfully!');
    }
    };

  if (!resto) {
    return (
      <div className="p-4 text-center bg-[#FFFDED] min-h-screen">
        <h1 className="text-2xl font-bold text-black">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-4 text-center bg-[#FFFDED] min-h-screen">
      <button
        className="bg-[#9BA38D] text-white px-4 py-2 rounded hover:bg-[#7F8C69] mb-4"
        onClick={() => navigate('/home')}
      >
        Back to Home
      </button>
      <div className="bg-[#F9F4DA] p-6 rounded shadow-md max-w-md mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-4 text-black">{resto.nama_kantin}</h1>
        <p className="text-lg text-black">Owned by: <span className="font-semibold">{resto.nama}</span></p>
      </div>
        <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        onClick={() => navigate('/order')}
        >
        View Basket
        </button>

      {/* Products Section */}
      <div className="grid grid-cols-2 gap-6 px-6 text-black">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#F9F4DA] p-4 rounded shadow-md flex h-48 w-full cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* Left Grid: Image */}
            <div className="w-1/2 h-full">
              <div className="w-full h-full bg-gray-200 rounded overflow-hidden">
                <img
                  src={product.image_url || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Grid: Details */}
            <div className="w-1/2 flex flex-col justify-between pl-4">
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-left">{product.desk}</p>
              <p className="text-sm text-left font-semibold">Price: Rp {product.price}</p>
              <div className="flex items-center justify-between mt-2">
                <button
                  className="bg-[#9BA38D] text-white px-2 py-1 rounded hover:bg-[#7F8C69]"
                  onClick={() => handleAddToBasket(product)}
                >
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}