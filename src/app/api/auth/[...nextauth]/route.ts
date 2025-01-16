import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/util/common/database";

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} environment variable is required but not provided.`,
    );
  }
  return value;
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: getRequiredEnvVar("GITHUB_CLIENT_ID"),
      clientSecret: getRequiredEnvVar("GITHUB_CLIENT_SECRET"),
    }),
    GoogleProvider({
      clientId: getRequiredEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnvVar("GOOGLE_CLIENT_SECRET"),
    }),
    CredentialsProvider({
      async authorize(credentials) {
        let db = (await connectDB).db("user");
        let user = await db
          .collection("account")
          .findOne({ email: credentials.email });
        if (!user) {
          throw new Error("존재하지 않는 이메일 주소입니다");
        }
        const pwcheck = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!pwcheck) {
          console.log("비번틀림");
          throw new Error("비밀번호가 틀렸습니다.");
        }
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.email = user.email;
      }
      return token;
    },

    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
