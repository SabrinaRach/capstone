import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withProtectedPersonalData } from "../lib/authAdapter.js";
import { hashEmail } from "../lib/personalData.js";

// Minimal in-memory stand-in for the MongoDB adapter: stores exactly what it
// receives, so the tests can check what would end up in the database.
function createInMemoryAdapter() {
  const db = { users: [], accounts: [], verificationTokens: [] };
  let nextId = 1;

  return {
    db,
    async createUser(data) {
      const user = { ...data, id: String(nextId++) };
      db.users.push(user);
      return user;
    },
    async getUser(id) {
      return db.users.find((user) => user.id === id) || null;
    },
    async getUserByEmail(email) {
      return db.users.find((user) => user.email === email) || null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = db.accounts.find(
        (entry) =>
          entry.provider === provider &&
          entry.providerAccountId === providerAccountId,
      );
      return account
        ? db.users.find((user) => user.id === account.userId)
        : null;
    },
    async updateUser(data) {
      const user = db.users.find((entry) => entry.id === data.id);
      Object.assign(user, data);
      return user;
    },
    async linkAccount(account) {
      db.accounts.push(account);
      return account;
    },
    async createVerificationToken(token) {
      db.verificationTokens.push(token);
      return token;
    },
    async useVerificationToken({ identifier, token }) {
      const index = db.verificationTokens.findIndex(
        (entry) => entry.identifier === identifier && entry.token === token,
      );
      return index === -1 ? null : db.verificationTokens.splice(index, 1)[0];
    },
  };
}

function containsPlainEmail(db, email) {
  return JSON.stringify(db).toLowerCase().includes(email.toLowerCase());
}

describe("withProtectedPersonalData", () => {
  let base;
  let adapter;

  beforeEach(() => {
    vi.stubEnv("EMAIL_HASH_SECRET", "test-secret-with-at-least-32-characters");
    base = createInMemoryAdapter();
    adapter = withProtectedPersonalData(base);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("email sign-in", () => {
    it("stores neither the email nor the sign-in link identifier in plain text", async () => {
      // 1. Request a sign-in link
      expect(await adapter.getUserByEmail("jane@example.com")).toBeNull();
      await adapter.createVerificationToken({
        identifier: "jane@example.com",
        token: "hashed-token",
        expires: new Date(),
      });

      expect(containsPlainEmail(base.db, "jane@example.com")).toBe(false);

      // 2. Open the link: NextAuth verifies the token and creates the user
      const token = await adapter.useVerificationToken({
        identifier: "jane@example.com",
        token: "hashed-token",
      });
      expect(token).not.toBeNull();

      const user = await adapter.createUser({
        email: "jane@example.com",
        emailVerified: new Date(),
      });

      expect(user.email).toBe(hashEmail("jane@example.com"));
      expect(containsPlainEmail(base.db, "jane@example.com")).toBe(false);
    });

    it("returns a sign-in token that passes NextAuth's validity check", async () => {
      const expires = new Date(Date.now() + 60_000);
      await adapter.createVerificationToken({
        identifier: "jane@example.com",
        token: "hashed-token",
        expires,
      });

      // Same check as next-auth/core/routes/callback.js for email sign-in
      const paramIdentifier = "jane@example.com";
      const invite = await adapter.useVerificationToken({
        identifier: paramIdentifier,
        token: "hashed-token",
      });
      const invalidInvite =
        !invite ||
        invite.expires.valueOf() < Date.now() ||
        invite.identifier !== paramIdentifier;

      expect(invalidInvite).toBe(false);
      expect(base.db.verificationTokens).toHaveLength(0);
    });

    it("rejects a sign-in token for a different email address", async () => {
      await adapter.createVerificationToken({
        identifier: "jane@example.com",
        token: "hashed-token",
        expires: new Date(Date.now() + 60_000),
      });

      expect(
        await adapter.useVerificationToken({
          identifier: "john@example.com",
          token: "hashed-token",
        }),
      ).toBeNull();
    });

    it("finds a returning user by the email address they enter", async () => {
      const created = await adapter.createUser({ email: "jane@example.com" });

      const found = await adapter.getUserByEmail("Jane@Example.com");

      expect(found.id).toBe(created.id);
    });

    it("finds the user again when NextAuth passes the stored hash back in", async () => {
      const created = await adapter.createUser({ email: "jane@example.com" });

      const found = await adapter.getUserByEmail(created.email);

      expect(found.id).toBe(created.id);
    });

    it("keeps the account of a user stored before hashing and protects it", async () => {
      base.db.users.push({
        id: "legacy",
        email: "jane@example.com",
        name: "Jane",
        image: "https://example.com/jane.png",
      });

      const found = await adapter.getUserByEmail("jane@example.com");

      expect(found.id).toBe("legacy");
      expect(base.db.users[0]).toMatchObject({
        email: hashEmail("jane@example.com"),
        name: null,
        image: null,
      });
      expect(containsPlainEmail(base.db, "jane@example.com")).toBe(false);
    });
  });

  describe("GitHub sign-in", () => {
    it("stores only the hashed email and no name, picture or OAuth tokens", async () => {
      const user = await adapter.createUser({
        email: "jane@example.com",
        name: "Jane Doe",
        image: "https://avatars.example.com/jane.png",
        emailVerified: null,
      });
      await adapter.linkAccount({
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "4711",
        access_token: "gho_secret",
        refresh_token: "ghr_secret",
        expires_at: 123,
        token_type: "bearer",
        scope: "read:user,user:email",
      });

      expect(base.db.users[0]).toEqual({
        id: user.id,
        email: hashEmail("jane@example.com"),
        emailVerified: null,
      });
      expect(base.db.accounts[0]).toEqual({
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "4711",
      });
      expect(containsPlainEmail(base.db, "jane@example.com")).toBe(false);
      expect(JSON.stringify(base.db)).not.toContain("Jane Doe");
    });

    it("still finds the user by their GitHub account", async () => {
      const user = await adapter.createUser({ email: "jane@example.com" });
      await adapter.linkAccount({
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "4711",
      });

      const found = await adapter.getUserByAccount({
        provider: "github",
        providerAccountId: "4711",
      });

      expect(found.id).toBe(user.id);
    });
  });

  it("does not write name or picture when updating a user", async () => {
    const user = await adapter.createUser({ email: "jane@example.com" });

    await adapter.updateUser({
      id: user.id,
      name: "Jane",
      image: "https://example.com/jane.png",
      emailVerified: new Date(),
    });

    expect(base.db.users[0]).not.toHaveProperty("name");
    expect(base.db.users[0]).not.toHaveProperty("image");
  });
});
