//  // این صفحه باید کلاینت باشد تا از هوک useCart استفاده کند
// import { auth } from '@/auth';
// import prisma from '@/lib/prisma';
// import FoodItemCard from '@/components/FoodItemCard';
// import FavoriteButton from '@/components/FavoriteButton'; // دکمه جدید

// export default async function FavoritesPage() {
//   const session = await auth();
//   if (!session?.user) return <div>لطفا وارد شوید.</div>;

//   const favoriteFoods = await prisma.favoriteFood.findMany({
//     where: { userId: session.user.id },
//     include: {
//       food: true, // اطلاعات کامل غذا را هم می‌گیریم
//     },
//   });

//     const plainFavoriteFoods = favoriteFoods.map(fav => ({
//     ...fav,
//     food: {
//       ...fav.food,
//       price: fav.food.price.toNumber(), // تبدیل Decimal به number
//     }
//   }));

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">غذاهای مورد علاقه</h1>
//       {favoriteFoods.length === 0 ? (
//         <p>شما هنوز هیچ غذایی را به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {plainFavoriteFoods.map(({ food }) => (
//             <div key={food.id} className="relative">
//               <FoodItemCard
//                 food={food}
//                 isFavorited={true} 
//                 onAddToCart={() => {}} // شما منطق افزودن به سبد را اینجا پیاده می‌کنید
//               />
//               <FavoriteButton foodId={food.id} isFavorited={true} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import FavoritesClient from './FavoritesClient'; // کامپوننت کلاینت جدید

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) return <div>لطفا وارد شوید.</div>;

  const favoriteFoodsFromDb = await prisma.favoriteFood.findMany({
    where: { userId: session.user.id },
    include: {
      food: true,
    },
  });

    const foodIds = favoriteFoodsFromDb.map(fav => fav.foodId);
  const averageRatings = await prisma.review.groupBy({
    by: ['foodId'],
    where: { foodId: { in: foodIds } },
    _avg: { rating: true },
  });
  const ratingsMap = new Map(
    averageRatings.map(r => [r.foodId, r._avg.rating || 0])
  );

  // قیمت را به number تبدیل می‌کنیم
  const plainFavoriteFoods = favoriteFoodsFromDb.map(fav => ({
    ...fav,
    food: {
      ...fav.food,
      price: fav.food.price.toNumber(),
       averageRating: ratingsMap.get(fav.food.id) || 0,
    }
  }));

  return <FavoritesClient initialFavorites={plainFavoriteFoods} />;
}
