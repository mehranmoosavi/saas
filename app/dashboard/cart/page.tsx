import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import CartClient from './CartClient'; // کامپوننت کلاینت که در ادامه می‌سازیم

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) {
    return <div>لطفا وارد شوید.</div>;
  }

  // آدرس‌های کاربر را در سرور واکشی می‌کنیم
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
  });

  return <CartClient addresses={addresses} />;
}