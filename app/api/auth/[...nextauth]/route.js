// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google"; // 1. این خط را تغییر دهید
import client from "@/lib/prisma";

console.log("SERVER-SIDE ENV VARS:", {
  googleId: process.env.GOOGLE_CLIENT_ID ? "Loaded" : "NOT LOADED",
  googleSecret: process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "NOT LOADED",
  nextAuthUrl: process.env.NEXTAUTH_URL,
});

const handler = NextAuth({
  adapter: PrismaAdapter(client),
  providers: [
    // 2. این بلوک را جایگزین کنید
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };