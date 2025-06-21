import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient' // sesuaikan dengan path kamu

export default function Pendapatan({ sellerId }) {
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
        .from('invoice')
        .select(`
          price,
          quantity,
          created_at,
          product:product_id (
            seller_id
          ),
          progress:progress (
            order_status
          )
        `)
        .eq('progress.order_status', 'queue')

      if (error) {
        console.error('Gagal mengambil data invoice:', error)
        setLoading(false)
        return
      }

      // Filter berdasarkan seller & tanggal hari ini
      const today = new Date().toISOString().slice(0, 10)
      const pendapatanHariIni = data
        .filter((item) => {
          return (
            item.product?.seller_id === sellerId &&
            item.created_at?.startsWith(today)
          )
        })
        .reduce((acc, item) => acc + item.price * item.quantity, 0)

      setTotal(pendapatanHariIni)
      setLoading(false)
    }

    fetchTotalPendapatan()
  }, [sellerId])

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
