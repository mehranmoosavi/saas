'use server'
import { signIn } from '@/auth';

  const handleSign = async (email:any,password:any) => {
   await signIn('credentials', {
      redirect: false, // برای مدیریت خطا در همین صفحه
      email,
      password,
    }
);}