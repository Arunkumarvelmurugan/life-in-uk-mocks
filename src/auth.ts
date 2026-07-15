import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUser } from "@/lib/supabase-users";
import { sendWelcomeEmail } from "@/lib/transactional-emails";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Only runs on the initial sign-in, when Google's account/profile are present.
      if (account && profile?.sub && profile.email) {
        const { userId, isNewUser } = await upsertUser({
          googleSub: profile.sub,
          email: profile.email,
          name: profile.name,
          avatarUrl: (profile as { picture?: string }).picture,
        });
        token.supabaseUserId = userId;
        if (isNewUser) {
          await sendWelcomeEmail({ email: profile.email, name: profile.name });
        }
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
