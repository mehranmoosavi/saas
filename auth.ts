import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prisma" // مطمئن شوید این مسیر به فایل پریزما شما صحیح است
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import { schema } from "@/schema";


const adapter = PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "database" },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email' , type: 'text'},
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validatedCredentials = schema.parse(credentials);
        

        if (!credentials?.email || !credentials.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email:validatedCredentials.email },
        });

        if (!user || !user.hashedPassword) return null;

        const isPasswordCorrect = await bcrypt.compare(
          validatedCredentials.password,
          user.hashedPassword
        );
        console.log(isPasswordCorrect)

        if (isPasswordCorrect) return user;
        
        return null;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],  
  callbacks: {
    async jwt({ token, account,user }) {
      console.log({userrrr:user})
      console.log({tokennnn:token})
    
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async signIn({user, account, profile, email, credentials}){

      return true
    },
    async redirect({url, baseUrl}){

      return url
    },
    async session({ session, token }) {

      return session
    }
  },
    jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 ),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,

});
