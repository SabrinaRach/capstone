import { OAUTH_TOKEN_FIELDS } from "./authAdapter.js";
import { hashEmail, isEmailHash } from "./personalData.js";

const UNUSED_USER_FIELDS = ["name", "image"];

// Returns the MongoDB update that brings a user created before emails were
// hashed into the protected format, or null if nothing needs to change.
export function buildUserUpdate(user) {
  const update = {};

  if (typeof user.email === "string" && !isEmailHash(user.email)) {
    update.$set = { email: hashEmail(user.email) };
  }

  const fieldsToRemove = UNUSED_USER_FIELDS.filter((field) => field in user);

  if (fieldsToRemove.length > 0) {
    update.$unset = Object.fromEntries(
      fieldsToRemove.map((field) => [field, ""]),
    );
  }

  return Object.keys(update).length > 0 ? update : null;
}

// Returns the MongoDB update that removes stored OAuth tokens from an
// account, or null if there are none.
export function buildAccountUpdate(account) {
  const fieldsToRemove = OAUTH_TOKEN_FIELDS.filter((field) => field in account);

  if (fieldsToRemove.length === 0) {
    return null;
  }

  return {
    $unset: Object.fromEntries(fieldsToRemove.map((field) => [field, ""])),
  };
}
