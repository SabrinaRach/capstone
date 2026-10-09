// Removes the test user created by seed-test-user.mjs and everything it owns.
//
//   node --env-file=.env.local .claude/skills/accessibility/scripts/cleanup-test-user.mjs
import fs from "node:fs";
import { MongoClient, ObjectId } from "mongodb";
import { SESSION_FILE, loadSession } from "./lib.mjs";

const ALLOWED_DATABASES = (process.env.A11Y_ALLOWED_DB || "capstone_dev").split(",");
const session = loadSession();

const client = await new MongoClient(process.env.MONGODB_URI).connect();
const db = client.db();

if (!ALLOWED_DATABASES.includes(db.databaseName)) {
  await client.close();
  throw new Error(`Refusing to clean up "${db.databaseName}".`);
}

const entries = await db.collection("entries").deleteMany({ owner: session.owner });
const categories = await db
  .collection("categories")
  .deleteMany({ owner: session.owner, isSystem: false });
await db.collection("userPreferences").deleteMany({ userId: session.owner });
const users = await db
  .collection("users")
  .deleteOne({ _id: new ObjectId(session.owner) });

fs.rmSync(SESSION_FILE);

console.log(
  `Removed from ${db.databaseName}: ${entries.deletedCount} entries, ${categories.deletedCount} categories, ${users.deletedCount} user.`,
);
await client.close();
