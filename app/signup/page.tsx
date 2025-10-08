'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signUp } from '@/app/action'; // مسیر اکشن خود را وارد کنید
import Link from 'next/link';
import { useActionState } from 'react';

// یک کامپوننت جدا برای دکمه submit می‌سازیم تا از useFormStatus استفاده کنیم
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? 'در حال ثبت نام...' : 'ثبت نام'}
    </button>
  );
}

export default function SignUpPage() {
  // از useFormState برای اتصال فرم به Server Action استفاده می‌کنیم
  const [errorMessage, formAction] = useActionState(signUp, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">ایجاد حساب کاربری</h1>
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="username">نام</label>
            <input id="username" name="username" type="text" required className="w-full px-4 py-2 mt-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="email">ایمیل</label>
            <input id="email" name="email" type="email" required className="w-full px-4 py-2 mt-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="password">رمز عبور</label>
            <input id="password" name="password" type="password" required minLength={6} className="w-full px-4 py-2 mt-2 border rounded-md" />
          </div>
          <div>
            <SubmitButton />
          </div>
          {errorMessage && (
            <p className="text-sm font-medium text-red-500 text-center">{errorMessage}</p>
          )}
        </form>
        <p className="text-center text-sm text-gray-600">
          از قبل حساب کاربری دارید؟{' '}
          <Link href="/api/auth/signin" className="font-medium text-blue-600 hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}