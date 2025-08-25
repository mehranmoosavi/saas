// components/AuthForm.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // فراخوانی API ثبت‌نام
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: 'New User' }),
    });
    if (response.ok) {
      alert('Registration successful! Please sign in.');
    } else {
      alert('Registration failed.');
    }
  };

  const handleSignIn = async () => {
    // فراخوانی NextAuth برای ورود
    const result = await signIn('credentials', {
      redirect: false, // برای مدیریت خطا در همین صفحه
      email,
      password,
    });

    if (result?.ok) {
      // می‌توانید کاربر را به صفحه داشبورد هدایت کنید
      window.location.href = '/dashboard';
    } else {
      alert('Sign in failed. Check your credentials.');
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}