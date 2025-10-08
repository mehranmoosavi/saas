    // app/actions.ts
'use server'

import { signIn } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { AuthError } from 'next-auth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { signUpSchema } from "@/schema";
import { redirect } from 'next/navigation';
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache';
import { success } from 'zod/v4'
import { serializeCart } from "@/lib/cart-utils";
import { z } from 'zod'




 
const prisma = new PrismaClient

 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
...Object.fromEntries(formData),
redirectTo: '/', // \<-- کاربر را به صفحه اصلی هدایت کن
});
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        case 'CallbackRouteError':
          return 'invalid email and pass'  
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }

}

export async function signUp( prevState: string | undefined,
  formData: FormData,
){
console.log(prevState)
try{
const name = formData.get('username')
const email = formData.get('email')
const password = formData.get('password')
const Role = formData.get('role')

const credintals=signUpSchema.parse({name,email,password,Role})

     const exist = await prisma.user.findUnique({
      where: { email:credintals.email },
    });

    if (exist) {
      return 'user already exist';
    }
      const hashedPassword = await bcrypt.hash( credintals.password, 10);

    const user = await prisma.user.create({
      data: {
        email:credintals.email,
        name:credintals.name,
        hashedPassword,
        role:'USER'
      },
    });
      
}catch (error) {
    if (error instanceof z.ZodError) {
      return 'داده‌های ورودی نامعتبر است.';
    }
    console.error(error);
    return 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
  }
redirect("./dashboard")
}

type CartData = {
  foodId: string;
  quantity: number;
}[];

export async function createOrder(
  cartData: CartData, 
  deliveryMethod: 'PICKUP' | 'DELIVERY', 
  addressId?: string
)  {
  // ۱. گرفتن سشن کاربر در سرور
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'لطفاً ابتدا وارد شوید.' };
  }
  const userId = session.user.id;
  if (deliveryMethod === 'DELIVERY' && !addressId) {
    return { success: false, message: 'لطفاً یک آدرس برای تحویل انتخاب کنید.' };
  }

  if (!cartData || cartData.length === 0) {
    return { success: false, message: 'سبد خرید شما خالی است.' };
  }

  try {
    // ۲. استفاده از Transaction برای تضمین یکپارچگی داده‌ها
    const newOrder = await prisma.$transaction(async (tx) => {
      // ۳. محاسبه قیمت نهایی در سرور برای امنیت
      const foodIds = cartData.map(item => item.foodId);
      const foodsInDb = await tx.food.findMany({
        where: { id: { in: foodIds } },
      });

      let totalPrice = 0;
      for (const item of cartData) {
        const food = foodsInDb.find(f => f.id === item.foodId);
        if (!food) {
          throw new Error(`محصول با شناسه ${item.foodId} یافت نشد.`);
        }
        totalPrice += food.price * item.quantity;
      }

      // ۴. ایجاد سفارش اصلی
    

      // ۵. ایجاد آیتم‌های سفارش
      const order = await tx.order.create({
        data: {
          userId: userId,
          totalPrice: totalPrice,
          deliveryMethod: deliveryMethod, // فیلد جدید
          addressId: addressId,         // فیلد جدید
        },
      });
      await tx.orderItem.createMany({
        data: cartData.map(item => {
          const food = foodsInDb.find(f => f.id === item.foodId);
          return {
            orderId: order.id,
            foodId: item.foodId,
            quantity: item.quantity,
            price: food!.price, // قیمت در لحظه سفارش
          };
        }),
      });

      return order;
    });

    return { success: true, message: 'سفارش شما با موفقیت ثبت شد!', orderId: newOrder.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: 'خطایی در ثبت سفارش رخ داد.' };
  }
}

interface ProfileData {
  name: string;
  image?: string; // عکس پروفایل اختیاری است
}

export async function updateUserProfile(data: ProfileData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: 'شما وارد نشده‌اید.' };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        image: data.image,
      },
    });

    return { success: true, message: 'پروفایل شما با موفقیت به‌روزرسانی شد.' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'خطایی در به‌روزرسانی پروفایل رخ داد.' };
  }
}

export async function toggleFavorite(foodId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('شما وارد نشده‌اید.');
  }
  const userId = session.user.id;

  try {
    // چک می‌کنیم آیا این غذا قبلاً لایک شده یا نه
    const existingFavorite = await prisma.favoriteFood.findUnique({
      where: { userId_foodId: { userId, foodId } },
    });

    if (existingFavorite) {
      // اگر وجود داشت، آن را حذف کن (آنلایک)
      await prisma.favoriteFood.delete({
        where: { userId_foodId: { userId, foodId } },
      });
      console.log('Favorite removed');
    } else {
      // اگر وجود نداشت، آن را ایجاد کن (لایک)
      await prisma.favoriteFood.create({
        data: { userId, foodId },
      });
      console.log('Favorite added');
    }

    // این دستور به Next.js می‌گوید که داده‌های این صفحات را دوباره واکشی کند
    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/favorites');
    
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('خطایی در تغییر وضعیت علاقه‌مندی رخ داد.');
  }
}

