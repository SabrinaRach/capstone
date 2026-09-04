import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../db/models/Category.js";

dotenv.config({ path: ".env.local" });

const { default: dbConnect } = await import("../db/connect.js");

const systemCategories = [
  {
    name: "Recipes",
    slug: "recipes",
    color: "#6B8F71",
    backgroundColor: "#e8f0e9",
    isSystem: true,
  },
  {
    name: "How-to / Instructions",
    slug: "how-to-instructions",
    color: "#7C6F8F",
    backgroundColor: "#eeebf2",
    isSystem: true,
  },
  {
    name: "Guides",
    slug: "guides",
    color: "#B08A4A",
    backgroundColor: "#f3eddf",
    isSystem: true,
  },
  {
    name: "Other / Not assigned",
    slug: "other",
    color: "#7D8587",
    backgroundColor: "#dbeaee",
    isSystem: true,
  },
];

async function seedCategories() {
  await dbConnect();

  for (const category of systemCategories) {
    await Category.updateOne(
      { slug: category.slug },
      { $set: category },
      { upsert: true },
    );
  }

  console.log("System categories seeded.");

  await mongoose.connection.close();
}

seedCategories().catch((error) => {
  console.error(error);
  process.exit(1);
});
