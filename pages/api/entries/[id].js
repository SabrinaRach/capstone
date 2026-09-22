import { del } from "@vercel/blob";
import dbConnect from "../../../db/connect.js";
import Entry from "../../../db/models/Entry.js";
import Category from "../../../db/models/Category.js";
import { authOptions } from "../auth/[...nextauth]";
import { getSessionSafe, sendApiError } from "../../../lib/apiError.js";

export default async function handler(req, res) {
  const session = await getSessionSafe(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    const userId = session.user.id;

    await dbConnect();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: "Entry ID is required.",
      });
    }

    const entry = await Entry.findOne({
      _id: id,
      owner: userId,
    });

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
      const {
        title,
        description,
        category,
        items,
        steps,
        notes,
        source,
        images,
        rating,
      } = req.body;

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

      const existingCategory = await Category.findOne({
        _id: category,
        $or: [{ owner: userId }, { isSystem: true }],
      });

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
      entry.rating = rating >= 1 && rating <= 5 ? rating : undefined;

      if (Array.isArray(images)) {
        if (images.length > 5) {
          return res.status(400).json({
            message: "You can have a maximum of 5 images.",
          });
        }
        const oldImages = entry.images || [];

        const imagesToDelete = oldImages.filter(
          (oldImage) => !images.includes(oldImage),
        );

        for (const imageUrl of imagesToDelete) {
          try {
            await del(imageUrl);
          } catch (error) {
            console.error("Failed to delete blob:", imageUrl, error);
          }
        }
        entry.images = images;
      }

      await entry.save();

      return res.status(200).json({
        entry,
      });
    }

    if (req.method === "DELETE") {
      const imagesToDelete = entry.images || [];

      for (const imageUrl of imagesToDelete) {
        try {
          await del(imageUrl);
        } catch (error) {
          console.error("Failed to delete blob:", imageUrl, error);
        }
      }
      await entry.deleteOne();

      return res.status(200).json({
        message: "Entry deleted successfully.",
      });
    }

    return res.status(405).json({
      message: "Method not allowed.",
    });
  } catch (error) {
    return sendApiError(res, error, "Entry API error");
  }
}
