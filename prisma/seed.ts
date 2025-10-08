import { PrismaClient, FoodType } from '@prisma/client';

const prisma = new PrismaClient();

const sampleFoods = [
  {
    name: 'چلوکباب کوبیده',
    type: FoodType.PERSIAN,
    description: 'دو سیخ کباب کوبیده گوشت مخلوط گوسفند و گوساله به همراه برنج ایرانی و گوجه کبابی',
    price: 250000.00,
    stock: 50,
    imageUrl: '/images/koobideh.jpg',
  },
    {
    name: 'چیزبرگر کلاسیک',
    type: FoodType.FAST_FOOD,
    description: 'برگر گوشت خالص ۱۸۰ گرمی، پنیر گودا، کاهو، گوجه، خیارشور و سس مخصوص',
    price: 185000.00,
    stock: 100,
    imageUrl: '/images/cheeseburger.jpg',
  },
  {
    name: 'سوشی سالمون نیگیری',
    type: FoodType.JAPANESE,
    description: 'دو تکه سوشی نیگیری با برش تازه ماهی سالمون روی برنج مخصوص سوشی',
    price: 150000.00,
    stock: 30,
    imageUrl: '/images/sushi.jpg',
  },
  {
    name: 'نوشابه کوکاکولا',
    type: FoodType.DRINKING,
    description: 'نوشابه گازدار ۳۰۰ میلی‌لیتری',
    price: 20000.00,
    stock: 200,
    imageUrl: '/images/coke.jpg',
  },
  // --- غذاهای ایرانی ---
  {
    name: 'قورمه سبزی',
    type: 'PERSIAN',
    description: 'خورشت سبزیجات معطر با لوبیا قرمز، لیمو عمانی و تکه‌های گوشت گوساله',
    price: 280000.00,
    stock: 40,
    imageUrl: '/images/ghormeh-sabzi.jpg',
  },
  {
    name: 'جوجه کباب',
    type: 'PERSIAN',
    description: 'یک سیخ جوجه کباب زعفرانی بدون استخوان به همراه برنج ایرانی و گوجه کبابی',
    price: 265000.00,
    stock: 60,
    imageUrl: '/images/joojeh-kebab.jpg',
  },

  // --- فست فود ---
  {
    name: 'سیب زمینی سرخ کرده',
    type: 'FAST_FOOD',
    description: 'سیب زمینی خلالی سرخ شده به همراه سس کچاپ',
    price: 75000.00,
    stock: 150,
    imageUrl: '/images/fries.jpg',
  },
  {
    name: 'ساندویچ مرغ گریل',
    type: 'FAST_FOOD',
    description: 'فیله مرغ گریل شده، پنیر، کاهو و سس مخصوص در نان باگت',
    price: 195000.00,
    stock: 70,
    imageUrl: '/images/chicken-sandwich.jpg',
  },
  
  // --- غذاهای ژاپنی ---
  {
    name: 'رامن میسو',
    type: 'JAPANESE',
    description: 'سوپ نودل ژاپنی با طعم میسو، به همراه گوشت، تخم مرغ و سبزیجات تازه',
    price: 350000.00,
    stock: 25,
    imageUrl: '/images/ramen.jpg',
  },
  {
    name: 'تمپورا میگو',
    type: 'JAPANESE',
    description: 'چهار عدد میگوی سوخاری شده به روش ژاپنی به همراه سس مخصوص',
    price: 220000.00,
    stock: 35,
    imageUrl: '/images/tempura.jpg',
  },

  // --- نوشیدنی‌ها ---
  {
    name: 'دوغ',
    type: 'DRINKING',
    description: 'نوشیدنی سنتی بر پایه ماست، گازدار و همراه با نعنا',
    price: 25000.00,
    stock: 120,
    imageUrl: '/images/doogh.jpg',
  },
  {
    name: 'آب معدنی',
    type: 'DRINKING',
    description: 'آب آشامیدنی معدنی ۵۰۰ میلی‌لیتری',
    price: 15000.00,
    stock: 300,
    imageUrl: '/images/water.jpg',
  },
];


async function main() {
  console.log('Start seeding...');
  await prisma.food.deleteMany({});
  console.log('Cleaned the Food table.');

  for (const food of sampleFoods) {
    try {
      await prisma.food.create({
        data: food,
      });
      console.log(`✅ SUCCESS: Created ${food.name}`);
    } catch (error) {
      console.error(`❌ ERROR creating ${food.name}:`);
      // این خط، متن کامل خطای پریزما را چاپ می‌کند
      console.error(error); 
    }
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


