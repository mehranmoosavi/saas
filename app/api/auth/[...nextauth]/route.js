import { handlers } from "@/auth"

// این خط به Next.js می‌گوید که این مسیر را در محیط Node.js اجرا کند
// و خطای 'fs' not found را برطرف می‌کند.


export const { GET, POST } = handlers

// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google"; // 1. این خط را تغییر دهید
// import GitHubProvider from "next-auth/providers/github"
// import CredentialsProvider from "next-auth/providers/credentials"
// import bcrypt from 'bcrypt'
// import client from "@/lib/prisma";

//  export const { handlers, auth, signIn, signOut ,GET,POST } = NextAuth({
//     session: {
//     strategy: "database",
//   },
//   adapter: PrismaAdapter(client),
//   providers: [
//     // 2. این بلوک را جایگزین کنید
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       // این بخش را برای تست اضافه کنید
//       authorization: {
//         params: {
//           scope: "openid email profile",
//         },
//       },
//     }),
//         GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     }),
//      CredentialsProvider({
      
//       credentials: {
//         email: {  },
//         password: {  },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) {
//           return null;
//         }
//         const user = await prisma.user.findFirst({
//           where: { email: credentials.email },
//         });


//         if (!user || !user.hashedPassword) {
//           return null;
//         }
        



//        const isPasswordCorrect = await bcrypt.compare(
//           credentials.password,
//           user.hashedPassword
//         );


//         if (isPasswordCorrect) {
//                     return user
//         }
      
//         return null;
//       },
//     })
    
//   ], secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     // --- شروع تغییر کلیدی ---
//     // این callback بعد از authorize و قبل از ساخت نشست اجرا می‌شود
//     async signIn({ user, account }) {
//       console.log("--- SIGNIN CALLBACK TRIGGERED ---");
//       console.log("User Object received:", JSON.stringify(user, null, 2));
//       console.log("Account Object received:", JSON.stringify(account, null, 2));

//       // برای ورود با Credentials، آبجکت account باید null باشد
//       if (account?.provider === "credentials") {
//         console.log("This is a credentials sign-in. Proceeding...");
//       }
      
//       // همیشه true برگردانید تا فرآیند ادامه پیدا کند
//       return true;
//     },
//     // --- پایان تغییر کلیدی ---

//     session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id;
//       }
//       return session;
//     },
//   },
// });
