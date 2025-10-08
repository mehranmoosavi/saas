import type { Prisma } from '@prisma/client';

// این "شکل" یا "دستور پخت" کوئری ماست
const cartWithItemsAndFood = Prisma.validator<Prisma.OrderArgs>()({
  include: {
    items: {
      include: {
        food: true,
      },
    },
  },
});

// حالا از پریزما می‌خواهیم که بر اساس این دستور پخت، تایپ خروجی را برای ما بسازد
export type CartWithItems = Prisma.OrderGetPayload<typeof cartWithItemsAndFood>;