import { hashEmail, isEmailHash } from "./personalData.js";

// Fields of a user/account that are never stored: the app doesn't use the
// GitHub name or profile picture, and it never calls the GitHub API, so the
// OAuth tokens aren't needed after sign-in.
export const OAUTH_TOKEN_FIELDS = [
  "access_token",
  "refresh_token",
  "id_token",
  "expires_at",
  "refresh_token_expires_in",
  "token_type",
  "scope",
  "session_state",
];

function protectUser(user) {
  const { name, image, ...rest } = user;

  return rest.email ? { ...rest, email: hashEmail(rest.email) } : rest;
}

function protectAccount(account) {
  return Object.fromEntries(
    Object.entries(account).filter(([key]) => !OAUTH_TOKEN_FIELDS.includes(key)),
  );
}

// Wraps a NextAuth adapter so that email addresses are only stored and looked
// up as hashes, and unneeded personal data is never written.
export function withProtectedPersonalData(adapter) {
  return {
    ...adapter,

    createUser: (user) => adapter.createUser(protectUser(user)),

    updateUser: (user) => adapter.updateUser(protectUser(user)),

    async getUserByEmail(email) {
      const user = await adapter.getUserByEmail(hashEmail(email));

      if (user || isEmailHash(email)) {
        return user;
      }

      // Users created before emails were hashed are still stored with their
      // plain address until the migration script has run. They are found
      // here and protected on the fly, so they keep their account.
      const legacyUser = await adapter.getUserByEmail(email);

      if (!legacyUser) {
        return null;
      }

      return adapter.updateUser({
        id: legacyUser.id,
        email: hashEmail(email),
        name: null,
        image: null,
      });
    },

    linkAccount: (account) => adapter.linkAccount(protectAccount(account)),

    createVerificationToken: (verificationToken) =>
      adapter.createVerificationToken({
        ...verificationToken,
        identifier: hashEmail(verificationToken.identifier),
      }),

    useVerificationToken: (params) =>
      adapter.useVerificationToken({
        ...params,
        identifier: hashEmail(params.identifier),
      }),
  };
}
