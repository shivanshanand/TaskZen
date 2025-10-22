import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodbAdapter";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // adding user id to token on signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      //add user id to session
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
