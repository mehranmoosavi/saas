// middleware.ts
// import { auth } from '@/app/api/auth/[...nextauth]/route'; // ایمپورت از فایل auth.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

  // console.log(`--- Middleware triggered for: ${req.nextUrl.pathname} ---`);

  // const secret = process.env.NEXTAUTH_SECRET;
  // if (!secret) {
  //   // console.error('!!! CRITICAL ERROR: NEXTAUTH_SECRET is not available in the middleware.');
  //   // اگر سکرت وجود ندارد، اجازه بده درخواست ادامه پیدا کند تا خطای اصلی مشخص شود
  //   return NextResponse.next();
  // }

  // try {
  //   // تلاش برای خواندن توکن
  //   const token = await getToken({ req, secret });
  //   // console.log('Token successfully retrieved:', token);

  //    const publicRoutes = ['/login', '/register'];


  //   const isLoggedIn = !!token;
  //   const isAccessingProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');
  //    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  //   if (!isLoggedIn && isAccessingProtectedRoute) {
  //     // console.log('User is not logged in, redirecting to /login...');
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }
  //     if (isLoggedIn && isPublicRoute) {
  //   return NextResponse.redirect(new URL('/dashboard', req.url));
  // }


  // } catch (error) {
  //   // اگر در حین گرفتن توکن خطایی رخ داد، آن را ثبت کن
  //   // console.error('!!! ERROR inside middleware while calling getToken:', error);
  //   // برای جلوگیری از حلقه‌های بی‌پایان، اجازه بده درخواست ادامه پیدا کند
  //   return NextResponse.next();
  // }

  // console.log('--- Middleware finished, passing request through. ---');
  return NextResponse.next();
}

// matcher را برای تست موقتاً ساده‌تر می‌کنیم
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
