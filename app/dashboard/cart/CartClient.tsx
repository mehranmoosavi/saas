'use client';

import { useState } from 'react';
import { useCartState, useCartDispatch } from '@/contexts/CartContext';
import type { Address } from '@prisma/client';
import { Trash2 } from 'lucide-react';

interface CartClientProps {
  addresses: Address[];
}

export default function CartClient({ addresses }: CartClientProps) {
  const cart = useCartState();
  const { removeItem, finalizeOrder, isUpdatingCart } = useCartDispatch();
  
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // تبدیل داده‌های دیتابیس به فرمت مناسب برای نمایش در UI
  const cartItemsForUI = cart?.items?.map(item => ({
    ...item.food,
    price: Number(item.food.price),
    quantity: item.quantity,
  })) || [];

  const totalPrice = cartItemsForUI.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOpenModal = () => {
    if (cartItemsForUI.length > 0) {
      setShowDeliveryModal(true);
    } else {
      alert('سبد خرید شما خالی است!');
    }
  };

  const handleConfirmOrder = async (method: 'PICKUP' | 'DELIVERY') => {
    if (method === 'DELIVERY' && !selectedAddressId) {
      alert('لطفاً یک آدرس برای تحویل انتخاب کنید.');
      return;
    }

    const result = await finalizeOrder(method, selectedAddressId);

    if (result.success) {
      alert('سفارش شما با موفقیت ثبت شد!');
      setShowDeliveryModal(false);
    } else {
      alert('خطایی در ثبت سفارش رخ داد.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">سبد خرید شما</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {cartItemsForUI.length === 0 ? (
          <p className="text-gray-500">سبد خرید شما خالی است.</p>
        ) : (
          <div>
            {cartItemsForUI.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.price.toLocaleString()} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-bold text-lg">{(item.price * item.quantity).toLocaleString()} تومان</p>
                  <button
                  title='a'
                    onClick={() => removeItem(item.id)}
                    disabled={isUpdatingCart}
                    className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6">
              <div className="flex justify-between items-center font-bold text-2xl">
                <span>جمع کل:</span>
                <span>{totalPrice.toLocaleString()} تومان</span>
              </div>
              <button
                onClick={handleOpenModal}
                disabled={isUpdatingCart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isUpdatingCart ? 'در حال پردازش...' : 'پرداخت و نهایی کردن سفارش'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* مودال انتخاب روش تحویل */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">انتخاب روش تحویل</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">۱. تحویل در محل</h3>
                <select
                title='a'
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="" disabled>یک آدرس انتخاب کنید</option>
                  {addresses.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {addr.city}, {addr.street}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleConfirmOrder('DELIVERY')}
                  disabled={!selectedAddressId || isUpdatingCart}
                  className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
                >
                  {isUpdatingCart ? '...' : 'تایید و ارسال به این آدرس'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">یا</span></div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">۲. تحویل حضوری</h3>
                <button
                  onClick={() => handleConfirmOrder('PICKUP')}
                  disabled={isUpdatingCart}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold"
                >
                  {isUpdatingCart ? '...' : 'انتخاب تحویل حضوری'}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowDeliveryModal(false)}
              className="w-full mt-8 text-center text-sm text-gray-600 hover:text-gray-800"
            >
              انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}