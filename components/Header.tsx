'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCartState } from '@/contexts/CartContext';
import { useUserState } from '@/contexts/UserContext';

// تعریف پراپ‌های ورودی کامپوننت
interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  // گرفتن state ها از کانتکست‌های مربوطه
  const { status } = useSession();
  const cart = useCartState();
  const user = useUserState();
  
  // state محلی برای باز و بسته بودن منوی پروفایل
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // محاسبه تعداد آیتم‌های سبد خرید
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // return (
  //   <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
  //     {/* دکمه منوی همبرگری برای موبایل */}
  //     <button title='a' onClick={onMenuClick} className="md:hidden p-2 rounded-md hover:bg-gray-100">
  //       <Menu className="h-6 w-6 text-gray-700" />
  //     </button>

  //     {/* این div برای این است که در حالت دسکتاپ، جای دکمه همبرگری خالی بماند و آیتم‌ها در سمت راست باشند */}
  //     <div className="flex-1 flex justify-end items-center space-x-6">
        
  //       {/* آیکون سبد خرید */}
  //       <Link href="/dashboard/cart" className="relative p-2 rounded-full hover:bg-gray-100">
  //         <ShoppingCart className="h-6 w-6 text-gray-700" />
  //         {itemCount > 0 && (
  //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
  //             {itemCount}
  //           </span>
  //         )}
  //       </Link>
        
  //       {/* بخش پروفایل کاربر */}
  //       {user && (
  //         <div className="relative">
  //           <button 
  //             onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
  //             className="flex items-center space-x-2 focus:outline-none"
  //           >
  //             <img
  //               src={user.image || `https://ui-avatars.com/api/?name=${user.name?.charAt(0) || 'U'}&background=random`}
  //               alt="Profile"
  //               className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
  //             />
  //             <span className="hidden sm:block font-medium text-gray-800">{user.name}</span>
  //           </button>

  //           {/* منوی Dropdown پروفایل */}
  //           {isProfileMenuOpen && (
  //             <div 
  //               className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
  //               onMouseLeave={() => setIsProfileMenuOpen(false)}
  //             >
  //               <Link 
  //                 href="/dashboard/profile" 
  //                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  //                 onClick={() => setIsProfileMenuOpen(false)}
  //               >
  //                 پروفایل
  //               </Link>
  //               <button
  //                 onClick={() => signOut()}
  //                 className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
  //               >
  //                 خروج
  //               </button>
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   </header>
  // );
return <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        FoodApp
      </Link>
      <nav className="flex items-center space-x-6">
        {status === 'loading' && (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        )}

        {status === 'unauthenticated' && (
          <div className="flex items-center space-x-4">
            <Link href="/api/auth/signin" className="font-semibold text-gray-700 hover:text-blue-600">
              ورود
            </Link>
            <Link href="/signup" className="font-semibold text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
              ثبت نام
            </Link>
          </div>
        )}

        {status === 'authenticated' && user && (
          <>
            {/* آیکون سبد خرید */}
            <Link href="/dashboard/cart" className="relative p-2 rounded-full hover:bg-gray-100">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* آیکون پروفایل */}
            <Link href="/dashboard/profile">
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${user.name?.charAt(0) || 'U'}`}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500"
              />
            </Link>
          </>
        )}
      </nav>
    </header>
}