// Creates a test user with entries and categories in the DEV database and
// writes a login token for it, so the audit scripts can open pages behind
// the login. Refuses to run against any database that isn't a dev database.
//
//   node --env-file=.env.local .claude/skills/accessibility/scripts/seed-test-user.mjs
import fs from "node:fs";
import { MongoClient, ObjectId } from "mongodb";
import { encode } from "next-auth/jwt";
import { OUT_DIR, SESSION_FILE } from "./lib.mjs";

const ALLOWED_DATABASES = (process.env.A11Y_ALLOWED_DB || "capstone_dev").split(",");

const client = await new MongoClient(process.env.MONGODB_URI).connect();
const db = client.db();

if (!ALLOWED_DATABASES.includes(db.databaseName)) {
  await client.close();
  throw new Error(
    `Refusing to seed "${db.databaseName}". Point MONGODB_URI at a dev database (allowed: ${ALLOWED_DATABASES.join(", ")}).`,
  );
}

const userId = new ObjectId();
const owner = userId.toString();

await db.collection("users").insertOne({
  _id: userId,
  email: "hmac-sha256:a11y-audit-test-user",
  emailVerified: new Date(),
});

const systemCategories = await db
  .collection("categories")
  .find({ isSystem: true })
  .toArray();

if (systemCategories.length === 0) {
  await client.close();
  throw new Error("No system categories found. Run `npm run seed:categories` first.");
}

await db.collection("categories").insertOne({
  name: "A11y Testkategorie",
  slug: "a11y-audit-category",
  color: "#7C3AED",
  backgroundColor: "#EFE7FD",
  isSystem: false,
  owner,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Image URLs on the allowed blob host that don't exist: enough to audit the
// image slider markup without uploading anything.
const image = (n) =>
  `https://a11y-audit.public.blob.vercel-storage.com/test-${n}.jpg`;

const now = new Date();
const { insertedIds } = await db.collection("entries").insertMany(
  [
    {
      title: "Spaghetti Carbonara",
      category: systemCategories[0]._id,
      rating: 4,
      items: ["200 g Spaghetti", "2 Eier", "50 g Pecorino"],
      steps: ["Wasser kochen", "Pancetta anbraten", "Alles vermengen"],
      description: "Klassisch und schnell.",
      notes: "Keine Sahne!",
      source: "https://example.com/carbonara",
      images: [image(1), image(2)],
    },
    {
      title: "Zweiter Testeintrag",
      category: systemCategories[1 % systemCategories.length]._id,
      rating: 0,
      items: ["a"],
      steps: ["b"],
      description: "",
      notes: "",
      source: "",
      images: [],
    },
  ].map((entry) => ({ ...entry, owner, createdAt: now, updatedAt: now })),
);

const token = await encode({
  token: { sub: owner, locale: "de" },
  secret: process.env.NEXTAUTH_SECRET,
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  SESSION_FILE,
  JSON.stringify(
    {
      owner,
      token,
      entryIds: Object.values(insertedIds).map(String),
      systemSlug: systemCategories[0].slug,
    },
    null,
    2,
  ),
);

console.log(`Test user created in ${db.databaseName}. Session: ${SESSION_FILE}`);
await client.close();
