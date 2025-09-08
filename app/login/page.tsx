import AuthForm from '@/components/AuthForm'; // مسیر کامپوننت خود را وارد کنید
import Providers from '@/components/googlegithub';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="emailpasslogin w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign In or Register
        </h1>
        <AuthForm />
      </div>
 <Providers/>
    </main>
  );
}