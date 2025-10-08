import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { addAddress, deleteAddress } from '@/app/action';

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session?.user?.id },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">مدیریت آدرس‌ها</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* فرم افزودن آدرس جدید */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">افزودن آدرس جدید</h2>
          <form action={addAddress} className="space-y-4">
            <input name="street" placeholder="خیابان اصلی" required className="w-full p-2 border rounded" />
            <input name="city" placeholder="شهر" required className="w-full p-2 border rounded" />
            <input name="postalCode" placeholder="کد پستی" required className="w-full p-2 border rounded" />
            <textarea name="details" placeholder="جزئیات بیشتر (پلاک، واحد)" className="w-full p-2 border rounded"></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
              افزودن
            </button>
          </form>
        </div>

        {/* لیست آدرس‌های موجود */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">آدرس‌های شما</h2>
          <div className="space-y-4">
            {addresses.map(address => (
              <div key={address.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{address.street}, {address.city}</p>
                  <p className="text-sm text-gray-500">{address.postalCode}</p>
                  <p className="text-sm text-gray-500">{address.details}</p>
                </div>
                <form action={deleteAddress.bind(null, address.id)}>
                  <button type="submit" className="text-red-500 hover:text-red-700">حذف</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}