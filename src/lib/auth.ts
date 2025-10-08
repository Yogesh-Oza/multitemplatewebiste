import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const adminUser = await prisma.adminUser.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { email: credentials.username },
            ],
            isActive: true,
          },
        });

        if (!adminUser) return null;

        const passwordMatches = await bcrypt.compare(
          credentials.password,
          adminUser.password
        );

        if (!passwordMatches) return null;

        return {
          id: adminUser.id,
          name: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          subdomainId: adminUser.subdomainId ?? undefined,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.subdomainId = (user as any).subdomainId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).subdomainId = (token as any).subdomainId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};



