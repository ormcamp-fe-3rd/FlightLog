import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