export async function addAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const data = {
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    postalCode: formData.get('postalCode') as string,
    details: formData.get('details') as string,
    userId: session.user.id,
  };

  await prisma.address.create({ data });
  revalidatePath('/dashboard/addresses');
} 

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');
  
  await prisma.address.delete({
    where: { id: addressId, userId: session.user.id }, // تضمین می‌کند که کاربر فقط آدرس خود را پاک کند
  });
  revalidatePath('/dashboard/addresses');
}

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const cart = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      status: 'CART',
    },
    include: {
      items: {
        include: {
          food: true,
        },
      },
    },
  });
  const serializedCart = serializeCart(cart)
  return serializedCart;
}
// تابعی برای افزودن آیتم به سبد خرید
export async function addItemToCart(foodId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');
    const userId = session.user.id;

  const food = await prisma.food.findUnique({ where: { id: foodId } });

  if (!food) throw new Error('Food not found');

const updatedCart = await prisma.$transaction(async (tx) => {

    // ۱. سبد خرید کاربر را پیدا کن یا اگر وجود نداشت، یکی بساز
    let cart = await tx.order.findFirst({
      where: { userId, status: 'CART' },
    });

    if (!cart) {
      cart = await tx.order.create({
        data: { userId ,totalPrice:0,status: 'CART',},
      });
    }

    // ۲. از Upsert برای افزودن یا آپدیت آیتم استفاده کن
    await tx.orderItem.upsert({
      where: {
        // بر اساس کلید منحصر به فردی که در اسکیمای جدید ساختیم
        orderId_foodId: {
          orderId: cart.id,
          foodId: foodId,
        },
      },
      // اگر آیتم از قبل وجود داشت، تعدادش را یکی اضافه کن
      update: {
        quantity: { increment: 1 },
      },
      // اگر آیتم وجود نداشت، آن را با این مقادیر ایجاد کن
      create: {
        orderId: cart.id,
        foodId: food.id,
        quantity: 1,
        price: food.price,
      },
    });

    // ۳. سبد خرید کامل را برای برگرداندن به کلاینت، دوباره واکشی کن
    const finalCart = await tx.order.findFirst({
      where: { id: cart.id },
      include: { items: { include: { food: true } } },
    });

    return finalCart;
  });
  // ۴. به Next.js بگو که صفحات مربوطه را دوباره واکشی کند
  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard/cart');

    const serializedCart = serializeCart(updatedCart)
  return serializedCart;
}

export async function finalizeCartAsOrder(
  deliveryMethod: 'PICKUP' | 'DELIVERY', 
  addressId?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  // ۱. سبد خرید فعلی کاربر را پیدا کن
  const cart = await prisma.order.findFirst({
    where: { userId: session.user.id, status: 'CART' },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error('سبد خرید شما خالی است.');
  }

  // ۲. وضعیت آن را به PENDING تغییر بده و اطلاعات تحویل را اضافه کن
  const updatedOrder = await prisma.order.update({
    where: { id: cart.id },
    data: {
      status: 'PENDING', // وضعیت از سبد خرید به در حال انتظار تغییر کرد
      deliveryMethod: deliveryMethod,
      addressId: addressId,
    },
  });
  // ۳. صفحات مربوطه را برای نمایش داده‌های جدید، revalidate کن
  revalidatePath('/dashboard/cart');
  revalidatePath('/dashboard/orders'); // برای تاریخچه سفارش‌ها
  
  if (updatedOrder){return { success: true, order: updatedOrder };}else{
return {success:false}
  }
}

export async function removeItemFromCart(foodId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  // ۱. سبد خرید فعال کاربر را پیدا کن
  const cart = await prisma.order.findFirst({
    where: { userId: session.user.id, status: 'CART' },
  });

  if (cart) {
    // ۲. آیتم مورد نظر را از سبد خرید حذف کن
    await prisma.orderItem.deleteMany({
      where: {
        orderId: cart.id,
        foodId: foodId,
      },
    });
  }

  // ۳. سبد خرید آپدیت شده را برای به‌روزرسانی UI برگردان
  const updatedCart = await getCart(); // از تابع getCart که داشتیم استفاده می‌کنیم
  
  // revalidatePath('/dashboard/cart');
  return updatedCart;
}


export async function addReview(foodId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const rating = Number(formData.get('rating'));
  const text = formData.get('text') as string;
  const userId = session.user.id;
  
  if (!rating || !text) throw new Error('Rating and text are required.');

  // از upsert استفاده می‌کنیم تا اگر کاربر قبلاً نظر داده بود، نظرش آپدیت شود
  await prisma.review.upsert({
    where: {
      userId_foodId: { userId, foodId }
    },
    update: { rating, text },
    create: { userId, foodId, rating, text },
  });

  // به Next.js می‌گوییم که صفحه این غذا را revalidate کند
  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (food) {
    revalidatePath(`/food/${food.name}`);
  }
}