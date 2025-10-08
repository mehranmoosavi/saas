import { auth } from '@/auth';
import { getCart } from '@/app/action';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import { serializeCart } from "@/lib/cart-utils";
import Sidebar from '@/components/sidebar';


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const [initialCart, session] = await Promise.all([
    getCart(),
    auth(),
  ]);

// const serializedCart = {

//  ...initialCart,

//  totalPrice: initialCart?.totalPrice.toNumber(),

//  items: initialCart?.items.map(item => ({

//  ...item,

//  price:item.price.toNumber(),
//  food:{...item.food,price:item.food.price.toNumber()}

//  })),

// };
// const serializedCart = serializeCart(initialCart)

    return    ( <>   
    <div className='flex'>
      <Sidebar isSidebarOpen={true} />
      {children}</div>
 </>  )
}