'use client';

import { useState } from 'react';
import FoodTypeSelector from '@/components/FoodTypeSelector';
import FoodItemCard from '@/components/FoodItemCard';
import ShoppingCart from '@/components/ShoppingCart'; // این کامپوننت را هم اضافه می‌کنیم
import { createOrder } from '@/app/action';
import type { Food as PrismaFood } from '@prisma/client';
import { FoodType } from '@prisma/client';
import { useCartState, useCartDispatch } from '@/contexts/CartContext';



interface OrderClientProps {
  allFoods: FoodWithNumberPrice[];
  initialFavoritedIds: Set<string>;
}


export default function OrderClient({ allFoods , initialFavoritedIds  }: OrderClientProps) {
  const [selectedType, setSelectedType] = useState<FoodType | null>(FoodType.PERSIAN);
const cart = useCartState(); // برای گرفتن داده‌ها
const { addToCart } = useCartDispatch(); // برای گرفتن توابع
     
       // ۱. داده‌ها را از ساختار دیتابیس به ساختار UI تبدیل می‌کنیم
  const cartItemsForUI = cart?.items?.map(dbItem => ({
    ...dbItem.food, // تمام پراپرتی‌های food را کپی می‌کنیم
    price: Number(dbItem.food.price), // قیمت را به number تبدیل می‌کنیم
    quantity: dbItem.quantity, // quantity را از آیتم اصلی اضافه می‌کنیم
  })) || [];


     const items = cart?.items || [] 


  // فیلتر کردن غذاها بر اساس نوع انتخاب شده
  const filteredFoods = allFoods.filter((food) => food.type === selectedType);

  return (
    <div className="flex-5 p-8">
      <h1 className="text-3xl font-bold mb-6">ثبت سفارش جدید</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* بخش اصلی: انتخاب نوع و منوی غذا */}
        <div className="lg:col-span-2 ">
          <FoodTypeSelector selectedType={selectedType} onSelectType={setSelectedType} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {filteredFoods.map((food) => (
              <FoodItemCard key={food.id} food={food} isFavorited={initialFavoritedIds.has(food.id)}/>
       
              
             
              
            ))}
          </div>
        </div>

        {/* بخش سایدبار: سبد خرید */}
        <div className="lg:col-span-1 ">
          <ShoppingCart
            cartItems={cartItemsForUI}  
            
            />
        </div>
      </div>
    </div>
  );
}