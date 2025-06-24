import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PaidCount({ sellerId }) {
  const [totalTerjual, setTotalTerjual] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTotal = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('invoice_with_seller')
        .select('quantity')
        .eq('seller_id', sellerId)
        .eq('order_status', 'paid')

      if (error) {
        console.error('Gagal mengambil data:', error)
        setLoading(false)
        return
      }

      const total = data.reduce((sum, item) => sum + item.quantity, 0)
      setTotalTerjual(total)
      setLoading(false)
    }

    fetchTotal()
  }, [sellerId])

  return (
    <div className="p-4 text-center">
      {loading ? (
        <p className="text-gray-600">Memuat data...</p>
      ) : (
        <>
          <h2 className="text-xl font-bold text-[#3A4D39]">Total Produk Terjual</h2>
          <p className="text-3xl font-semibold mt-2 text-[#3A4D39]">{totalTerjual}</p>
        </>
      )}
    </div>
  )
}
