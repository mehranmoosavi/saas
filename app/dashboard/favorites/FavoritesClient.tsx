'use client';

import FoodItemCard from '@/components/FoodItemCard';
import { FoodType } from '@prisma/client';
import { useCartState, useCartDispatch } from '@/contexts/CartContext';

// تایپ داده‌های ورودی را تعریف می‌کنیم
type FavoriteFood = {
  food: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    stock: number;
    type:FoodType
    // ... بقیه فیلدهای food
  }
}

interface FavoritesClientProps {
  initialFavorites: FavoriteFood[];
}

export default function FavoritesClient({ initialFavorites }: FavoritesClientProps) {
const { addToCart } = useCartDispatch(); // برای گرفتن توابع// تابع افزودن به سبد را از کانتکست می‌گیریم

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">غذاهای مورد علاقه</h1>
      {initialFavorites.length === 0 ? (
        <p>شما هنوز هیچ غذایی را به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialFavorites.map(({ food }) => (
            <FoodItemCard
              key={food.id}
              food={food}
              isFavorited={true} 
              onAddToCart={addToCart} // تابع واقعی را پاس می‌دهیم
            />
          ))}
        </div>
      )}
    </div>
  );
}