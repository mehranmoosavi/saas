    // app/actions.ts
'use server'

import { signIn } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { AuthError } from 'next-auth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { signInSchema } from "@/schema";
import { redirect } from 'next/navigation';


 
const prisma = new PrismaClient

 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
...Object.fromEntries(formData),
redirectTo: '/', // \<-- کاربر را به صفحه اصلی هدایت کن
});
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        case 'CallbackRouteError':
          return 'invalid email and pass'  
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }

}

export async function signUp( prevState: string | undefined,
  formData: FormData,
){
console.log(prevState)
try{
const name = formData.get('username')
const email = formData.get('email')
const password = formData.get('password')
const role = formData.get('role')

const credintals=signInSchema.parse({name,email,password,role})

     const exist = await prisma.user.findUnique({
      where: { email:credintals.email },
    });

    if (exist) {
      return 'user already exist';
    }
      const hashedPassword = await bcrypt.hash( credintals.password, 10);

    const user = await prisma.user.create({
      data: {
        email:credintals.email,
        name:credintals.name,
        hashedPassword,
        role:credintals.role
      },
    });
      
}catch(error){
  console.error(error);
    return 'something went wrong';
}
return 'registeration success'
}


