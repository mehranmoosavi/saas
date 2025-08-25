import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google"; // 1. این خط را تغییر دهید
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import client from "@/lib/prisma";
 const auth = NextAuth({
    session: {
    strategy: "database",
  },
  adapter: PrismaAdapter(client),
  providers: [
    // 2. این بلوک را جایگزین کنید
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // این بخش را برای تست اضافه کنید
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
        GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
     CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (isPasswordCorrect) {
          return user;
        }

        return null;
      },
    })
    
  ], secret: process.env.NEXTAUTH_SECRET,
  debug: true,
    events: {
    async signIn(message) {
      console.log('EVENT: signIn', message)
    },
    async createUser(message) {
      console.log('EVENT: createUser - User should be created now.', message)
    },
    async linkAccount(message) {
      console.log('EVENT: linkAccount - Account should be linked now.', message)
    },
    async session(message) {
      console.log('EVENT: session', message)
    },
    async error(message) {
      console.error('EVENT: error', message)
    },
  },
});

export {auth as GET, auth as POST,auth }


// app/api/auth/[...nextauth]/route.ts
// auth.ts (فایل جدید در ریشه پروژه)


// import { handlers } from "@/auth" // ایمپورت از فایل auth.ts که ساختیم
// export const { GET, POST } = handlers