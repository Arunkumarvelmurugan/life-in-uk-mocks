import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUser } from "@/lib/supabase-users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Only runs on the initial sign-in, when Google's account/profile are present.
      if (account && profile?.sub && profile.email) {
        token.supabaseUserId = await upsertUser({
          googleSub: profile.sub,
          email: profile.email,
          name: profile.name,
          avatarUrl: (profile as { picture?: string }).picture,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (token.supabaseUserId) {
        session.user.id = token.supabaseUserId;
      }
      return session;
    },
  },
});
