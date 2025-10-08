'use client';
import { Food as PrismaFood } from '@prisma/client';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';
import Link from 'next/link';
import { Star } from 'lucide-react';
import {  useCartDispatch } from '@/contexts/CartContext';
import { useTransition } from 'react';

type ClientFood = Omit<PrismaFood, 'price'> & {
  price: number;
  averageRating: number
};

interface FoodItemCardProps {
  food: ClientFood;
  isFavorited: boolean;
  onAddToCart: (id: string) => void;
}

export default function FoodItemCard({ food,isFavorited }: FoodItemCardProps) {
   const [isPending, startTransition] = useTransition(); 
 const { addToCart } = useCartDispatch(); // برای گرفتن توابع
  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
     startTransition(async () => { // ۳. استفاده محلی
      await addToCart(food.id);
    });
  };
  return (  <Link href={`/food/${encodeURIComponent(food.name)}`} className="block">

    <div className=" h-full relative border rounded-lg p-4 flex flex-col justify-between items-center shadow-md bg-white">

       <FavoriteButton foodId={food.id} isFavorited={isFavorited} />
        {food.averageRating > 0 && (
        <div className="absolute top-2 left-2 flex items-center space-x-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          <Star size={12} className="fill-current" />
          {/* امتیاز را با یک رقم اعشار نمایش می‌دهیم */}
          <span>{food.averageRating.toFixed(1)}</span>
        </div>
      )}<div className='h-32'>
       <Image
        src={food.imageUrl || '/images/default-food.png'}
        alt={food.name}
        width={128}   // 2. اضافه کردن عرض
        height={128}  // 3. اضافه کردن ارتفاع
        className="object-cover rounded-md mb-4"
      /></div><h3 className="text-lg font-bold">{food.name}</h3>
      <p className="text-sm text-gray-600 my-2 text-center ">{food.description} </p>
      <div><p className="text-lg font-semibold text-green-600 my-2">{food.price.toLocaleString()} تومان</p>
      <button
        onClick={handleAddToCartClick} // <-- از تابع جدید استفاده می‌کنیم
          disabled={isPending}
        className="mt-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
      >
        افزودن به سبد
      </button></div>
    </div>
     </Link>

  );
}