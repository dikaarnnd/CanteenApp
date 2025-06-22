import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient' // sesuaikan dengan path kamu

export default function Pendapatan({ sellerId }) {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTotalPendapatan = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('invoice_with_seller')
        .select('price, quantity, created_at')
        .eq('seller_id', sellerId)
        .eq('order_status', 'paid')

      if (error) {
        console.error('Gagal mengambil data invoice_with_seller:', error)
        setLoading(false)
        return
      }

      // Filter berdasarkan seller & tanggal hari ini
      const today = new Date().toISOString().slice(0, 10)
      const pendapatanHariIni = data
        .filter((item) => item.created_at?.startsWith(today))
        .reduce((acc, item) => acc + item.price * item.quantity, 0)

      setTotal(pendapatanHariIni)
      setLoading(false)
    }

    fetchTotalPendapatan()
  }, [])

  return (
    <section className='flex justify-center items-center'>
      {loading ? (
        <p className='text-[#FFFDED]'>Memuat...</p>
      ) : (
        <>
          <p className='text-center font-bold text-2xl text-[#FFFDED]'>
            Rp. {total.toLocaleString('id-ID')}
          </p>
        </>
      )}
    </section>
  )
}
