import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function getSubdomainFromHostname(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Split by dots
  const parts = host.split('.');
  
  // If we have at least 3 parts (subdomain.domain.tld), return the subdomain
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}

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
          include: {
            subdomain: true
          }
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
          subdomain: adminUser.subdomain?.subdomain ?? undefined,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.subdomainId = (user as any).subdomainId;
        token.subdomain = (user as any).subdomain;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).subdomainId = (token as any).subdomainId;
        (session.user as any).subdomain = (token as any).subdomain;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};



