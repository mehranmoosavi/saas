'use client';

import { useUserState, useUserDispatch } from '@/contexts/UserContext'; // ۱. ایمپورت هوک‌های سفارشی
import { useState, useEffect, useTransition } from 'react';

export default function ProfilePage() {
  // ۲. state و توابع را از کانتکست‌های جداگانه می‌گیریم
  const user = useUserState();
  const { updateProfile } = useUserDispatch();
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ۳. تابع آپدیت را از کانتکست فراخوانی می‌کنیم
    startTransition(async () => {
      await updateProfile({ name });
    });
  };

  if (!user) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">پروفایل کاربری</h1>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <img
            src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'U'}`}
            alt="عکس پروفایل"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
          title='a'
            type="submit"
            disabled={isPending} // ۴. از state لودینگ کانتکست استفاده می‌کنیم
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >  {isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </form>
      </div>
    </div>
  );
}