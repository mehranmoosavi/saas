// lib/cart-utils.js

export function serializeCart(cart) {
  // اگر سبد خرید وجود نداشت، null برگردان
  if (!cart) {
    return null;
  }

  
  // تمام منطق تبدیلی که قبلا نوشتیم را اینجا قرار بده
  const serialized = {
    ...cart,
    totalPrice: cart?.totalPrice ? cart.totalPrice.toNumber() : 0,
    items: cart?.items.map(item => ({
      ...item,
      price: item.food?.price ? item.food.price.toNumber() : 0 ,
      food: {
        ...item.food,
        price: item.food?.price ? item.food.price.toNumber() : 0,
      },
    })) || [],
  };

  return serialized;
}