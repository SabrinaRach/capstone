import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildAccountUpdate,
  buildUserUpdate,
} from "../lib/personalDataMigration.js";
import { hashEmail } from "../lib/personalData.js";

describe("personal data migration", () => {
  beforeEach(() => {
    vi.stubEnv("EMAIL_HASH_SECRET", "test-secret-with-at-least-32-characters");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("hashes the plain email and removes name and picture", () => {
    expect(
      buildUserUpdate({
        email: "jane@example.com",
        name: "Jane",
        image: "https://example.com/jane.png",
        emailVerified: null,
      }),
    ).toEqual({
      $set: { email: hashEmail("jane@example.com") },
      $unset: { name: "", image: "" },
    });
  });

  it("leaves already migrated users unchanged", () => {
    expect(
      buildUserUpdate({ email: hashEmail("jane@example.com") }),
    ).toBeNull();
  });

  it("removes leftover empty name and picture fields", () => {
    expect(
      buildUserUpdate({
        email: hashEmail("jane@example.com"),
        name: null,
        image: null,
      }),
    ).toEqual({ $unset: { name: "", image: "" } });
  });

  it("removes stored OAuth tokens from accounts", () => {
    expect(
      buildAccountUpdate({
        provider: "github",
        providerAccountId: "4711",
        access_token: "gho_secret",
        refresh_token: "ghr_secret",
        scope: "read:user",
      }),
    ).toEqual({
      $unset: { access_token: "", refresh_token: "", scope: "" },
    });
  });

  it("leaves accounts without tokens unchanged", () => {
    expect(
      buildAccountUpdate({ provider: "github", providerAccountId: "4711" }),
    ).toBeNull();
  });
});
