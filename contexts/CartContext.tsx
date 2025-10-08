'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useTransition } from 'react';
import { addItemToCart, removeItemFromCart, finalizeCartAsOrder } from '@/app/action';
import type { CartWithItems } from '@/lib/types'; // تایپ دقیقی که از پریزما ساختیم

const CartStateContext = createContext<CartWithItems | null>(null);

const CartDispatchContext = createContext<{
  addToCart: (foodId: string) => void;
  removeItem: (foodId: string) => void;
  finalizeOrder: (method: 'PICKUP' | 'DELIVERY', addressId?: string) => Promise<{ success: boolean }>;
  
} | undefined>(undefined);

export function CartProvider({ children, initialCart }: { children: ReactNode; initialCart: CartWithItems | null }) {
  const [cart, setCart] = useState(initialCart);
  // const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  const handleAddToCart = useCallback(async(foodId: string) => {
      const updatedCart = await addItemToCart(foodId);
      setCart(updatedCart as CartWithItems);
    
  }, []);

  const handleRemoveItem = useCallback(async(foodId: string) => {
   
      const updatedCart = await removeItemFromCart(foodId);
      setCart(updatedCart as CartWithItems);
  }, []);

  const handleFinalizeOrder = useCallback(async (method: 'PICKUP' | 'DELIVERY', addressId?: string) => {
    let result = { success: false };

      result = await finalizeCartAsOrder(method, addressId);
      if (result.success) {
        setCart(null);
      }
    
    return result;
  }, []);

  return (
    <CartDispatchContext.Provider value={{ addToCart: handleAddToCart, removeItem: handleRemoveItem, finalizeOrder: handleFinalizeOrder,  }}>
      <CartStateContext.Provider value={cart}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

// هوک‌های سفارشی
export function useCartState() {
  return useContext(CartStateContext);
}
export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (!context) throw new Error('useCartDispatch must be used within a CartProvider');
  return context;
}