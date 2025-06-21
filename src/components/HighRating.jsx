// components/HighRating.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient' // sesuaikan dengan path client supabase kamu

export default function HighRating() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHighRatedProducts = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('invoice')
        .select(`
          id,
          rating,
          product:product_id (
            id,
            name,
            image_url
          ),
          progress:progress (
            order_status
          )
        `)
        .eq('progress.order_status', 'paid')
        .not('rating', 'is', null)
        .order('rating', { ascending: false })

      if (error) {
        console.error('Error fetching high rating data:', error)
      } else {
        setData(data)
      }

      setLoading(false)
    }

    fetchHighRatedProducts()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-black">Produk Terlaris Berdasarkan Rating</h2>
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>Belum ada data rating.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.id} className="p-4 border rounded-lg shadow-sm flex items-center gap-4">
              <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 rounded object-cover" />
              <div>
                <p className="font-bold text-black">{item.product.name}</p>
                <p className="text-sm text-black">Rating: {item.rating}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
