import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import {
  authorizeWithPassword,
  authorizeWithVerificationCode,
} from "@/lib/auth-credentials";

export const { handlers, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        code: { type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();

        if (!email) {
          return null;
        }

        const code = String(credentials?.code ?? "").trim();

        if (code) {
          return authorizeWithVerificationCode(email, code);
        }

        const password = String(credentials?.password ?? "");

        if (!password) {
          return null;
        }

        return authorizeWithPassword(email, password);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(user.id) },
          select: { id: true, role: true, fullName: true, email: true },
        });

        if (dbUser) {
          token.sub = String(dbUser.id);
          token.role = dbUser.role;
          token.name = dbUser.fullName;
          token.email = dbUser.email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = String(token.role ?? "USER");
        session.user.name = String(token.name ?? "");
        session.user.email = String(token.email ?? "");
      }

      return session;
    },
  },
});
