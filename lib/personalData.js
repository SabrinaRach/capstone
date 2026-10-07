import { createHmac } from "node:crypto";
import { inspect } from "node:util";

// Email addresses are only stored as a keyed hash (HMAC-SHA256). The same
// address always results in the same hash, so users can still be looked up
// at sign-in, but the address can't be recovered from the database. Unlike a
// plain SHA-256 hash, the secret key prevents guessing addresses by hashing
// lists of known emails.
const EMAIL_HASH_PREFIX = "hmac-sha256:";

function getEmailHashSecret() {
  const secret = process.env.EMAIL_HASH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "EMAIL_HASH_SECRET must be set to a random value of at least 32 characters.",
    );
  }

  return secret;
}

export function isEmailHash(value) {
  return typeof value === "string" && value.startsWith(EMAIL_HASH_PREFIX);
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Returns values that are already hashed unchanged: NextAuth passes the email
// of a stored user (i.e. its hash) back into the adapter during sign-in.
export function hashEmail(email) {
  if (typeof email !== "string" || !email) {
    return email;
  }

  if (isEmailHash(email)) {
    return email;
  }

  const hash = createHmac("sha256", getEmailHashSecret())
    .update(normalizeEmail(email))
    .digest("hex");

  return `${EMAIL_HASH_PREFIX}${hash}`;
}

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

// Turns any value (string, error, object) into a log-safe string without
// email addresses.
export function redactPersonalData(value) {
  const text =
    typeof value === "string"
      ? value
      : inspect(value, { depth: 4, breakLength: Infinity });

  return text.replace(EMAIL_PATTERN, "[redacted email]");
}
