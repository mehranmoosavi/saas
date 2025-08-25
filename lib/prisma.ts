// // lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// این خط به TypeScript می‌گوید که یک ویژگی به نام prisma می‌تواند روی شیء global وجود داشته باشد
declare global {
  var prisma: PrismaClient | undefined;
}

const client = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = client;
}

export default client;



// lib/prisma.ts (نسخه تستی ساده شده)
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// export default prisma;