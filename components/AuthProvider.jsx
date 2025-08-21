// components/AuthProvider.jsx
'use client'; // این خط برای کامپوننت‌های سمت کلاینت ضروری است

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}