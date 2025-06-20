import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function RestoPage() {
  const { id } = useParams(); // Get the dynamic id from the URL
  const navigate = useNavigate(); // For navigation
  const [resto, setResto] = useState(null);

  useEffect(() => {
    const fetchResto = async () => {
      const { data, error } = await supabase
        .from('seller') // Replace 'seller' with your actual table name
        .select('nama, nama_kantin')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching resto:', error);
      } else {
        setResto(data);
      }
    };

    fetchResto();
  }, [id]);

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
        onClick={() => navigate('/home')} // Navigate back to Home
      >
        Back to Home
      </button>
      <div className="bg-[#F9F4DA] p-6 rounded shadow-md max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-black">{resto.nama_kantin}</h1>
        <p className="text-lg text-black">Owned by: <span className="font-semibold">{resto.nama}</span></p>
      </div>
    </div>
  );
}