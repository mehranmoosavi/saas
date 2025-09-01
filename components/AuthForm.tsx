// // components/AuthForm.tsx

// import { signIn } from '@/auth';


// export default function AuthForm(){

// return <form action={async (formdata)=>{
// 'use server'
// console.log(formdata)
// try{let result = await signIn('credentials',formdata)


// }catch(err){
//   console.log(err)
// }
// }}>

// <input name='email' placeholder="email" type="text" required />
// <input name='password'  placeholder="Password" type="text" required />
// <button title='submit' type='submit'>sign in</button>



// </form>

// }



// export default function AuthForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter(); // ۲. هوک را فراخوانی کنید


//   const handleRegister = async () => {
//     // فراخوانی API ثبت‌نام

//     const response = await fetch('/api/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password, name: 'New User' }),
//     });

//     if (response.ok) {
//       alert('Registration successful! Please sign in.');
//     } else {
//       alert('Registration failed.');
//     }
//   };

// await handleSign()

//   return (
//     <div>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//       />
//       <button type="button" onClick={handleSignIn}>Sign In</button>
//       <button type="button" onClick={handleRegister}>Register</button>
//     </div>
//   );
// }


// 'use client';

// import { signIn } from 'next-auth/react'; 
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AuthForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleRegister = async () => {
//     // فراخوانی API ثبت‌نام
//     const response = await fetch('/api/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password, name: 'New User' }),
//     });
//     if (response.ok) {
//       alert('Registration successful! Please sign in.');
//     } else {
//       alert('Registration failed.');
//     }
//   };

//   const handleSignIn = async () => {
//     setError(''); // پاک کردن خطای قبلی
//     try {
//       // ۲. استفاده از try...catch برای مدیریت خطا در نسخه ۵
//       const result = await signIn('credentials', {
//         redirect: false,
//         email,
//         password,
//       });

//       if (result?.error) {
//         // اگر خطایی از سرور برگردد (مثلاً رمز اشتباه)
//         setError('Invalid email or password. Please try again.');
//         return;
//       }
      
//       // اگر خطایی وجود نداشته باشد، به داشبورد هدایت کن
//       router.push('/dashboard');

//     } catch (error) {
//       // برای خطاهای غیرمنتظره شبکه
//       console.error("Sign in error:", error);
//       setError('An unexpected error occurred.');
//     }
//   };

//   return (
//     <div>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//       />
//       <button type="button" onClick={handleSignIn}>Sign In</button>
//       <button type="button" onClick={handleRegister}>Register</button>
      
//       {/* نمایش پیام خطا به کاربر */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// }


// components/AuthForm.tsx
'use client'
 
// import { useFormState } from 'react-dom'
import {useActionState} from 'react'
import { authenticate } from '@/app/action'
 
export default function AuthForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
 
  return (
    <form action={dispatch}>
      <div>
        <label htmlFor="email">Email</label>
        <div>
          <input
            id="email"
            // type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <div>
          <input
            id="password"
            // type="password"
            name="password"
            placeholder="Enter password"
            required
            // minLength={6}
          />
        </div>
      </div>
      <LoginButton />
      <div
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <p>{errorMessage}</p>
        )}
      </div>
    </form>
  )
}
 
function LoginButton() {

 
  return (
    <button title='a'>
      Log in
    </button>
  )
}
