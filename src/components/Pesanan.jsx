import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

import CancelBtn from '../assets/cancel.png'
import CheckBtn from '../assets/check.png'

export default function Pesanan({ sellerId }) {
  const [queueOrders, setQueueOrders] = useState([])
  const [processOrders, setProcessOrders] = useState([])

  const fetchQueueOrders = async () => {
    const { data, error } = await supabase
      .from('progress')
      .select(`
        invoice_id,
        order_status,
        invoice (
          mhs_nim,
          quantity,
          product:product_id (
            name,
            seller_id
          )
        )
      `)
      .eq('order_status', 'queue')
      .limit(5)

    if (error) {
      console.error('Error fetching data:', error)
    } else {
      const filtered = data.filter(order => order.invoice?.product?.seller_id === sellerId)
      setQueueOrders(filtered)
    }
  }
  
  const fetchProcessOrders = async () => {
    const { data, error } = await supabase
      .from('progress')
      .select(`
        invoice_id,
        order_status,
        invoice (
          mhs_nim,
          quantity,
          product:product_id (
            name,
            seller_id
          )
        )
      `)
      .eq('order_status', 'process')
      .limit(5)

    if (error) {
      console.error('Error fetching data:', error)
    } else {
      const filtered = data.filter(order => order.invoice?.product?.seller_id === sellerId)
      setQueueOrders(filtered)
    }
  }

  const handleAction = async (progressId, newStatus) => {
    const { error } = await supabase
      .from('progress')
      .update({ order_status: newStatus })
      .eq('invoice_id', progressId)

    if (error) {
      console.error(`Gagal memperbarui status menjadi ${newStatus}:`, error)
    } else {
       // Refresh data setelah update
      fetchQueueOrders()
      fetchProcessOrders()
    }
  }

  useEffect(() => {
    fetchQueueOrders()
    fetchProcessOrders()
  }, [sellerId])
  return (
    <div className='flex-grow grid grid-rows-4 gap-2 px-6'>
      <div className='grid rows-5 gap-1'>
        <div className='text-[#3A4D39]'>Menunggu persetujuan</div>
        <div className='bg-[#3A4D39] row-span-4 rounded-xl p-4'>
          {queueOrders.length === 0 ? (
            <div className='text-sm italic'>Tidak ada pesanan</div>
          ) : (
            <ul className='text-sm'>
              {queueOrders.map((order, index) => (
                <li key={index} className='flex justify-between items-center gap-1'>
                  <div>
                    <strong>{order.invoice.mhs_nim}</strong>
                  </div>
                  <div>{order.invoice?.product?.name || 'Produk tidak ditemukan'}</div>
                  <div className='flex items-center gap-2'>
                    <div className="mr-3">({order.invoice.quantity} pcs)</div>
                    <button onClick={() => handleAction(order.invoice_id, 'process')}
                      className="cursor-pointer"
                    >
                      <img src={CheckBtn} className='w-7 h-7' />
                    </button>
                    <button onClick={() => handleAction(order.invoice_id, 'cancel')}
                      className="cursor-pointer"
                    >
                      <img src={CancelBtn} className='w-7 h-7' />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className='grid rows-5 gap-1'>
        <div className='text-[#3A4D39]'>Sedang diproses</div>
        <div className='bg-[#3A4D39] row-span-4 rounded-xl p-4'>
          {processOrders.length === 0 ? (
            <div className='text-sm italic'>Belum ada pesanan yang disetujui</div>
          ) : (
            <ul className='text-sm'>
              {processOrders.map((order, index) => (
                <li key={index} className='flex justify-between items-center gap-1'>
                  <div>
                    <strong>{order.invoice.mhs_nim}</strong>
                  </div>
                  <div>{order.invoice?.product?.name || 'Produk tidak ditemukan'}</div>
                  <div className='flex items-center gap-2'>
                    <div className="mr-3">({order.invoice.quantity} pcs)</div>
                    <button onClick={() => handleAction(order.invoice_id, 'ready')}
                      className="cursor-pointer"
                    >
                      <img src={CheckBtn} className='w-7 h-7' />
                    </button>
                    <button onClick={() => handleAction(order.invoice_id, 'queue')}
                      className="cursor-pointer"
                    >
                      <img src={CancelBtn} className='w-7 h-7' />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
