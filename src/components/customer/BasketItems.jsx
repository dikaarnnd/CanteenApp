import React from 'react';

export default function BasketItem({ item, onRemove }) {
  if (!item.product) {
    return null; // Don't render invalid items
  }

  return (
    <div className="bg-[#F9F4DA] rounded-lg p-4 flex items-center gap-4">
      <img
        src={item.product.image_url || 'https://via.placeholder.com/100'}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-bold text-black">{item.product.name}</h3>
        <p className="text-sm text-gray-600">{item.product.desk}</p>
        <p className="text-[#9BA38D] font-bold">
          Rp {item.product.price?.toLocaleString('id-ID')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-black">Qty: {item.quantity}</span>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
      <div className="text-right">
        <p className="font-bold text-[#9BA38D]">
          Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}