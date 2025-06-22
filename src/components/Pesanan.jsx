import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

import CancelBtn from '../assets/cancel.png'
import CheckBtn from '../assets/check.png'

const STATUSES = ['queue', 'process', 'ready', 'paid']
const LIMIT_PER_STATUS = 3

export default function Pesanan({ sellerId }) {
  const [orders, setOrders] = useState({
    queue: [],
    process: [],
    ready: [],
    paid: []
  })

  const fetchOrdersByStatus = async (status) => {
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
      .eq('order_status', status)

    if (error) {
      console.error(`Error fetching ${status} orders:`, error)
    } else {
      const filtered = data.filter(order =>
        order?.invoice?.product?.seller_id?.toString() === sellerId?.toString()
      )
      setOrders(prev => ({
        ...prev,
        [status]: filtered.slice(0, LIMIT_PER_STATUS)
      }))
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
      STATUSES.forEach(fetchOrdersByStatus)
    }
  }

  useEffect(() => {
    if (sellerId) {
      STATUSES.forEach(fetchOrdersByStatus)
    }
  }, [sellerId])

  const renderOrderList = (status, title, actionLeft, actionRight) => {
    const orderList = orders[status]
    const statusEmptyText = {
      queue: 'Tidak ada pesanan',
      process: 'Belum ada pesanan yang disetujui',
      ready: 'Belum ada pesanan yang siap',
      paid: 'Belum ada pesanan yang dibayar'
    }

    return (
      <div className='grid rows-5 mb-1'>
        <div className='text-[#3A4D39]'>{title}</div>
        <div className='min-h-29 bg-[#3A4D39] row-span-4 rounded-xl p-4'>
          {orderList.length === 0 ? (
            <div className='text-sm italic'>{statusEmptyText[status]}</div>
          ) : (
            <ul className='text-sm'>
              {orderList.map((order, index) => (
                <li key={index} className='flex justify-between items-center gap-1 text-[#FFFDED]'>
                  <div>
                    <strong>{order.invoice.mhs_nim}</strong>
                  </div>
                  <div>{order.invoice?.product?.name || 'Produk tidak ditemukan'}</div>
                  <div className='flex items-center gap-2'>
                    <div className="mr-3">({order.invoice.quantity} pcs)</div>
                    <button
                      onClick={() => handleAction(order.invoice_id, actionLeft.status)}
                      className="cursor-pointer"
                    >
                      <img src={CheckBtn} alt="Check" className='w-7 h-7' />
                    </button>
                    <button
                      onClick={() => handleAction(order.invoice_id, actionRight.status)}
                      className="cursor-pointer"
                    >
                      <img src={CancelBtn} alt="Cancel" className='w-7 h-7' />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='flex-grow grid grid-rows-4 gap-2 px-6'>
      {renderOrderList('queue', 'Menunggu persetujuan', { status: 'process' }, { status: 'cancel' })}
      {renderOrderList('process', 'Sedang diproses', { status: 'ready' }, { status: 'queue' })}
      {renderOrderList('ready', 'Pesanan Siap', { status: 'paid' }, { status: 'process' })}
      {/* {renderOrderList('paid', 'Selesai', { status: 'paid' }, { status: 'process' })} */}
    </div>
  )
}

