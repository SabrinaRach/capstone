import dbConnect from "../../../db/connect.js";
import Category from "../../../db/models/Category.js";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { getSessionSafe, sendApiError } from "../../../lib/apiError.js";
import { sortOtherLast } from "../../../lib/categoryOrder.js";

function createSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createBackgroundColor(hexColor) {
  const hex = hexColor.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const mix = 0.88;

  const newR = Math.round(r + (255 - r) * mix);
  const newG = Math.round(g + (255 - g) * mix);
  const newB = Math.round(b + (255 - b) * mix);

  return `#${[newR, newG, newB]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export default async function handler(req, res) {
  const session = await getSessionSafe(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      code: "NOT_AUTHORIZED",
      message: "Not authorized",
    });
  }

  try {
    const token = await getToken({ req });
    const userId = token?.sub;

    await dbConnect();

    if (req.method === "GET") {
      const categories = await Category.find({
        $or: [{ owner: userId }, { isSystem: true }],
      })
        .sort({ isSystem: -1, name: 1 })
        .lean();

      return res
        .status(200)
        .json(JSON.parse(JSON.stringify(sortOtherLast(categories))));
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        code: "METHOD_NOT_ALLOWED",
        message: "Method not allowed",
      });
    }

    const { name, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        code: "CATEGORY_NAME_REQUIRED",
        message: "Category name is required.",
      });
    }

    if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return res.status(400).json({
        code: "INVALID_COLOR",
        message: "A valid color is required.",
      });
    }

    const trimmedName = name.trim();
    const slug = createSlug(trimmedName);

    if (!slug) {
      return res.status(400).json({
        code: "INVALID_CATEGORY_NAME",
        message: "Please enter a valid category name.",
      });
    }

    const existingCategory = await Category.findOne({
      $and: [
        {
          $or: [
            { slug },
            {
              name: {
                $regex: `^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
              },
            },
          ],
        },
        {
          name: trimmedName,
          $or: [{ owner: userId }, { isSystem: true }],
        },
      ],
    });

    if (existingCategory) {
      return res.status(409).json({
        code: "CATEGORY_EXISTS",
        message: "A category with this name already exists.",
      });
    }

    const backgroundColor = createBackgroundColor(color);

    const category = await Category.create({
      name: trimmedName,
      slug,
      color: color.toUpperCase(),
      backgroundColor,
      isSystem: false,
      owner: userId,
    });

    return res.status(201).json({
      category,
    });
  } catch (error) {
    return sendApiError(res, error, "Categories API error");
  }
}
