import dbConnect from "../../../db/connect.js";
import Entry from "../../../db/models/Entry.js";
import Category from "../../../db/models/Category.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  const token = await getToken({ req });
  const userId = token?.sub;

  console.log("AUTH DEBUG", {
    sessionUser: session.user,
    tokenSub: token?.sub,
  });

  await dbConnect();

  if (req.method === "GET") {
    const entries = await Entry.find({ owner: userId }).populate("category");

    return res.status(200).json(entries);
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { title, description, category, steps, items, notes, source, images } =
    req.body;

  if (!title?.trim()) {
    return res.status(400).json({
      message: "Title is required.",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "At least one item is required.",
    });
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({
      message: "At least one step is required.",
    });
  }

  if (!category) {
    return res.status(400).json({
      message: "Category is required.",
    });
  }

  if (images?.length > 5) {
    return res
      .status(400)
      .json({ message: "You can upload a maximum of 5 images." });
  }

  const existingCategory = await Category.findById(category);

  if (!existingCategory) {
    return res.status(400).json({
      message: "Invalid category.",
    });
  }

  const entry = await Entry.create({
    title: title.trim(),
    description: description?.trim() || "",
    category,
    items,
    steps,
    notes: notes?.trim() || "",
    source: source?.trim() || "",
    images: images || [],
    owner: userId,
  });

  return res.status(201).json(entry);
}
