import dbConnect from "../../../db/connect.js";
import Category from "../../../db/models/Category.js";
import Entry from "../../../db/models/Entry.js";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Category ID is required.",
    });
  }

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found.",
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      category,
    });
  }

  if (req.method === "PATCH") {
    if (category.isSystem) {
      return res.status(403).json({
        message: "System categories cannot be modified.",
      });
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required.",
      });
    }

    const trimmedName = name.trim();

    const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${escapedName}$`,
        $options: "i",
      },
      _id: { $ne: category._id },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "A category with this name already exists.",
      });
    }

    category.name = trimmedName;

    await category.save();

    return res.status(200).json({
      category,
    });
  }

  if (req.method === "DELETE") {
    if (category.isSystem) {
      return res.status(403).json({
        message: "System categories cannot be deleted.",
      });
    }

    const otherCategory = await Category.findOne({
      slug: "other",
      isSystem: true,
    });

    if (!otherCategory) {
      return res.status(500).json({
        message: "The default 'Other / Not assigned' category was not found.",
      });
    }

    await Entry.updateMany(
      { category: category._id },
      { $set: { category: otherCategory._id } },
    );

    await category.deleteOne();

    return res.status(200).json({
      message: "Category deleted successfully.",
    });
  }

  return res.status(405).json({
    message: "Method not allowed.",
  });
}
