import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient' // sesuaikan dengan path kamu

export default function Pendapatan() {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTotalPendapatan = async () => {
      setLoading(true)

      // Ambil seller_id dari localStorage
      const sellerId = localStorage.getItem('seller_id')
      if (!sellerId) {
        console.warn('seller_id tidak ditemukan di localStorage')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('invoice_with_seller')
        .select('price, quantity, created_at')
        .eq('seller_id', sellerId)
        .eq('order_status', 'paid')

      if (error) {
        console.error('Gagal mengambil data invoice:', error)
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
        <p className='text-white'>Memuat...</p>
      ) : (
        <>
          <p className='text-center text-2xl text-white'>
            Rp. {total.toLocaleString('id-ID')}
          </p>
        </>
      )}
    </section>
  )
}
