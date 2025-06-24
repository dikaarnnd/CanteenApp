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
      const nim = localStorage.getItem('nim');

      if (!nim) {
          alert('You must be logged in to add items to the basket.');
          return;
      }

      try {
          // First, check if the item already exists in the basket
          const { data: existingItem, error: fetchError } = await supabase
              .from('keranjang')
              .select('id, quantity')
              .eq('product_id', product.id)
              .eq('mhs_nim', nim)
              .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
              // PGRST116 is "not found" error, which is expected if item doesn't exist
              console.error('Error checking existing item:', fetchError);
              alert('Failed to check basket.');
              return;
          }

          if (existingItem) {
              // Item exists, update the quantity
              const { error: updateError } = await supabase
                  .from('keranjang')
                  .update({ quantity: existingItem.quantity + 1 })
                  .eq('id', existingItem.id);

              if (updateError) {
                  console.error('Error updating basket:', updateError);
                  alert('Failed to update item quantity.');
              } else {
                  alert('Item quantity updated in basket!');
              }
          } else {
              // Item doesn't exist, insert new item
              const { error: insertError } = await supabase
                  .from('keranjang')
                  .insert([{
                      product_id: product.id,
                      quantity: 1,
                      mhs_nim: nim,
                  }]);

              if (insertError) {
                  console.error('Error adding to basket:', insertError);
                  alert('Failed to add item to basket.');
              } else {
                  alert('Item added to basket successfully!');
              }
          }
      } catch (error) {
          console.error('Error in handleAddToBasket:', error);
          alert('An error occurred while adding to basket.');
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
    <div className="bg-[#FFFDED] min-h-screen">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-[#F9F4DA] shadow-sm">
        <button
          className="bg-[#9BA38D] text-white px-4 py-2 rounded hover:bg-[#7F8C69] transition-colors"
          onClick={() => navigate('/home')}
        >
          ← Kembali ke Home
        </button>
        <button
          className="bg-[#9BA38D] text-white px-4 py-2 rounded hover:bg-[#7F8C69] transition-colors"
          onClick={() => navigate('/order')}
        >
          🛒 View Basket
        </button>
      </div>

      {/* Restaurant Header with Image */}
      <div className="relative">
        {/* Restaurant Image */}
        <div className="w-full h-64 bg-gray-300 overflow-hidden">
          <img
            src="https://via.placeholder.com/800x300/9BA38D/FFFFFF?text=Restaurant+Image"
            alt={resto.nama_kantin}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{resto.nama_kantin}</h1>
            <p className="text-lg text-gray-200">Seller: <span className="font-semibold text-white">{resto.nama}</span></p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Menu Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#F9F4DA] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-200 overflow-hidden">
                <img
                  src={product.image_url || 'https://via.placeholder.com/300x200/9BA38D/FFFFFF?text=Food+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-black mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{product.desk}</p>
                
                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
                    <span className="text-lg font-bold text-[#9BA38D]">Rp {product.price?.toLocaleString('id-ID') || product.price}</span>
                  </div>
                  <button
                    className="bg-[#9BA38D] text-white px-4 py-2 rounded-lg hover:bg-[#7F8C69] transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                    onClick={() => handleAddToBasket(product)}
                  >
                    + Add to Basket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No menu items available</h3>
            <p className="text-gray-500">This restaurant hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}