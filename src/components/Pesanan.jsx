import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

import CancelBtn from '../assets/cancel.png'
import CheckBtn from '../assets/check.png'
import NPaidBtn from '../assets/npaid.png'

const STATUSES = ['queue', 'process', 'ready', 'paid']
const LIMIT_PER_STATUS = 100

export default function Pesanan({ sellerId, visibleStatuses = ['queue', 'process', 'ready', 'npaid', 'cancel'] }) {
  const [orders, setOrders] = useState({
    queue: [],
    process: [],
    ready: [],
    paid: [],
    npaid: [],
    cancel: []
  })

  function getTodayDateRangeInUTC() {
    const now = new Date()

    // Konversi ke zona waktu Indonesia (WIB = UTC+7)
    const offsetInMs = 7 * 60 * 60 * 1000
    const today = new Date(now.getTime() + offsetInMs)

    const startOfDay = new Date(today)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(today)
    endOfDay.setUTCHours(23, 59, 59, 999)

    return {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString()
    }
  }


  const fetchOrdersByStatus = async (status) => {
    const { start, end } = getTodayDateRangeInUTC()
    
    const { data, error } = await supabase
      .from('progress')
      .select(`
        invoice_id,
        order_status,
        invoice (
          mhs_nim,
          quantity,
          created_at,
          product:product_id (
            name,
            seller_id
          )
        )
      `)
      .eq('order_status', status)
      .gte('invoice.created_at', start)
      .lt('invoice.created_at', end)

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

  const renderOrderList = (status, title, actionLeft, actionRight, extraAction = null) => {
    const orderList = orders[status]
    const statusEmptyText = {
      queue: 'Tidak ada pesanan',
      process: 'Belum ada pesanan yang disetujui',
      ready: 'Belum ada pesanan yang siap',
      paid: 'Belum ada pesanan yang dibayar',
      npaid: 'Belum ada pesanan yang tidak dibayar',
      cancel: 'Tidak ada pesanan yang dibatalkan'
    }

    return (
      <div className='flex flex-col mb-1'>
        <div className='text-[#3A4D39]'>{title}</div>
        <div className={`bg-[#3A4D39] rounded-xl p-4 min-h-36 ${orderList.length === 0 ? 'h-fit' : 'max-h-36 overflow-y-auto'}`}>
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
                    {/* Tombol tambahan jika ada */}
                    {extraAction && (
                      <button
                        onClick={() => handleAction(order.invoice_id, extraAction.status)}
                        className="cursor-pointer"
                      >
                        {extraAction.label}
                      </button>
                    )}
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
    <div className='flex flex-col mb-3 gap-2 px-6'>
      {visibleStatuses.includes('queue') &&
        renderOrderList('queue', 'Menunggu persetujuan', { status: 'process' }, { status: 'cancel' })}
      
      {visibleStatuses.includes('process') &&
        renderOrderList('process', 'Sedang diproses', { status: 'ready' }, { status: 'queue' })}
      
      {visibleStatuses.includes('ready') &&
        renderOrderList('ready', 'Pesanan Siap',
          { status: 'paid' },
          { status: 'process' },
          { status: 'npaid', label: <img src={NPaidBtn} className='w-5 h-5' /> })}
      
      {visibleStatuses.includes('npaid') &&
        renderOrderList('npaid', 'Tidak Dibayar/Diambil', { status: 'paid' })}
      
      {visibleStatuses.includes('cancel') &&
        renderOrderList('cancel', 'Dibatalkan', { status: 'queue' })}
    </div>
  )
}

