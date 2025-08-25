// app/api/test-prisma/route.ts
import { NextResponse } from 'next/server';
// مطمئن شوید که این import دقیقا مشابه فایل next-auth شماست
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Attempting to create a test user...');
    
    const newUser = await prisma.session.create({
      data: {
        sessionToken: 'Prisma Test User',
        userId: `1`,
        id:'1'
      },
    });

    console.log('Test user created successfully:', newUser);
    return NextResponse.json({ success: true, user: newUser });

  } catch (error) {
    console.error('!!! DATABASE WRITE ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to write to database.', error: error },
      { status: 500 }
    );
  }
}