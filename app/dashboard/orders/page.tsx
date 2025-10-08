import prisma from '@/lib/prisma';
import OrderClient from './OrderClient'; // کامپوننت کلاینت که در مرحله بعد می‌سازیم
import { auth } from '@/auth';

// این یک Server Component است و به صورت async تعریف می‌شود
export default async function OrderPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const [allFoods, averageRatings, favoriteFoods] = await Promise.all([
    prisma.food.findMany(),
    prisma.review.groupBy({
      by: ['foodId'],
      _avg: { rating: true },
    }),
    userId ? prisma.favoriteFood.findMany({ where: { userId } }) : []
  ]);
  const ratingsMap = new Map(
    averageRatings.map(r => [r.foodId, r._avg.rating ])
  );

const foodsWithRatings = allFoods.map(food => ({
    ...food,
    price: food.price.toNumber(),
    averageRating: ratingsMap.get(food.id) || 0, // اگر غذایی امتیاز نداشت، صفر در نظر می‌گیریم
  }));
  

  const favoritedFoodIds = new Set(favoriteFoods.map(fav => fav.foodId));
  const plainFoods = allFoods.map(food => {
    const avgRatingDecimal = ratingsMap.get(food.id);
    return {
      ...food,
      price: food.price.toNumber(), // تبدیل قیمت
      averageRating: avgRatingDecimal ? avgRatingDecimal : 0, // تبدیل میانگین امتیاز
    };
  });

  return <OrderClient 
             allFoods={plainFoods} 
            initialFavoritedIds={favoritedFoodIds} 
         />;
}
