import dbConnect from "../../../db/connect.js";
import Entry from "../../../db/models/Entry.js";
import Category from "../../../db/models/Category.js";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Entry ID is required.",
    });
  }

  const entry = await Entry.findById(id);

  if (!entry) {
    return res.status(404).json({
      message: "Entry not found.",
    });
  }

  if (req.method === "GET") {
    await entry.populate("category");

    return res.status(200).json({
      entry,
    });
  }

  if (req.method === "PATCH") {
    const { title, description, category, items, steps, notes, source } =
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

    entry.title = title.trim();
    entry.description = description?.trim() || "";
    entry.category = category;
    entry.items = items;
    entry.steps = steps;
    entry.notes = notes?.trim() || "";
    entry.source = source?.trim() || "";

    await entry.save();

    return res.status(200).json({
      entry,
    });
  }

  if (req.method === "DELETE") {
    await entry.deleteOne();

    return res.status(200).json({
      message: "Entry deleted successfully.",
    });
  }

  return res.status(405).json({
    message: "Method not allowed.",
  });
}
