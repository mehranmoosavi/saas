'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { updateUserProfile } from '@/app/action';
import type { User } from 'next-auth';
type UserState = User | null;
// Context برای State (داده‌ها)
const UserStateContext = createContext<UserState>(null);

// Context برای Dispatch (توابع)
const UserDispatchContext = createContext<{
  updateProfile: (data: { name: string; image?: string }) => Promise<void>;
} | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // const [user, setUser] = useState(initialUser);
  // const { update: updateSession } = useSession();
    const { data:session, status, update: updateSession } = useSession();
console.log(session)
      const user = session?.user || null;
      

  // همگام‌سازی state با prop ورودی
  // useEffect(() => {
  //   setUser(initialUser);
  // }, [initialUser]);

  const handleUpdateProfile = useCallback(async (data: { name: string; image?: string }) => {

    const result = await updateUserProfile(data);
    if (result.success) {
      await updateSession(data);
      // setUser(prev => prev ? { ...prev, ...data } : null);
      alert(result.message);
    } else {
      alert(result.message);
    }
  }, [updateSession]);

  return (
    <UserDispatchContext.Provider value={{ updateProfile: handleUpdateProfile,  }}>
      <UserStateContext.Provider value={user}>
        {children}
      </UserStateContext.Provider>
    </UserDispatchContext.Provider>
  );
}

// هوک‌های سفارشی برای دسترسی آسان
export function useUserState() {
  return useContext(UserStateContext);
}
export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (!context) throw new Error('useUserDispatch must be used within a UserProvider');
  return context;
}
