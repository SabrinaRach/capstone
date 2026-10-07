import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  hashEmail,
  isEmailHash,
  redactPersonalData,
} from "../lib/personalData.js";

const SECRET = "test-secret-with-at-least-32-characters";

describe("hashEmail", () => {
  beforeEach(() => {
    vi.stubEnv("EMAIL_HASH_SECRET", SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not contain the email address or parts of it", () => {
    const hash = hashEmail("jane.doe@example.com");

    expect(hash).not.toContain("jane");
    expect(hash).not.toContain("example");
    expect(hash).not.toContain("@");
    expect(hash).toMatch(/^hmac-sha256:[0-9a-f]{64}$/);
  });

  it("returns the same hash for the same address, ignoring case and spaces", () => {
    expect(hashEmail(" Jane.Doe@Example.com ")).toBe(
      hashEmail("jane.doe@example.com"),
    );
  });

  it("returns different hashes for different addresses", () => {
    expect(hashEmail("a@example.com")).not.toBe(hashEmail("b@example.com"));
  });

  it("depends on the secret, so hashes can't be precomputed without it", () => {
    const hash = hashEmail("jane@example.com");

    vi.stubEnv("EMAIL_HASH_SECRET", "another-secret-with-at-least-32-chars");

    expect(hashEmail("jane@example.com")).not.toBe(hash);
  });

  it("returns an existing hash unchanged", () => {
    const hash = hashEmail("jane@example.com");

    expect(isEmailHash(hash)).toBe(true);
    expect(hashEmail(hash)).toBe(hash);
  });

  it("refuses to hash without a sufficiently long secret", () => {
    vi.stubEnv("EMAIL_HASH_SECRET", "");
    expect(() => hashEmail("jane@example.com")).toThrow(/EMAIL_HASH_SECRET/);

    vi.stubEnv("EMAIL_HASH_SECRET", "too-short");
    expect(() => hashEmail("jane@example.com")).toThrow(/EMAIL_HASH_SECRET/);
  });
});

describe("redactPersonalData", () => {
  it("removes email addresses from strings", () => {
    expect(redactPersonalData("Failed to send to jane@example.com")).toBe(
      "Failed to send to [redacted email]",
    );
  });

  it("removes email addresses from errors and nested objects", () => {
    const error = new Error("Invalid recipient jane@example.com");
    error.details = { to: "john@example.org" };

    const output = redactPersonalData({ error });

    expect(output).not.toContain("jane@example.com");
    expect(output).not.toContain("john@example.org");
    expect(output).toContain("Invalid recipient");
  });
});
