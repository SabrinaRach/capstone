import { del } from "@vercel/blob";
import { ObjectId } from "mongodb";
import mongoClient from "./mongodb.js";
import dbConnect from "../db/connect.js";
import Entry from "../db/models/Entry.js";
import Category from "../db/models/Category.js";
import UserPreference from "../db/models/UserPreference.js";

// Resolves everything that belongs to the logged-in user. Content is owned by
// the session id, which is the GitHub account id for GitHub logins and the
// adapter's user id for email logins. A user who signed in both ways can own
// content under both ids, so all of them are collected.
async function resolveAccount(sessionUserId) {
  const db = mongoClient.db();

  let user = null;

  if (ObjectId.isValid(sessionUserId)) {
    user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(sessionUserId) });
  }

  if (!user) {
    const account = await db
      .collection("accounts")
      .findOne({ providerAccountId: sessionUserId });

    if (account) {
      user = await db.collection("users").findOne({ _id: account.userId });
    }
  }

  const accounts = user
    ? await db.collection("accounts").find({ userId: user._id }).toArray()
    : [];

  const ownerIds = [
    ...new Set([
      sessionUserId,
      ...(user ? [user._id.toString()] : []),
      ...accounts.map((account) => account.providerAccountId),
    ]),
  ];

  return { db, user, accounts, ownerIds };
}

export async function exportUserData(sessionUserId) {
  await dbConnect();

  const { user, accounts, ownerIds } = await resolveAccount(sessionUserId);

  const [entries, categories, preference] = await Promise.all([
    Entry.find({ owner: { $in: ownerIds } })
      .populate("category", "name slug")
      .sort({ createdAt: 1 })
      .lean(),
    Category.find({ owner: { $in: ownerIds }, isSystem: false })
      .sort({ createdAt: 1 })
      .lean(),
    UserPreference.findOne({ userId: { $in: ownerIds } }).lean(),
  ]);

  // Login tokens are left out on purpose: they are security credentials, not
  // information about the user. The email address itself is not stored, only
  // its hash, which is exported as it is.
  return {
    exportedAt: new Date().toISOString(),
    account: {
      id: sessionUserId,
      emailHash: user?.email || null,
      emailVerified: user?.emailVerified || null,
      loginMethods: accounts.map((account) => account.provider),
    },
    preferences: {
      locale: preference?.locale || null,
    },
    categories: categories.map((category) => ({
      name: category.name,
      color: category.color,
      backgroundColor: category.backgroundColor,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    })),
    entries: entries.map((entry) => ({
      title: entry.title,
      description: entry.description || "",
      category: entry.category?.name || null,
      items: entry.items,
      steps: entry.steps,
      notes: entry.notes || "",
      source: entry.source || "",
      rating: entry.rating ?? null,
      images: entry.images,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    })),
  };
}

export async function deleteUserData(sessionUserId) {
  await dbConnect();

  const { db, user, ownerIds } = await resolveAccount(sessionUserId);

  const entries = await Entry.find({ owner: { $in: ownerIds } })
    .select("images")
    .lean();
  const imageUrls = entries.flatMap((entry) => entry.images || []);

  // Images are deleted first: if that fails, the request fails before any
  // database record is gone, so the user can simply try again instead of
  // leaving public images behind that nothing references anymore.
  if (imageUrls.length > 0) {
    await del(imageUrls);
  }

  await Promise.all([
    Entry.deleteMany({ owner: { $in: ownerIds } }),
    Category.deleteMany({ owner: { $in: ownerIds }, isSystem: false }),
    UserPreference.deleteMany({ userId: { $in: ownerIds } }),
  ]);

  if (user) {
    if (user.email) {
      await db
        .collection("verification_tokens")
        .deleteMany({ identifier: user.email });
    }

    await db.collection("accounts").deleteMany({ userId: user._id });
    await db.collection("users").deleteOne({ _id: user._id });
  }
}
