    import { CartItem } from "@/contexts/CartContext";

interface ShoppingCartProps {
  cartItems: CartItem[];

}

export default function ShoppingCart({ cartItems,  }: ShoppingCartProps) {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">سبد خرید</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">سبد خرید شما خالی است.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()} x {item.quantity}</p>
              </div>
              <p className="font-bold">{(item.price * item.quantity).toLocaleString()} تومان</p>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center font-bold text-xl">
              <span>جمع کل:</span>
              <span>{totalPrice.toLocaleString()} تومان</span>
            </div>
            {/* <button  onClick={onFinalize}  disabled={isSubmitting || cartItems.length === 0}    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 font-semibold hover:bg-blue-700">
             {isSubmitting ? 'در حال ثبت...' : 'نهایی کردن سفارش'}
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}