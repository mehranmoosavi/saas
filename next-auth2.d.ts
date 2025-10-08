// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// تایپ‌های پیش‌فرض NextAuth را گسترش می‌دهیم
declare module "next-auth" {
  /**
   * این اینترفیس تایپ آبجکت Session را که در کلاینت استفاده می‌شود،
   * گسترش می‌دهد.
   */
  interface Session {
    user: {
      id: string;
      role: string; 
      createdAt :Date
      updatedAt :Date// فیلد سفارشی خود را اینجا اضافه کنید
    } & DefaultSession["user"]; // فیلدهای پیش‌فرض را حفظ کنید
  }

  /**
   * این اینترفیس تایپ آبجکت User را که از دیتابیس یا provider
   * برمی‌گردد، گسترش می‌دهد.
   */
  interface User extends DefaultUser {
    role: string; // فیلد سفارشی خود را اینجا هم اضافه کنید
  }
}