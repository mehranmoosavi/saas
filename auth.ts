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
      console.log('auth executed')

        // let e= credentials.a
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
//      user= {
//     id: '1',
//     name:'1',
//     email: '1',
//     role: 'ADMIN',
//     hashedPassword: '1',
//     emailVerified:  null,
//     image: null,
//     createdAt: new Date,
//     updatedAt:  new Date,
if (isPasswordCorrect) return user
// }
        
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
      console.log({tokennnnn:token})

  
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
      console.log({sessiontokennnn:token})

      return {
    id: session.userId,
    sessionToken: session.sessionToken,
    userId: session.userId,
    expires: session.expires,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      image: session.user.image,
      role: session.user.role,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
      
    }
  }
    }
  },
    jwt: {
      
    encode: async function (params) {
      console.log('jwt option executed')

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

  // ,
  // "overrides": {
  //   "@auth/core": "^0.31.0" 
  // }