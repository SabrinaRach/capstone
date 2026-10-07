import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClient from "../../../lib/mongodb.js";
import dbConnect from "../../../db/connect.js";
import UserPreference from "../../../db/models/UserPreference.js";
import { withProtectedPersonalData } from "../../../lib/authAdapter.js";
import { logError } from "../../../lib/logger.js";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: withProtectedPersonalData(MongoDBAdapter(mongoClient)),
  // NextAuth's default logger prints error details that can contain the
  // email address of the user signing in.
  logger: {
    error(code, metadata) {
      logError(`NextAuth error ${code}`, metadata);
    },
    warn(code) {
      console.warn(`NextAuth warning ${code}`);
    },
    debug() {},
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error",
  },
  providers: [
    process.env.VERCEL_ENV === "preview"
      ? CredentialsProvider({
          name: "credentials",
          credentials: {
            username: {
              label: "Username",
              type: "text",
              placeholder: "username",
            },
            password: {
              label: "Password",
              type: "password",
            },
          },
          async authorize(credentials) {
            if (
              credentials.username === "fisch" &&
              credentials.password === "fisch"
            ) {
              return {
                name: "Neuer Fisch",
                email: "test@example.com",
                id: "a1b2c3d4",
              };
            }

            return null;
          },
        })
      : GithubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
        }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, account, trigger, session }) {
      // NextAuth copies name, email and picture into the token by default;
      // the app only needs the user id (sub) and the locale.
      delete token.name;
      delete token.email;
      delete token.picture;

      // Entries/categories are owned by the raw GitHub account id (not the
      // adapter-generated user id). Keep that id stable so existing content
      // stays associated with its owner after adding the database adapter.
      if (account?.provider === "github" && account?.providerAccountId) {
        token.sub = account.providerAccountId;
      }

      // A client-side locale change calls useSession().update({ locale })
      // after already persisting the new value to the DB, so just mirror it
      // into the token here instead of round-tripping to the DB again.
      if (trigger === "update" && session?.locale) {
        token.locale = session.locale;
        return token;
      }

      // Load the user's remembered locale once, at sign-in, so it's
      // available on every subsequent request without a DB read.
      if (account && token.sub) {
        try {
          await dbConnect();
          const preference = await UserPreference.findOne({
            userId: token.sub,
          }).lean();
          token.locale = preference?.locale || "de";
        } catch (error) {
          logError("Failed to load locale preference", error);
          token.locale = token.locale || "de";
        }
      }

      return token;
    },
    // The client only needs the user id and locale; name, email and picture
    // are deliberately not exposed via /api/auth/session.
    async session({ session, token }) {
      session.user = {
        id: token.sub,
        locale: token.locale || "de",
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
