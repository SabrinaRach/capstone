# Data Protection

This document describes which personal data the app stores, how it is protected and how to operate the protection safely.

## Personal data inventory

| Location | Data | Protection |
| --- | --- | --- |
| `users` | email address, `emailVerified` | Email stored only as HMAC-SHA256 hash. GitHub name and profile picture are not stored. |
| `accounts` | provider, provider account id (GitHub id), user id | OAuth access/refresh tokens are not stored. |
| `verification_tokens` | identifier (email), hashed sign-in token, expiry | Identifier stored only as HMAC-SHA256 hash. Expired entries are deleted automatically (TTL index). |
| `entries`, `categories`, `userPreferences` | user content, settings | Linked to the user only via a pseudonymous id (`owner`, `userId`). |
| Vercel Blob | uploaded images | Metadata (EXIF incl. GPS) and original filenames are removed on upload. Public, unguessable URLs. |
| Session cookie (JWT, encrypted) | user id, locale | Name, email and picture are removed from the token. |
| `/api/auth/session` | user id, locale | Name, email and picture are not exposed. |
| Server logs | errors | Email addresses are redacted (`lib/logger.js`), including NextAuth's own error logs. |

The app has no analytics, tracking, caches or error tracking services that could hold personal data.

## Email hashing

Email addresses are hashed with **HMAC-SHA256** using a secret key (`EMAIL_HASH_SECRET`), after normalising them (trimmed, lower case). Stored values look like `hmac-sha256:<64 hex characters>`.

- **Why a hash at all:** the app only needs the email address at the moment of sign-in, and the user enters it then. The address is hashed and used to look up the user; the sign-in link is sent to the address that was just entered. It never has to be read from the database.
- **Why HMAC instead of plain SHA-256:** email addresses are easy to guess. Without a secret, anyone with database access could hash lists of known addresses and compare. With HMAC, that requires the key, which is not stored in the database.
- **Why not bcrypt/Argon2:** they use a random salt per value, so the same address would produce a different hash every time and users could not be looked up.
- **One-way:** the original address cannot be recovered from the hash.

Implementation:

- `lib/personalData.js`: `hashEmail()`, `redactPersonalData()`
- `lib/authAdapter.js`: wraps the NextAuth MongoDB adapter. It hashes emails in `createUser`, `updateUser`, `getUserByEmail`, `createVerificationToken` and `useVerificationToken`, drops name and picture, and strips OAuth tokens in `linkAccount`.
- `hashEmail()` returns existing hashes unchanged, because NextAuth passes the stored (hashed) email of a user back into the adapter during sign-in.

Users stored before hashing was introduced are still found by their plain address and protected on the fly at their next sign-in (`getUserByEmail` fallback), so deploying the code before running the migration is safe.

## The `EMAIL_HASH_SECRET` key

- Generate it once: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- It must be **identical in every environment that uses the same database** (local `.env.local`, Vercel Production, Preview and Development).
- It must **never change or get lost**. Without the original key, no email user can be found anymore; they would get a new, empty account on their next sign-in. Keep a copy in a password manager.
- The app refuses to hash (and sign-in fails) if the key is missing or shorter than 32 characters.

## Migrating existing data

`scripts/migratePersonalData.js` converts data stored before this change. It runs against the database in `MONGODB_URI` and only prints counts, never values.

```bash
npm run migrate:personal-data              # dry run, shows what would change
npm run migrate:personal-data -- --apply   # applies the changes
```

It hashes plain-text emails, removes name and picture from users, removes OAuth tokens from accounts, deletes pending sign-in links (users simply request a new one) and creates two indexes: a unique index on the email hash and a TTL index that deletes expired sign-in links. The script can be run repeatedly; already migrated records are skipped.

Recommended order:

1. Set `EMAIL_HASH_SECRET` in Vercel (all environments) and in `.env.local`, with the same value.
2. Deploy the code.
3. Back up the database (MongoDB Atlas → Backup, or `mongodump`).
4. Run the dry run, check the counts, then run with `--apply`.

## Environments

Development and test environments should not use the production database, so they don't contain real user data. Use a separate database (e.g. a second database name on the same Atlas cluster) in `.env.local`, and create test accounts there.

## Tests

`npm test` runs automated tests (Vitest) that check, among other things, that no plain-text email, name, picture or OAuth token ends up in the stored data, that users can still be found by email and GitHub account, and that log output is redacted.
