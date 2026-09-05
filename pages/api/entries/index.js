import dbConnect from "../../../db/connect.js";
import Entry from "../../../db/models/Entry.js";
import Category from "../../../db/models/Category.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { title, description, category, steps, items, notes, source } =
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
  });

  return res.status(201).json(entry);
}
