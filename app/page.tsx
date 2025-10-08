// 'use client'
// import Image from "next/image";
// import { useSession, signIn, signOut } from 'next-auth/react'
// import Link from 'next/link'
// import CustomSlider from "@/components/CustomSlider";


// export default function Home() {
//    const { data: session, status } = useSession()
//    console.log(session)
//      if (status === 'loading') {
//     return <p>Loading...</p>
//     // یا یک کامپوننت اسکلتی (Skeleton Component)
//   }
//   return (
//   <><div className="flex flex-col gap-0.5 p-10">
//   <div className="p-10">
//     <CustomSlider/>
//     </div>
//     <div className="flex justify-center bg-blue-700"><Link href='/dashboard' className="">برو به خرید </Link></div>

//     </div>
//   </>)
// }
import { auth } from '@/auth'; // تابع برای گرفتن سشن در سرور
import Link from 'next/link';
import CustomSlider from '@/components/CustomSlider'; // اسلایدر عکسی که ساختیم

export default async function HomePage() {
  // ۱. اطلاعات سشن کاربر را در سرور واکشی می‌کنیم
  const session = await auth();
  const userRole = session?.user?.role;

  let buttonText = 'شروع خرید';
  let buttonHref = '/dashboard/orders'; // لینک پیش‌فرض برای کاربر عادی

  // ۲. بر اساس نقش کاربر، متن و لینک دکمه را تعیین می‌کنیم
  if (userRole === 'ADMIN' || userRole === 'OWNER') {
    buttonText = 'ورود به داشبورد مدیریت';
    buttonHref = '/dashboard/admin'; // ادمین/صاحب به داشبورد ادمین هدایت می‌شود
  } else if (!session) {
    buttonText = 'ورود / ثبت نام';
    buttonHref = '/api/auth/signin'; // اگر کاربر لاگین نبود، به صفحه ورود هدایت می‌شود
  }

  return (
    <div>
      {/* بخش هدر در layout اصلی قرار دارد */}
      
      {/* بخش اسلایدر عکس */}
      <section className="py-12 px-0 md:py-10 md:px-30">
        <CustomSlider />
      </section>

      {/* بخش فراخوان (Call to Action) */}
      <section className="text-center ">
        <h2 className="text-4xl font-extrabold mb-2">
          بهترین طعم‌ها، فقط با یک کلیک
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
          از منوی متنوع ما انتخاب کنید و سفارش خود را به راحتی ثبت کنید. تحویل سریع و با کیفیت را با ما تجربه کنید.
        </p>
        
        {/* ۳. دکمه شرطی را رندر می‌کنیم */}
        <Link 
          href={buttonHref}
          className="bg-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          {buttonText}
        </Link>
      </section>
      
      {/* می‌توانید بخش‌های دیگری مانند "غذاهای محبوب" را اینجا اضافه کنید */}
    </div>
  );
}