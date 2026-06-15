import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-google-client-secret',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar || user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Check if user already exists
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // Update avatar if provided by Google
            if (user.image && !existingUser.avatar) {
              await db.user.update({
                where: { id: existingUser.id },
                data: { avatar: user.image, image: user.image },
              });
            }
            // Create account link if not exists
            const existingAccount = await db.account.findFirst({
              where: { provider: 'google', providerAccountId: account.providerAccountId },
            });
            if (!existingAccount) {
              await db.account.create({
                data: {
                  userId: existingUser.id,
                  provider: 'google',
                  providerAccountId: account.providerAccountId,
                  type: 'oauth',
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            }
          } else {
            // Create new user from Google profile
            const newUser = await db.user.create({
              data: {
                email: user.email!,
                name: user.name || 'Google User',
                avatar: user.image,
                image: user.image,
                role: 'user',
                emailVerified: new Date(),
              },
            });
            // Create account link
            await db.account.create({
              data: {
                userId: newUser.id,
                provider: 'google',
                providerAccountId: account.providerAccountId,
                type: 'oauth',
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role || 'user';
        token.id = user.id;
      }
      if (trigger === 'update' && session) {
        token.role = session.role;
      }
      // Always fetch latest role from DB
      if (token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { role: true, id: true, avatar: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
          token.picture = dbUser.avatar;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.image = token.picture || null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'luxe-fashion-demo-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
};
