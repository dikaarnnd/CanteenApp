// components/HighRating.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient' // sesuaikan dengan path client supabase kamu

import Star from '../assets/star.png' // pastikan path ini sesuai dengan struktur proyek kamu

export default function HighRating() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAggregatedRatings = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('invoice')
        .select(`
          product_id,
          rating,
          product:product_id (
            name,
            image_url
          ),
          progress:progress (
            order_status
          )
        `)
        .eq('progress.order_status', 'paid')
        .not('rating', 'is', null)

      if (error) {
        console.error('Error fetching invoice data:', error)
        setLoading(false)
        return
      }

      // Kelompokkan dan hitung rata-rata rating
      const grouped = {}
      data.forEach((item) => {
        const id = item.product_id
        if (!grouped[id]) {
          grouped[id] = {
            name: item.product.name,
            totalRating: 0,
            count: 0
          }
        }
        grouped[id].totalRating += item.rating
        grouped[id].count += 1
      })

      // Hitung rata-rata & ubah ke array
      const result = Object.entries(grouped).map(([id, item]) => ({
        id,
        name: item.name,
        avgRating: (item.totalRating / item.count).toFixed(1),
        totalVotes: item.count
      }))

      // Urutkan dari rating tertinggi
      result.sort((a, b) => b.avgRating - a.avgRating)

      setData(result)
      setLoading(false)
    }

    fetchAggregatedRatings()
  }, [])

  return (
    <div className="px-6 text-black">
      {loading ? (
        <p className='text-center'>Loading...</p>
      ) : data.length === 0 ? (
        <p className='text-center'>Belum ada data rating.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item, index) => (
            <li
              key={item.id}
              className="flex justify-between items-center gap-2"
            >
              <p>
                {index + 1}. {item.name}
              </p>
              <div className='flex flex-row gap-2'>
                <div className='flex flex-row'>
                  <img src={Star} className='w-[20px] h-[20px]' />
                  <p>
                    {item.avgRating}
                  </p>
                </div>
                <p>
                  ({item.totalVotes})
                </p>
              </div>

              {/* <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-bold text-black">
                  {index + 1}. {item.name}
                </p>
                <p className="text-sm text-gray-700">
                  Rata-rata Rating: {item.avgRating} ({item.totalVotes} penilaian)
                </p>
              </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
