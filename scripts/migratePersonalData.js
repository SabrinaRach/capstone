// Migrates personal data stored before email hashing was introduced:
// - hashes plain-text email addresses of users
// - removes the unused GitHub name and profile picture
// - removes stored OAuth tokens from accounts
// - deletes pending sign-in links (they contain plain-text emails)
// - adds indexes: unique email hash, automatic expiry of sign-in links
//
// Runs as a dry run by default and only prints counts, never values:
//   npm run migrate:personal-data
//   npm run migrate:personal-data -- --apply
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import {
  buildAccountUpdate,
  buildUserUpdate,
} from "../lib/personalDataMigration.js";
import { hashEmail } from "../lib/personalData.js";

dotenv.config({ path: ".env.local" });

const shouldApply = process.argv.includes("--apply");

async function migratePersonalData() {
  const client = await new MongoClient(process.env.MONGODB_URI).connect();
  const db = client.db();

  try {
    const users = await db.collection("users").find({}).toArray();
    const accounts = await db.collection("accounts").find({}).toArray();
    const pendingSignInLinks = await db
      .collection("verification_tokens")
      .countDocuments();

    const userUpdates = users
      .map((user) => ({ _id: user._id, update: buildUserUpdate(user) }))
      .filter(({ update }) => update);
    const accountUpdates = accounts
      .map((account) => ({
        _id: account._id,
        update: buildAccountUpdate(account),
      }))
      .filter(({ update }) => update);

    // Two users whose addresses only differ in upper/lower case would end up
    // with the same hash; that has to be resolved manually first.
    const emailHashes = users
      .filter((user) => typeof user.email === "string")
      .map((user) => hashEmail(user.email));
    const hasDuplicates = new Set(emailHashes).size !== emailHashes.length;

    console.log(`Database: ${db.databaseName}`);
    console.log(`Mode: ${shouldApply ? "APPLY" : "dry run (no changes)"}`);
    console.log(`Users to update: ${userUpdates.length} of ${users.length}`);
    console.log(
      `Accounts with OAuth tokens to remove: ${accountUpdates.length} of ${accounts.length}`,
    );
    console.log(`Pending sign-in links to delete: ${pendingSignInLinks}`);

    if (hasDuplicates) {
      throw new Error(
        "Several users share the same email address (ignoring case). Merge them before migrating.",
      );
    }

    if (!shouldApply) {
      console.log("Run again with --apply to apply these changes.");
      return;
    }

    for (const { _id, update } of userUpdates) {
      await db.collection("users").updateOne({ _id }, update);
    }

    for (const { _id, update } of accountUpdates) {
      await db.collection("accounts").updateOne({ _id }, update);
    }

    await db.collection("verification_tokens").deleteMany({});

    await db
      .collection("users")
      .createIndex(
        { email: 1 },
        { unique: true, partialFilterExpression: { email: { $type: "string" } } },
      );
    await db
      .collection("verification_tokens")
      .createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

    console.log("Migration completed.");
  } finally {
    await client.close();
  }
}

migratePersonalData().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
