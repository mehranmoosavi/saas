'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';
import Sidebar from './sidebar';
import Header from '@/components/Header';

export default function ClientLayoutWrapper({ children, session, initialCart }:any) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SessionProvider session={session}>
      <UserProvider>
        <CartProvider initialCart={initialCart}>
          <div className="flex min-h-screen">
            <div className="flex-1 flex flex-col">
              {/* تابع onMenuClick را اینجا به هدر پاس می‌دهیم */}
              <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
              <main className="flex-1  bg-gray-50">
                {children}
              </main>
            </div>
          </div>
        </CartProvider>
      </UserProvider>
    </SessionProvider>
  );
}