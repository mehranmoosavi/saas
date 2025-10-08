import prisma from '@/lib/prisma';
import { addReview } from '@/app/action'
import Image from 'next/image';
import StarRating from '@/components/StarRating';
import { group } from 'console';
import { Star } from 'lucide-react';

export default async function FoodDetailPage({ params }: { params: { slug: string } }) {
    const foodName = decodeURIComponent(params.slug);
  const [food, ratingAggregation] = await Promise.all([
    // اطلاعات اصلی غذا و لیست نظرات
    prisma.food.findUnique({
      where: { name: foodName },
      include: {
        reviews: {
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    // میانگین امتیازات برای همین غذا
    prisma.review.aggregate({
      where: {
        food: {
          name: foodName,
        },
      },
      _avg: {
        rating: true,
      },
    }),
  ]);
  if (!food) {
    return <div>غذا یافت نشد.</div>;
  }

    const averageRating = ratingAggregation._avg.rating;
  
  // اکشن را با food.id از پیش تنظیم می‌کنیم
  const addReviewWithFoodId = addReview.bind(null, food.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* بخش جزئیات غذا */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 rounded-lg shadow-2xl">
        <Image src={food.imageUrl || ''} alt={food.name} width={300} height={300} className="rounded-lg object-cover" />
        <div>
          <div className='flex'><h1 className="text-4xl font-bold">{food.name}</h1>  {averageRating && (
            <div className="flex items-center space-x-2 my-4">
              <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500 mt-1">از {food.reviews.length} نظر</span>
            </div>
          )}</div>
          <p className="text-2xl text-green-600 font-semibold my-4">{Number(food.price).toLocaleString()} تومان</p>
          <p className="text-gray-600">{food.description}</p>
        </div>
      </div>
      
      {/* بخش افزودن نظر */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">نظر خود را ثبت کنید</h2>
        <form action={addReviewWithFoodId} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">امتیاز شما:</label>
            {/* یک سیستم ستاره‌ای ساده */}
            <StarRating />
          </div>
          <textarea name="text" required placeholder="نظر خود را بنویسید..." className="w-full p-2 border rounded-lg h-28"></textarea>
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold">ارسال نظر</button>
        </form>
      </div>

      {/* بخش نمایش نظرات */}
      <div>
        <h2 className="text-2xl font-bold mb-4">نظرات دیگران</h2>
        <div className="space-y-6">
          {food.reviews.map(review => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <img src={review.user.image || ''} alt={review.user.name || ''} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-bold">{review.user.name}</p>
                  <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
                </div>
              </div>
              <p className="text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}